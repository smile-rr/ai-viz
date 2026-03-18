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
  },
  zh: {
    "nav.dashboard": "\u4eea\u8868\u76d8",
    "nav.markets": "\u5e02\u573a\u6570\u636e",
    "nav.analytics": "\u5206\u6790\u62a5\u544a",
    "nav.platform": "\u5e73\u53f0\u67b6\u6784",
    "nav.overview": "\u5e02\u573a\u603b\u89c8",
    "nav.cn-markets": "\u4e2d\u56fd\u5e02\u573a",
    "nav.global": "\u5168\u7403\u5e02\u573a",
    "nav.fx": "\u5916\u6c47\u6c47\u7387",
    "nav.commodities": "\u5927\u5b97\u5546\u54c1",
    "nav.crypto": "\u52a0\u5bc6\u8d27\u5e01",
    "nav.reports": "\u7814\u7a76\u62a5\u544a",
    "nav.architecture": "\u6570\u636e\u6a21\u578b",
    "nav.quality": "\u6570\u636e\u8d28\u91cf",
    "header.terminal": "\u7ec8\u7aef",
    "header.live": "\u5b9e\u65f6",
    "header.autoRefresh": "\u81ea\u52a8\u5237\u65b0\uff1a5\u5206\u949f",
    "header.nextRefresh": "\u4e0b\u6b21\u5237\u65b0",
    "header.updated": "\u66f4\u65b0\u65f6\u95f4",
    "header.refreshing": "\u5237\u65b0\u4e2d...",
    "header.refresh": "\u5237\u65b0",
    "page.overview.title": "\u5e02\u573a\u603b\u89c8",
    "page.overview.subtitle": "\u5168\u7403\u91d1\u878d\u5e02\u573a\u4e00\u89c8",
    "page.cn.title": "\u4e2d\u56fd\u5e02\u573a",
    "page.cn.subtitle":
      "\u4e0a\u8bc1\u3001\u6df1\u8bc1\u3001\u6e2f\u80a1\u6307\u6570\u8d70\u52bf",
    "page.global.title": "\u5168\u7403\u5e02\u573a",
    "page.global.subtitle":
      "\u5168\u7403\u4e3b\u8981\u6307\u6570 \u2014 S&P 500\u3001\u9053\u7434\u65af\u3001\u7eb3\u65af\u8fbe\u514b\u3001\u65e5\u7ecf\u7b49",
    "page.fx.title": "\u5916\u6c47\u5e02\u573a",
    "page.fx.subtitle":
      "\u4e3b\u8981\u8d27\u5e01\u5bf9\u6c47\u7387\u53ca\u8d70\u52bf",
    "page.commodities.title": "\u5927\u5b97\u5546\u54c1",
    "page.commodities.subtitle":
      "\u9ec4\u91d1\u3001\u539f\u6cb9\u3001\u767d\u94f6\u7b49\u5546\u54c1\u4ef7\u683c",
    "page.crypto.title": "\u52a0\u5bc6\u8d27\u5e01",
    "page.crypto.subtitle":
      "\u6bd4\u7279\u5e01\u3001\u4ee5\u592a\u574a\u53ca\u6570\u5b57\u8d44\u4ea7",
    "page.architecture.title": "\u6570\u636e\u67b6\u6784",
    "page.architecture.subtitle":
      "\u661f\u578b\u6a21\u578b\u3001\u8bed\u4e49\u5c42\u3001\u6570\u636e\u8840\u7f18\u4e0e\u6280\u672f\u6808",
    "page.reports.title": "\u7814\u7a76\u62a5\u544a",
    "page.reports.subtitle":
      "\u6bcf\u65e5\u5e02\u573a\u6458\u8981\u4e0e\u5b9a\u671f\u56de\u987e",
    "page.quality.title": "\u6570\u636e\u8d28\u91cf",
    "page.quality.subtitle":
      "\u6570\u636e\u65b0\u9c9c\u5ea6\u3001\u8986\u76d6\u8303\u56f4\u53ca\u9a8c\u8bc1\u76d1\u63a7",
    "footer.disclaimer":
      "AI-VIZ \u91d1\u878d\u6570\u636e\u7ec8\u7aef \u00b7 \u6570\u636e\u6765\u6e90\uff1aAKShare \u00b7 Yahoo Finance \u00b7 Tushare \u00b7 \u4ec5\u4f9b\u53c2\u8003",
    "system.refreshFreq":
      "\u5237\u65b0\u9891\u7387\uff1a\u6bcf\u65e5 18:00 CST",
    "system.cnSource":
      "\u4e2d\u56fd\uff1aAKShare / Tushare",
    "system.globalSource":
      "\u56fd\u9645\uff1aYahoo Finance",
  },
} as const;
