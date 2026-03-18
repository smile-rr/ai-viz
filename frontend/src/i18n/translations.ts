export type Locale = "en" | "zh";

export const translations = {
  en: {
    // Sidebar groups
    "nav.dashboard": "Dashboard",
    "nav.markets": "Markets",
    "nav.analytics": "Analytics",
    "nav.platform": "Platform",
    // Sidebar items
    "nav.overview": "Overview",
    "nav.cn-markets": "China Markets",
    "nav.global": "Global Markets",
    "nav.fx": "FX Rates",
    "nav.commodities": "Commodities",
    "nav.crypto": "Crypto",
    "nav.reports": "Reports",
    "nav.architecture": "Data Model",
    "nav.quality": "Data Quality",
    // Header
    "header.terminal": "TERMINAL",
    "header.live": "LIVE",
    "header.autoRefresh": "Auto-refresh: 5min",
    "header.nextRefresh": "Next refresh in",
    "header.updated": "Updated",
    "header.refreshing": "Refreshing...",
    "header.refresh": "Refresh",
    // Page titles
    "page.overview.title": "Market Overview",
    "page.overview.subtitle": "Global financial markets at a glance",
    "page.cn.title": "China Markets",
    "page.cn.subtitle": "Shanghai, Shenzhen & Hong Kong indices",
    "page.global.title": "Global Markets",
    "page.global.subtitle": "Major world indices",
    "page.fx.title": "Foreign Exchange",
    "page.fx.subtitle": "Major currency pair rates and trends",
    "page.commodities.title": "Commodities",
    "page.commodities.subtitle": "Gold, oil, silver and commodity prices",
    "page.crypto.title": "Cryptocurrency",
    "page.crypto.subtitle": "Bitcoin, Ethereum and digital assets",
    "page.architecture.title": "Data Architecture",
    "page.architecture.subtitle":
      "Star schema, semantic layer, data lineage & tech stack",
    "page.reports.title": "Reports",
    "page.reports.subtitle": "Auto-generated market summaries and reviews",
    "page.quality.title": "Data Quality",
    "page.quality.subtitle":
      "Data freshness, coverage, and validation monitoring",
    // Footer
    "footer.disclaimer":
      "AI-VIZ Market Intelligence Terminal \u00b7 Data: AKShare \u00b7 Yahoo Finance \u00b7 Tushare \u00b7 For informational purposes only",
    // System info
    "system.refreshFreq": "Refresh: Daily 18:00 CST",
    "system.cnSource": "CN: AKShare / Tushare",
    "system.globalSource": "Global: Yahoo Finance",

    // ── Chart titles (page.tsx) ──
    "chart.cn.30d": "China Markets — 30 Day Trend",
    "chart.cn.extended": "China Markets — Extended",
    "chart.global.30d": "Global Markets — 30 Day Trend",
    "chart.global.extended": "Global Markets — Extended",
    "chart.cn.all": "All China Indices — 30 Day Trend",
    "chart.cn.mainBoard": "Main Board Indices",
    "chart.cn.extendedIndices": "Extended Indices",
    "chart.global.all": "Global Indices — 30 Day Trend",
    "chart.global.americas": "Americas & Europe",
    "chart.global.asiaPacific": "Asia-Pacific & Others",
    "chart.fx.trends": "FX Rate Trends — 30 Day",
    "chart.fx.major": "Major Pairs",
    "chart.fx.cross": "Cross Pairs",
    "chart.commodity.trends": "Commodity Price Trends — 30 Day",
    "chart.crypto.30d": "Crypto — 30 Day Trend",
    "chart.crypto.price30d": "{name} — 30 Day Price",

    // ── DataTable titles (page.tsx) ──
    "table.cn.detail": "China Indices — Detailed View",
    "table.global.detail": "Global Indices — Detailed View",
    "table.fx.title": "Foreign Exchange",
    "table.fx.detail": "Foreign Exchange — Detailed View",
    "table.commodity.dailyChange": "Commodities — Daily Change",
    "table.commodity.detail": "Commodities — Detailed View",
    "table.crypto.title": "Cryptocurrency",
    "table.crypto.detail": "Cryptocurrency — Detailed View",

    // ── DataTable column headers ──
    "table.col.name": "Name",
    "table.col.price": "Price",
    "table.col.chgPct": "Chg%",
    "table.col.trend30d": "30D Trend",

    // ── MarketChart ──
    "chart.normalized": "(Normalized %)",

    // ── Heatmap ──
    "heatmap.title": "Market Heatmap — All Assets by Daily Change",

    // ── InsightsCard ──
    "insights.title": "Market Insights",
    // Insight templates
    "insight.consecutive.up": "{name} advanced for {streak} consecutive sessions",
    "insight.consecutive.down": "{name} declined for {streak} consecutive sessions",
    "insight.biggestGainer": "{name} was the biggest gainer at +{pct}%",
    "insight.biggestLoser": "{name} was the biggest loser at {pct}%",
    "insight.brokeHigh": "{name} broke above its 30-day high at {price}",
    "insight.nearHigh": "{name} is trading near its 30-day high",
    "insight.brokeLow": "{name} fell below its 30-day low at {price}",
    "insight.nearLow": "{name} is trading near its 30-day low",
    "insight.divergence.cnDown": "Market divergence: China markets down (avg {cnAvg}%) while US markets up (avg +{usAvg}%)",
    "insight.divergence.cnUp": "Market divergence: China markets up (avg +{cnAvg}%) while US markets down (avg {usAvg}%)",
    "insight.volatility": "{name} volatility spike: {changePct}% move vs {avgChange}% avg",

    // ── Reports ──
    "report.dailyBrief": "Daily Market Brief",
    "report.generated": "Generated",
    "report.executiveSummary": "Executive Summary",
    "report.keyHighlights": "Key Highlights",
    "report.topGainers": "Top Gainers",
    "report.topLosers": "Top Losers",
    "report.noData": "No reports data available.",

    // ── Report Archive ──
    "archive.title": "Report Archive",
    "archive.col.date": "Date",
    "archive.col.type": "Type",
    "archive.col.title": "Title",
    "archive.type.daily": "Daily",
    "archive.type.weekly": "Weekly",
    "archive.type.monthly": "Monthly",

    // ── Quality — tabs & workflow ──
    "quality.tab.scorecard": "Scorecard",
    "quality.tab.freshness": "Freshness",
    "quality.tab.coverage": "Coverage",
    "quality.tab.checks": "Checks",
    "quality.tab.tables": "Tables",
    "quality.workflow.collect": "Collect",
    "quality.workflow.validate": "Validate",
    "quality.workflow.store": "Store",
    "quality.workflow.serve": "Serve",
    "quality.workflow.monitor": "Monitor",
    "quality.noData": "No quality data available.",

    // ── QualityScorecard ──
    "quality.overallScore": "Overall Quality Score",
    "quality.passed": "Passed",
    "quality.warnings": "Warnings",
    "quality.failed": "Failed",
    "quality.lastChecked": "Last checked:",

    // ── FreshnessTable ──
    "freshness.title": "Data Freshness",
    "freshness.col.source": "Source",
    "freshness.col.market": "Market",
    "freshness.col.lastUpdate": "Last Update",
    "freshness.col.status": "Status",
    "freshness.col.frequency": "Frequency",
    "freshness.status.fresh": "Fresh",
    "freshness.status.stale": "Stale",
    "freshness.status.error": "Error",

    // ── CoverageMatrix ──
    "coverage.title": "Coverage Matrix",
    "coverage.col.market": "Market",
    "coverage.asset.equity": "Equity",
    "coverage.asset.index": "Index",
    "coverage.asset.macro": "Macro",
    "coverage.asset.fx": "FX",
    "coverage.asset.commodity": "Commodity",
    "coverage.asset.crypto": "Crypto",

    // ── QualityChecks ──
    "checks.title": "Quality Checks",
    "checks.category.completeness": "Completeness",
    "checks.category.validity": "Validity",
    "checks.category.consistency": "Consistency",
    "checks.passed": "passed",

    // ── TableStats ──
    "tableStats.title": "Table Statistics",
    "tableStats.noData": "No data",
    "tableStats.rows": "rows",
    "tableStats.hasData": "Has data",
    "tableStats.empty": "Empty / Not configured",

    // ── Architecture tabs ──
    "arch.tab.starSchema": "Star Schema",
    "arch.tab.semanticLayer": "Semantic Layer",
    "arch.tab.dataLineage": "Data Lineage",
    "arch.tab.techStack": "Tech Stack",
    "arch.tab.dataExplorer": "Data Explorer",

    // ── Data Explorer ──
    "dataExplorer.title": "Data Explorer",
    "dataExplorer.tables": "tables",
    "dataExplorer.dimensions": "Dimensions",
    "dataExplorer.facts": "Facts",
    "dataExplorer.rows": "rows",
    "dataExplorer.showing": "Showing {count} of {total}",
    "dataExplorer.filter": "Filter all columns...",
    "dataExplorer.page": "Page",
    "dataExplorer.of": "of",
    "dataExplorer.noData": "No data available for this table",
    "dataExplorer.loading": "Loading table data...",
    "dataExplorer.selectTable": "Select a table",
    "dataExplorer.emptyTable": "Empty table",

    // ── StarSchemaViz ──
    "starSchema.title": "Star Schema Model",
    "starSchema.subtitle": "Click any table to explore relationships",
    "starSchema.factTables": "Fact Tables",
    "starSchema.dimensions": "Dimensions",
    "starSchema.fkJoins": "foreign key joins",
    "starSchema.cols": "cols",
    "starSchema.relatedTables": "Related tables:",
    // Star schema descriptions
    "starSchema.desc.fact_price": "Daily OHLCV price data",
    "starSchema.desc.fact_index": "Index valuation metrics",
    "starSchema.desc.fact_macro": "Macroeconomic indicators",
    "starSchema.desc.fact_fx": "FX pair exchange rates",
    "starSchema.desc.fact_commodity": "Commodity futures data",
    "starSchema.desc.fact_fund_flow": "Sector fund flow data",
    "starSchema.desc.fact_cross_border": "Northbound/Southbound flows",
    "starSchema.desc.dim_date": "Date dimension with trading calendar",
    "starSchema.desc.dim_asset": "Asset master data",
    "starSchema.desc.dim_market": "Market/Exchange reference",
    "starSchema.desc.dim_indicator": "Macro indicator definitions",

    // ── SemanticLayerViz ──
    "semantic.title": "Semantic Layer",
    "semantic.subtitle": "{count} metrics across {categories} categories",
    "semantic.analysisDimensions": "Analysis Dimensions",

    // ── DataLineageViz ──
    "lineage.title": "Data Lineage",
    "lineage.subtitle": "End-to-end data flow from source to dashboard",
    "lineage.tables": "Tables",
    // Lineage layer labels
    "lineage.layer.source": "Data Sources",
    "lineage.layer.source.sub": "Collection",
    "lineage.layer.ods": "ODS",
    "lineage.layer.ods.sub": "Raw Landing",
    "lineage.layer.dwd": "DWD",
    "lineage.layer.dwd.sub": "Cleaned & Typed",
    "lineage.layer.dws": "DWS",
    "lineage.layer.dws.sub": "Aggregated Facts",
    "lineage.layer.serving": "Serving",
    "lineage.layer.serving.sub": "Dashboard JSON",
    // Lineage node descriptions
    "lineage.node.akshare": "CN Markets",
    "lineage.node.yfinance": "Global Markets",
    "lineage.node.tushare": "CN Fundamentals",
    "lineage.node.ods_cn_index": "Raw CN indices",
    "lineage.node.ods_global_quote": "Raw global quotes",
    "lineage.node.ods_macro_raw": "Raw macro data",
    "lineage.node.dwd_price": "Standardized OHLCV",
    "lineage.node.dwd_index": "Typed index data",
    "lineage.node.dwd_macro": "Cleaned macro series",
    "lineage.node.fact_price": "Price fact table",
    "lineage.node.fact_index": "Index valuations",
    "lineage.node.fact_macro": "Macro indicators",
    "lineage.node.fact_fx": "FX rates",
    "lineage.node.market_summary": "Dashboard payload",
    "lineage.node.semantic_layer": "Metric definitions",

    // ── TechStackViz ──
    "techStack.title": "Technology Stack",
    "techStack.subtitle": "6 layers, {count} technologies",
    "techStack.principles": "Architecture Principles",
    // Layer names
    "techStack.layer.presentation": "Presentation",
    "techStack.layer.semantic": "Semantic",
    "techStack.layer.processing": "Processing",
    "techStack.layer.storage": "Storage",
    "techStack.layer.collection": "Collection",
    "techStack.layer.cicd": "CI / CD",
    // Layer Chinese names
    "techStack.layerZh.presentation": "展示层",
    "techStack.layerZh.semantic": "语义层",
    "techStack.layerZh.processing": "处理层",
    "techStack.layerZh.storage": "存储层",
    "techStack.layerZh.collection": "采集层",
    "techStack.layerZh.cicd": "部署层",
    // Tech descriptions
    "techStack.desc.nextjs": "React SSG framework",
    "techStack.desc.echarts": "Interactive charting",
    "techStack.desc.tailwind": "Utility-first styling",
    "techStack.desc.typescript": "Type-safe frontend",
    "techStack.desc.metricsYml": "Metric definitions",
    "techStack.desc.lineageYml": "Data lineage config",
    "techStack.desc.dimensionsYml": "Dimension hierarchies",
    "techStack.desc.polars": "DataFrame processing",
    "techStack.desc.duckdb": "Analytical SQL engine",
    "techStack.desc.python": "Pipeline orchestration",
    "techStack.desc.turso": "Cloud SQLite (libSQL)",
    "techStack.desc.parquet": "Local columnar files",
    "techStack.desc.json": "Dashboard serving layer",
    "techStack.desc.akshare": "CN market data API",
    "techStack.desc.yfinance": "Global market data",
    "techStack.desc.tushare": "CN financial data",
    "techStack.desc.githubActions": "Scheduled pipelines",
    "techStack.desc.cloudflare": "Static site hosting",
    "techStack.desc.cron": "Daily data refresh",
    // Architecture principles
    "techStack.principle.batchFirst": "Batch-First",
    "techStack.principle.batchFirst.desc": "Daily ETL pipelines",
    "techStack.principle.schemaOnWrite": "Schema-on-Write",
    "techStack.principle.schemaOnWrite.desc": "Validated at ingestion",
    "techStack.principle.staticFirst": "Static-First",
    "techStack.principle.staticFirst.desc": "Pre-built JSON serving",
    "techStack.principle.layeredDW": "Layered DW",
    "techStack.principle.layeredDW.desc": "ODS > DWD > DWS",

    // ── StarSchemaViz — detail panel ──
    "starSchema.estimatedRows": "Est. rows",
    "starSchema.fieldDetails": "Field Details",
    "starSchema.col.field": "Field",
    "starSchema.col.type": "Type",
    "starSchema.col.key": "Key",
    "starSchema.col.description": "Description",
    // Table purposes
    "starSchema.purpose.fact_price": "Stores daily OHLCV (Open/High/Low/Close/Volume) trading data for all tracked equities and ETFs. This is the core price table and the most frequently queried fact table in the warehouse.",
    "starSchema.purpose.fact_index": "Stores daily index-level data including OHLCV prices and valuation multiples (PE, PB). Used for market-wide valuation analysis and benchmark comparisons.",
    "starSchema.purpose.fact_macro": "Stores macroeconomic indicator releases (GDP, CPI, PMI, interest rates, etc.) with year-over-year and month-over-month change calculations. Enables macro-market correlation analysis.",
    "starSchema.purpose.fact_fx": "Stores daily foreign exchange rates for major currency pairs. Enables cross-market value comparison and currency exposure analysis.",
    "starSchema.purpose.fact_commodity": "Stores daily commodity futures prices and trading volumes. Covers precious metals, energy, and agricultural commodities.",
    "starSchema.purpose.fact_fund_flow": "Tracks daily capital flow by industry sector, distinguishing between institutional (main force) and retail investor flows. Key for understanding market sentiment and sector rotation.",
    "starSchema.purpose.fact_cross_border": "Tracks Stock Connect (northbound/southbound) cross-border capital flows between mainland China and Hong Kong markets. A key sentiment indicator for A-share markets.",
    "starSchema.purpose.dim_date": "Calendar dimension table providing time hierarchy for drill-down analysis. Includes trading day flags for both Chinese and US markets, enabling cross-market time alignment.",
    "starSchema.purpose.dim_asset": "Master data table for all tracked financial instruments. Provides asset classification, exchange mapping, and sector/industry categorization for analytical grouping.",
    "starSchema.purpose.dim_market": "Reference table for trading venues. Stores timezone and currency info needed for cross-market time alignment and FX conversion.",
    "starSchema.purpose.dim_indicator": "Reference table defining all macroeconomic indicators. Provides bilingual names, categorization, update frequency, and data source attribution.",
    // Field descriptions — fact_price
    "starSchema.field.fact_price.date_key": "Trading date (FK to dim_date)",
    "starSchema.field.fact_price.asset_key": "Stock/ETF symbol, links to dim_asset (FK)",
    "starSchema.field.fact_price.open": "Opening price of the trading session",
    "starSchema.field.fact_price.high": "Highest price during the session",
    "starSchema.field.fact_price.low": "Lowest price during the session",
    "starSchema.field.fact_price.close": "Closing price -- the most important price point for analysis",
    "starSchema.field.fact_price.volume": "Number of shares/contracts traded",
    "starSchema.field.fact_price.change_pct": "Percentage change from previous close",
    // Field descriptions — fact_index
    "starSchema.field.fact_index.date_key": "Trading date (FK to dim_date)",
    "starSchema.field.fact_index.asset_key": "Index code, links to dim_asset (FK)",
    "starSchema.field.fact_index.open": "Index opening value",
    "starSchema.field.fact_index.high": "Index high value",
    "starSchema.field.fact_index.low": "Index low value",
    "starSchema.field.fact_index.close": "Index closing value",
    "starSchema.field.fact_index.volume": "Total trading volume across index constituents",
    "starSchema.field.fact_index.pe_ttm": "Price-to-Earnings ratio (trailing 12 months) -- valuation metric",
    "starSchema.field.fact_index.pb": "Price-to-Book ratio -- valuation metric",
    // Field descriptions — fact_macro
    "starSchema.field.fact_macro.date_key": "Release date of the indicator (FK to dim_date)",
    "starSchema.field.fact_macro.indicator_key": "Links to dim_indicator for metadata (FK)",
    "starSchema.field.fact_macro.value": "The indicator value at release",
    "starSchema.field.fact_macro.yoy_change": "Year-over-year change percentage",
    "starSchema.field.fact_macro.mom_change": "Month-over-month change percentage",
    // Field descriptions — fact_fx
    "starSchema.field.fact_fx.date_key": "Trading date (FK to dim_date)",
    "starSchema.field.fact_fx.pair": "Currency pair identifier, e.g. USDCNY",
    "starSchema.field.fact_fx.rate": "Exchange rate (mid-market close)",
    "starSchema.field.fact_fx.change_pct": "Daily change percentage",
    // Field descriptions — fact_commodity
    "starSchema.field.fact_commodity.date_key": "Trading date (FK to dim_date)",
    "starSchema.field.fact_commodity.asset_key": "Commodity symbol, e.g. GC=F for Gold (FK)",
    "starSchema.field.fact_commodity.price": "Settlement/closing price",
    "starSchema.field.fact_commodity.change_pct": "Daily change percentage",
    "starSchema.field.fact_commodity.volume": "Contracts traded",
    // Field descriptions — fact_fund_flow
    "starSchema.field.fact_fund_flow.date_key": "Trading date (FK to dim_date)",
    "starSchema.field.fact_fund_flow.sector": "Industry sector name",
    "starSchema.field.fact_fund_flow.net_inflow": "Net capital inflow (inflow - outflow)",
    "starSchema.field.fact_fund_flow.main_inflow": "Institutional (main force) capital inflow",
    "starSchema.field.fact_fund_flow.main_outflow": "Institutional (main force) capital outflow",
    "starSchema.field.fact_fund_flow.retail_inflow": "Retail investor capital inflow",
    "starSchema.field.fact_fund_flow.retail_outflow": "Retail investor capital outflow",
    // Field descriptions — fact_cross_border
    "starSchema.field.fact_cross_border.date_key": "Trading date (FK to dim_date)",
    "starSchema.field.fact_cross_border.direction": "northbound (into A-shares) or southbound (into HK)",
    "starSchema.field.fact_cross_border.net_buy": "Net purchase amount (buy - sell)",
    "starSchema.field.fact_cross_border.buy_amount": "Gross buy amount",
    "starSchema.field.fact_cross_border.sell_amount": "Gross sell amount",
    // Field descriptions — dim_date
    "starSchema.field.dim_date.date_key": "Calendar date (PK)",
    "starSchema.field.dim_date.year": "Year for time hierarchy drill-down",
    "starSchema.field.dim_date.quarter": "Quarter (1-4) for time hierarchy",
    "starSchema.field.dim_date.month": "Month (1-12) for time hierarchy",
    "starSchema.field.dim_date.week": "ISO week number for weekly aggregation",
    "starSchema.field.dim_date.is_cn_trading": "Whether Chinese A-share market is open on this date",
    "starSchema.field.dim_date.is_us_trading": "Whether US market is open on this date",
    // Field descriptions — dim_asset
    "starSchema.field.dim_asset.asset_key": "Unique identifier / ticker symbol (PK)",
    "starSchema.field.dim_asset.name": "Display name of the asset",
    "starSchema.field.dim_asset.asset_type": "Asset type: stock / index / etf / bond / commodity / fx / crypto",
    "starSchema.field.dim_asset.exchange": "Trading venue, e.g. SSE, SZSE, NYSE, NASDAQ",
    "starSchema.field.dim_asset.market": "Market region: CN, US, HK, etc.",
    "starSchema.field.dim_asset.sector": "GICS sector classification for sector analysis",
    "starSchema.field.dim_asset.industry": "GICS industry sub-classification",
    // Field descriptions — dim_market
    "starSchema.field.dim_market.market_key": "Market identifier (PK), e.g. SSE, NYSE",
    "starSchema.field.dim_market.timezone": "Market timezone for cross-market time alignment",
    "starSchema.field.dim_market.currency": "Trading currency for FX conversion",
    "starSchema.field.dim_market.open_time": "Market open time in local timezone",
    "starSchema.field.dim_market.close_time": "Market close time in local timezone",
    // Field descriptions — dim_indicator
    "starSchema.field.dim_indicator.indicator_key": "Unique indicator code (PK)",
    "starSchema.field.dim_indicator.name": "English indicator name",
    "starSchema.field.dim_indicator.name_cn": "Chinese indicator name",
    "starSchema.field.dim_indicator.category": "Category: GDP / CPI / PMI / rate, etc.",
    "starSchema.field.dim_indicator.frequency": "Update frequency: daily / monthly / quarterly",
    "starSchema.field.dim_indicator.source": "Data provider / source agency",

    // ── SemanticLayerViz — expandable details ──
    "semantic.exampleCalc": "Example Calculation",
    "semantic.whenToUse": "When to Use",
    "semantic.sourceJoins": "Source & Joins",
    // daily_return
    "semantic.example.daily_return": "If yesterday's close was 100 and today's is 102, daily_return = (102 - 100) / 100 * 100 = 2%",
    "semantic.usage.daily_return": "Use to measure single-day price movement. The most fundamental return metric. Positive = gain, negative = loss. Used as input for volatility and Sharpe calculations.",
    "semantic.joins.daily_return": "fact_price (self-join on lag date via dim_date)",
    // cumulative_return
    "semantic.example.cumulative_return": "If first close was 3000 and current close is 3150, cumulative_return = (3150 - 3000) / 3000 * 100 = 5%",
    "semantic.usage.cumulative_return": "Use to measure total performance over a period. Best for comparing different assets over the same time window.",
    "semantic.joins.cumulative_return": "fact_price JOIN dim_date (for period start)",
    // volatility_20d
    "semantic.example.volatility_20d": "If the std. dev. of daily returns over 20 days is 1.2%, annualized volatility = 1.2% * sqrt(252) = ~19%",
    "semantic.usage.volatility_20d": "Use to assess risk. Higher volatility = higher uncertainty. Compare across assets to gauge relative risk. Often used alongside Sharpe ratio.",
    "semantic.joins.volatility_20d": "fact_price (rolling 20-day window)",
    // volume_ratio
    "semantic.example.volume_ratio": "If today's volume is 12M and 5-day avg is 8M, volume_ratio = 12/8 = 1.5x (50% above average)",
    "semantic.usage.volume_ratio": "Use to detect unusual trading activity. Ratio > 1.5 may signal breakout; < 0.5 may signal low interest. Key for confirming price trends.",
    "semantic.joins.volume_ratio": "fact_price (rolling 5-day avg)",
    // turnover_rate
    "semantic.example.turnover_rate": "If 50M shares traded out of 1B total shares, turnover = 50M/1B * 100 = 5%",
    "semantic.usage.turnover_rate": "Use to gauge market liquidity and investor activity. High turnover often indicates speculative interest. Compare across sectors for rotation signals.",
    "semantic.joins.turnover_rate": "fact_price JOIN dim_asset (for total_shares)",
    // pe_percentile
    "semantic.example.pe_percentile": "If current PE is 15x and it ranks at the 30th percentile over 10 years, the index is cheaper than 70% of historical valuations.",
    "semantic.usage.pe_percentile": "Use for relative valuation assessment. Below 20% = historically cheap (potential buy); above 80% = historically expensive (potential risk).",
    "semantic.joins.pe_percentile": "fact_index (10-year window, percent_rank)",
    // pb_percentile
    "semantic.example.pb_percentile": "If current PB is 1.2x at 45th percentile, the index is near its historical median valuation.",
    "semantic.usage.pb_percentile": "Similar to PE percentile but based on book value. More stable for capital-intensive industries. Use together with PE for comprehensive valuation.",
    "semantic.joins.pb_percentile": "fact_index (10-year window, percent_rank)",
    // northbound_net
    "semantic.example.northbound_net": "If northbound buy = 80B CNY, sell = 65B, net = 80 - 65 = 15B CNY net inflow",
    "semantic.usage.northbound_net": "Use as foreign investor sentiment indicator for A-shares. Sustained net inflow is bullish; net outflow may signal risk-off. Watch for daily extremes.",
    "semantic.joins.northbound_net": "fact_cross_border WHERE direction = 'northbound'",
    // sector_net_inflow
    "semantic.example.sector_net_inflow": "If main_inflow = 5B and main_outflow = 3B, sector_net_inflow = 5 - 3 = 2B CNY",
    "semantic.usage.sector_net_inflow": "Use to track institutional money flow into sectors. Positive = sector accumulation; negative = distribution. Key for sector rotation strategy.",
    "semantic.joins.sector_net_inflow": "fact_fund_flow (aggregated by sector)",
    // gdp_yoy
    "semantic.example.gdp_yoy": "If Q1 GDP = 28.5T and last year Q1 = 27.0T, yoy_change = (28.5 - 27.0) / 27.0 * 100 = 5.6%",
    "semantic.usage.gdp_yoy": "The broadest measure of economic health. Rising GDP growth is generally bullish for equities. Compare across quarters for trend direction.",
    "semantic.joins.gdp_yoy": "fact_macro JOIN dim_indicator WHERE category = 'GDP'",
    // cpi_yoy
    "semantic.example.cpi_yoy": "If CPI value = 2.3, it means consumer prices are 2.3% higher than the same month last year.",
    "semantic.usage.cpi_yoy": "Use to gauge inflation pressure. High CPI may lead to tighter monetary policy (rate hikes), which typically pressures equities.",
    "semantic.joins.cpi_yoy": "fact_macro JOIN dim_indicator WHERE category = 'CPI'",
    // pmi_value
    "semantic.example.pmi_value": "PMI = 51.2 means manufacturing is expanding (above 50 threshold). PMI = 48.5 means contraction.",
    "semantic.usage.pmi_value": "Leading economic indicator. Above 50 = expansion, below 50 = contraction. Watch the trend direction more than the absolute level.",
    "semantic.joins.pmi_value": "fact_macro JOIN dim_indicator WHERE category = 'PMI'",
    // sharpe_ratio
    "semantic.example.sharpe_ratio": "If annualized return = 12%, risk-free rate = 3%, volatility = 18%, Sharpe = (12 - 3) / 18 = 0.5",
    "semantic.usage.sharpe_ratio": "Use to compare risk-adjusted returns across assets. Sharpe > 1 is good, > 2 is excellent. Higher Sharpe = better return per unit of risk.",
    "semantic.joins.sharpe_ratio": "fact_price (annualized return & volatility calc)",
    // max_drawdown
    "semantic.example.max_drawdown": "If peak was 5000 and trough was 4000, max_drawdown = (4000 - 5000) / 5000 * 100 = -20%",
    "semantic.usage.max_drawdown": "Use to assess worst-case downside risk. Smaller drawdowns = more stable investment. Important for risk management and position sizing.",
    "semantic.joins.max_drawdown": "fact_price (running max with trailing min calc)",
    // dividend_yield
    "semantic.example.dividend_yield": "If trailing 12-month dividends = 3.50 and close = 100, yield = 3.50 / 100 * 100 = 3.5%",
    "semantic.usage.dividend_yield": "Use to compare income potential across assets. Higher yield may indicate value opportunity or higher risk. Compare against bond yields.",
    "semantic.joins.dividend_yield": "fact_index (trailing dividend data)",
    // rsi_14d
    "semantic.example.rsi_14d": "If avg 14-day gain = 1.5% and avg loss = 0.8%, RSI = 100 - 100/(1 + 1.5/0.8) = 65.2",
    "semantic.usage.rsi_14d": "Momentum oscillator. RSI > 70 = overbought (potential reversal down); RSI < 30 = oversold (potential reversal up). Use with other indicators for confirmation.",
    "semantic.joins.rsi_14d": "fact_price (14-day rolling gain/loss averages)",

    // ── DataLineageViz — stage explanations ──
    "lineage.clickToExpand": "Click stage headers for details",
    "lineage.stageDetails": "Stage Details",
    "lineage.explain.source": "Three external APIs provide raw market data:\n- AKShare: Chinese A-share indices, sector fund flows, cross-border flows. Free tier, ~500 req/min. Covers SSE, SZSE, BSE. Runs daily at 18:00 CST after market close.\n- yfinance: Global indices (S&P 500, DJIA, NASDAQ, etc.), FX rates, commodities, crypto. Unofficial Yahoo Finance API, ~2000 req/hour. Runs at 06:00 UTC.\n- Tushare: Chinese fundamental data (PE/PB ratios, dividend yields). Requires API token, 200 req/min on free tier. Runs at 20:00 CST.",
    "lineage.explain.ods": "Operational Data Store -- raw data lands here exactly as received from APIs.\n- No transformations applied: column names, data types, and formats match the source API response.\n- Stored as JSON or CSV files in the data lake.\n- Purpose: preserve original data for debugging, auditing, and reprocessing.\n- Retention: 90 days of raw files kept for recovery scenarios.",
    "lineage.explain.dwd": "Detail Warehouse Data -- cleaned and standardized data.\n- Timezone normalization: all timestamps converted to UTC with market-local annotations.\n- Null handling: missing prices forward-filled from last known value; missing volumes set to 0.\n- Column renaming: source-specific column names mapped to unified schema (e.g., 'close_price' -> 'close').\n- Deduplication: duplicate records removed based on (date, asset) composite key.\n- Type casting: strings to decimals, date parsing, enum validation.\n- Tool: Polars for DataFrame transforms, DuckDB for SQL-based validation.",
    "lineage.explain.dws": "Data Warehouse Summary -- aggregated fact tables in star schema format.\n- Daily summaries computed: OHLCV aggregation, change percentages, running averages.\n- Valuation metrics joined: PE/PB ratios matched to index records.\n- Cross-border flows aggregated by direction (northbound/southbound) and date.\n- Fund flow data aggregated by sector.\n- These fact tables form the core of the star schema and are the primary query targets.",
    "lineage.explain.serving": "Serving layer delivers data to the frontend:\n- JSON files: Pre-computed market_summary.json (< 500KB) containing latest prices, 30-day history, and change metrics. Deployed as static assets via Cloudflare Pages.\n- Turso (libSQL): Cloud SQLite database for on-demand queries that need historical depth or flexible filtering.\n- Semantic layer: YAML-based metric definitions (semantic_layer.json) that map business metrics to SQL formulas.",

    // ── Data Guides ──
    "guide.overview":
      "This dashboard aggregates real-time market data from multiple sources. China market data (A-shares, indices) is sourced from AKShare/Tushare, updated daily after market close at 15:00 CST. Global markets (US, EU, Japan, Korea) and commodities/FX/crypto data comes from Yahoo Finance. The KPI cards show the latest closing price and daily change percentage, with a 30-day sparkline trend.",
    "guide.cn":
      "China A-share index data covers the 6 major indices: Shanghai Composite, Shenzhen Component, ChiNext, CSI 300, CSI 500, and CSI 1000. Data source: AKShare (Eastmoney/Sina Finance APIs). History available from 1990. Charts show percentage-normalized trends when indices have different scales.",
    "guide.global":
      "Global index data covers 8 major world indices: S&P 500, Dow Jones, NASDAQ (US), FTSE 100 (UK), DAX (Germany), Nikkei 225 (Japan), Hang Seng (Hong Kong), KOSPI (South Korea). Data source: Yahoo Finance (15-min delayed). ~1 year of daily history available.",
    "guide.fx":
      "Foreign exchange rates for 4 major pairs: USD/CNY, EUR/USD, USD/JPY, GBP/USD. Data source: Yahoo Finance. Rates represent the mid-market exchange rate at the end of each trading day.",
    "guide.commodities":
      "Commodity futures prices: Gold (GC=F), Silver (SI=F), WTI Crude Oil (CL=F), Brent Crude (BZ=F), Natural Gas (NG=F). Data source: Yahoo Finance. Prices are for the front-month futures contract on NYMEX/ICE.",
    "guide.crypto":
      "Cryptocurrency prices for Bitcoin (BTC) and Ethereum (ETH) in USD. Data source: Yahoo Finance. Crypto markets trade 24/7; the displayed price is the latest available close.",
    "guide.reports":
      "Auto-generated market reports based on the latest collected data. Daily reports summarize key market movements, highlight notable gainers/losers, and flag significant trends. Reports are generated by the data pipeline after each daily collection run.",
    "guide.quality":
      "This page monitors the health of the data pipeline. The quality scorecard shows validation results across completeness (do we have all expected data?), validity (are values within reasonable ranges?), and consistency (no duplicates, dates make sense). The coverage matrix shows which markets and asset classes are actively tracked.",
  },
  zh: {
    "nav.dashboard": "仪表盘",
    "nav.markets": "市场数据",
    "nav.analytics": "分析报告",
    "nav.platform": "平台架构",
    "nav.overview": "市场总览",
    "nav.cn-markets": "中国市场",
    "nav.global": "全球市场",
    "nav.fx": "外汇汇率",
    "nav.commodities": "大宗商品",
    "nav.crypto": "加密货币",
    "nav.reports": "研究报告",
    "nav.architecture": "数据模型",
    "nav.quality": "数据质量",
    "header.terminal": "终端",
    "header.live": "实时",
    "header.autoRefresh": "自动刷新：5分钟",
    "header.nextRefresh": "下次刷新",
    "header.updated": "更新时间",
    "header.refreshing": "刷新中...",
    "header.refresh": "刷新",
    "page.overview.title": "市场总览",
    "page.overview.subtitle": "全球金融市场一览",
    "page.cn.title": "中国市场",
    "page.cn.subtitle":
      "上证、深证、港股指数走势",
    "page.global.title": "全球市场",
    "page.global.subtitle":
      "全球主要指数 — S&P 500、道琼斯、纳斯达克、日经等",
    "page.fx.title": "外汇市场",
    "page.fx.subtitle":
      "主要货币对汇率及走势",
    "page.commodities.title": "大宗商品",
    "page.commodities.subtitle":
      "黄金、原油、白银等商品价格",
    "page.crypto.title": "加密货币",
    "page.crypto.subtitle":
      "比特币、以太坊及数字资产",
    "page.architecture.title": "数据架构",
    "page.architecture.subtitle":
      "星型模型、语义层、数据血缘与技术栈",
    "page.reports.title": "研究报告",
    "page.reports.subtitle":
      "每日市场摘要与定期回顾",
    "page.quality.title": "数据质量",
    "page.quality.subtitle":
      "数据新鲜度、覆盖范围及验证监控",
    "footer.disclaimer":
      "AI-VIZ 金融数据终端 \u00b7 数据来源：AKShare \u00b7 Yahoo Finance \u00b7 Tushare \u00b7 仅供参考",
    "system.refreshFreq":
      "刷新频率：每日 18:00 CST",
    "system.cnSource":
      "中国：AKShare / Tushare",
    "system.globalSource":
      "国际：Yahoo Finance",

    // ── Chart titles ──
    "chart.cn.30d": "中国市场 — 30日走势",
    "chart.cn.extended": "中国市场 — 扩展指数",
    "chart.global.30d": "全球市场 — 30日走势",
    "chart.global.extended": "全球市场 — 扩展指数",
    "chart.cn.all": "全部中国指数 — 30日走势",
    "chart.cn.mainBoard": "主板指数",
    "chart.cn.extendedIndices": "扩展指数",
    "chart.global.all": "全球指数 — 30日走势",
    "chart.global.americas": "美洲与欧洲",
    "chart.global.asiaPacific": "亚太及其他",
    "chart.fx.trends": "汇率走势 — 30日",
    "chart.fx.major": "主要货币对",
    "chart.fx.cross": "交叉货币对",
    "chart.commodity.trends": "商品价格走势 — 30日",
    "chart.crypto.30d": "加密货币 — 30日走势",
    "chart.crypto.price30d": "{name} — 30日价格",

    // ── DataTable titles ──
    "table.cn.detail": "中国指数 — 详细数据",
    "table.global.detail": "全球指数 — 详细数据",
    "table.fx.title": "外汇汇率",
    "table.fx.detail": "外汇 — 详细数据",
    "table.commodity.dailyChange": "大宗商品 — 日涨跌幅",
    "table.commodity.detail": "大宗商品 — 详细数据",
    "table.crypto.title": "加密货币",
    "table.crypto.detail": "加密货币 — 详细数据",

    // ── DataTable column headers ──
    "table.col.name": "名称",
    "table.col.price": "价格",
    "table.col.chgPct": "涨跌%",
    "table.col.trend30d": "30日走势",

    // ── MarketChart ──
    "chart.normalized": "(归一化 %)",

    // ── Heatmap ──
    "heatmap.title": "市场热力图 — 全资产日涨跌幅",

    // ── InsightsCard ──
    "insights.title": "市场洞察",
    "insight.consecutive.up": "{name} 连续上涨 {streak} 个交易日",
    "insight.consecutive.down": "{name} 连续下跌 {streak} 个交易日",
    "insight.biggestGainer": "{name} 为当日最大涨幅，上涨 +{pct}%",
    "insight.biggestLoser": "{name} 为当日最大跌幅，下跌 {pct}%",
    "insight.brokeHigh": "{name} 突破30日高点，报 {price}",
    "insight.nearHigh": "{name} 接近30日高点",
    "insight.brokeLow": "{name} 跌破30日低点，报 {price}",
    "insight.nearLow": "{name} 接近30日低点",
    "insight.divergence.cnDown": "市场分化：中国市场下跌（均值 {cnAvg}%），美股上涨（均值 +{usAvg}%）",
    "insight.divergence.cnUp": "市场分化：中国市场上涨（均值 +{cnAvg}%），美股下跌（均值 {usAvg}%）",
    "insight.volatility": "{name} 波动率飙升：{changePct}% 变动 vs {avgChange}% 均值",

    // ── Reports ──
    "report.dailyBrief": "每日市场简报",
    "report.generated": "生成时间",
    "report.executiveSummary": "摘要总结",
    "report.keyHighlights": "市场要点",
    "report.topGainers": "涨幅榜",
    "report.topLosers": "跌幅榜",
    "report.noData": "暂无报告数据。",

    // ── Report Archive ──
    "archive.title": "报告归档",
    "archive.col.date": "日期",
    "archive.col.type": "类型",
    "archive.col.title": "标题",
    "archive.type.daily": "日报",
    "archive.type.weekly": "周报",
    "archive.type.monthly": "月报",

    // ── Quality ──
    "quality.tab.scorecard": "评分卡",
    "quality.tab.freshness": "新鲜度",
    "quality.tab.coverage": "覆盖度",
    "quality.tab.checks": "检查项",
    "quality.tab.tables": "数据表",
    "quality.workflow.collect": "采集",
    "quality.workflow.validate": "验证",
    "quality.workflow.store": "存储",
    "quality.workflow.serve": "服务",
    "quality.workflow.monitor": "监控",
    "quality.noData": "暂无质量数据。",

    // ── QualityScorecard ──
    "quality.overallScore": "整体质量评分",
    "quality.passed": "通过",
    "quality.warnings": "警告",
    "quality.failed": "失败",
    "quality.lastChecked": "上次检查：",

    // ── FreshnessTable ──
    "freshness.title": "数据新鲜度",
    "freshness.col.source": "数据源",
    "freshness.col.market": "市场",
    "freshness.col.lastUpdate": "最后更新",
    "freshness.col.status": "状态",
    "freshness.col.frequency": "频率",
    "freshness.status.fresh": "最新",
    "freshness.status.stale": "过时",
    "freshness.status.error": "异常",

    // ── CoverageMatrix ──
    "coverage.title": "覆盖矩阵",
    "coverage.col.market": "市场",
    "coverage.asset.equity": "股票",
    "coverage.asset.index": "指数",
    "coverage.asset.macro": "宏观",
    "coverage.asset.fx": "外汇",
    "coverage.asset.commodity": "商品",
    "coverage.asset.crypto": "加密",

    // ── QualityChecks ──
    "checks.title": "质量检查",
    "checks.category.completeness": "完整性",
    "checks.category.validity": "有效性",
    "checks.category.consistency": "一致性",
    "checks.passed": "通过",

    // ── TableStats ──
    "tableStats.title": "数据表统计",
    "tableStats.noData": "无数据",
    "tableStats.rows": "行",
    "tableStats.hasData": "有数据",
    "tableStats.empty": "空表 / 未配置",

    // ── Architecture tabs ──
    "arch.tab.starSchema": "星型模型",
    "arch.tab.semanticLayer": "语义层",
    "arch.tab.dataLineage": "数据血缘",
    "arch.tab.techStack": "技术栈",
    "arch.tab.dataExplorer": "数据浏览器",

    // ── Data Explorer ──
    "dataExplorer.title": "数据浏览器",
    "dataExplorer.tables": "个表",
    "dataExplorer.dimensions": "维度表",
    "dataExplorer.facts": "事实表",
    "dataExplorer.rows": "行",
    "dataExplorer.showing": "显示 {count} / {total}",
    "dataExplorer.filter": "搜索所有列...",
    "dataExplorer.page": "页",
    "dataExplorer.of": "/",
    "dataExplorer.noData": "该表暂无数据",
    "dataExplorer.loading": "加载表数据...",
    "dataExplorer.selectTable": "选择一个表",
    "dataExplorer.emptyTable": "空表",

    // ── StarSchemaViz ──
    "starSchema.title": "星型模型",
    "starSchema.subtitle": "点击任意表查看关联关系",
    "starSchema.factTables": "事实表",
    "starSchema.dimensions": "维度表",
    "starSchema.fkJoins": "外键关联",
    "starSchema.cols": "列",
    "starSchema.relatedTables": "关联表：",
    "starSchema.desc.fact_price": "每日 OHLCV 价格数据",
    "starSchema.desc.fact_index": "指数估值指标",
    "starSchema.desc.fact_macro": "宏观经济指标",
    "starSchema.desc.fact_fx": "外汇汇率数据",
    "starSchema.desc.fact_commodity": "商品期货数据",
    "starSchema.desc.fact_fund_flow": "行业资金流向",
    "starSchema.desc.fact_cross_border": "北向/南向资金流",
    "starSchema.desc.dim_date": "日期维度与交易日历",
    "starSchema.desc.dim_asset": "资产主数据",
    "starSchema.desc.dim_market": "市场/交易所信息",
    "starSchema.desc.dim_indicator": "宏观指标定义",

    // ── SemanticLayerViz ──
    "semantic.title": "语义层",
    "semantic.subtitle": "{count} 个指标，{categories} 个分类",
    "semantic.analysisDimensions": "分析维度",

    // ── DataLineageViz ──
    "lineage.title": "数据血缘",
    "lineage.subtitle": "从数据源到仪表盘的端到端数据流",
    "lineage.tables": "张表",
    "lineage.layer.source": "数据源",
    "lineage.layer.source.sub": "采集",
    "lineage.layer.ods": "ODS",
    "lineage.layer.ods.sub": "原始落地",
    "lineage.layer.dwd": "DWD",
    "lineage.layer.dwd.sub": "清洗建模",
    "lineage.layer.dws": "DWS",
    "lineage.layer.dws.sub": "聚合事实",
    "lineage.layer.serving": "服务层",
    "lineage.layer.serving.sub": "仪表盘 JSON",
    "lineage.node.akshare": "中国市场",
    "lineage.node.yfinance": "全球市场",
    "lineage.node.tushare": "中国基本面",
    "lineage.node.ods_cn_index": "原始中国指数",
    "lineage.node.ods_global_quote": "原始全球行情",
    "lineage.node.ods_macro_raw": "原始宏观数据",
    "lineage.node.dwd_price": "标准化 OHLCV",
    "lineage.node.dwd_index": "类型化指数数据",
    "lineage.node.dwd_macro": "清洗后宏观序列",
    "lineage.node.fact_price": "价格事实表",
    "lineage.node.fact_index": "指数估值",
    "lineage.node.fact_macro": "宏观指标",
    "lineage.node.fact_fx": "外汇汇率",
    "lineage.node.market_summary": "仪表盘数据",
    "lineage.node.semantic_layer": "指标定义",

    // ── TechStackViz ──
    "techStack.title": "技术栈",
    "techStack.subtitle": "6 层架构，{count} 项技术",
    "techStack.principles": "架构原则",
    "techStack.layer.presentation": "展示层",
    "techStack.layer.semantic": "语义层",
    "techStack.layer.processing": "处理层",
    "techStack.layer.storage": "存储层",
    "techStack.layer.collection": "采集层",
    "techStack.layer.cicd": "部署层",
    "techStack.layerZh.presentation": "Presentation",
    "techStack.layerZh.semantic": "Semantic",
    "techStack.layerZh.processing": "Processing",
    "techStack.layerZh.storage": "Storage",
    "techStack.layerZh.collection": "Collection",
    "techStack.layerZh.cicd": "CI / CD",
    "techStack.desc.nextjs": "React SSG 框架",
    "techStack.desc.echarts": "交互式图表",
    "techStack.desc.tailwind": "原子化 CSS",
    "techStack.desc.typescript": "类型安全前端",
    "techStack.desc.metricsYml": "指标定义",
    "techStack.desc.lineageYml": "数据血缘配置",
    "techStack.desc.dimensionsYml": "维度层次结构",
    "techStack.desc.polars": "数据帧处理",
    "techStack.desc.duckdb": "分析型 SQL 引擎",
    "techStack.desc.python": "流水线编排",
    "techStack.desc.turso": "云端 SQLite (libSQL)",
    "techStack.desc.parquet": "本地列式文件",
    "techStack.desc.json": "仪表盘服务层",
    "techStack.desc.akshare": "中国市场数据 API",
    "techStack.desc.yfinance": "全球市场数据",
    "techStack.desc.tushare": "中国金融数据",
    "techStack.desc.githubActions": "定时流水线",
    "techStack.desc.cloudflare": "静态站点托管",
    "techStack.desc.cron": "每日数据刷新",
    "techStack.principle.batchFirst": "批处理优先",
    "techStack.principle.batchFirst.desc": "每日 ETL 流水线",
    "techStack.principle.schemaOnWrite": "写入时校验",
    "techStack.principle.schemaOnWrite.desc": "入库时验证",
    "techStack.principle.staticFirst": "静态优先",
    "techStack.principle.staticFirst.desc": "预构建 JSON 服务",
    "techStack.principle.layeredDW": "分层数仓",
    "techStack.principle.layeredDW.desc": "ODS > DWD > DWS",

    // ── StarSchemaViz — detail panel ──
    "starSchema.estimatedRows": "估计行数",
    "starSchema.fieldDetails": "字段详情",
    "starSchema.col.field": "字段",
    "starSchema.col.type": "类型",
    "starSchema.col.key": "键",
    "starSchema.col.description": "说明",
    // Table purposes
    "starSchema.purpose.fact_price": "存储所有跟踪的股票和ETF的每日OHLCV（开盘/最高/最低/收盘/成交量）交易数据。这是数仓中最核心的价格表，也是查询频率最高的事实表。",
    "starSchema.purpose.fact_index": "存储指数级别的每日数据，包括OHLCV价格和估值指标（PE、PB）。用于市场整体估值分析和基准比较。",
    "starSchema.purpose.fact_macro": "存储宏观经济指标发布数据（GDP、CPI、PMI、利率等），包含同比和环比变化计算。支持宏观-市场关联分析。",
    "starSchema.purpose.fact_fx": "存储主要货币对的每日外汇汇率。支持跨市场价值比较和货币敞口分析。",
    "starSchema.purpose.fact_commodity": "存储大宗商品期货的每日价格和成交量。覆盖贵金属、能源和农产品。",
    "starSchema.purpose.fact_fund_flow": "按行业板块追踪每日资金流向，区分主力（机构）和散户资金流。用于理解市场情绪和板块轮动。",
    "starSchema.purpose.fact_cross_border": "追踪沪深港通（北向/南向）跨境资金流。是A股市场的重要情绪指标。",
    "starSchema.purpose.dim_date": "日历维度表，提供时间层级用于下钻分析。包含中美两市交易日标记，支持跨市场时间对齐。",
    "starSchema.purpose.dim_asset": "所有跟踪金融工具的主数据表。提供资产分类、交易所映射和行业分类，用于分析分组。",
    "starSchema.purpose.dim_market": "交易场所参考表。存储时区和货币信息，用于跨市场时间对齐和汇率转换。",
    "starSchema.purpose.dim_indicator": "定义所有宏观经济指标的参考表。提供中英文名称、分类、更新频率和数据来源。",
    // Field descriptions — fact_price
    "starSchema.field.fact_price.date_key": "交易日期（外键关联 dim_date）",
    "starSchema.field.fact_price.asset_key": "证券代码，关联 dim_asset（外键）",
    "starSchema.field.fact_price.open": "开盘价",
    "starSchema.field.fact_price.high": "最高价",
    "starSchema.field.fact_price.low": "最低价",
    "starSchema.field.fact_price.close": "收盘价 — 最重要的价格指标",
    "starSchema.field.fact_price.volume": "成交量（股/手）",
    "starSchema.field.fact_price.change_pct": "涨跌幅，相对前一交易日收盘价",
    // Field descriptions — fact_index
    "starSchema.field.fact_index.date_key": "交易日期（外键关联 dim_date）",
    "starSchema.field.fact_index.asset_key": "指数代码，关联 dim_asset（外键）",
    "starSchema.field.fact_index.open": "指数开盘值",
    "starSchema.field.fact_index.high": "指数最高值",
    "starSchema.field.fact_index.low": "指数最低值",
    "starSchema.field.fact_index.close": "指数收盘值",
    "starSchema.field.fact_index.volume": "指数成分股总成交量",
    "starSchema.field.fact_index.pe_ttm": "市盈率TTM（滚动12个月）— 估值指标",
    "starSchema.field.fact_index.pb": "市净率 — 估值指标",
    // Field descriptions — fact_macro
    "starSchema.field.fact_macro.date_key": "指标发布日期（外键关联 dim_date）",
    "starSchema.field.fact_macro.indicator_key": "指标代码，关联 dim_indicator（外键）",
    "starSchema.field.fact_macro.value": "指标值",
    "starSchema.field.fact_macro.yoy_change": "同比变化率",
    "starSchema.field.fact_macro.mom_change": "环比变化率",
    // Field descriptions — fact_fx
    "starSchema.field.fact_fx.date_key": "交易日期（外键关联 dim_date）",
    "starSchema.field.fact_fx.pair": "货币对，如 USDCNY",
    "starSchema.field.fact_fx.rate": "汇率（中间价收盘）",
    "starSchema.field.fact_fx.change_pct": "日变动百分比",
    // Field descriptions — fact_commodity
    "starSchema.field.fact_commodity.date_key": "交易日期（外键关联 dim_date）",
    "starSchema.field.fact_commodity.asset_key": "商品代码，如 GC=F 黄金（外键）",
    "starSchema.field.fact_commodity.price": "结算/收盘价",
    "starSchema.field.fact_commodity.change_pct": "日变动百分比",
    "starSchema.field.fact_commodity.volume": "成交合约数",
    // Field descriptions — fact_fund_flow
    "starSchema.field.fact_fund_flow.date_key": "交易日期（外键关联 dim_date）",
    "starSchema.field.fact_fund_flow.sector": "行业板块名称",
    "starSchema.field.fact_fund_flow.net_inflow": "资金净流入（流入 - 流出）",
    "starSchema.field.fact_fund_flow.main_inflow": "主力资金流入",
    "starSchema.field.fact_fund_flow.main_outflow": "主力资金流出",
    "starSchema.field.fact_fund_flow.retail_inflow": "散户资金流入",
    "starSchema.field.fact_fund_flow.retail_outflow": "散户资金流出",
    // Field descriptions — fact_cross_border
    "starSchema.field.fact_cross_border.date_key": "交易日期（外键关联 dim_date）",
    "starSchema.field.fact_cross_border.direction": "北向（流入A股）或南向（流入港股）",
    "starSchema.field.fact_cross_border.net_buy": "净买入额（买入 - 卖出）",
    "starSchema.field.fact_cross_border.buy_amount": "买入总额",
    "starSchema.field.fact_cross_border.sell_amount": "卖出总额",
    // Field descriptions — dim_date
    "starSchema.field.dim_date.date_key": "日历日期（主键）",
    "starSchema.field.dim_date.year": "年份，用于时间层级下钻",
    "starSchema.field.dim_date.quarter": "季度（1-4），用于时间层级",
    "starSchema.field.dim_date.month": "月份（1-12），用于时间层级",
    "starSchema.field.dim_date.week": "ISO周数，用于周度聚合",
    "starSchema.field.dim_date.is_cn_trading": "A股是否交易日",
    "starSchema.field.dim_date.is_us_trading": "美股是否交易日",
    // Field descriptions — dim_asset
    "starSchema.field.dim_asset.asset_key": "唯一标识符/股票代码（主键）",
    "starSchema.field.dim_asset.name": "显示名称",
    "starSchema.field.dim_asset.asset_type": "资产类型：stock/index/etf/bond/commodity/fx/crypto",
    "starSchema.field.dim_asset.exchange": "交易所，如 SSE、SZSE、NYSE、NASDAQ",
    "starSchema.field.dim_asset.market": "市场区域：CN、US、HK 等",
    "starSchema.field.dim_asset.sector": "GICS行业分类，用于板块分析",
    "starSchema.field.dim_asset.industry": "GICS细分行业分类",
    // Field descriptions — dim_market
    "starSchema.field.dim_market.market_key": "市场标识（主键），如 SSE、NYSE",
    "starSchema.field.dim_market.timezone": "市场时区，用于跨市场时间对齐",
    "starSchema.field.dim_market.currency": "交易货币，用于汇率转换",
    "starSchema.field.dim_market.open_time": "当地时区的开市时间",
    "starSchema.field.dim_market.close_time": "当地时区的收市时间",
    // Field descriptions — dim_indicator
    "starSchema.field.dim_indicator.indicator_key": "指标代码（主键）",
    "starSchema.field.dim_indicator.name": "英文指标名称",
    "starSchema.field.dim_indicator.name_cn": "中文指标名称",
    "starSchema.field.dim_indicator.category": "分类：GDP/CPI/PMI/利率 等",
    "starSchema.field.dim_indicator.frequency": "更新频率：日/月/季",
    "starSchema.field.dim_indicator.source": "数据来源/发布机构",

    // ── SemanticLayerViz — expandable details ──
    "semantic.exampleCalc": "计算示例",
    "semantic.whenToUse": "使用场景",
    "semantic.sourceJoins": "数据源与关联",
    // daily_return
    "semantic.example.daily_return": "若昨日收盘价为100，今日为102，则 daily_return = (102 - 100) / 100 * 100 = 2%",
    "semantic.usage.daily_return": "用于衡量单日价格变动。最基础的收益指标。正值=盈利，负值=亏损。是波动率和夏普比率计算的输入。",
    "semantic.joins.daily_return": "fact_price（通过 dim_date 自关联取前日数据）",
    // cumulative_return
    "semantic.example.cumulative_return": "若期初收盘价为3000，当前为3150，则累计收益率 = (3150 - 3000) / 3000 * 100 = 5%",
    "semantic.usage.cumulative_return": "用于衡量一段时期内的总体表现。适合在同一时间窗口内比较不同资产。",
    "semantic.joins.cumulative_return": "fact_price JOIN dim_date（获取期初数据）",
    // volatility_20d
    "semantic.example.volatility_20d": "若20日日收益率标准差为1.2%，则年化波动率 = 1.2% * sqrt(252) = ~19%",
    "semantic.usage.volatility_20d": "用于评估风险。波动率越高=不确定性越大。可跨资产比较相对风险。常与夏普比率配合使用。",
    "semantic.joins.volatility_20d": "fact_price（20日滚动窗口）",
    // volume_ratio
    "semantic.example.volume_ratio": "若今日成交量1200万，5日均量800万，则量比 = 1200/800 = 1.5倍（高于均值50%）",
    "semantic.usage.volume_ratio": "用于检测异常交易活动。量比 > 1.5 可能预示突破；< 0.5 可能表示关注度低。是确认价格趋势的关键。",
    "semantic.joins.volume_ratio": "fact_price（5日滚动均值）",
    // turnover_rate
    "semantic.example.turnover_rate": "若成交5000万股，总股本10亿股，则换手率 = 5000万/10亿 * 100 = 5%",
    "semantic.usage.turnover_rate": "用于衡量市场流动性和投资者活跃度。高换手率通常表示投机兴趣浓厚。跨板块比较可发现轮动信号。",
    "semantic.joins.turnover_rate": "fact_price JOIN dim_asset（获取总股本）",
    // pe_percentile
    "semantic.example.pe_percentile": "若当前PE为15倍，在10年历史中排在第30百分位，说明该指数比70%的历史估值便宜。",
    "semantic.usage.pe_percentile": "用于相对估值评估。低于20% = 历史低位（潜在买入）；高于80% = 历史高位（潜在风险）。",
    "semantic.joins.pe_percentile": "fact_index（10年窗口，percent_rank）",
    // pb_percentile
    "semantic.example.pb_percentile": "若当前PB为1.2倍，位于第45百分位，说明该指数估值接近历史中位数。",
    "semantic.usage.pb_percentile": "与PE分位类似，但基于账面价值。对资本密集型行业更稳定。建议与PE一起使用进行综合估值。",
    "semantic.joins.pb_percentile": "fact_index（10年窗口，percent_rank）",
    // northbound_net
    "semantic.example.northbound_net": "若北向买入800亿，卖出650亿，则净买入 = 800 - 650 = 150亿元",
    "semantic.usage.northbound_net": "外资对A股的情绪指标。持续净流入看涨；净流出可能表示避险。关注极端值。",
    "semantic.joins.northbound_net": "fact_cross_border WHERE direction = 'northbound'",
    // sector_net_inflow
    "semantic.example.sector_net_inflow": "若主力流入50亿，流出30亿，则板块净流入 = 50 - 30 = 20亿元",
    "semantic.usage.sector_net_inflow": "追踪机构资金流入各板块的情况。正值=板块吸筹；负值=板块减仓。板块轮动策略的关键。",
    "semantic.joins.sector_net_inflow": "fact_fund_flow（按板块汇总）",
    // gdp_yoy
    "semantic.example.gdp_yoy": "若Q1 GDP = 28.5万亿，去年Q1 = 27.0万亿，则同比 = (28.5 - 27.0) / 27.0 * 100 = 5.6%",
    "semantic.usage.gdp_yoy": "最广泛的经济健康度指标。GDP增速上升通常利好股市。跨季度比较可判断趋势方向。",
    "semantic.joins.gdp_yoy": "fact_macro JOIN dim_indicator WHERE category = 'GDP'",
    // cpi_yoy
    "semantic.example.cpi_yoy": "若CPI值 = 2.3，表示消费者价格比去年同期上涨2.3%。",
    "semantic.usage.cpi_yoy": "衡量通胀压力。CPI过高可能导致货币紧缩（加息），通常对股市形成压力。",
    "semantic.joins.cpi_yoy": "fact_macro JOIN dim_indicator WHERE category = 'CPI'",
    // pmi_value
    "semantic.example.pmi_value": "PMI = 51.2 表示制造业扩张（高于50分界线）。PMI = 48.5 表示收缩。",
    "semantic.usage.pmi_value": "先行经济指标。50以上=扩张，50以下=收缩。趋势方向比绝对值更重要。",
    "semantic.joins.pmi_value": "fact_macro JOIN dim_indicator WHERE category = 'PMI'",
    // sharpe_ratio
    "semantic.example.sharpe_ratio": "若年化收益12%，无风险利率3%，波动率18%，则夏普比率 = (12-3)/18 = 0.5",
    "semantic.usage.sharpe_ratio": "用于比较不同资产的风险调整后收益。夏普 > 1 良好，> 2 优秀。越高 = 单位风险收益越好。",
    "semantic.joins.sharpe_ratio": "fact_price（年化收益和波动率计算）",
    // max_drawdown
    "semantic.example.max_drawdown": "若峰值5000点，谷值4000点，则最大回撤 = (4000-5000)/5000 * 100 = -20%",
    "semantic.usage.max_drawdown": "评估最大下行风险。回撤越小=投资越稳定。对风险管理和仓位控制非常重要。",
    "semantic.joins.max_drawdown": "fact_price（运行最大值与滞后最小值计算）",
    // dividend_yield
    "semantic.example.dividend_yield": "若过去12个月分红3.50元，收盘价100元，则股息率 = 3.50/100 * 100 = 3.5%",
    "semantic.usage.dividend_yield": "比较不同资产的收益潜力。高股息率可能是价值机会或高风险信号。可与债券收益率比较。",
    "semantic.joins.dividend_yield": "fact_index（滚动分红数据）",
    // rsi_14d
    "semantic.example.rsi_14d": "若14日平均涨幅1.5%，平均跌幅0.8%，则 RSI = 100 - 100/(1+1.5/0.8) = 65.2",
    "semantic.usage.rsi_14d": "动量振荡指标。RSI > 70 = 超买（可能下跌）；RSI < 30 = 超卖（可能反弹）。建议配合其他指标确认。",
    "semantic.joins.rsi_14d": "fact_price（14日滚动涨跌均值）",

    // ── DataLineageViz — stage explanations ──
    "lineage.clickToExpand": "点击阶段标题查看详情",
    "lineage.stageDetails": "阶段详情",
    "lineage.explain.source": "三个外部API提供原始市场数据：\n- AKShare：中国A股指数、行业资金流向、跨境资金流。免费层，约500请求/分钟。覆盖上交所、深交所、北交所。每日18:00 CST收盘后运行。\n- yfinance：全球指数（S&P 500、道琼斯、纳斯达克等）、汇率、商品、加密货币。非官方Yahoo Finance API，约2000请求/小时。每日06:00 UTC运行。\n- Tushare：中国基本面数据（PE/PB、股息率等）。需要API令牌，免费层200请求/分钟。每日20:00 CST运行。",
    "lineage.explain.ods": "操作数据存储 — 原始数据按API返回格式原样落地。\n- 不做任何转换：列名、数据类型和格式与源API响应完全一致。\n- 以JSON或CSV文件存储在数据湖中。\n- 目的：保留原始数据，用于调试、审计和重新处理。\n- 保留策略：原始文件保留90天以备恢复。",
    "lineage.explain.dwd": "明细数据层 — 清洗和标准化后的数据。\n- 时区标准化：所有时间戳转换为UTC，附带市场本地时区标注。\n- 空值处理：缺失价格用最近已知值前向填充；缺失成交量设为0。\n- 列名映射：源特定列名映射到统一模式（如 close_price -> close）。\n- 去重：基于(日期, 资产)复合键移除重复记录。\n- 类型转换：字符串转decimal、日期解析、枚举校验。\n- 工具：Polars做DataFrame转换，DuckDB做SQL验证。",
    "lineage.explain.dws": "汇总数据层 — 星型模型格式的聚合事实表。\n- 计算日度汇总：OHLCV聚合、涨跌幅百分比、移动平均。\n- 估值指标关联：PE/PB比率匹配到指数记录。\n- 跨境资金按方向（北向/南向）和日期汇总。\n- 资金流数据按行业板块汇总。\n- 这些事实表构成星型模型的核心，是主要的查询目标。",
    "lineage.explain.serving": "服务层将数据交付给前端：\n- JSON文件：预计算的 market_summary.json（<500KB），包含最新价格、30日历史和变动指标。通过Cloudflare Pages作为静态资源部署。\n- Turso (libSQL)：云端SQLite数据库，用于需要历史深度或灵活筛选的按需查询。\n- 语义层：基于YAML的指标定义（semantic_layer.json），将业务指标映射到SQL公式。",

    // ── Data Guides ──
    "guide.overview":
      "本仪表盘汇聚多个数据源的市场数据。中国市场数据（A股、指数）来源于 AKShare/Tushare，每日收盘后（15:00 CST）更新。全球市场（美国、欧洲、日本、韩国）及商品/外汇/加密货币数据来源于 Yahoo Finance。KPI 卡片显示最新收盘价和日涨跌幅，附带30日趋势迷你图。",
    "guide.cn":
      "中国A股指数数据覆盖6大核心指数：上证综指、深证成指、创业板指、沪深300、中证500、中证1000。数据来源：AKShare（东方财富/新浪财经接口）。历史数据可追溯至1990年。当指数数值差异大时，图表自动使用百分比归一化显示。",
    "guide.global":
      "全球指数数据覆盖8大国际指数：标普500、道琼斯、纳斯达克（美国）、富时100（英国）、DAX（德国）、日经225（日本）、恒生指数（香港）、KOSPI（韩国）。数据来源：Yahoo Finance（延迟15分钟）。约1年日线历史数据。",
    "guide.fx":
      "4组主要货币对汇率：美元/人民币、欧元/美元、美元/日元、英镑/美元。数据来源：Yahoo Finance。汇率为每个交易日收盘时的中间价。",
    "guide.commodities":
      "大宗商品期货价格：黄金(GC=F)、白银(SI=F)、WTI原油(CL=F)、布伦特原油(BZ=F)、天然气(NG=F)。数据来源：Yahoo Finance。价格为 NYMEX/ICE 近月合约。",
    "guide.crypto":
      "加密货币价格：比特币(BTC)和以太坊(ETH)的美元报价。数据来源：Yahoo Finance。加密市场24/7交易，显示的是最新可用收盘价。",
    "guide.reports":
      "基于最新采集数据自动生成的市场报告。日报总结关键市场动态，突出显著涨跌标的，标记重要趋势。报告在每日数据采集后由管道自动生成。",
    "guide.quality":
      "本页面监控数据管道的健康状况。质量评分卡展示三个维度的验证结果：完整性（是否有所有预期数据？）、有效性（数值是否在合理范围内？）、一致性（无重复、日期合理）。覆盖矩阵展示哪些市场和资产类别正在被追踪。",
  },
} as const;
