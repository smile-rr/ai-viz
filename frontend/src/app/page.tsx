"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import type { MarketData, MarketItem } from "@/types/market";
import { useI18n } from "@/i18n/context";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import KpiCard from "@/components/KpiCard";
import MarketChart from "@/components/MarketChart";
import DataTable from "@/components/DataTable";
import CommodityBar from "@/components/CommodityBar";
import Heatmap from "@/components/Heatmap";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import DailyReport from "@/components/reports/DailyReport";
import ReportArchive from "@/components/reports/ReportArchive";
import QualityScorecard from "@/components/quality/QualityScorecard";
import FreshnessTable from "@/components/quality/FreshnessTable";
import CoverageMatrix from "@/components/quality/CoverageMatrix";
import QualityChecks from "@/components/quality/QualityChecks";
import TableStats from "@/components/quality/TableStats";
import StarSchemaViz from "@/components/architecture/StarSchemaViz";
import SemanticLayerViz from "@/components/architecture/SemanticLayerViz";
import DataLineageViz from "@/components/architecture/DataLineageViz";
import TechStackViz from "@/components/architecture/TechStackViz";
import InsightsCard from "@/components/InsightsCard";
import TabNav from "@/components/TabNav";

/** Filter out items with null close/change_pct and clean null values from history */
function cleanItems(items: MarketItem[]): MarketItem[] {
  return items
    .filter((item) => item.close != null && item.change_pct != null)
    .map((item) => ({
      ...item,
      close: item.close ?? 0,
      change_pct: item.change_pct ?? 0,
      history: (item.history ?? []).filter((v): v is number => v != null),
    }));
}

/* ────────────────────────────────────────────────
   Section metadata (i18n-aware)
   ──────────────────────────────────────────────── */
function getSectionMeta(
  section: string,
  t: (key: string) => string
): { title: string; subtitle: string } {
  const map: Record<string, { titleKey: string; subtitleKey: string }> = {
    overview: {
      titleKey: "page.overview.title",
      subtitleKey: "page.overview.subtitle",
    },
    "cn-markets": {
      titleKey: "page.cn.title",
      subtitleKey: "page.cn.subtitle",
    },
    global: {
      titleKey: "page.global.title",
      subtitleKey: "page.global.subtitle",
    },
    fx: {
      titleKey: "page.fx.title",
      subtitleKey: "page.fx.subtitle",
    },
    commodities: {
      titleKey: "page.commodities.title",
      subtitleKey: "page.commodities.subtitle",
    },
    crypto: {
      titleKey: "page.crypto.title",
      subtitleKey: "page.crypto.subtitle",
    },
    reports: {
      titleKey: "page.reports.title",
      subtitleKey: "page.reports.subtitle",
    },
    quality: {
      titleKey: "page.quality.title",
      subtitleKey: "page.quality.subtitle",
    },
    architecture: {
      titleKey: "page.architecture.title",
      subtitleKey: "page.architecture.subtitle",
    },
  };

  const entry = map[section] ?? map.overview;
  return { title: t(entry.titleKey), subtitle: t(entry.subtitleKey) };
}

/** Sections that show auto-refresh countdown */
const MARKET_SECTIONS = new Set([
  "overview",
  "cn-markets",
  "global",
  "fx",
  "commodities",
  "crypto",
]);

/** Auto-refresh interval in milliseconds (5 minutes) */
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export default function Home() {
  const { t } = useI18n();
  const [data, setData] = useState<MarketData | null>(null);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [reportsData, setReportsData] = useState<any>(null);
  const [qualityData, setQualityData] = useState<any>(null);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeArchTab, setActiveArchTab] = useState("star-schema");
  const [activeQualityTab, setActiveQualityTab] = useState("scorecard");
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isMarketSection = MARKET_SECTIONS.has(activeSection);

  const fetchData = useCallback(async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch("/data/market_summary.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
      const json: MarketData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error loading data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Reset countdown
  const resetCountdown = useCallback(() => {
    setCountdown(REFRESH_INTERVAL_MS / 1000);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch reports data
  useEffect(() => {
    fetch("/data/reports.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setReportsData(json))
      .catch(() => {/* reports data is optional */});
  }, []);

  // Fetch quality data
  useEffect(() => {
    fetch("/data/data_quality.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setQualityData(json))
      .catch(() => {/* quality data is optional */});
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    refreshTimerRef.current = setInterval(() => {
      fetchData(true);
      resetCountdown();
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [fetchData, resetCountdown]);

  // Countdown ticker (updates every second)
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL_MS / 1000 : prev - 1));
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Format countdown as M:SS
  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Manual refresh handler — resets auto-refresh timer
  const handleManualRefresh = useCallback(() => {
    fetchData(true);
    resetCountdown();
    // Reset the auto-refresh interval
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    refreshTimerRef.current = setInterval(() => {
      fetchData(true);
      resetCountdown();
    }, REFRESH_INTERVAL_MS);
  }, [fetchData, resetCountdown]);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
    // Scroll to top of main content when switching sections
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const cnIndices = data ? cleanItems(data.cn_indices) : [];
  const globalIndices = data ? cleanItems(data.global_indices) : [];
  const fx = data ? cleanItems(data.fx) : [];
  const commodities = data ? cleanItems(data.commodities) : [];
  const crypto = data ? cleanItems(data.crypto) : [];

  // Build top KPI items for overview: pick major indices from all categories
  const kpiItems: MarketItem[] = [];
  const kpiCandidates = [...cnIndices, ...globalIndices, ...crypto, ...commodities];
  const kpiSymbolPriority = ["000001", "^GSPC", "^HSI", "BTC-USD", "GC=F", "^DJI", "399001", "^IXIC", "^N225", "399006", "000300", "ETH-USD"];

  for (const sym of kpiSymbolPriority) {
    const item = kpiCandidates.find((i) => i.symbol === sym);
    if (item && kpiItems.length < 6) kpiItems.push(item);
  }
  for (const item of kpiCandidates) {
    if (kpiItems.length >= 6) break;
    if (!kpiItems.find((k) => k.symbol === item.symbol)) kpiItems.push(item);
  }

  // Collect all items for heatmap
  const allItems = [...cnIndices, ...globalIndices, ...fx, ...commodities, ...crypto];

  const sidebarWidth = sidebarOpen ? "pl-48" : "pl-14";
  const meta = getSectionMeta(activeSection, t);

  /* ──────────────────────────────────────────
     Section-specific rendering helpers
     ────────────────────────────────────────── */

  /** Overview — the original combined dashboard */
  const renderOverview = () => (
    <>
      {/* KPI Cards */}
      {kpiItems.length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {kpiItems.map((item) => (
              <KpiCard
                key={item.symbol}
                name={item.name}
                symbol={item.symbol}
                close={item.close}
                changePct={item.change_pct}
                history={item.history}
              />
            ))}
          </div>
        </section>
      )}

      {/* Market Insights */}
      <section>
        <InsightsCard
          cnIndices={cnIndices}
          globalIndices={globalIndices}
          fx={fx}
          commodities={commodities}
          crypto={crypto}
        />
      </section>

      {/* China Markets Charts */}
      {cnIndices.length > 0 && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MarketChart
              title="China Markets — 30 Day Trend"
              items={cnIndices.slice(0, 4)}
              colors={["#2979ff", "#00c853", "#ff9100", "#e040fb"]}
            />
            {cnIndices.length > 4 && (
              <MarketChart
                title="China Markets — Extended"
                items={cnIndices.slice(4, 8)}
                colors={["#00e5ff", "#ffc107", "#69f0ae", "#ff5252"]}
              />
            )}
            {cnIndices.length <= 4 && globalIndices.length > 0 && (
              <MarketChart
                title="Global Markets — 30 Day Trend"
                items={globalIndices.slice(0, 4)}
                colors={["#00e5ff", "#ffc107", "#ff5252", "#69f0ae"]}
              />
            )}
          </div>
        </section>
      )}

      {/* Global Markets Charts */}
      {globalIndices.length > 0 && cnIndices.length > 4 && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MarketChart
              title="Global Markets — 30 Day Trend"
              items={globalIndices.slice(0, 4)}
              colors={["#00e5ff", "#ffc107", "#ff5252", "#69f0ae"]}
            />
            {globalIndices.length > 4 && (
              <MarketChart
                title="Global Markets — Extended"
                items={globalIndices.slice(4, 8)}
                colors={["#2979ff", "#e040fb", "#ff9100", "#00c853"]}
              />
            )}
          </div>
        </section>
      )}

      {/* FX / Commodities / Crypto tables */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fx.length > 0 && (
            <DataTable
              title="Foreign Exchange"
              items={fx}
              formatPrice={(n) => n.toFixed(4)}
            />
          )}
          {commodities.length > 0 && (
            <CommodityBar
              title="Commodities — Daily Change"
              items={commodities}
            />
          )}
          {crypto.length > 0 && (
            <DataTable title="Cryptocurrency" items={crypto} />
          )}
        </div>
      </section>

      {/* Market Heatmap */}
      {allItems.length > 0 && (
        <section>
          <Heatmap items={allItems} />
        </section>
      )}
    </>
  );

  /** China Markets — dedicated detail page */
  const renderCnMarkets = () => (
    <>
      {/* KPI cards for all CN indices */}
      {cnIndices.length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {cnIndices.map((item) => (
              <KpiCard
                key={item.symbol}
                name={item.name}
                symbol={item.symbol}
                close={item.close}
                changePct={item.change_pct}
                history={item.history}
              />
            ))}
          </div>
        </section>
      )}

      {/* Large chart with all CN indices */}
      {cnIndices.length > 0 && (
        <section>
          <MarketChart
            title="All China Indices — 30 Day Trend"
            items={cnIndices}
            colors={["#2979ff", "#00c853", "#ff9100", "#e040fb", "#00e5ff", "#ffc107", "#69f0ae", "#ff5252"]}
            height={420}
          />
        </section>
      )}

      {/* Split charts if enough indices */}
      {cnIndices.length > 4 && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MarketChart
              title="Main Board Indices"
              items={cnIndices.slice(0, 4)}
              colors={["#2979ff", "#00c853", "#ff9100", "#e040fb"]}
            />
            <MarketChart
              title="Extended Indices"
              items={cnIndices.slice(4)}
              colors={["#00e5ff", "#ffc107", "#69f0ae", "#ff5252"]}
            />
          </div>
        </section>
      )}

      {/* Detailed data table */}
      {cnIndices.length > 0 && (
        <section>
          <DataTable title="China Indices — Detailed View" items={cnIndices} />
        </section>
      )}

      {/* Heatmap for CN only */}
      {cnIndices.length > 0 && (
        <section>
          <Heatmap items={cnIndices} />
        </section>
      )}
    </>
  );

  /** Global Markets — dedicated detail page */
  const renderGlobal = () => (
    <>
      {/* KPI cards for all global indices */}
      {globalIndices.length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {globalIndices.map((item) => (
              <KpiCard
                key={item.symbol}
                name={item.name}
                symbol={item.symbol}
                close={item.close}
                changePct={item.change_pct}
                history={item.history}
              />
            ))}
          </div>
        </section>
      )}

      {/* Full chart with all global indices */}
      {globalIndices.length > 0 && (
        <section>
          <MarketChart
            title="Global Indices — 30 Day Trend"
            items={globalIndices}
            colors={["#00e5ff", "#ffc107", "#ff5252", "#69f0ae", "#2979ff", "#e040fb", "#ff9100", "#00c853"]}
            height={420}
          />
        </section>
      )}

      {/* Split charts */}
      {globalIndices.length > 4 && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MarketChart
              title="Americas & Europe"
              items={globalIndices.slice(0, 4)}
              colors={["#00e5ff", "#ffc107", "#ff5252", "#69f0ae"]}
            />
            <MarketChart
              title="Asia-Pacific & Others"
              items={globalIndices.slice(4)}
              colors={["#2979ff", "#e040fb", "#ff9100", "#00c853"]}
            />
          </div>
        </section>
      )}

      {/* Data table */}
      {globalIndices.length > 0 && (
        <section>
          <DataTable title="Global Indices — Detailed View" items={globalIndices} />
        </section>
      )}

      {/* Heatmap */}
      {globalIndices.length > 0 && (
        <section>
          <Heatmap items={globalIndices} />
        </section>
      )}
    </>
  );

  /** FX — dedicated detail page */
  const renderFx = () => (
    <>
      {/* KPI cards for FX pairs */}
      {fx.length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {fx.map((item) => (
              <KpiCard
                key={item.symbol}
                name={item.name}
                symbol={item.symbol}
                close={item.close}
                changePct={item.change_pct}
                history={item.history}
                formatPrice={(n) => n.toFixed(4)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Large chart with all FX rate trends */}
      {fx.length > 0 && (
        <section>
          <MarketChart
            title="FX Rate Trends — 30 Day"
            items={fx}
            colors={["#2979ff", "#00c853", "#ff9100", "#e040fb", "#00e5ff", "#ffc107", "#69f0ae", "#ff5252"]}
            height={420}
          />
        </section>
      )}

      {/* Split into two charts if enough pairs */}
      {fx.length > 3 && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MarketChart
              title="Major Pairs"
              items={fx.slice(0, Math.ceil(fx.length / 2))}
              colors={["#2979ff", "#00c853", "#ff9100", "#e040fb"]}
            />
            <MarketChart
              title="Cross Pairs"
              items={fx.slice(Math.ceil(fx.length / 2))}
              colors={["#00e5ff", "#ffc107", "#69f0ae", "#ff5252"]}
            />
          </div>
        </section>
      )}

      {/* Data table */}
      {fx.length > 0 && (
        <section>
          <DataTable
            title="Foreign Exchange — Detailed View"
            items={fx}
            formatPrice={(n) => n.toFixed(4)}
          />
        </section>
      )}
    </>
  );

  /** Commodities — dedicated detail page */
  const renderCommodities = () => (
    <>
      {/* KPI cards */}
      {commodities.length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {commodities.map((item) => (
              <KpiCard
                key={item.symbol}
                name={item.name}
                symbol={item.symbol}
                close={item.close}
                changePct={item.change_pct}
                history={item.history}
              />
            ))}
          </div>
        </section>
      )}

      {/* Large chart with commodity price trends */}
      {commodities.length > 0 && (
        <section>
          <MarketChart
            title="Commodity Price Trends — 30 Day"
            items={commodities}
            colors={["#ffc107", "#ff9100", "#00c853", "#2979ff", "#e040fb", "#00e5ff"]}
            height={420}
          />
        </section>
      )}

      {/* Bar chart for daily change */}
      {commodities.length > 0 && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CommodityBar
              title="Commodities — Daily Change"
              items={commodities}
            />
            <DataTable
              title="Commodities — Detailed View"
              items={commodities}
            />
          </div>
        </section>
      )}

      {/* Heatmap */}
      {commodities.length > 0 && (
        <section>
          <Heatmap items={commodities} />
        </section>
      )}
    </>
  );

  /** Crypto — dedicated detail page */
  const renderCrypto = () => (
    <>
      {/* KPI cards for all crypto */}
      {crypto.length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {crypto.map((item) => (
              <KpiCard
                key={item.symbol}
                name={item.name}
                symbol={item.symbol}
                close={item.close}
                changePct={item.change_pct}
                history={item.history}
              />
            ))}
          </div>
        </section>
      )}

      {/* Large chart with BTC/ETH trends */}
      {crypto.length > 0 && (
        <section>
          <MarketChart
            title="Crypto — 30 Day Trend"
            items={crypto}
            colors={["#ff9100", "#2979ff", "#00c853", "#e040fb", "#00e5ff", "#ffc107"]}
            height={420}
          />
        </section>
      )}

      {/* Individual charts if multiple coins */}
      {crypto.length > 1 && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {crypto.slice(0, 2).map((coin, idx) => (
              <MarketChart
                key={coin.symbol}
                title={`${coin.name} — 30 Day Price`}
                items={[coin]}
                colors={[["#ff9100", "#2979ff"][idx]]}
                normalized={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* Data table */}
      {crypto.length > 0 && (
        <section>
          <DataTable title="Cryptocurrency — Detailed View" items={crypto} />
        </section>
      )}

      {/* Heatmap */}
      {crypto.length > 0 && (
        <section>
          <Heatmap items={crypto} />
        </section>
      )}
    </>
  );

  /** Reports — daily briefs and archive */
  const renderReports = () => (
    <>
      {reportsData?.daily_report && (
        <section>
          <DailyReport report={reportsData.daily_report} />
        </section>
      )}
      {reportsData?.report_archive && (
        <section>
          <ReportArchive entries={reportsData.report_archive} />
        </section>
      )}
      {!reportsData && (
        <section>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted">No reports data available.</p>
          </div>
        </section>
      )}
    </>
  );

  /** Data Quality — monitoring dashboard */
  const qualityTabs = [
    { id: "scorecard", label: "Scorecard" },
    { id: "freshness", label: "Freshness" },
    { id: "coverage", label: "Coverage" },
    { id: "checks", label: "Checks" },
    { id: "tables", label: "Tables" },
  ];

  const renderQuality = () => {
    if (!qualityData) {
      return (
        <section>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-sm text-muted">No quality data available.</p>
          </div>
        </section>
      );
    }

    const checks = qualityData.checks ?? [];
    const passCount = checks.filter((c: { status: string }) => c.status === "pass").length;
    const warnCount = checks.filter((c: { status: string }) => c.status === "warn").length;
    const failCount = checks.filter((c: { status: string }) => c.status === "fail").length;

    // Stage check counts for workflow banner
    const stageChecks = {
      collect: checks.filter((c: { category: string }) => c.category === "completeness").length,
      validate: checks.filter((c: { category: string }) => c.category === "validity").length,
      store: checks.filter((c: { category: string }) => c.category === "consistency").length,
      serve: Object.keys(qualityData.tables ?? {}).length,
      monitor: (qualityData.freshness ?? []).length,
    };

    return (
      <>
        {/* Workflow banner */}
        <section>
          <div className="bg-card border border-border rounded-lg p-4 animate-fade-in">
            <div className="flex items-center justify-center gap-0 flex-wrap">
              {(
                [
                  { key: "collect", label: "Collect" },
                  { key: "validate", label: "Validate" },
                  { key: "store", label: "Store" },
                  { key: "serve", label: "Serve" },
                  { key: "monitor", label: "Monitor" },
                ] as const
              ).map((stage, i) => (
                <React.Fragment key={stage.key}>
                  {i > 0 && (
                    <svg width="24" height="16" viewBox="0 0 24 16" className="text-muted flex-shrink-0">
                      <path d="M0 8 L18 8 M14 3 L20 8 L14 13" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                  <div className="flex flex-col items-center px-3 py-2 border border-border rounded-md bg-background min-w-[80px]">
                    <span className="text-[10px] text-muted uppercase tracking-wide">{stage.label}</span>
                    <span className="text-sm font-semibold text-foreground font-mono mt-0.5">
                      {stageChecks[stage.key]}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Tab navigation */}
        <section>
          <TabNav tabs={qualityTabs} activeTab={activeQualityTab} onChange={setActiveQualityTab} />
        </section>

        {/* Tab content */}
        {activeQualityTab === "scorecard" && (
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <QualityScorecard
                score={qualityData.overall_score}
                generatedAt={qualityData.generated_at}
                passCount={passCount}
                warnCount={warnCount}
                failCount={failCount}
              />
              <div className="lg:col-span-2">
                <CoverageMatrix coverage={qualityData.coverage} />
              </div>
            </div>
          </section>
        )}

        {activeQualityTab === "freshness" && (
          <section>
            <FreshnessTable items={qualityData.freshness} />
          </section>
        )}

        {activeQualityTab === "coverage" && (
          <section>
            <CoverageMatrix coverage={qualityData.coverage} />
          </section>
        )}

        {activeQualityTab === "checks" && (
          <section>
            <QualityChecks checks={qualityData.checks} />
          </section>
        )}

        {activeQualityTab === "tables" && (
          <section>
            <TableStats tables={qualityData.tables} />
          </section>
        )}
      </>
    );
  };

  /** Architecture — data modeling showcase */
  const archTabs = [
    { id: "star-schema", label: "Star Schema" },
    { id: "semantic-layer", label: "Semantic Layer" },
    { id: "data-lineage", label: "Data Lineage" },
    { id: "tech-stack", label: "Tech Stack" },
  ];

  const renderArchitecture = () => (
    <>
      <section>
        <TabNav tabs={archTabs} activeTab={activeArchTab} onChange={setActiveArchTab} />
      </section>
      <section>
        {activeArchTab === "star-schema" && <StarSchemaViz />}
        {activeArchTab === "semantic-layer" && <SemanticLayerViz />}
        {activeArchTab === "data-lineage" && <DataLineageViz />}
        {activeArchTab === "tech-stack" && <TechStackViz />}
      </section>
    </>
  );

  /* ──────────────────────────────────────────
     Section router
     ────────────────────────────────────────── */
  const renderSection = () => {
    switch (activeSection) {
      case "cn-markets":
        return renderCnMarkets();
      case "global":
        return renderGlobal();
      case "fx":
        return renderFx();
      case "commodities":
        return renderCommodities();
      case "crypto":
        return renderCrypto();
      case "reports":
        return renderReports();
      case "quality":
        return renderQuality();
      case "architecture":
        return renderArchitecture();
      case "overview":
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        date={data?.date ?? ""}
        generatedAt={data?.generated_at}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isRefreshing={isRefreshing}
        refreshCountdown={isMarketSection ? formatCountdown(countdown) : undefined}
        showRefresh={isMarketSection}
      />
      <Sidebar
        open={sidebarOpen}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main
        className={`pt-14 ${sidebarWidth} transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 lg:p-6 max-w-[1800px] mx-auto space-y-5">
          {/* Page title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                {meta.title}
              </h1>
              <p className="text-xs text-secondary mt-0.5">
                {meta.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {data?.generated_at && (
                <span className="text-[10px] text-muted font-mono hidden md:inline">
                  {t("header.updated")}: {data.generated_at}
                </span>
              )}
              {isMarketSection && (
                <span className="text-[10px] text-muted font-mono hidden md:inline">
                  {t("header.nextRefresh")} {formatCountdown(countdown)}
                </span>
              )}
              {isMarketSection && (
                <button
                  onClick={handleManualRefresh}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-border text-xs text-secondary hover:text-foreground hover:border-border-hover transition-colors ${
                    isRefreshing ? "animate-pulse" : ""
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isRefreshing ? "animate-spin" : ""}
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  {isRefreshing ? t("header.refreshing") : t("header.refresh")}
                </button>
              )}
            </div>
          </div>

          {loading && <LoadingSkeleton />}
          {error && <ErrorState message={error} onRetry={fetchData} />}

          {!loading && !error && data && renderSection()}
          {!loading && !data && !error && (activeSection === "quality" || activeSection === "architecture") && renderSection()}

          {/* Footer */}
          <footer className="text-center py-6 border-t border-border">
            <p className="text-[10px] text-muted uppercase tracking-wider">
              {t("footer.disclaimer")}
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
