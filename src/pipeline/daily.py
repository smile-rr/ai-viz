"""Daily data pipeline — 每日数据采集 + 转换 + 聚合 + Turso同步."""

import json
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import duckdb
import polars as pl
from dotenv import load_dotenv

# Resolve project root and ensure it's on sys.path for imports
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.data.collectors.akshare_collector import AKShareCollector, CN_INDICES
from src.data.collectors.yfinance_collector import (
    COMMODITIES,
    CRYPTO,
    FX_PAIRS,
    GLOBAL_INDICES,
    YFinanceCollector,
)
from src.db.turso import TursoSync
from src.models.schema import init_database

load_dotenv(PROJECT_ROOT / ".env")

DATA_DIR = PROJECT_ROOT / "data"
DB_PATH = DATA_DIR / "ai_viz.duckdb"
AGG_DIR = DATA_DIR / "aggregated"
FRONTEND_DATA_DIR = PROJECT_ROOT / "frontend" / "public" / "data"


def run_daily_pipeline(target_date: date | None = None):
    """Run the full daily data pipeline."""
    today = target_date or date.today()
    print(f"=== Daily Pipeline: {today} ===\n")

    # 1. Init DuckDB
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect(str(DB_PATH))
    init_database(con)
    print("[1/5] DuckDB initialized\n")

    # 2. Collect data
    print("[2/5] Collecting data...")
    ak_collector = AKShareCollector(DATA_DIR / "raw")
    yf_collector = YFinanceCollector(DATA_DIR / "raw")

    start_7d = today - timedelta(days=7)
    start_30d = today - timedelta(days=400)  # ~1 year + buffer for time range selection

    # Chinese indices (full history for sparkline)
    cn_index = pl.DataFrame()
    try:
        cn_index = ak_collector.collect_index_data()
        if not cn_index.is_empty():
            ak_collector.save(cn_index, "index", f"cn_index_{today}")
            print(f"  CN indices: {len(cn_index)} rows")
    except Exception as e:
        print(f"  CN indices: FAILED - {e}")

    # Global indices
    global_index = pl.DataFrame()
    try:
        global_index = yf_collector.collect_index_data(start_date=start_30d, end_date=today)
        if not global_index.is_empty():
            yf_collector.save(global_index, "index", f"global_index_{today}")
            print(f"  Global indices: {len(global_index)} rows")
    except Exception as e:
        print(f"  Global indices: FAILED - {e}")

    # FX
    fx = pl.DataFrame()
    try:
        fx = yf_collector.collect_fx(start_date=start_30d, end_date=today)
        if not fx.is_empty():
            yf_collector.save(fx, "fx", f"fx_{today}")
            print(f"  FX: {len(fx)} rows")
    except Exception as e:
        print(f"  FX: FAILED - {e}")

    # Commodities
    commodities = pl.DataFrame()
    try:
        commodities = yf_collector.collect_commodities(start_date=start_30d, end_date=today)
        if not commodities.is_empty():
            yf_collector.save(commodities, "commodity", f"commodity_{today}")
            print(f"  Commodities: {len(commodities)} rows")
    except Exception as e:
        print(f"  Commodities: FAILED - {e}")

    # Crypto
    crypto = pl.DataFrame()
    try:
        crypto = yf_collector.collect_crypto(start_date=start_30d, end_date=today)
        if not crypto.is_empty():
            yf_collector.save(crypto, "crypto", f"crypto_{today}")
            print(f"  Crypto: {len(crypto)} rows")
    except Exception as e:
        print(f"  Crypto: FAILED - {e}")

    # Macro (less frequent, run weekly on Monday)
    if today.weekday() == 0:
        try:
            macro = ak_collector.collect_macro_china()
            for name, df in macro.items():
                if not df.is_empty():
                    ak_collector.save(df, "macro", f"{name}_{today}")
            print(f"  Macro indicators: {len(macro)} categories")
        except Exception as e:
            print(f"  Macro: FAILED - {e}")

    # Northbound flow
    nb = pl.DataFrame()
    try:
        nb = ak_collector.collect_northbound_flow()
        if not nb.is_empty():
            ak_collector.save(nb, "flow", f"northbound_{today}")
            print(f"  Northbound flow: {len(nb)} rows")
    except Exception as e:
        print(f"  Northbound flow: FAILED - {e}")

    # Sector fund flow
    sf = pl.DataFrame()
    try:
        sf = ak_collector.collect_sector_fund_flow()
        if not sf.is_empty():
            ak_collector.save(sf, "flow", f"sector_flow_{today}")
            print(f"  Sector flow: {len(sf)} rows")
    except Exception as e:
        print(f"  Sector flow: FAILED - {e}")

    print()

    # 3. Generate JSON for frontend
    print("[3/5] Generating frontend JSON...")
    AGG_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)
    generate_market_summary(today, cn_index, global_index, fx, commodities, crypto)

    # 4. Sync to Turso
    print("[4/5] Syncing to Turso...")
    try:
        turso = TursoSync()
        turso.connect()
        turso.init_tables()
        turso.upsert_index_data(cn_index, source="cn")
        turso.upsert_index_data(global_index, source="global")
        turso.upsert_fx_data(fx)
        turso.upsert_commodity_data(commodities)
        turso.sync_remote()
        turso.close()
        print("  Turso sync complete")
    except Exception as e:
        print(f"  Turso sync FAILED: {e}")

    # 5. Quality check
    print("[5/5] Quality check...")
    quality_report = {
        "date": str(today),
        "tables_collected": {
            "cn_index": len(cn_index) if not cn_index.is_empty() else 0,
            "global_index": len(global_index) if not global_index.is_empty() else 0,
            "fx": len(fx) if not fx.is_empty() else 0,
            "commodities": len(commodities) if not commodities.is_empty() else 0,
            "crypto": len(crypto) if not crypto.is_empty() else 0,
        },
        "status": "success",
    }
    quality_path = DATA_DIR / "quality" / f"check_{today}.json"
    quality_path.parent.mkdir(parents=True, exist_ok=True)
    quality_path.write_text(json.dumps(quality_report, indent=2, ensure_ascii=False))

    con.close()

    # Print summary
    print(f"\n=== Pipeline Summary ===")
    total = sum(quality_report["tables_collected"].values())
    for k, v in quality_report["tables_collected"].items():
        print(f"  {k}: {v} rows")
    print(f"  TOTAL: {total} rows")
    print(f"=== Pipeline complete: {today} ===")


def generate_market_summary(
    today: date,
    cn_index: pl.DataFrame,
    global_index: pl.DataFrame,
    fx: pl.DataFrame,
    commodities: pl.DataFrame,
    crypto: pl.DataFrame,
) -> None:
    """Generate market_summary.json for frontend with sparkline history."""
    # Name mappings for display
    name_map = {**GLOBAL_INDICES, **COMMODITIES, **CRYPTO}
    fx_names = {
        "USDCNY=X": "USD/CNY",
        "EURUSD=X": "EUR/USD",
        "USDJPY=X": "USD/JPY",
        "GBPUSD=X": "GBP/USD",
    }

    summary = {
        "date": str(today),
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S CST"),
        "generated_at_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "cn_indices": _build_items_cn(cn_index),
        "global_indices": _build_items_yf(global_index, name_map),
        "fx": _build_items_yf(fx, fx_names),
        "commodities": _build_items_yf(commodities, name_map),
        "crypto": _build_items_yf(crypto, name_map),
    }

    json_str = json.dumps(summary, indent=2, ensure_ascii=False, default=str)

    # Write to both locations
    agg_path = AGG_DIR / "market_summary.json"
    agg_path.write_text(json_str)
    print(f"  Market summary -> {agg_path}")

    fe_path = FRONTEND_DATA_DIR / "market_summary.json"
    fe_path.write_text(json_str)
    print(f"  Market summary -> {fe_path}")


def _build_items_cn(df: pl.DataFrame) -> list[dict]:
    """Build summary items from CN index dataframe (akshare format)."""
    if df.is_empty():
        return []
    items = []
    try:
        for code in df["index_code"].unique().to_list():
            subset = df.filter(pl.col("index_code") == code)
            # Sort by date column (first column typically)
            date_col = subset.columns[0]
            subset = subset.sort(date_col)

            last = subset.tail(1).to_dicts()[0]
            name = last.get("index_name", code)
            close_val = _safe_float(last.get("close"))
            open_val = _safe_float(last.get("open"))
            high_val = _safe_float(last.get("high"))
            low_val = _safe_float(last.get("low"))
            volume = _safe_int(last.get("volume"))

            # Compute change_pct from last 2 rows if not available
            change_pct = _safe_float(last.get("change_pct"))
            if change_pct is None and len(subset) >= 2:
                prev_close = _safe_float(subset.tail(2).head(1).to_dicts()[0].get("close"))
                if prev_close and prev_close != 0 and close_val is not None:
                    change_pct = round((close_val - prev_close) / prev_close * 100, 2)

            # ~1 year sparkline (260 trading days)
            history = _extract_history(subset.tail(260), "close")

            items.append({
                "symbol": code,
                "name": name,
                "close": close_val,
                "change_pct": change_pct,
                "open": open_val,
                "high": high_val,
                "low": low_val,
                "volume": volume,
                "history": history,
            })
    except Exception as e:
        print(f"  [WARN] CN index summary error: {e}")
    return items


def _build_items_yf(df: pl.DataFrame, name_map: dict) -> list[dict]:
    """Build summary items from yfinance dataframe."""
    if df.is_empty():
        return []
    items = []
    try:
        for symbol in df["symbol"].unique().to_list():
            subset = df.filter(pl.col("symbol") == symbol)

            # Find date column
            date_col = "Date"
            if date_col not in subset.columns:
                # Try first column
                date_col = subset.columns[0]
            subset = subset.sort(date_col)

            last = subset.tail(1).to_dicts()[0]
            close_val = _safe_float(last.get("Close"))

            # If the last row has null Close (e.g. crypto before market
            # settlement), fall back to the second-to-last row.
            if close_val is None and len(subset) >= 2:
                last = subset.tail(2).head(1).to_dicts()[0]
                close_val = _safe_float(last.get("Close"))
                # Also trim the trailing null row from history source
                subset = subset.head(len(subset) - 1)

            open_val = _safe_float(last.get("Open"))
            high_val = _safe_float(last.get("High"))
            low_val = _safe_float(last.get("Low"))
            volume = _safe_int(last.get("Volume"))

            # Compute change_pct from last 2 rows
            change_pct = None
            if len(subset) >= 2:
                prev_close = _safe_float(subset.tail(2).head(1).to_dicts()[0].get("Close"))
                if prev_close and prev_close != 0 and close_val is not None:
                    change_pct = round((close_val - prev_close) / prev_close * 100, 2)

            # ~1 year sparkline (260 trading days)
            history = _extract_history(subset.tail(260), "Close")

            items.append({
                "symbol": symbol,
                "name": name_map.get(symbol, symbol),
                "close": close_val,
                "change_pct": change_pct,
                "open": open_val,
                "high": high_val,
                "low": low_val,
                "volume": volume,
                "history": history,
            })
    except Exception as e:
        print(f"  [WARN] YF summary error: {e}")
    return items


def _extract_history(df: pl.DataFrame, close_col: str) -> list[float]:
    """Extract close prices as a list for sparkline."""
    try:
        values = df[close_col].to_list()
        return [round(float(v), 4) if v is not None else None for v in values]
    except Exception:
        return []


def _safe_float(val) -> float | None:
    if val is None:
        return None
    try:
        return round(float(val), 4)
    except (ValueError, TypeError):
        return None


def _safe_int(val) -> int | None:
    if val is None:
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


if __name__ == "__main__":
    target = None
    if len(sys.argv) > 1:
        target = date.fromisoformat(sys.argv[1])
    run_daily_pipeline(target)
