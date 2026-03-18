# AI-Viz Platform Strategic Review

**Date**: 2026-03-18
**Author**: Senior Manager Review
**Status**: Action Items Identified — Requires Engineering Response

---

## Executive Summary

The ai-viz financial data visualization platform has a solid foundation: a clean Next.js frontend with ECharts rendering, a well-structured sidebar navigation, i18n support, and automated data quality monitoring. However, six critical gaps prevent it from delivering real analyst value. This document provides concrete implementation guidance for each.

---

## Issue 1: Time Range Selection

### Current State

All charts are hardcoded to display whatever is in the `history` array — currently ~30 data points labeled `D-30` to `D-1`. The `MarketChart` component (`/frontend/src/components/MarketChart.tsx`, line 37-38) derives the x-axis directly from `items[0].history.length`. There is no mechanism for the user to select a different time window.

The `market_summary.json` file serves ~30 entries per asset in the `history` array. The pipeline reportedly stores 8000+ rows for CN indices in the database but only 30-45 days for global assets.

### Decision

Since expanding global history requires pipeline changes (longer yfinance lookback periods), the practical approach is a phased rollout:

### Implementation Plan

**Phase 1 — Frontend TimeRangeSelector (1-2 days)**

1. Create `src/components/TimeRangeSelector.tsx` with button group: `[1W, 1M, 3M, 6M, 1Y, ALL]`.
2. Add state `timeRange` to `page.tsx` and pass it down to `MarketChart` and `KpiCard`.
3. In `MarketChart`, slice the `history` array from the end based on the selected range:
   - 1W = last 5 entries
   - 1M = last 22 entries (or all if fewer)
   - 3M = last 66 entries
   - 6M = last 132 entries
   - 1Y = last 252 entries
   - ALL = full array
4. Gray out (disable) ranges that exceed the available `history.length` for the displayed assets. Check `Math.min(...items.map(i => i.history.length))` against the required count.
5. Update the x-axis labels to show actual dates instead of `D-N`. This requires the pipeline to include a `dates` array alongside `history`, or embed date strings in the JSON.

**Phase 2 — Pipeline expansion (3-5 days)**

1. Expand `market_summary.json` to include `history_dates: string[]` parallel to `history`.
2. For CN indices: serve the full history (already collected). The JSON will grow, so consider a separate `history_full.json` endpoint loaded on demand when users select 3M+.
3. For global indices: extend yfinance lookback to `period="1y"` (currently appears to be `period="1mo"`).
4. For crypto: same yfinance expansion.

**Phase 3 — Lazy loading (optimization)**

Serve only 30 days in `market_summary.json` by default. When a user selects a longer range, fetch from `/data/history/{symbol}.json` on demand. This keeps the initial page load fast.

---

## Issue 2: Analyst Value Proposition

### Current State

The dashboard displays raw price data, change percentages, sparklines, and heatmaps. There is no derived analysis — no comparisons, no correlations, no actionable callouts. The semantic layer (`semantic_layer.json`) defines 16 metrics (daily return, volatility, RSI, Sharpe ratio, PE percentile, etc.) but none are surfaced in the UI.

### Implementation Plan

**A. Insights Card Component (`src/components/InsightsCard.tsx`)**

Generate observations client-side from the existing data:

```typescript
interface Insight {
  severity: 'info' | 'warning' | 'alert';
  icon: string;       // e.g., trend-down, trend-up, neutral
  message: string;
  category: string;   // 'streak', 'extreme', 'correlation', 'momentum'
}
```

Insight generators to implement:

1. **Consecutive direction detection**: Scan `history` for N consecutive up/down closes. Trigger at 3+ days. Example output: "上证指数 down 5 consecutive sessions (-2.1% cumulative)".
2. **Extreme move detection**: Flag any single-day `change_pct` exceeding +/-3%. Example: "中证500 dropped 2.07% today — largest single-day decline in 30 sessions".
3. **Range position**: Compare current `close` to the 30-day high/low from `history`. Example: "Bitcoin trading at 30-day low, 8.2% below recent high".
4. **Cross-asset divergence**: Compare normalized returns across categories. Example: "Gold +4.2% while Shanghai Composite -2.1% over 30 days — risk-off signal".
5. **Volatility alert**: Calculate 5-day vs 20-day standard deviation of returns. Flag when short-term vol exceeds long-term by >1.5x.

Place this card prominently on the Overview page, between the KPI cards and the charts.

**B. Asset Comparison Mode**

Add a "Compare" toggle to `MarketChart` that lets users overlay any two assets on a normalized (%) chart. Implementation:
- Add a multi-select dropdown above the chart.
- Use the existing `normalized` mode (already supported in `MarketChart` via `shouldNormalize`).
- Allow cross-category comparison (e.g., Gold vs S&P 500).

**C. Data Export**

Add a download button to `DataTable` and `MarketChart`:
- CSV export of displayed data (symbol, name, close, change_pct, history values).
- Use `Blob` + `URL.createObjectURL` — no backend needed.

---

## Issue 3: Crypto Data is Blank

### Current State

In `market_summary.json`, both `BTC-USD` and `ETH-USD` have `"close": null, "change_pct": null`. Their `history` arrays contain valid data for 29 entries, with the 30th (today's) entry being `null`. The `cleanItems()` function in `page.tsx` (line 28-37) filters out items where `close` or `change_pct` is null, so crypto cards and charts render empty.

The root cause: yfinance returns today's crypto candle with null close because the 24-hour candle hasn't completed. The market is 24/7, but yfinance only finalizes the daily bar after midnight UTC.

### Fix — Pipeline Side (Recommended)

In the data collection script, after fetching crypto data:

```python
# For each crypto asset:
if row['close'] is None or pd.isna(row['close']):
    # Use the previous day's close
    row['close'] = history[-1] if history else None
    row['change_pct'] = 0.0  # Or compute from day before
    # Alternatively, use the current intraday price via:
    # ticker.info.get('regularMarketPrice')
```

### Fix — Frontend Side (Interim)

Modify `cleanItems()` in `page.tsx` to backfill null close from the last non-null history entry:

```typescript
function cleanItems(items: MarketItem[]): MarketItem[] {
  return items.map((item) => {
    const validHistory = (item.history ?? []).filter((v): v is number => v != null);
    const close = item.close ?? validHistory[validHistory.length - 1] ?? null;
    const change_pct = item.change_pct ?? 0;
    if (close == null) return null;
    return { ...item, close, change_pct, history: validHistory };
  }).filter(Boolean) as MarketItem[];
}
```

Both fixes should be applied. The pipeline fix is the correct long-term solution; the frontend fix is a resilience measure.

---

## Issue 4: Data Model Page — Discoverability

### Current State

The Architecture page (`renderArchitecture()` in `page.tsx`, lines 741-756) renders four components in sequence: `StarSchemaViz`, `SemanticLayerViz`, `DataLineageViz`, `TechStackViz`. The user must scroll to discover each. On a 1080p screen, only the first section is visible on load.

### Implementation Plan

1. Create `src/components/architecture/ArchitectureTabs.tsx`:

```typescript
const tabs = [
  { id: 'star-schema', label: 'Star Schema', icon: /* database icon */ },
  { id: 'semantic-layer', label: 'Semantic Layer', icon: /* layers icon */ },
  { id: 'data-lineage', label: 'Data Lineage', icon: /* git-branch icon */ },
  { id: 'tech-stack', label: 'Tech Stack', icon: /* cpu icon */ },
];
```

2. Use `useState` to track the active tab. Render only the active section's component.
3. Style as a horizontal pill/tab bar with the active tab highlighted using the existing `bg-blue-dim text-blue` pattern from the sidebar.
4. Add a brief description below each tab heading explaining what the user is looking at and why it matters (see Issue 6).

Replace the current `renderArchitecture()` with:

```tsx
const renderArchitecture = () => (
  <ArchitectureTabs />
);
```

---

## Issue 5: Data Quality — Workflow Clarity

### Current State

The Quality page shows a scorecard (overall score 95), coverage matrix, freshness table, check results, and table stats. The data in `data_quality.json` is well-structured with 16 checks across completeness/validity/consistency categories, 6 freshness entries, and 7 table stats. However, there is no visual indication of HOW this quality monitoring works or WHERE in the pipeline each check runs.

### Implementation Plan

**A. Pipeline Workflow Visualization (`src/components/quality/PipelineWorkflow.tsx`)**

Render a horizontal 4-stage flow diagram:

```
[Collection] → [Validation] → [Storage] → [Serving]
  AKShare        Null checks     DuckDB      JSON export
  yfinance       Range checks    Fact tables  market_summary.json
                 Consistency     Dimensions   data_quality.json
```

Each stage should be a card with:
- Stage name and icon
- Data sources or operations at that stage
- Count of checks that run at that stage (map from `data_quality.json` checks)
- Status indicator (green if all checks pass at that stage, yellow if warnings, red if failures)

Map checks to stages:
- **Collection**: Freshness checks (is data arriving?)
- **Validation**: completeness checks ("CN indices have data"), validity checks ("No null close prices", "Prices within expected range", "Change % within +/-20%")
- **Storage**: consistency checks ("No duplicate symbols", "CN market hours aligned")
- **Serving**: "History arrays length = 30", "FX inverse rate consistency"

**B. Workflow Description Text**

Add a callout box at the top of the Quality page:

> "This dashboard monitors an automated data governance pipeline. Data is collected daily from AKShare (China markets) and yfinance (global markets), validated against 16 quality checks, stored in a DuckDB star schema, and served as static JSON. Any check failure triggers an alert."

**C. Check-to-Stage Linking**

In the `QualityChecks` component, add a column or tag showing which pipeline stage each check belongs to. This connects the abstract checks to the concrete workflow.

Place `PipelineWorkflow` at the top of `renderQuality()`, before the scorecard.

---

## Issue 6: Purpose Statement

### Current State

Page headers show a title and subtitle (from i18n keys like `page.overview.title` / `page.overview.subtitle`), but these are generic labels. They do not explain the analytical purpose of the page or what actions a user should take.

### Implementation Plan

Add a `PagePurpose` component or expand the existing header area. Each page should have a one-line "purpose" and a "key question" it answers:

| Page | Purpose Statement | Key Question |
|------|------------------|--------------|
| Overview | "Cross-market snapshot for daily decision-making" | "What moved today and what should I watch?" |
| CN Markets | "Deep dive into China A-share indices with full history" | "Is the domestic market trending or consolidating?" |
| Global | "Track major global indices relative to China" | "How are international markets positioned vs domestic?" |
| FX | "Monitor currency exposure and hedging signals" | "Is the RMB strengthening or weakening against key pairs?" |
| Commodities | "Commodity price trends affecting industrial and consumer sectors" | "Are input costs rising or falling?" |
| Crypto | "Digital asset tracking for portfolio diversification" | "What is the risk-on/risk-off signal from crypto?" |
| Reports | "AI-generated daily market briefs with archival access" | "What happened today in plain language?" |
| Quality | "Automated data governance — pipeline health at a glance" | "Can I trust the data I'm seeing?" |
| Architecture | "Technical data model documentation for developers and analysts" | "How is the data structured and where does it come from?" |

Implementation:
1. Add these as new i18n keys: `page.<section>.purpose` and `page.<section>.keyQuestion`.
2. Render below the existing subtitle in `page.tsx` (lines 808-815), styled as a muted italic line with slightly larger text than the subtitle.
3. For the Quality and Architecture pages, also add an introductory card (not just a text line) that explains the page's function before showing any data.

---

## Priority and Sequencing

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P0 | Issue 3: Crypto null fix | 2 hours | Broken feature — users see empty section |
| P1 | Issue 1: TimeRangeSelector (Phase 1) | 1-2 days | Core analyst workflow — currently missing |
| P1 | Issue 2: Insights Card | 2-3 days | Primary differentiator vs raw data display |
| P2 | Issue 6: Purpose statements | 0.5 day | Low effort, high clarity improvement |
| P2 | Issue 4: Architecture tabs | 0.5 day | Simple UX improvement |
| P2 | Issue 5: Quality workflow viz | 1-2 days | Valuable but not user-facing for analysts |
| P3 | Issue 1: Pipeline expansion (Phase 2-3) | 3-5 days | Enables full time range selection |
| P3 | Issue 2: Comparison mode + export | 2-3 days | Advanced analyst features |

---

## Files Requiring Changes

| File | Issues Addressed |
|------|-----------------|
| `/frontend/src/app/page.tsx` | 1, 2, 3, 4, 5, 6 |
| `/frontend/src/components/MarketChart.tsx` | 1, 2 |
| `/frontend/src/components/KpiCard.tsx` | 1 |
| `/frontend/src/components/TimeRangeSelector.tsx` (new) | 1 |
| `/frontend/src/components/InsightsCard.tsx` (new) | 2 |
| `/frontend/src/components/architecture/ArchitectureTabs.tsx` (new) | 4 |
| `/frontend/src/components/quality/PipelineWorkflow.tsx` (new) | 5 |
| `/frontend/public/data/market_summary.json` | 1, 3 (pipeline output) |
| `/frontend/src/i18n/` (locale files) | 6 |
| Pipeline scripts (Python, outside frontend) | 1, 3 |

---

## Conclusion

The platform has strong technical bones — ECharts rendering, i18n, auto-refresh, data quality monitoring, and a well-organized component structure. The primary gap is that it treats data display as the end goal rather than analysis. The recommended changes transform it from a "data viewer" into an "analyst workbench" by adding time range control, automated insights, cross-asset comparison, and clear purpose framing on every page. The crypto null fix is a P0 bug that should ship immediately.
