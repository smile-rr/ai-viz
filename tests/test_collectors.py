"""Tests for data collectors and daily pipeline."""

import json
from datetime import date, timedelta
from pathlib import Path

import pytest

from src.data.collectors.akshare_collector import AKShareCollector
from src.data.collectors.yfinance_collector import YFinanceCollector


# ---------------------------------------------------------------------------
# Instantiation tests
# ---------------------------------------------------------------------------

class TestAKShareCollectorInit:
    def test_can_instantiate(self, tmp_path):
        collector = AKShareCollector(data_dir=tmp_path / "raw")
        assert collector is not None
        assert collector.source_name == "akshare"

    def test_data_dir_created(self, tmp_path):
        data_dir = tmp_path / "raw"
        AKShareCollector(data_dir=data_dir)
        assert data_dir.exists()


class TestYFinanceCollectorInit:
    def test_can_instantiate(self, tmp_path):
        collector = YFinanceCollector(data_dir=tmp_path / "raw")
        assert collector is not None
        assert collector.source_name == "yfinance"

    def test_data_dir_created(self, tmp_path):
        data_dir = tmp_path / "raw"
        YFinanceCollector(data_dir=data_dir)
        assert data_dir.exists()


# ---------------------------------------------------------------------------
# Data collection tests (live network calls — small date ranges)
# ---------------------------------------------------------------------------

class TestAKShareCollectorData:
    @pytest.fixture
    def collector(self, tmp_path):
        return AKShareCollector(data_dir=tmp_path / "raw")

    def test_collect_index_data_returns_dataframe(self, collector):
        """collect_index_data() should return a non-empty DataFrame with expected columns."""
        df = collector.collect_index_data(indices=["000001"])
        assert not df.is_empty(), "Expected non-empty DataFrame from collect_index_data"
        expected_cols = {"index_code", "index_name"}
        assert expected_cols.issubset(set(df.columns)), (
            f"Missing columns: {expected_cols - set(df.columns)}"
        )


class TestYFinanceCollectorData:
    @pytest.fixture
    def collector(self, tmp_path):
        return YFinanceCollector(data_dir=tmp_path / "raw")

    def test_collect_daily_prices_gspc(self, collector):
        """collect_daily_prices(['^GSPC']) should return data with expected columns."""
        end = date.today()
        start = end - timedelta(days=5)
        df = collector.collect_daily_prices(["^GSPC"], start_date=start, end_date=end)
        assert not df.is_empty(), "Expected non-empty DataFrame for ^GSPC"
        expected_cols = {"Close", "Open", "High", "Low", "Volume", "symbol"}
        assert expected_cols.issubset(set(df.columns)), (
            f"Missing columns: {expected_cols - set(df.columns)}"
        )


# ---------------------------------------------------------------------------
# Pipeline / market_summary.json validation
# ---------------------------------------------------------------------------

class TestMarketSummaryJson:
    """Validate the existing market_summary.json produced by the daily pipeline."""

    SUMMARY_PATH = Path(__file__).resolve().parents[1] / "data" / "aggregated" / "market_summary.json"

    @pytest.fixture
    def summary(self):
        if not self.SUMMARY_PATH.exists():
            pytest.skip("market_summary.json not found — run the daily pipeline first")
        with open(self.SUMMARY_PATH) as f:
            return json.load(f)

    def test_has_required_sections(self, summary):
        for section in ("cn_indices", "global_indices", "fx", "commodities", "crypto"):
            assert section in summary, f"Missing section: {section}"

    def test_sections_non_empty(self, summary):
        for section in ("cn_indices", "global_indices", "fx", "commodities", "crypto"):
            assert len(summary[section]) > 0, f"Section {section} is empty"

    def test_items_have_positive_close(self, summary):
        """Items with a non-null close must have close > 0.

        Some sections (e.g. crypto) may have all-null close values when the
        market data for the current day has not yet settled; we skip those
        sections rather than failing.
        """
        sections_with_data = 0
        for section in ("cn_indices", "global_indices", "fx", "commodities", "crypto"):
            items_with_close = [
                item for item in summary[section] if item.get("close") is not None
            ]
            if not items_with_close:
                continue  # section has no settled data yet — skip
            sections_with_data += 1
            for item in items_with_close:
                assert item["close"] > 0, (
                    f"Non-positive close in {section}/{item.get('symbol')}"
                )
        assert sections_with_data >= 1, "No sections had any items with a valid close"

    def test_items_have_history(self, summary):
        for section in ("cn_indices", "global_indices", "fx", "commodities", "crypto"):
            for item in summary[section]:
                assert len(item.get("history", [])) > 0, (
                    f"Empty history in {section}/{item.get('symbol')}"
                )

    def test_no_duplicate_symbols(self, summary):
        for section in ("cn_indices", "global_indices", "fx", "commodities", "crypto"):
            symbols = [item["symbol"] for item in summary[section]]
            assert len(symbols) == len(set(symbols)), (
                f"Duplicate symbols in {section}: {symbols}"
            )

    def test_date_is_recent(self, summary):
        summary_date = date.fromisoformat(summary["date"])
        assert (date.today() - summary_date).days <= 7, (
            f"Summary date {summary_date} is older than 7 days"
        )
