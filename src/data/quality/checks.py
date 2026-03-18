"""Data quality checker for market_summary.json.

Validates:
- All sections have at least 1 item
- All items have valid close > 0
- All items have non-empty history arrays
- No duplicate symbols
- Date is reasonable (within last 7 days)

Usage:
    uv run python -m src.data.quality.checks
    uv run python -m src.data.quality.checks /path/to/market_summary.json
"""

import json
import sys
from datetime import date
from pathlib import Path

SECTIONS = ("cn_indices", "global_indices", "fx", "commodities", "crypto")

# Resolve project root
PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_SUMMARY = PROJECT_ROOT / "data" / "aggregated" / "market_summary.json"


class QualityCheckResult:
    def __init__(self):
        self.passed: list[str] = []
        self.failed: list[str] = []

    def ok(self, msg: str):
        self.passed.append(msg)

    def fail(self, msg: str):
        self.failed.append(msg)

    @property
    def success(self) -> bool:
        return len(self.failed) == 0

    def summary(self) -> str:
        lines = []
        for msg in self.passed:
            lines.append(f"  PASS  {msg}")
        for msg in self.failed:
            lines.append(f"  FAIL  {msg}")
        total = len(self.passed) + len(self.failed)
        lines.append(f"\n{len(self.passed)}/{total} checks passed.")
        return "\n".join(lines)


def check_market_summary(path: Path | None = None) -> QualityCheckResult:
    """Run all quality checks on market_summary.json and return results."""
    path = path or DEFAULT_SUMMARY
    result = QualityCheckResult()

    # --- Load file ---
    if not path.exists():
        result.fail(f"File not found: {path}")
        return result

    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError as e:
        result.fail(f"Invalid JSON: {e}")
        return result

    # --- Check date is reasonable (within last 7 days) ---
    raw_date = data.get("date")
    if raw_date:
        try:
            summary_date = date.fromisoformat(raw_date)
            age = (date.today() - summary_date).days
            if age <= 7:
                result.ok(f"Date {summary_date} is within 7 days (age={age}d)")
            else:
                result.fail(f"Date {summary_date} is {age} days old (>7)")
        except ValueError:
            result.fail(f"Invalid date format: {raw_date}")
    else:
        result.fail("Missing 'date' field")

    # --- Check each section ---
    for section in SECTIONS:
        items = data.get(section)

        # At least 1 item
        if items is None or not isinstance(items, list):
            result.fail(f"{section}: missing or not a list")
            continue

        if len(items) >= 1:
            result.ok(f"{section}: has {len(items)} item(s)")
        else:
            result.fail(f"{section}: empty (0 items)")
            continue

        # All items have close > 0
        bad_close = [
            it.get("symbol", "?")
            for it in items
            if it.get("close") is None or it["close"] <= 0
        ]
        if not bad_close:
            result.ok(f"{section}: all items have valid close > 0")
        else:
            result.fail(f"{section}: invalid close for symbols {bad_close}")

        # All items have non-empty history
        bad_hist = [
            it.get("symbol", "?")
            for it in items
            if not it.get("history")
        ]
        if not bad_hist:
            result.ok(f"{section}: all items have non-empty history")
        else:
            result.fail(f"{section}: empty history for symbols {bad_hist}")

        # No duplicate symbols
        symbols = [it.get("symbol") for it in items]
        dupes = [s for s in symbols if symbols.count(s) > 1]
        if not dupes:
            result.ok(f"{section}: no duplicate symbols")
        else:
            result.fail(f"{section}: duplicate symbols {set(dupes)}")

    return result


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    target = path or DEFAULT_SUMMARY
    print(f"Quality check: {target}\n")

    result = check_market_summary(path)
    print(result.summary())

    sys.exit(0 if result.success else 1)


if __name__ == "__main__":
    main()
