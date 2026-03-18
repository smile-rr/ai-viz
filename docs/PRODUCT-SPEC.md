# AI-VIZ Product Specification — Platform Expansion

**Version:** 1.0
**Date:** 2026-03-18
**Author:** Product Management
**Target Role:** Senior Data Visualization Technical Consultant — Fidelity International

---

## Executive Summary

AI-VIZ currently operates as a single-page financial data dashboard displaying market charts and KPIs. To serve as a portfolio piece for a Senior Data Visualization Technical Consultant role, the platform must demonstrate competency in five additional areas: semantic layers and data governance, data modeling (Star Schema), data lineage, BI platform architecture, and report generation.

This document specifies five new pages that transform AI-VIZ from a chart viewer into a complete, professional data platform demonstration.

---

## Current State

### Existing Pages
- **Dashboard** (`/`) — Market Overview, China Markets, Global Markets, FX, Commodities, Crypto sections via sidebar navigation

### Existing Components
- `Header` — Fixed top bar with date display, LIVE indicator, sidebar toggle
- `Sidebar` — Left nav with 6 market section items
- `KpiCard` — Compact metric card with sparkline
- `MarketChart` — ECharts line chart with multi-series support
- `DataTable` — Tabular data display with formatted prices
- `CommodityBar` — Horizontal bar chart for daily change
- `Heatmap` — Color-coded performance heatmap (ECharts treemap)
- `LoadingSkeleton` — Loading placeholder
- `ErrorState` — Error display with retry button

### Existing Data Sources
- `data/aggregated/market_summary.json` — Frontend-consumed market data
- `data/quality/check_YYYY-MM-DD.json` — Pipeline quality reports
- `src/models/semantic/metrics.yml` — 13 metric definitions with formulas, units, source tables
- `src/models/semantic/lineage.yml` — 7 fact table lineage definitions
- `src/models/schema.py` — Star Schema DDL (4 dimension tables, 7 fact tables)
- DuckDB database at `data/ai_viz.duckdb`

### Tech Stack
- **Frontend:** Next.js 16 (Static Export) + ECharts + Tailwind CSS 4
- **Backend/Data:** Python 3.13 + Polars + DuckDB + AKShare + yfinance + Tushare
- **Storage:** DuckDB (local) + Turso (remote) + JSON (static frontend)
- **Deployment:** GitHub Actions CI/CD

---

## New Pages Specification

---

## Page 1: Data Architecture (`/architecture`)

**Priority:** P0 — Must Have
**Rationale:** Directly demonstrates Star Schema modeling, semantic layer design, and data lineage — three of the five core competencies listed in the job requirements.

### Page Title & Subtitle
- **Title:** Data Architecture
- **Subtitle:** Star Schema, semantic layer, and data lineage powering the platform

### Section 1.1: Star Schema Diagram

**Layout:** Full-width interactive diagram, centered on the page. Dimension tables on the outer ring, fact tables in the center, connected by FK relationship lines.

**Content:**
- **Dimension Tables (4):**
  - `dim_date` — date_key (PK), year, quarter, month, week, day_of_week, is_month_end, is_cn_trading, is_us_trading, is_hk_trading
  - `dim_asset` — asset_key (PK), name, asset_type, exchange, market, sector, industry, currency, list_date, status
  - `dim_market` — market_key (PK), market_name, region, timezone, currency, open_time, close_time
  - `dim_indicator` — indicator_key (PK), name, name_cn, category, unit, frequency, source, description
- **Fact Tables (7):**
  - `fact_price` — PK(date_key, asset_key), open, high, low, close, volume, turnover, change_pct, amplitude
  - `fact_index` — PK(date_key, asset_key), open, high, low, close, volume, change_pct, pe_ttm, pb
  - `fact_macro` — PK(date_key, indicator_key), value, yoy_change, mom_change
  - `fact_fund_flow` — PK(date_key, sector), net_inflow, main_inflow, main_outflow, retail_inflow, retail_outflow
  - `fact_cross_border` — PK(date_key, direction), net_buy, buy_amount, sell_amount
  - `fact_fx` — PK(date_key, pair), rate, change_pct
  - `fact_commodity` — PK(date_key, asset_key), price, change_pct, volume

**Interaction:**
- Click any table node to expand and show full column list, data types, and row counts
- Hover relationship lines to show the join key
- Color coding: blue for dimensions, green for facts

**Data Requirements:**
- New static JSON file: `public/data/schema_metadata.json`
  - Generated from `src/models/schema.py` by a build script
  - Structure: `{ dimensions: [...], facts: [...], relationships: [...] }`
  - Include row counts from DuckDB for each table (updated daily by pipeline)

**Components:**
- `StarSchemaGraph` (NEW) — ECharts graph/force chart or custom SVG. Renders nodes for each table, edges for FK relationships. Click-to-expand detail panel.
- `TableDetailPanel` (NEW) — Slide-out or modal showing column definitions, sample data (3 rows), row count, and last updated timestamp.

---

### Section 1.2: Semantic Layer Explorer

**Layout:** Two-column grid. Left column: metric category tabs (Market, Valuation, Fund Flow, Macro). Right column: detail view for selected metric.

**Content — derived from `src/models/semantic/metrics.yml`:**

| Metric Key | Display Name | Formula | Unit | Source Table |
|---|---|---|---|---|
| daily_return | Daily Return | (close - lag(close)) / lag(close) * 100 | percent | fact_price |
| cumulative_return | Cumulative Return | (close - first_close) / first_close * 100 | percent | fact_price |
| volatility_20d | 20D Volatility | stddev(daily_return) over 20 trading days * sqrt(252) | percent | fact_price |
| volume_ratio | Volume Ratio | volume / avg(volume) over 5 days | ratio | fact_price |
| turnover_rate | Turnover Rate | volume / total_shares * 100 | percent | fact_price |
| pe_percentile | PE Percentile | percent_rank(pe_ttm) over trailing 10 years | percent | fact_index |
| pb_percentile | PB Percentile | percent_rank(pb) over trailing 10 years | percent | fact_index |
| northbound_net | Northbound Net Buy | buy_amount - sell_amount | CNY_100M | fact_cross_border |
| sector_net_inflow | Sector Net Inflow | main_inflow - main_outflow | CNY_100M | fact_fund_flow |
| gdp_yoy | GDP YoY Growth | yoy_change where indicator_key = 'gdp' | percent | fact_macro |
| cpi_yoy | CPI YoY | value where indicator_key = 'cpi' | percent | fact_macro |
| pmi_value | Manufacturing PMI | value where indicator_key = 'pmi' | index | fact_macro |

Also display dimension definitions:
- `region` — hierarchy: global_region > country > market; values: APAC, NA, EU
- `asset_class` — hierarchy: class > sub_class; values: equity, fixed_income, commodity, fx, crypto
- `time_grain` — values: daily, weekly, monthly, quarterly, yearly

**Interaction:**
- Click a metric to show its detail card: formula rendered as styled pseudo-SQL, description, source table linkage (click links to Star Schema diagram)
- Toggle between English and Chinese display names

**Data Requirements:**
- New static JSON file: `public/data/semantic_metrics.json`
  - Generated from `src/models/semantic/metrics.yml` by a build script at pipeline time
  - Structure: `{ metrics: [...], dimensions: [...] }`

**Components:**
- `MetricCatalog` (NEW) — Filterable/searchable card grid of all metrics
- `MetricDetailCard` (NEW) — Expanded view of a single metric with formula, description, source table badge
- `DimensionExplorer` (NEW) — Hierarchy tree view of dimension values

---

### Section 1.3: Data Lineage Flow

**Layout:** Full-width horizontal Sankey diagram or directed acyclic graph (DAG).

**Content — derived from `src/models/semantic/lineage.yml`:**

Flow layers (left to right):
1. **Data Sources** (leftmost): AKShare (6 APIs), yfinance (4 categories), Tushare
2. **ODS Layer** (`data/raw/`): Raw parquet files per source per day
3. **DWD Layer** (`data/processed/`): Cleaned, unified column names, computed fields
4. **DWS Layer** (`data/aggregated/`): market_summary.json, cross-source aggregations
5. **Presentation** (rightmost): Dashboard charts, KPI cards, tables

Specific lineage paths:
- AKShare::stock_zh_a_hist → raw/akshare/ → fact_price (CN) → market_summary.cn_indices → Dashboard
- AKShare::stock_zh_index_daily → raw/akshare/ → fact_index (CN) → market_summary.cn_indices → Dashboard
- yfinance::Ticker.history → raw/yfinance/ → fact_price/fact_index (Global) → market_summary.global_indices → Dashboard
- yfinance (FX pairs) → raw/yfinance/ → fact_fx → market_summary.fx → Dashboard
- yfinance (Commodities) → raw/yfinance/ → fact_commodity → market_summary.commodities → Dashboard
- yfinance (Crypto) → raw/yfinance/ → market_summary.crypto → Dashboard
- AKShare::macro_china_* → raw/akshare/ → fact_macro → (future macro dashboard)
- AKShare::stock_hsgt_north → raw/akshare/ → fact_cross_border → (future flow dashboard)

**Interaction:**
- Hover any node to highlight its upstream/downstream path
- Click a node to show metadata: refresh frequency, row count, last update time, quality status
- Toggle between "full view" and "simplified view" (3-layer vs 5-layer)

**Data Requirements:**
- New static JSON file: `public/data/lineage.json`
  - Generated from `src/models/semantic/lineage.yml` + pipeline metadata
  - Structure: `{ nodes: [{id, label, layer, type, metadata}], edges: [{source, target, label}] }`

**Components:**
- `LineageDAG` (NEW) — ECharts Sankey chart or custom DAG renderer. Horizontal flow with 5 columns representing ODS/DWD/DWS/Presentation layers.
- `LineageNodeTooltip` (NEW) — Rich tooltip showing source API, refresh schedule, row count, quality status

---

### Section 1.4: Tech Stack Diagram

**Layout:** Single visual, horizontally layered architecture diagram.

**Content:**

| Layer | Technologies |
|---|---|
| Data Sources | AKShare, yfinance, Tushare (Python APIs) |
| Ingestion | Python 3.13, UV package manager, BaseCollector pattern |
| Processing | Polars (DataFrame), DuckDB (SQL analytics) |
| Storage | DuckDB (local OLAP), Turso/libSQL (remote), Parquet (files), JSON (static) |
| Frontend | Next.js 16, React 19, ECharts 6, Tailwind CSS 4 |
| CI/CD | GitHub Actions (daily scheduled pipeline + static site deploy) |
| Package Mgmt | UV (Python), pnpm (Node) |

**Interaction:**
- Click any technology to show a brief description of why it was chosen and what role it plays

**Data Requirements:**
- Hardcoded in component (no external data file needed — this is static content)

**Components:**
- `TechStackDiagram` (NEW) — Layered block diagram, either SVG or styled HTML/CSS. Each block is a technology with an icon and label.

---

## Page 2: Data Quality Dashboard (`/quality`)

**Priority:** P0 — Must Have
**Rationale:** Demonstrates data governance and operational maturity — critical for any enterprise BI role.

### Page Title & Subtitle
- **Title:** Data Quality
- **Subtitle:** Monitoring data freshness, completeness, and validation across all sources

### Section 2.1: Freshness Monitor

**Layout:** Horizontal card row (5 cards), one per data source category.

**Content — one card per category:**

| Source | Metric | Status Logic |
|---|---|---|
| CN Indices | Last update timestamp, row count | Green: updated today; Yellow: 1-2 days old; Red: 3+ days |
| Global Indices | Last update timestamp, row count | Same |
| FX | Last update timestamp, row count | Same |
| Commodities | Last update timestamp, row count | Same |
| Crypto | Last update timestamp, row count | Same |

Each card shows:
- Source name and icon
- Last updated: "2026-03-18 18:05 CST"
- Row count: "34,732 records"
- Status badge: green/yellow/red dot with label (Fresh / Stale / Outdated)
- Sparkline of row counts over last 7 days (shows collection consistency)

**Data Requirements:**
- Read from `public/data/quality_history.json` (NEW)
  - Generated by pipeline: aggregation of all `data/quality/check_*.json` files
  - Structure: `{ current: { date, sources: {cn_index: {rows, updated_at, status}, ...} }, history: [{date, sources: {...}}, ...] }`

**Components:**
- `FreshnessCard` (NEW) — Status card with colored indicator, timestamp, row count, mini sparkline
- Reuse `KpiCard` pattern for styling consistency

---

### Section 2.2: Quality Scorecard

**Layout:** Table or card grid showing pass/fail for each quality check.

**Content — from `src/data/quality/checks.py` output:**

The quality checker runs 21 checks total:
- 1 date freshness check
- 5 section existence checks (cn_indices, global_indices, fx, commodities, crypto)
- 5 valid close checks (close > 0 for all items in each section)
- 5 non-empty history checks (history array non-empty for each section)
- 5 duplicate symbol checks (no duplicate symbols in each section)

Display as a checklist:
```
[PASS] Date 2026-03-18 is within 7 days (age=0d)
[PASS] cn_indices: has 8 item(s)
[PASS] cn_indices: all items have valid close > 0
[PASS] cn_indices: all items have non-empty history
[PASS] cn_indices: no duplicate symbols
... (repeat for each section)
```

Show aggregate score: "21/21 checks passed" with a large circular progress indicator.

**Data Requirements:**
- New static JSON file: `public/data/quality_scorecard.json`
  - Generated by running `check_market_summary()` and serializing the `QualityCheckResult`
  - Structure: `{ date, total, passed, failed, checks: [{name, status, message}] }`

**Components:**
- `QualityScorecard` (NEW) — Circular progress gauge (ECharts gauge) + checklist table
- `CheckRow` (NEW) — Single check result row with pass/fail icon and message

---

### Section 2.3: Coverage Matrix

**Layout:** Grid/matrix table. Rows = data source APIs. Columns = asset classes or markets.

**Content:**

| Source API | CN Equity | US Equity | HK Equity | FX | Commodities | Crypto | Macro |
|---|---|---|---|---|---|---|---|
| AKShare | Yes | - | - | - | - | - | Yes |
| yfinance | - | Yes | Yes | Yes | Yes | Yes | - |
| Tushare | Yes (backup) | - | - | - | - | - | - |

Show checkmarks for covered, dashes for not covered. Add a "completeness score" per row and per column.

**Data Requirements:**
- Hardcoded in component (static matrix — the coverage map does not change without code changes)

**Components:**
- `CoverageMatrix` (NEW) — Styled HTML table or ECharts heatmap. Color-coded cells: green = active coverage, grey = not covered, yellow = backup/partial.

---

### Section 2.4: Historical Quality Trend

**Layout:** Line chart showing quality score over time.

**Content:**
- X-axis: dates (last 30 days)
- Y-axis: number of checks passed (0-21)
- Secondary series: total row count collected per day
- Highlight any days where quality dropped below 100%

**Data Requirements:**
- Reuse `public/data/quality_history.json` from Section 2.1
- Parse all `data/quality/check_*.json` files at build time to build historical array

**Components:**
- Reuse `MarketChart` with custom configuration (different axis labels/formatting)
- Or create `QualityTrendChart` (NEW) — ECharts line chart with dual Y-axes

---

## Page 3: Reports (`/reports`)

**Priority:** P1 — Should Have
**Rationale:** Report generation is explicitly listed as a required competency. Demonstrates the ability to produce automated analytical narratives from data.

### Page Title & Subtitle
- **Title:** Reports
- **Subtitle:** Automated market intelligence reports and analysis

### Section 3.1: Daily Market Summary Report

**Layout:** Full-width rendered report view, styled like a professional PDF report.

**Content — auto-generated from `market_summary.json`:**

Report structure:
1. **Header:** "Daily Market Summary — [Date]" with AI-VIZ branding
2. **Key Highlights (bullet points):**
   - "Shanghai Composite closed at 3,245.67 (+1.2%), continuing a 3-day uptrend"
   - "S&P 500 fell -0.8% amid rising Treasury yields"
   - "Gold reached $2,150/oz, up 0.5% on safe-haven demand"
   - "Bitcoin traded at $67,500, volatility remains elevated"
3. **Market Performance Table:** All indices with close, change_pct, 5-day trend direction
4. **FX Summary:** Major pair movements with context
5. **Commodity Summary:** Price and change for gold, oil, silver, copper
6. **Crypto Summary:** BTC and ETH price and change
7. **Data Quality Note:** "All 21 quality checks passed. Data sourced from AKShare, Yahoo Finance."

Generation logic:
- Narratives are template-based with conditional phrasing:
  - change_pct > 1% → "surged", "rallied"
  - change_pct between 0-1% → "edged up", "gained"
  - change_pct between -1%-0% → "slipped", "edged down"
  - change_pct < -1% → "fell", "dropped"
- Trend detection: compare last 3 days of history to determine "N-day uptrend/downtrend"

**Data Requirements:**
- Read `public/data/market_summary.json` (existing)
- New file: `public/data/reports/daily_YYYY-MM-DD.json`
  - Generated by a new pipeline step
  - Structure: `{ date, title, highlights: [string], sections: [{title, content, table_data}] }`

**Components:**
- `ReportViewer` (NEW) — Styled article/prose layout with sections, tables, and summary bullets
- `ReportHighlight` (NEW) — Styled bullet point with up/down indicator icon

---

### Section 3.2: Monthly Review Report

**Layout:** Full-width report with embedded charts.

**Content:**
- Month-over-month performance comparison for all tracked indices
- Best and worst performers of the month
- Macro context (if macro data available): GDP, CPI, PMI trends
- Embedded mini-charts (reuse `MarketChart` with monthly data)

**Data Requirements:**
- Aggregation of all daily `market_summary.json` files for the month
- New file: `public/data/reports/monthly_YYYY-MM.json`

**Components:**
- Reuse `ReportViewer` with extended section types
- `PerformanceRankTable` (NEW) — Sorted table showing best-to-worst monthly performers

---

### Section 3.3: Report Archive

**Layout:** List/table of all available reports with metadata.

**Content:**
- Columns: Date, Report Type (Daily/Monthly), Title, Quality Score, Actions (View/Download)
- Sorted by date descending
- Filter by type (Daily/Monthly)
- Download as JSON (stretch: PDF generation)

**Data Requirements:**
- New file: `public/data/reports/index.json`
  - Structure: `{ reports: [{date, type, title, path, quality_score}] }`
  - Built by scanning all report JSON files

**Components:**
- `ReportArchiveTable` (NEW) — Sortable, filterable table with download links
- Reuse existing table styling patterns from `DataTable`

---

## Page 4: Data Explorer (`/explorer`)

**Priority:** P1 — Should Have
**Rationale:** Demonstrates BI self-service capability — users can explore data interactively, which is a core BI platform feature. The SQL-like query display demonstrates semantic layer translation.

### Page Title & Subtitle
- **Title:** Data Explorer
- **Subtitle:** Interactive query builder with semantic layer translation

### Section 4.1: Query Builder Panel

**Layout:** Left panel (1/3 width) with query controls. Right panel (2/3 width) with results.

**Left Panel — Query Controls:**

1. **Metric Selector** (dropdown)
   - Options populated from `semantic_metrics.json`
   - Groups: Market (daily_return, cumulative_return, volatility_20d, volume_ratio, turnover_rate), Valuation (pe_percentile, pb_percentile), Fund Flow (northbound_net, sector_net_inflow), Macro (gdp_yoy, cpi_yoy, pmi_value)
   - Shows display name + unit in each option

2. **Dimension Filters:**
   - **Market/Region** (multi-select): APAC, NA, EU — or specific markets: CN, US, HK, EU, JP
   - **Asset Class** (multi-select): Equity, Fixed Income, Commodity, FX, Crypto
   - **Time Period** (date range picker): Presets for 7D, 1M, 3M, 6M, 1Y, YTD, Custom
   - **Time Grain** (radio): Daily, Weekly, Monthly

3. **Chart Type** (icon toggle): Line, Bar, Table

4. **"Run Query" button** — Triggers data filtering and chart render

**Right Panel — Results:**
- Selected chart type rendered with the filtered data
- Below the chart: raw data table (togglable)

**Data Requirements:**
- Read `public/data/market_summary.json` for current data
- Read `public/data/semantic_metrics.json` for metric definitions
- Future: API endpoint to query DuckDB directly for historical data beyond 30-day window

**Components:**
- `QueryBuilder` (NEW) — Form panel with metric dropdown, dimension filters, chart type selector
- `MetricDropdown` (NEW) — Grouped dropdown populated from semantic layer
- `DimensionFilter` (NEW) — Multi-select filter chips for market, asset class
- `DateRangePicker` (NEW) — Date range selector with preset buttons
- `ChartTypeToggle` (NEW) — Icon-based toggle between line/bar/table views
- Reuse `MarketChart`, `DataTable` for rendering results

---

### Section 4.2: Semantic Query Display

**Layout:** Collapsible panel below the query builder, styled as a dark code block.

**Content:**
Shows the "translated query" that maps the user's selections to the semantic layer and underlying SQL. This is a demonstration feature — it shows what a BI tool would generate.

Example display when user selects "Daily Return" for "CN" market, "Equity" asset class, last 30 days:

```sql
-- Semantic Layer Query
SELECT
  metric('daily_return')           -- (close - lag(close)) / lag(close) * 100
FROM fact_price fp
JOIN dim_asset da ON fp.asset_key = da.asset_key
JOIN dim_date dd ON fp.date_key = dd.date_key
WHERE da.market = 'CN'
  AND da.asset_type = 'equity'
  AND dd.date_key BETWEEN '2026-02-16' AND '2026-03-18'
ORDER BY dd.date_key
```

**Interaction:**
- Auto-updates as user changes query parameters
- Copy-to-clipboard button
- Toggle between "Semantic" view (uses metric names) and "Expanded" view (shows raw formula)

**Data Requirements:**
- No external data — generated client-side from metric definitions + user selections

**Components:**
- `SemanticQueryDisplay` (NEW) — Syntax-highlighted code block with copy button, semantic/expanded toggle

---

## Page 5: About / Platform Overview (`/about`)

**Priority:** P2 — Nice to Have
**Rationale:** Provides project context for portfolio reviewers. Not directly a technical capability demo but gives the viewer confidence in the candidate's ability to articulate architecture decisions.

### Page Title & Subtitle
- **Title:** About AI-VIZ
- **Subtitle:** Platform architecture, methodology, and technology choices

### Section 5.1: Project Overview

**Layout:** Hero section with centered text, followed by feature grid.

**Content:**
- **Headline:** "AI-VIZ: Financial Data Visualization Platform"
- **Description:** 2-3 sentences explaining the platform's purpose — a full-stack data visualization platform covering China and global financial markets, built to demonstrate enterprise-grade data architecture patterns including Star Schema modeling, semantic layers, data lineage, and automated report generation.
- **Feature Grid (2x3):** Six feature cards:
  1. Multi-Source Data Pipeline — AKShare, yfinance, Tushare
  2. Star Schema Data Model — 4 dimensions, 7 fact tables
  3. Semantic Layer — 13 governed metrics with formulas
  4. Data Lineage Tracking — Full source-to-dashboard traceability
  5. Automated Quality Checks — 21 validation rules
  6. Agent-Based Development — Built with AI-assisted engineering

**Data Requirements:** None (static content)

**Components:**
- `HeroSection` (NEW) — Centered title, subtitle, description
- `FeatureGrid` (NEW) — 2x3 card grid with icons, titles, descriptions

---

### Section 5.2: Data Pipeline Diagram

**Layout:** Full-width horizontal flow diagram (simplified version of Lineage DAG).

**Content:**
```
[Data Sources] → [Collection] → [Storage] → [Processing] → [Presentation]
     |                |             |             |               |
  AKShare         Collectors     DuckDB        Polars         Next.js
  yfinance        (Python)       Turso         DuckDB SQL     ECharts
  Tushare         Daily cron     Parquet       JSON export    Tailwind
```

Show pipeline execution time, last run status, schedule (daily 18:00 CST).

**Data Requirements:**
- Read pipeline status from `public/data/quality_history.json` for last run info

**Components:**
- `PipelineDiagram` (NEW) — Simplified horizontal flow chart (can be pure CSS/HTML or lightweight SVG)

---

### Section 5.3: Development Methodology

**Layout:** Vertical timeline or card layout.

**Content:**
- Agent-based development approach: Each module designed and built with AI-assisted engineering
- Iterative architecture: Started with data collection, added modeling, then visualization
- Quality-first: Automated validation at every pipeline stage

**Data Requirements:** None (static content)

**Components:**
- `MethodologyTimeline` (NEW) — Styled vertical timeline with milestone descriptions

---

### Section 5.4: Tech Stack Detail

**Layout:** Categorized list with technology logos/icons.

**Content (grouped):**

**Data Collection:**
- AKShare — Chinese market data (A-shares, indices, macro indicators, fund flows)
- yfinance — Global market data (US/HK/EU/JP indices, FX, commodities, crypto)
- Tushare — Backup source for Chinese market data

**Data Processing:**
- Python 3.13 — Primary language
- Polars — High-performance DataFrame library (chosen over pandas for speed)
- DuckDB — Embedded OLAP database for analytical queries

**Storage:**
- DuckDB — Local analytical database with Star Schema
- Turso (libSQL) — Remote SQLite-compatible database for cloud deployment
- Parquet — Columnar file format for raw/processed data
- JSON — Static files consumed by frontend

**Frontend:**
- Next.js 16 — React framework with static export
- React 19 — UI component library
- ECharts 6 — Charting library (line charts, bar charts, treemaps, Sankey, gauge, graph)
- Tailwind CSS 4 — Utility-first styling

**DevOps:**
- GitHub Actions — CI/CD pipeline (daily data collection at 18:00 CST, static site build and deploy)
- UV — Fast Python package manager
- pnpm — Node.js package manager

**Data Requirements:** None (static content)

**Components:**
- `TechStackList` (NEW) — Grouped list with category headers. Each item: technology name, version, role description.

---

## Navigation Updates

The sidebar (`Sidebar.tsx`) must be updated to include the new pages. Proposed navigation structure:

```
MARKETS (group label)
  Overview          /           (existing)
  China Markets     /           (existing, section nav)
  Global Markets    /           (existing, section nav)
  FX Rates          /           (existing, section nav)
  Commodities       /           (existing, section nav)
  Crypto            /           (existing, section nav)

PLATFORM (group label — new section divider)
  Architecture      /architecture    (NEW — P0)
  Data Quality      /quality         (NEW — P0)
  Reports           /reports         (NEW — P1)
  Data Explorer     /explorer        (NEW — P1)
  About             /about           (NEW — P2)
```

### Routing Approach
The current app uses client-side section switching within a single `page.tsx`. The new pages should be implemented as separate Next.js routes:
- `/architecture/page.tsx`
- `/quality/page.tsx`
- `/reports/page.tsx`
- `/explorer/page.tsx`
- `/about/page.tsx`

Each new page uses the shared `Header` and `Sidebar` components. The sidebar navigation should use Next.js `<Link>` for cross-page nav and the existing `onNavigate` callback for within-page section switching on the dashboard.

---

## New Data Files Summary

| File | Generated By | Frequency | Content |
|---|---|---|---|
| `public/data/schema_metadata.json` | Build script parsing `schema.py` | On code change | Table definitions, column types, row counts |
| `public/data/semantic_metrics.json` | Build script parsing `metrics.yml` | On code change | Metric definitions, dimensions |
| `public/data/lineage.json` | Build script parsing `lineage.yml` | On code change | DAG nodes and edges |
| `public/data/quality_history.json` | Daily pipeline (new step) | Daily | Aggregated quality check history |
| `public/data/quality_scorecard.json` | Daily pipeline (new step) | Daily | Latest quality check results |
| `public/data/reports/daily_YYYY-MM-DD.json` | Daily pipeline (new step) | Daily | Auto-generated daily report |
| `public/data/reports/monthly_YYYY-MM.json` | Monthly pipeline (new step) | Monthly | Auto-generated monthly report |
| `public/data/reports/index.json` | Build script | Daily | Report archive index |

---

## New Components Summary

| Component | Page | Priority | Reuses |
|---|---|---|---|
| `StarSchemaGraph` | Architecture | P0 | ECharts graph |
| `TableDetailPanel` | Architecture | P0 | — |
| `MetricCatalog` | Architecture | P0 | — |
| `MetricDetailCard` | Architecture | P0 | — |
| `DimensionExplorer` | Architecture | P0 | — |
| `LineageDAG` | Architecture | P0 | ECharts Sankey |
| `LineageNodeTooltip` | Architecture | P0 | — |
| `TechStackDiagram` | Architecture | P0 | — |
| `FreshnessCard` | Quality | P0 | KpiCard pattern |
| `QualityScorecard` | Quality | P0 | ECharts gauge |
| `CheckRow` | Quality | P0 | — |
| `CoverageMatrix` | Quality | P0 | — |
| `QualityTrendChart` | Quality | P0 | MarketChart pattern |
| `ReportViewer` | Reports | P1 | — |
| `ReportHighlight` | Reports | P1 | — |
| `PerformanceRankTable` | Reports | P1 | DataTable |
| `ReportArchiveTable` | Reports | P1 | DataTable |
| `QueryBuilder` | Explorer | P1 | — |
| `MetricDropdown` | Explorer | P1 | — |
| `DimensionFilter` | Explorer | P1 | — |
| `DateRangePicker` | Explorer | P1 | — |
| `ChartTypeToggle` | Explorer | P1 | — |
| `SemanticQueryDisplay` | Explorer | P1 | — |
| `HeroSection` | About | P2 | — |
| `FeatureGrid` | About | P2 | — |
| `PipelineDiagram` | About | P2 | — |
| `MethodologyTimeline` | About | P2 | — |
| `TechStackList` | About | P2 | — |

Total: 28 new components across 5 pages.

---

## Implementation Priority & Phasing

### Phase 1 — P0 (Must Have)
**Pages:** Architecture, Data Quality
**Estimated effort:** 3-4 days
**Why first:** These two pages directly demonstrate the three most differentiated competencies — Star Schema, semantic layers, data lineage, and data governance. They make the strongest impression for the Fidelity role.

### Phase 2 — P1 (Should Have)
**Pages:** Reports, Data Explorer
**Estimated effort:** 3-4 days
**Why second:** Report generation and self-service BI exploration are explicitly required competencies. The Data Explorer's semantic query display is a unique differentiator showing deep understanding of how BI tools translate user intent to SQL.

### Phase 3 — P2 (Nice to Have)
**Pages:** About
**Estimated effort:** 1 day
**Why last:** Important for portfolio context but does not demonstrate new technical capability. Much of the content is static prose.

---

## Design Principles

1. **Dark theme consistency** — All new pages use the existing dark theme (`bg-[#0a0a0f]`, `text-[#e8eaed]`, card borders, etc.)
2. **Terminal aesthetic** — Maintain the "Market Intelligence Terminal" feel with monospace accents, uppercase labels, and the green "LIVE" indicator
3. **Data-first** — Every visual element should be backed by real data from the pipeline, not mockups
4. **Interactive depth** — Every diagram should have at least one level of click/hover interaction to demonstrate technical depth
5. **Mobile responsive** — All layouts should collapse gracefully on smaller screens (follow existing grid patterns: 1-col on mobile, 2-col on tablet, full on desktop)
6. **Static export compatible** — All pages must work with Next.js static export (`output: 'export'`) since the platform deploys as a static site
