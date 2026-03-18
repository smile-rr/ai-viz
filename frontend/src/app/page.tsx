"use client";

import React, { useEffect, useState, useCallback } from "react";
import type { MarketData, MarketItem } from "@/types/market";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import KpiCard from "@/components/KpiCard";
import MarketChart from "@/components/MarketChart";
import DataTable from "@/components/DataTable";
import CommodityBar from "@/components/CommodityBar";
import Heatmap from "@/components/Heatmap";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";

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
   Section metadata
   ──────────────────────────────────────────────── */
const SECTION_META: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: "Market Overview",
    subtitle: "Global financial markets at a glance",
  },
  "cn-markets": {
    title: "China Markets",
    subtitle: "Shanghai, Shenzhen & Hong Kong indices — performance and trends",
  },
  global: {
    title: "Global Markets",
    subtitle: "Major world indices — S&P 500, Dow Jones, NASDAQ, Nikkei and more",
  },
  fx: {
    title: "Foreign Exchange",
    subtitle: "Major currency pair rates and 30-day trends",
  },
  commodities: {
    title: "Commodities",
    subtitle: "Gold, oil, silver and other commodity price movements",
  },
  crypto: {
    title: "Cryptocurrency",
    subtitle: "Bitcoin, Ethereum and digital asset market data",
  },
};

export default function Home() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/data/market_summary.json");
      if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
      const json: MarketData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error loading data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  const meta = SECTION_META[activeSection] ?? SECTION_META.overview;

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
      case "overview":
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        date={data?.date ?? ""}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
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
                  Updated: {data.generated_at}
                </span>
              )}
              <button
                onClick={fetchData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-border text-xs text-secondary hover:text-foreground hover:border-border-hover transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {loading && <LoadingSkeleton />}
          {error && <ErrorState message={error} onRetry={fetchData} />}

          {!loading && !error && data && renderSection()}

          {/* Footer */}
          <footer className="text-center py-6 border-t border-border">
            <p className="text-[10px] text-muted uppercase tracking-wider">
              AI-VIZ Market Intelligence Terminal &middot; Data: AKShare &middot; Yahoo Finance &middot; Tushare &middot; For informational purposes only
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
