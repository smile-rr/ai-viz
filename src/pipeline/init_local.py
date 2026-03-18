"""Initialize local data stores — populate DuckDB dimension + fact tables and sync to Turso.

Run once after first data collection, or any time you want to rebuild local state:
    uv run python -m src.pipeline.init_local
"""

import sys
from datetime import date, datetime, timedelta
from pathlib import Path

import duckdb
import polars as pl
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(PROJECT_ROOT / ".env")

from src.data.collectors.akshare_collector import CN_INDICES
from src.data.collectors.yfinance_collector import (
    COMMODITIES,
    CRYPTO,
    FX_PAIRS,
    GLOBAL_INDICES,
)
from src.db.turso import TursoSync
from src.models.schema import init_database

DB_PATH = PROJECT_ROOT / "data" / "ai_viz.duckdb"


def populate_dim_date(con: duckdb.DuckDBPyConnection) -> int:
    """Populate dim_date with trading calendar from 2020 to today+1y."""
    print("  dim_date...")
    start = date(2020, 1, 1)
    end = date.today() + timedelta(days=365)
    rows = []
    d = start
    while d <= end:
        rows.append((
            d, d.year, (d.month - 1) // 3 + 1, d.month,
            d.isocalendar()[1], d.weekday(),
            d.month != (d + timedelta(days=1)).month,
            d.weekday() < 5,  # CN trading (simplified)
            d.weekday() < 5,  # US trading (simplified)
            d.weekday() < 5,  # HK trading (simplified)
        ))
        d += timedelta(days=1)
    con.executemany(
        "INSERT OR REPLACE INTO dim_date VALUES (?,?,?,?,?,?,?,?,?,?)", rows
    )
    return len(rows)


def populate_dim_asset(con: duckdb.DuckDBPyConnection) -> int:
    """Populate dim_asset with known assets."""
    print("  dim_asset...")
    rows = []
    # CN indices
    for code, name in CN_INDICES.items():
        rows.append((code, name, "index", "SSE" if code.startswith("0") else "SZSE",
                      "CN", None, None, "CNY", None, "active"))
    # Global indices
    for sym, name in GLOBAL_INDICES.items():
        exchange = "NYSE"
        market = "US"
        if "Nikkei" in name: market, exchange = "JP", "TSE"
        elif "FTSE" in name: market, exchange = "EU", "LSE"
        elif "DAX" in name: market, exchange = "EU", "XETRA"
        elif "Hang Seng" in name: market, exchange = "HK", "HKEX"
        elif "KOSPI" in name: market, exchange = "KR", "KRX"
        rows.append((sym, name, "index", exchange, market, None, None, "USD", None, "active"))
    # FX
    fx_names = {"USDCNY=X": "USD/CNY", "EURUSD=X": "EUR/USD", "USDJPY=X": "USD/JPY", "GBPUSD=X": "GBP/USD"}
    for sym in FX_PAIRS:
        rows.append((sym, fx_names.get(sym, sym), "fx", "FX", "GLOBAL", None, None, "USD", None, "active"))
    # Commodities
    for sym, name in COMMODITIES.items():
        rows.append((sym, name, "commodity", "NYMEX", "GLOBAL", None, None, "USD", None, "active"))
    # Crypto
    for sym, name in CRYPTO.items():
        rows.append((sym, name, "crypto", "CRYPTO", "GLOBAL", None, None, "USD", None, "active"))

    con.executemany(
        "INSERT OR REPLACE INTO dim_asset VALUES (?,?,?,?,?,?,?,?,?,?)", rows
    )
    return len(rows)


def populate_dim_market(con: duckdb.DuckDBPyConnection) -> int:
    """Populate dim_market with market definitions."""
    print("  dim_market...")
    markets = [
        ("CN", "China A-Shares", "Asia", "Asia/Shanghai", "CNY", "09:30", "15:00"),
        ("US", "United States", "Americas", "America/New_York", "USD", "09:30", "16:00"),
        ("HK", "Hong Kong", "Asia", "Asia/Hong_Kong", "HKD", "09:30", "16:00"),
        ("EU", "Europe", "Europe", "Europe/London", "EUR", "08:00", "16:30"),
        ("JP", "Japan", "Asia", "Asia/Tokyo", "JPY", "09:00", "15:00"),
        ("KR", "South Korea", "Asia", "Asia/Seoul", "KRW", "09:00", "15:30"),
        ("GLOBAL", "Global/Cross-market", "Global", "UTC", "USD", "00:00", "23:59"),
    ]
    con.executemany(
        "INSERT OR REPLACE INTO dim_market VALUES (?,?,?,?,?,?,?)", markets
    )
    return len(markets)


def populate_dim_indicator(con: duckdb.DuckDBPyConnection) -> int:
    """Populate dim_indicator with macro indicator definitions."""
    print("  dim_indicator...")
    indicators = [
        ("gdp", "GDP", "国内生产总值", "gdp", "亿元", "quarterly", "AKShare", "国内生产总值"),
        ("cpi", "CPI", "居民消费价格指数", "cpi", "percent", "monthly", "AKShare", "CPI同比变动"),
        ("pmi", "PMI", "制造业采购经理指数", "pmi", "index", "monthly", "AKShare", "制造业PMI，50以上为扩张"),
        ("money_supply_m2", "M2", "广义货币供应量", "money_supply", "亿元", "monthly", "AKShare", "M2货币供应量"),
        ("shibor_on", "SHIBOR O/N", "上海银行间同业拆放利率", "rate", "percent", "daily", "AKShare", "隔夜SHIBOR"),
        ("us_fed_rate", "Fed Funds Rate", "美联储基准利率", "rate", "percent", "as_needed", "FRED", "联邦基金目标利率"),
    ]
    con.executemany(
        "INSERT OR REPLACE INTO dim_indicator VALUES (?,?,?,?,?,?,?,?)", indicators
    )
    return len(indicators)


def load_raw_to_facts(con: duckdb.DuckDBPyConnection) -> dict[str, int]:
    """Load raw parquet files into fact tables."""
    print("  Loading raw data into fact tables...")
    counts = {}
    raw_dir = PROJECT_ROOT / "data" / "raw"

    # CN index data → fact_index
    cn_files = sorted(raw_dir.glob("akshare/index/*.parquet"))
    if cn_files:
        latest = cn_files[-1]
        df = pl.read_parquet(latest)
        if not df.is_empty() and "close" in df.columns:
            rows = []
            for r in df.iter_rows(named=True):
                date_val = str(r.get("date", ""))
                asset = r.get("index_code", "")
                if not date_val or not asset:
                    continue
                rows.append((
                    date_val, asset,
                    r.get("open"), r.get("high"), r.get("low"), r.get("close"),
                    r.get("volume"), None, None, None
                ))
            if rows:
                con.executemany(
                    "INSERT OR REPLACE INTO fact_index VALUES (?,?,?,?,?,?,?,?,?,?)", rows
                )
                counts["fact_index_cn"] = len(rows)

    # Global index data → fact_index
    gl_files = sorted(raw_dir.glob("yfinance/index/*.parquet"))
    if gl_files:
        latest = gl_files[-1]
        df = pl.read_parquet(latest)
        if not df.is_empty() and "Close" in df.columns:
            rows = []
            for r in df.iter_rows(named=True):
                date_val = str(r.get("Date", ""))[:10]
                asset = r.get("symbol", "")
                if not date_val or not asset:
                    continue
                rows.append((
                    date_val, asset,
                    r.get("Open"), r.get("High"), r.get("Low"), r.get("Close"),
                    r.get("Volume"), None, None, None
                ))
            if rows:
                con.executemany(
                    "INSERT OR REPLACE INTO fact_index VALUES (?,?,?,?,?,?,?,?,?,?)", rows
                )
                counts["fact_index_global"] = len(rows)

    # FX → fact_fx
    fx_files = sorted(raw_dir.glob("yfinance/fx/*.parquet"))
    if fx_files:
        latest = fx_files[-1]
        df = pl.read_parquet(latest)
        if not df.is_empty() and "Close" in df.columns:
            rows = []
            for r in df.iter_rows(named=True):
                date_val = str(r.get("Date", ""))[:10]
                pair = r.get("symbol", "")
                if not date_val or not pair:
                    continue
                rows.append((date_val, pair, r.get("Close"), None))
            if rows:
                con.executemany(
                    "INSERT OR REPLACE INTO fact_fx VALUES (?,?,?,?)", rows
                )
                counts["fact_fx"] = len(rows)

    # Commodity → fact_commodity
    com_files = sorted(raw_dir.glob("yfinance/commodity/*.parquet"))
    if com_files:
        latest = com_files[-1]
        df = pl.read_parquet(latest)
        if not df.is_empty() and "Close" in df.columns:
            rows = []
            for r in df.iter_rows(named=True):
                date_val = str(r.get("Date", ""))[:10]
                asset = r.get("symbol", "")
                if not date_val or not asset:
                    continue
                rows.append((date_val, asset, r.get("Close"), None, r.get("Volume")))
            if rows:
                con.executemany(
                    "INSERT OR REPLACE INTO fact_commodity VALUES (?,?,?,?,?)", rows
                )
                counts["fact_commodity"] = len(rows)

    # Crypto → fact_price (treating as generic price data)
    crypto_files = sorted(raw_dir.glob("yfinance/crypto/*.parquet"))
    if crypto_files:
        latest = crypto_files[-1]
        df = pl.read_parquet(latest)
        if not df.is_empty() and "Close" in df.columns:
            rows = []
            for r in df.iter_rows(named=True):
                date_val = str(r.get("Date", ""))[:10]
                asset = r.get("symbol", "")
                if not date_val or not asset:
                    continue
                rows.append((
                    date_val, asset,
                    r.get("Open"), r.get("High"), r.get("Low"), r.get("Close"),
                    r.get("Volume"), None, None, None
                ))
            if rows:
                con.executemany(
                    "INSERT OR REPLACE INTO fact_price VALUES (?,?,?,?,?,?,?,?,?,?)", rows
                )
                counts["fact_price_crypto"] = len(rows)

    return counts


def main():
    print(f"=== Initializing Local Data Stores ===")
    print(f"    Database: {DB_PATH}\n")

    con = duckdb.connect(str(DB_PATH))
    init_database(con)

    # 1. Populate dimensions
    print("[1/3] Populating dimension tables...")
    n_dates = populate_dim_date(con)
    n_assets = populate_dim_asset(con)
    n_markets = populate_dim_market(con)
    n_indicators = populate_dim_indicator(con)
    con.commit()
    print(f"  dim_date: {n_dates} rows")
    print(f"  dim_asset: {n_assets} rows")
    print(f"  dim_market: {n_markets} rows")
    print(f"  dim_indicator: {n_indicators} rows")

    # 2. Load raw data into fact tables
    print("\n[2/3] Loading raw data into fact tables...")
    counts = load_raw_to_facts(con)
    con.commit()
    for table, n in counts.items():
        print(f"  {table}: {n} rows")

    # 3. Sync to Turso
    print("\n[3/3] Syncing to Turso...")
    try:
        turso = TursoSync()
        turso.connect()
        turso.init_tables()

        # Re-sync all fact data from DuckDB to Turso
        for table in ["fact_index", "fact_fx", "fact_commodity"]:
            rows = con.execute(f"SELECT * FROM {table}").fetchall()
            cols = [desc[0] for desc in con.description]
            placeholders = ",".join(["?"] * len(cols))
            for row in rows:
                turso.conn.execute(
                    f"INSERT OR REPLACE INTO {table} ({','.join(cols)}) VALUES ({placeholders})",
                    tuple(row)
                )
            turso.conn.commit()
            print(f"  {table}: {len(rows)} rows synced to Turso")

        turso.sync_remote()
        turso.close()
    except Exception as e:
        print(f"  Turso sync failed: {e}")

    con.close()

    # Final summary
    print("\n=== Summary ===")
    con2 = duckdb.connect(str(DB_PATH))
    tables = con2.execute(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='main'"
    ).fetchall()
    for t in tables:
        count = con2.execute(f"SELECT COUNT(*) FROM {t[0]}").fetchone()[0]
        status = "✓" if count > 0 else "○"
        print(f"  {status} {t[0]}: {count:,} rows")
    con2.close()
    print("\nDone!")


if __name__ == "__main__":
    main()
