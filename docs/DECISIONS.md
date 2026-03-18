# AI-VIZ Product Decisions

**Date:** 2026-03-18
**Status:** Approved

---

## Decision 1: Sidebar Navigation Grouping

**Decision:** Two-group structure — **Markets** and **Platform**.

```
MARKETS
  Overview
  China Markets
  Global Markets
  FX Rates
  Commodities
  Crypto

PLATFORM
  Data Model
  Reports
  Data Quality
```

**Rationale:**

- The second option (Dashboard / Markets / Analytics / Engineering) creates too many groups for 9 items. Groups with a single item (Dashboard: Overview, Analytics: Reports) are visual noise, not information architecture.
- Two groups is the right split for 9 items. The cognitive overhead of scanning two labeled sections is minimal; four sections forces the eye to parse group labels more than nav items.
- Reports belongs under Platform, not Markets. Reports are generated artifacts about the platform's output — they demonstrate report generation capability (a Fidelity job requirement), not a market data view. Placing Reports next to Data Model and Data Quality signals "this is what the platform produces and monitors."
- Overview stays under Markets because it is a market data dashboard, not a standalone category.
- This matches the product spec's own grouping in the Navigation Updates section and aligns with the existing sidebar implementation where architecture/reports/quality are already the last three items.

**Implementation notes:**
- Add group label dividers (`<div>` with uppercase text, e.g., `text-[10px] uppercase tracking-wider text-muted`) above each group.
- When sidebar is collapsed (icon-only mode), hide group labels entirely.
- No sub-menus or nesting — keep it flat within each group.

---

## Decision 2: Internationalization (i18n)

**Decision:** Yes, implement i18n. English default, toggle to Simplified Chinese.

**Approach:** Simple JSON translation files, no full i18n library.

**Rationale:**

- The target role is at Fidelity International in Dalian, China. Bilingual UI directly demonstrates awareness of the operating environment and user base. This is a portfolio differentiator, not a checkbox feature.
- A full i18n library (next-intl, react-i18next) is overkill for a static export with ~50 translatable strings. It adds bundle weight and routing complexity (locale prefixes, middleware) that conflicts with the `output: 'export'` constraint.
- The semantic layer already has Chinese names (`name_cn` fields in metrics.yml and dim_indicator). The data model is pre-wired for this.

**Implementation plan:**

1. Create `src/i18n/en.json` and `src/i18n/zh.json` with flat key-value pairs covering: sidebar labels, page titles, page subtitles, section headers, column headers, button text, status labels.
2. Create a `useLocale()` React context/hook that reads from `localStorage` and provides a `t(key)` function.
3. Add a language toggle button (EN / CN) in the Header, next to the LIVE indicator.
4. Chart labels and metric names: use `name` vs `name_cn` from the data JSON based on current locale.
5. Do NOT translate: raw data values, symbol tickers, timestamps, technical terms (Star Schema, DAG, etc.).

**Scope:** ~50 translation keys. Estimate: 0.5 day implementation.

---

## Decision 3: Auto-Refresh Display

**Decision:** Show refresh timer and LIVE indicator only on market pages. Hide on platform pages.

**Market pages** (show refresh UI): `overview`, `cn-markets`, `global`, `fx`, `commodities`, `crypto`
**Platform pages** (hide refresh UI): `architecture`, `reports`, `quality`

**Rationale:**

- The auto-refresh fetches `market_summary.json`. Architecture, Reports, and Data Quality pages consume different data files (`data_quality.json`, `reports.json`) or use hardcoded content. Showing "Auto-refresh: 5min" and a countdown on these pages is misleading — it implies their data refreshes, which it does not.
- The LIVE indicator should also be hidden or replaced on platform pages. Showing a pulsing green "LIVE" dot on a static Star Schema diagram is confusing.
- The refresh button in the page header area should also be conditionally rendered.

**Implementation:**

1. Define a set: `const MARKET_SECTIONS = new Set(["overview", "cn-markets", "global", "fx", "commodities", "crypto"])`.
2. Pass `showRefresh={MARKET_SECTIONS.has(activeSection)}` to the Header component.
3. In Header: conditionally render the LIVE badge, auto-refresh text, and countdown based on this prop.
4. In the page header area of `page.tsx`: conditionally render the "Next refresh in..." text and Refresh button.
5. The underlying auto-refresh timer continues running regardless (market data stays fresh in memory). Only the UI indicators are hidden.

---

## Decision 4: Cloudflare Deployment Data Refresh Strategy

**Decision:** Option A — GitHub Actions daily commit JSON, push triggers Cloudflare rebuild.

**Rationale:**

- **Reliability:** Static JSON committed to the repo is the most reliable delivery mechanism. No runtime dependencies, no API keys in the browser, no CORS issues, no rate limits. The data updates once daily after market close — this is not a real-time use case.
- **Simplicity:** The pipeline already collects data, processes it, and writes JSON. Adding a `git commit && git push` step is one line in the workflow. Option B requires: a Turso HTTP client in the frontend, error handling for network failures, a loading state for every page, and exposing database credentials (even read-only) to the client.
- **Performance:** Static JSON served from Cloudflare's edge CDN is faster than a runtime API call to Turso. First paint is immediate; no waterfall of fetch requests.
- **Cost:** Both are free tier. But Option A has zero marginal cost — Cloudflare Pages serves static files at no cost with no request limits. Option B counts against Turso's free tier row reads (9B/month is generous but adds a dependency to monitor).
- **SEO/Portfolio:** A static site loads instantly for a hiring manager clicking the link. No spinner, no "loading data..." state on first visit.
- **Current design already works this way.** The HOSTING.md documents this exact flow. No architecture change needed.

**Trade-off acknowledged:** Every data update creates a git commit, which grows the repo. At ~100KB/day of JSON, this is ~36MB/year — negligible. If it becomes a concern, use `git gc` or move JSON to a separate branch.
