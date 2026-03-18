"""Export DuckDB table data as JSON for the frontend Data Explorer."""

import json
import math
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path

import duckdb


DB_PATH = Path(__file__).resolve().parents[2] / "data" / "ai_viz.duckdb"
OUTPUT_DIR = Path(__file__).resolve().parents[2] / "frontend" / "public" / "data" / "tables"
SAMPLE_LIMIT = 200


def _json_serializable(val):
    """Convert non-serializable types to JSON-friendly values."""
    if val is None:
        return None
    if isinstance(val, (date, datetime)):
        return val.isoformat()
    if isinstance(val, Decimal):
        return float(val)
    if isinstance(val, float):
        if math.isnan(val) or math.isinf(val):
            return None
        return val
    return val


def export_tables():
    """Export all tables from DuckDB to JSON files."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect(str(DB_PATH), read_only=True)

    tables_meta = con.execute(
        "SELECT table_name FROM information_schema.tables "
        "WHERE table_schema='main' ORDER BY table_name"
    ).fetchall()
    table_names = [r[0] for r in tables_meta]

    index_entries = []

    for table_name in table_names:
        print(f"Exporting {table_name}...")

        # Column metadata
        columns_raw = con.execute(
            "SELECT column_name, data_type FROM information_schema.columns "
            f"WHERE table_name='{table_name}' ORDER BY ordinal_position"
        ).fetchall()
        columns = [{"name": c[0], "type": c[1]} for c in columns_raw]
        col_names = [c[0] for c in columns_raw]

        # Row count
        row_count = con.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()[0]

        # Sample rows
        is_fact = table_name.startswith("fact_")
        table_type = "fact" if is_fact else "dimension"

        if is_fact:
            first_col = col_names[0]
            query = f"SELECT * FROM {table_name} ORDER BY {first_col} DESC LIMIT {SAMPLE_LIMIT}"
        else:
            query = f"SELECT * FROM {table_name} LIMIT {SAMPLE_LIMIT}"

        raw_rows = con.execute(query).fetchall()
        rows = [
            {col: _json_serializable(val) for col, val in zip(col_names, row)}
            for row in raw_rows
        ]

        table_data = {
            "table_name": table_name,
            "row_count": row_count,
            "sample_size": len(rows),
            "columns": columns,
            "rows": rows,
        }

        out_path = OUTPUT_DIR / f"{table_name}.json"
        with open(out_path, "w") as f:
            json.dump(table_data, f, indent=2, ensure_ascii=False)
        size_kb = out_path.stat().st_size / 1024
        print(f"  -> {out_path.name} ({len(rows)} rows, {size_kb:.1f} KB)")

        index_entries.append({
            "name": table_name,
            "row_count": row_count,
            "column_count": len(columns),
            "type": table_type,
        })

    # Write index
    index_path = OUTPUT_DIR / "index.json"
    with open(index_path, "w") as f:
        json.dump({"tables": index_entries}, f, indent=2, ensure_ascii=False)
    print(f"\nIndex written to {index_path.name} ({len(index_entries)} tables)")

    con.close()
    print("Done.")


if __name__ == "__main__":
    export_tables()
