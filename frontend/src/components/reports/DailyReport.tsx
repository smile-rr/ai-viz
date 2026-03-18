"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

interface Highlight {
  type: "bullish" | "bearish" | "neutral";
  text: string;
}

interface Mover {
  name: string;
  symbol: string;
  change_pct: number;
}

interface DailyReportData {
  date: string;
  generated_at: string;
  summary: string;
  highlights: Highlight[];
  market_movers: {
    top_gainers: Mover[];
    top_losers: Mover[];
  };
}

interface DailyReportProps {
  report: DailyReportData;
}

const highlightIcon: Record<string, React.ReactNode> = {
  bullish: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  bearish: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  neutral: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

export default function DailyReport({ report }: DailyReportProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-5">
      {/* Report Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-1 h-5 bg-blue-500 rounded-full" />
              <h2 className="text-lg font-semibold tracking-tight">{t("report.dailyBrief")}</h2>
            </div>
            <p className="text-xs text-muted font-mono ml-3">{report.date}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-muted block">{t("report.generated")}</span>
            <span className="text-xs text-secondary font-mono">{report.generated_at}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#0a0a12] border border-border/50 rounded-md p-4 mb-5">
          <div className="text-[10px] uppercase tracking-wider text-muted mb-2">{t("report.executiveSummary")}</div>
          <p className="text-sm text-secondary leading-relaxed">{report.summary}</p>
        </div>

        {/* Highlights */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-3">{t("report.keyHighlights")}</div>
          <div className="space-y-2">
            {report.highlights.map((h, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-md border ${
                  h.type === "bullish"
                    ? "border-green-500/20 bg-green-500/5"
                    : h.type === "bearish"
                    ? "border-red-500/20 bg-red-500/5"
                    : "border-border bg-card"
                }`}
              >
                <span className="flex-shrink-0 mt-0.5">{highlightIcon[h.type]}</span>
                <span className="text-sm text-secondary">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Gainers */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-400">{t("report.topGainers")}</span>
          </div>
          <div className="space-y-0">
            {report.market_movers.top_gainers.map((m, i) => (
              <div
                key={m.symbol}
                className={`flex items-center justify-between py-3 ${
                  i < report.market_movers.top_gainers.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div>
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-[10px] text-muted font-mono">{m.symbol}</div>
                </div>
                <span className="text-sm font-mono font-semibold text-green-400">
                  +{m.change_pct.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">{t("report.topLosers")}</span>
          </div>
          <div className="space-y-0">
            {report.market_movers.top_losers.map((m, i) => (
              <div
                key={m.symbol}
                className={`flex items-center justify-between py-3 ${
                  i < report.market_movers.top_losers.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div>
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-[10px] text-muted font-mono">{m.symbol}</div>
                </div>
                <span className="text-sm font-mono font-semibold text-red-400">
                  {m.change_pct.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
