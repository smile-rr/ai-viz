"""AKShare data collector — A股/港股/宏观/商品 数据采集."""

from datetime import date

import akshare as ak
import polars as pl

from .base import BaseCollector


# 主要A股指数
CN_INDICES = {
    "000001": "上证指数",
    "399001": "深证成指",
    "399006": "创业板指",
    "000300": "沪深300",
    "000905": "中证500",
    "000852": "中证1000",
}

# 主要行业板块
CN_SECTORS = [
    "银行", "房地产", "医药生物", "电子", "计算机",
    "食品饮料", "新能源", "汽车", "军工", "半导体",
]


class AKShareCollector(BaseCollector):
    @property
    def source_name(self) -> str:
        return "akshare"

    def collect_daily_prices(
        self, symbols: list[str], start_date: date, end_date: date
    ) -> pl.DataFrame:
        """Collect A-share daily prices."""
        frames = []
        start_str = start_date.strftime("%Y%m%d")
        end_str = end_date.strftime("%Y%m%d")

        for symbol in symbols:
            try:
                df_pd = ak.stock_zh_a_hist(
                    symbol=symbol,
                    period="daily",
                    start_date=start_str,
                    end_date=end_str,
                    adjust="qfq",
                )
                if df_pd.empty:
                    continue
                df = pl.from_pandas(df_pd)
                df = df.with_columns(pl.lit(symbol).alias("symbol"))
                frames.append(df)
                self.log(f"Collected {symbol}: {len(df)} rows")
            except Exception as e:
                self.log(f"Failed {symbol}: {e}")

        if not frames:
            return pl.DataFrame()
        return pl.concat(frames)

    def collect_index_data(
        self, indices: list[str] | None = None, start_date: date | None = None,
        end_date: date | None = None,
    ) -> pl.DataFrame:
        """Collect Chinese market index data."""
        indices = indices or list(CN_INDICES.keys())
        frames = []

        for code in indices:
            try:
                df_pd = ak.stock_zh_index_daily(symbol=f"sh{code}" if code.startswith("0") else f"sz{code}")
                if df_pd.empty:
                    continue
                df = pl.from_pandas(df_pd)
                df = df.with_columns([
                    pl.lit(code).alias("index_code"),
                    pl.lit(CN_INDICES.get(code, code)).alias("index_name"),
                ])
                frames.append(df)
                self.log(f"Index {code} ({CN_INDICES.get(code, '')}): {len(df)} rows")
            except Exception as e:
                self.log(f"Failed index {code}: {e}")

        if not frames:
            return pl.DataFrame()
        return pl.concat(frames, how="diagonal")

    def collect_macro_china(self) -> dict[str, pl.DataFrame]:
        """Collect key Chinese macro indicators."""
        result = {}

        collectors = {
            "gdp": lambda: ak.macro_china_gdp(),
            "cpi": lambda: ak.macro_china_cpi_monthly(),
            "pmi": lambda: ak.macro_china_pmi(),
            "money_supply": lambda: ak.macro_china_money_supply(),
        }

        for name, fn in collectors.items():
            try:
                df_pd = fn()
                result[name] = pl.from_pandas(df_pd)
                self.log(f"Macro {name}: {len(result[name])} rows")
            except Exception as e:
                self.log(f"Failed macro {name}: {e}")

        return result

    def collect_sector_fund_flow(self) -> pl.DataFrame:
        """Collect sector fund flow data.

        Uses stock_fund_flow_industry (同花顺) as primary source because
        stock_sector_fund_flow_rank (东方财富) has persistent connection issues.
        Falls back to stock_sector_fund_flow_rank if the primary source fails.
        """
        try:
            df_pd = ak.stock_fund_flow_industry(symbol="即时")
            df = pl.from_pandas(df_pd)
            self.log(f"Sector fund flow: {len(df)} rows")
            return df
        except Exception:
            pass

        try:
            df_pd = ak.stock_sector_fund_flow_rank(indicator="今日")
            df = pl.from_pandas(df_pd)
            self.log(f"Sector fund flow (fallback): {len(df)} rows")
            return df
        except Exception as e:
            self.log(f"Failed sector fund flow: {e}")
            return pl.DataFrame()

    def collect_northbound_flow(self) -> pl.DataFrame:
        """Collect northbound (沪深港通) capital flow."""
        try:
            df_pd = ak.stock_hsgt_hist_em(symbol="北向资金")
            df = pl.from_pandas(df_pd)
            self.log(f"Northbound flow: {len(df)} rows")
            return df
        except Exception as e:
            self.log(f"Failed northbound flow: {e}")
            return pl.DataFrame()
