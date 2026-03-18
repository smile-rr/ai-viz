"""Base collector interface for all data sources."""

from abc import ABC, abstractmethod
from datetime import date, datetime
from pathlib import Path

import polars as pl


class BaseCollector(ABC):
    """Base class for all data collectors."""

    def __init__(self, data_dir: Path = Path("data/raw")):
        self.data_dir = data_dir
        self.data_dir.mkdir(parents=True, exist_ok=True)

    @property
    @abstractmethod
    def source_name(self) -> str:
        """Name of the data source."""

    @abstractmethod
    def collect_daily_prices(
        self, symbols: list[str], start_date: date, end_date: date
    ) -> pl.DataFrame:
        """Collect daily OHLCV price data."""

    @abstractmethod
    def collect_index_data(
        self, indices: list[str], start_date: date, end_date: date
    ) -> pl.DataFrame:
        """Collect index data."""

    def save(self, df: pl.DataFrame, category: str, filename: str) -> Path:
        """Save dataframe to parquet file."""
        out_dir = self.data_dir / self.source_name / category
        out_dir.mkdir(parents=True, exist_ok=True)
        path = out_dir / f"{filename}.parquet"
        df.write_parquet(path)
        return path

    def log(self, msg: str) -> None:
        print(f"[{datetime.now():%H:%M:%S}] [{self.source_name}] {msg}")
