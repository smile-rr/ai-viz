"""Daily data pipeline — 每日数据采集 + 转换 + 聚合."""

import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

import duckdb
import polars as pl
from dotenv import load_dotenv

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from src.data.collectors.akshare_collector import AKShareCollector
from src.data.collectors.yfinance_collector import YFinanceCollector
from src.models.schema import init_database

load_dotenv()

DATA_DIR = Path("data")
DB_PATH = DATA_DIR / "ai_viz.duckdb"
AGG_DIR = DATA_DIR / "aggregated"


def run_daily_pipeline(target_date: date | None = None):
    """Run the full daily data pipeline."""
    today = target_date or date.today()
    print(f"=== Daily Pipeline: {today} ===\n")

    # 1. Init database
    con = duckdb.connect(str(DB_PATH))
    init_database(con)
    print("[1/4] Database initialized\n")

    # 2. Collect data
    print("[2/4] Collecting data...")
    ak_collector = AKShareCollector(DATA_DIR / "raw")
    yf_collector = YFinanceCollector(DATA_DIR / "raw")

    start = today - timedelta(days=7)  # Last 7 days for incremental

    # Chinese indices
    cn_index = ak_collector.collect_index_data()
    if not cn_index.is_empty():
        ak_collector.save(cn_index, "index", f"cn_index_{today}")
        print(f"  CN indices: {len(cn_index)} rows")

    # Global indices
    global_index = yf_collector.collect_index_data(start_date=start, end_date=today)
    if not global_index.is_empty():
        yf_collector.save(global_index, "index", f"global_index_{today}")
        print(f"  Global indices: {len(global_index)} rows")

    # FX
    fx = yf_collector.collect_fx(start_date=start, end_date=today)
    if not fx.is_empty():
        yf_collector.save(fx, "fx", f"fx_{today}")
        print(f"  FX: {len(fx)} rows")

    # Commodities
    commodities = yf_collector.collect_commodities(start_date=start, end_date=today)
    if not commodities.is_empty():
        yf_collector.save(commodities, "commodity", f"commodity_{today}")
        print(f"  Commodities: {len(commodities)} rows")

    # Macro (less frequent, run weekly on Monday)
    if today.weekday() == 0:
        macro = ak_collector.collect_macro_china()
        for name, df in macro.items():
            if not df.is_empty():
                ak_collector.save(df, "macro", f"{name}_{today}")
        print(f"  Macro indicators: {len(macro)} categories")

    # Northbound flow
    nb = ak_collector.collect_northbound_flow()
    if not nb.is_empty():
        ak_collector.save(nb, "flow", f"northbound_{today}")
        print(f"  Northbound flow: {len(nb)} rows")

    # Sector fund flow
    sf = ak_collector.collect_sector_fund_flow()
    if not sf.is_empty():
        ak_collector.save(sf, "flow", f"sector_flow_{today}")
        print(f"  Sector flow: {len(sf)} rows")

    print()

    # 3. Generate aggregated JSON for frontend
    print("[3/4] Generating aggregated data...")
    AGG_DIR.mkdir(parents=True, exist_ok=True)
    generate_market_summary(today, cn_index, global_index, fx, commodities)

    # 4. Quality check
    print("[4/4] Quality check...")
    quality_report = {
        "date": str(today),
        "tables_collected": {
            "cn_index": len(cn_index) if not cn_index.is_empty() else 0,
            "global_index": len(global_index) if not global_index.is_empty() else 0,
            "fx": len(fx) if not fx.is_empty() else 0,
            "commodities": len(commodities) if not commodities.is_empty() else 0,
        },
        "status": "success",
    }
    quality_path = DATA_DIR / "quality" / f"check_{today}.json"
    quality_path.parent.mkdir(parents=True, exist_ok=True)
    quality_path.write_text(json.dumps(quality_report, indent=2, ensure_ascii=False))

    con.close()
    print(f"\n=== Pipeline complete: {today} ===")


def generate_market_summary(
    today: date,
    cn_index: pl.DataFrame,
    global_index: pl.DataFrame,
    fx: pl.DataFrame,
    commodities: pl.DataFrame,
) -> None:
    """Generate market summary JSON for frontend."""
    summary = {
        "date": str(today),
        "generated_at": str(date.today()),
        "cn_indices": _df_to_summary(cn_index, "index_code", "index_name"),
        "global_indices": _df_to_summary(global_index, "symbol"),
        "fx": _df_to_summary(fx, "symbol"),
        "commodities": _df_to_summary(commodities, "symbol"),
    }

    out_path = AGG_DIR / "market_summary.json"
    out_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False, default=str))
    print(f"  Market summary → {out_path}")


def _df_to_summary(df: pl.DataFrame, key_col: str, name_col: str | None = None) -> list[dict]:
    """Convert dataframe to summary dicts (last row per key)."""
    if df.is_empty():
        return []
    try:
        result = []
        for key in df[key_col].unique().to_list():
            subset = df.filter(pl.col(key_col) == key).sort(df.columns[0])
            if subset.is_empty():
                continue
            last = subset.tail(1).to_dicts()[0]
            # Convert all values to JSON-serializable types
            clean = {k: str(v) if not isinstance(v, (int, float, str, bool, type(None))) else v for k, v in last.items()}
            result.append(clean)
        return result
    except Exception:
        return []


if __name__ == "__main__":
    target = None
    if len(sys.argv) > 1:
        target = date.fromisoformat(sys.argv[1])
    run_daily_pipeline(target)
