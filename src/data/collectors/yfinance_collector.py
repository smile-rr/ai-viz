"""yfinance data collector — Global markets data."""

from datetime import date

import polars as pl
import yfinance as yf

from .base import BaseCollector


# Global indices
GLOBAL_INDICES = {
    "^GSPC": "S&P 500",
    "^DJI": "Dow Jones",
    "^IXIC": "NASDAQ",
    "^FTSE": "FTSE 100",
    "^GDAXI": "DAX",
    "^N225": "Nikkei 225",
    "^HSI": "Hang Seng",
    "^KS11": "KOSPI",
}

# Major FX pairs
FX_PAIRS = ["USDCNY=X", "EURUSD=X", "USDJPY=X", "GBPUSD=X"]

# Major commodities
COMMODITIES = {
    "GC=F": "Gold",
    "SI=F": "Silver",
    "CL=F": "Crude Oil WTI",
    "BZ=F": "Brent Crude",
    "NG=F": "Natural Gas",
}

# Crypto
CRYPTO = {"BTC-USD": "Bitcoin", "ETH-USD": "Ethereum"}


class YFinanceCollector(BaseCollector):
    @property
    def source_name(self) -> str:
        return "yfinance"

    def collect_daily_prices(
        self, symbols: list[str], start_date: date, end_date: date
    ) -> pl.DataFrame:
        """Collect daily prices for given symbols."""
        frames = []
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                df_pd = ticker.history(start=start_date, end=end_date)
                if df_pd.empty:
                    continue
                df_pd = df_pd.reset_index()
                df = pl.from_pandas(df_pd)
                # Normalize timezone-aware Date column to naive UTC for consistent concat
                if "Date" in df.columns:
                    dtype = df["Date"].dtype
                    if hasattr(dtype, "time_zone") and dtype.time_zone is not None:
                        df = df.with_columns(
                            pl.col("Date").dt.replace_time_zone(None)
                        )
                df = df.with_columns(pl.lit(symbol).alias("symbol"))
                frames.append(df)
                self.log(f"Collected {symbol}: {len(df)} rows")
            except Exception as e:
                self.log(f"Failed {symbol}: {e}")

        if not frames:
            return pl.DataFrame()
        return pl.concat(frames, how="diagonal")

    def collect_index_data(
        self, indices: list[str] | None = None, start_date: date | None = None,
        end_date: date | None = None,
    ) -> pl.DataFrame:
        """Collect global index data."""
        indices = indices or list(GLOBAL_INDICES.keys())
        start = start_date or date(2020, 1, 1)
        end = end_date or date.today()
        return self.collect_daily_prices(indices, start, end)

    def collect_fx(self, start_date: date | None = None, end_date: date | None = None) -> pl.DataFrame:
        """Collect FX rates."""
        start = start_date or date(2020, 1, 1)
        end = end_date or date.today()
        return self.collect_daily_prices(FX_PAIRS, start, end)

    def collect_commodities(self, start_date: date | None = None, end_date: date | None = None) -> pl.DataFrame:
        """Collect commodity prices."""
        start = start_date or date(2020, 1, 1)
        end = end_date or date.today()
        return self.collect_daily_prices(list(COMMODITIES.keys()), start, end)

    def collect_crypto(self, start_date: date | None = None, end_date: date | None = None) -> pl.DataFrame:
        """Collect crypto prices."""
        start = start_date or date(2020, 1, 1)
        end = end_date or date.today()
        return self.collect_daily_prices(list(CRYPTO.keys()), start, end)
