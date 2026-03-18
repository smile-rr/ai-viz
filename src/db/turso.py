"""Turso (libsql) database sync module."""

import os
from pathlib import Path

import libsql_experimental as libsql
import polars as pl
from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parents[2]
LOCAL_DB_PATH = str(PROJECT_ROOT / "data" / "turso_local.db")

# Turso SQL schema — mirrors DuckDB schema from src/models/schema.py
# libsql uses SQLite types, so we adapt accordingly.
TURSO_TABLES = {
    "dim_asset": """
        CREATE TABLE IF NOT EXISTS dim_asset (
            asset_key   TEXT PRIMARY KEY,
            name        TEXT,
            asset_type  TEXT,
            exchange    TEXT,
            market      TEXT,
            sector      TEXT,
            industry    TEXT,
            currency    TEXT DEFAULT 'CNY',
            list_date   TEXT,
            status      TEXT DEFAULT 'active'
        )
    """,
    "fact_price": """
        CREATE TABLE IF NOT EXISTS fact_price (
            date_key    TEXT NOT NULL,
            asset_key   TEXT NOT NULL,
            open        REAL,
            high        REAL,
            low         REAL,
            close       REAL,
            volume      INTEGER,
            turnover    REAL,
            change_pct  REAL,
            amplitude   REAL,
            PRIMARY KEY (date_key, asset_key)
        )
    """,
    "fact_index": """
        CREATE TABLE IF NOT EXISTS fact_index (
            date_key    TEXT NOT NULL,
            asset_key   TEXT NOT NULL,
            open        REAL,
            high        REAL,
            low         REAL,
            close       REAL,
            volume      INTEGER,
            change_pct  REAL,
            pe_ttm      REAL,
            pb          REAL,
            PRIMARY KEY (date_key, asset_key)
        )
    """,
    "fact_fx": """
        CREATE TABLE IF NOT EXISTS fact_fx (
            date_key    TEXT NOT NULL,
            pair        TEXT NOT NULL,
            rate        REAL,
            change_pct  REAL,
            PRIMARY KEY (date_key, pair)
        )
    """,
    "fact_commodity": """
        CREATE TABLE IF NOT EXISTS fact_commodity (
            date_key    TEXT NOT NULL,
            asset_key   TEXT NOT NULL,
            price       REAL,
            change_pct  REAL,
            volume      INTEGER,
            PRIMARY KEY (date_key, asset_key)
        )
    """,
    "fact_macro": """
        CREATE TABLE IF NOT EXISTS fact_macro (
            date_key      TEXT NOT NULL,
            indicator_key TEXT NOT NULL,
            value         REAL,
            yoy_change    REAL,
            mom_change    REAL,
            PRIMARY KEY (date_key, indicator_key)
        )
    """,
    "fact_fund_flow": """
        CREATE TABLE IF NOT EXISTS fact_fund_flow (
            date_key       TEXT NOT NULL,
            sector         TEXT NOT NULL,
            net_inflow     REAL,
            main_inflow    REAL,
            main_outflow   REAL,
            retail_inflow  REAL,
            retail_outflow REAL,
            PRIMARY KEY (date_key, sector)
        )
    """,
    "fact_cross_border": """
        CREATE TABLE IF NOT EXISTS fact_cross_border (
            date_key    TEXT NOT NULL,
            direction   TEXT NOT NULL,
            net_buy     REAL,
            buy_amount  REAL,
            sell_amount REAL,
            PRIMARY KEY (date_key, direction)
        )
    """,
}


class TursoSync:
    """Sync data to Turso (libsql) remote database."""

    def __init__(self):
        self.url = os.getenv("TURSO_DATABASE_URL")
        self.token = os.getenv("TURSO_AUTH_TOKEN")
        if not self.url or not self.token:
            raise ValueError("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env")
        self.conn = None

    def connect(self):
        """Establish connection to Turso."""
        try:
            self.conn = libsql.connect(LOCAL_DB_PATH, sync_url=self.url, auth_token=self.token)
            self.conn.sync()
            print("[Turso] Connected successfully")
        except Exception as e:
            print(f"[Turso] Connection failed: {e}")
            raise

    def init_tables(self):
        """Create all tables in Turso."""
        if not self.conn:
            self.connect()
        for name, ddl in TURSO_TABLES.items():
            self.conn.execute(ddl)
        self.conn.commit()
        self.conn.sync()
        print(f"[Turso] Initialized {len(TURSO_TABLES)} tables")

    def sync_remote(self):
        """Push all local changes to Turso remote."""
        if self.conn:
            self.conn.commit()
            self.conn.sync()
            print("[Turso] Synced to remote")

    def upsert_index_data(self, df: pl.DataFrame, source: str = "cn"):
        """Upsert index data into fact_index. Only syncs last 30 rows per symbol."""
        if df.is_empty():
            return 0

        count = 0
        sql = """INSERT OR REPLACE INTO fact_index
                 (date_key, asset_key, open, high, low, close, volume, change_pct)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)"""

        key_col = "index_code" if source == "cn" else "symbol"

        if key_col not in df.columns:
            print(f"[Turso] WARNING: column '{key_col}' not found in index data")
            return 0

        for symbol in df[key_col].unique().to_list():
            subset = df.filter(pl.col(key_col) == symbol)
            date_col = subset.columns[0]
            subset = subset.sort(date_col).tail(30)

            for row in subset.iter_rows(named=True):
                try:
                    if source == "cn":
                        date_val = str(row.get("date", ""))
                        asset_key = row.get("index_code", "")
                        open_val = _to_float(row.get("open"))
                        high_val = _to_float(row.get("high"))
                        low_val = _to_float(row.get("low"))
                        close_val = _to_float(row.get("close"))
                        volume = _to_int(row.get("volume"))
                        change_pct = _to_float(row.get("change_pct"))
                    else:
                        date_val = str(row.get("Date", ""))[:10]
                        asset_key = row.get("symbol", "")
                        open_val = _to_float(row.get("Open"))
                        high_val = _to_float(row.get("High"))
                        low_val = _to_float(row.get("Low"))
                        close_val = _to_float(row.get("Close"))
                        volume = _to_int(row.get("Volume"))
                        change_pct = None

                    if not date_val or not asset_key:
                        continue

                    self.conn.execute(sql,
                        (date_val, asset_key, open_val, high_val, low_val, close_val, volume, change_pct))
                    count += 1
                except Exception:
                    continue

        self.conn.commit()
        print(f"[Turso] Inserted {count} index rows ({source})")
        return count

    def upsert_fx_data(self, df: pl.DataFrame):
        """Upsert FX data into fact_fx."""
        if df.is_empty():
            return 0
        count = 0
        for row in df.iter_rows(named=True):
            try:
                date_val = str(row.get("Date", ""))[:10]
                pair = row.get("symbol", "")
                rate = _to_float(row.get("Close"))
                if not date_val or not pair:
                    continue
                self.conn.execute(
                    "INSERT OR REPLACE INTO fact_fx (date_key, pair, rate, change_pct) VALUES (?, ?, ?, ?)",
                    (date_val, pair, rate, None),
                )
                count += 1
            except Exception:
                continue
        self.conn.commit()
        print(f"[Turso] Inserted {count} FX rows")
        return count

    def upsert_commodity_data(self, df: pl.DataFrame):
        """Upsert commodity data into fact_commodity."""
        if df.is_empty():
            return 0
        count = 0
        for row in df.iter_rows(named=True):
            try:
                date_val = str(row.get("Date", ""))[:10]
                asset_key = row.get("symbol", "")
                price = _to_float(row.get("Close"))
                volume = _to_int(row.get("Volume"))
                if not date_val or not asset_key:
                    continue
                self.conn.execute(
                    """INSERT OR REPLACE INTO fact_commodity
                       (date_key, asset_key, price, change_pct, volume) VALUES (?, ?, ?, ?, ?)""",
                    (date_val, asset_key, price, None, volume),
                )
                count += 1
            except Exception:
                continue
        self.conn.commit()
        print(f"[Turso] Inserted {count} commodity rows")
        return count

    def close(self):
        """Close the connection."""
        if self.conn:
            self.conn.close()
            self.conn = None


def _to_float(val) -> float | None:
    if val is None:
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def _to_int(val) -> int | None:
    if val is None:
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None
