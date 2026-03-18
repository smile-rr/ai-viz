"""DuckDB schema definitions — Star Schema for financial data."""

DIMENSION_TABLES = {
    "dim_date": """
        CREATE TABLE IF NOT EXISTS dim_date (
            date_key      DATE PRIMARY KEY,
            year          INT,
            quarter       INT,
            month         INT,
            week          INT,
            day_of_week   INT,
            is_month_end  BOOLEAN,
            is_cn_trading BOOLEAN DEFAULT TRUE,
            is_us_trading BOOLEAN DEFAULT TRUE,
            is_hk_trading BOOLEAN DEFAULT TRUE
        )
    """,
    "dim_asset": """
        CREATE TABLE IF NOT EXISTS dim_asset (
            asset_key     VARCHAR PRIMARY KEY,  -- symbol/ticker
            name          VARCHAR,
            asset_type    VARCHAR,              -- stock/index/etf/bond/commodity/fx/crypto
            exchange      VARCHAR,              -- SSE/SZSE/NYSE/NASDAQ/HKEX
            market        VARCHAR,              -- CN/US/HK/EU/JP/GLOBAL
            sector        VARCHAR,
            industry      VARCHAR,
            currency      VARCHAR DEFAULT 'CNY',
            list_date     DATE,
            status        VARCHAR DEFAULT 'active'
        )
    """,
    "dim_market": """
        CREATE TABLE IF NOT EXISTS dim_market (
            market_key    VARCHAR PRIMARY KEY,  -- CN/US/HK/EU/JP
            market_name   VARCHAR,
            region        VARCHAR,              -- Asia/Americas/Europe
            timezone      VARCHAR,
            currency      VARCHAR,
            open_time     VARCHAR,
            close_time    VARCHAR
        )
    """,
    "dim_indicator": """
        CREATE TABLE IF NOT EXISTS dim_indicator (
            indicator_key VARCHAR PRIMARY KEY,
            name          VARCHAR,
            name_cn       VARCHAR,
            category      VARCHAR,              -- gdp/cpi/pmi/rate/money_supply
            unit          VARCHAR,
            frequency     VARCHAR,              -- daily/monthly/quarterly/yearly
            source        VARCHAR,
            description   VARCHAR
        )
    """,
}

FACT_TABLES = {
    "fact_price": """
        CREATE TABLE IF NOT EXISTS fact_price (
            date_key      DATE,
            asset_key     VARCHAR,
            open          DOUBLE,
            high          DOUBLE,
            low           DOUBLE,
            close         DOUBLE,
            volume        BIGINT,
            turnover      DOUBLE,
            change_pct    DOUBLE,
            amplitude     DOUBLE,
            PRIMARY KEY (date_key, asset_key)
        )
    """,
    "fact_index": """
        CREATE TABLE IF NOT EXISTS fact_index (
            date_key      DATE,
            asset_key     VARCHAR,
            open          DOUBLE,
            high          DOUBLE,
            low           DOUBLE,
            close         DOUBLE,
            volume        BIGINT,
            change_pct    DOUBLE,
            pe_ttm        DOUBLE,
            pb            DOUBLE,
            PRIMARY KEY (date_key, asset_key)
        )
    """,
    "fact_macro": """
        CREATE TABLE IF NOT EXISTS fact_macro (
            date_key       DATE,
            indicator_key  VARCHAR,
            value          DOUBLE,
            yoy_change     DOUBLE,
            mom_change     DOUBLE,
            PRIMARY KEY (date_key, indicator_key)
        )
    """,
    "fact_fund_flow": """
        CREATE TABLE IF NOT EXISTS fact_fund_flow (
            date_key       DATE,
            sector         VARCHAR,
            net_inflow     DOUBLE,
            main_inflow    DOUBLE,
            main_outflow   DOUBLE,
            retail_inflow  DOUBLE,
            retail_outflow DOUBLE,
            PRIMARY KEY (date_key, sector)
        )
    """,
    "fact_cross_border": """
        CREATE TABLE IF NOT EXISTS fact_cross_border (
            date_key       DATE,
            direction      VARCHAR,  -- northbound/southbound
            net_buy        DOUBLE,
            buy_amount     DOUBLE,
            sell_amount    DOUBLE,
            PRIMARY KEY (date_key, direction)
        )
    """,
    "fact_fx": """
        CREATE TABLE IF NOT EXISTS fact_fx (
            date_key       DATE,
            pair           VARCHAR,  -- USDCNY/EURUSD etc
            rate           DOUBLE,
            change_pct     DOUBLE,
            PRIMARY KEY (date_key, pair)
        )
    """,
    "fact_commodity": """
        CREATE TABLE IF NOT EXISTS fact_commodity (
            date_key       DATE,
            asset_key      VARCHAR,
            price          DOUBLE,
            change_pct     DOUBLE,
            volume         BIGINT,
            PRIMARY KEY (date_key, asset_key)
        )
    """,
}


def init_database(con) -> None:
    """Initialize all tables in DuckDB."""
    for name, ddl in DIMENSION_TABLES.items():
        con.execute(ddl)
    for name, ddl in FACT_TABLES.items():
        con.execute(ddl)
