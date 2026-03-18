"use client";

import React, { useMemo } from "react";
import type { MarketItem } from "@/types/market";
import { useI18n } from "@/i18n/context";

interface InsightsCardProps {
  cnIndices: MarketItem[];
  globalIndices: MarketItem[];
  fx: MarketItem[];
  commodities: MarketItem[];
  crypto: MarketItem[];
}

interface Insight {
  type: "bearish" | "bullish" | "neutral";
  textKey: string;
  params: Record<string, string>;
  asset: string;
  symbol: string;
}

function generateInsights(
  cnIndices: MarketItem[],
  globalIndices: MarketItem[],
  fx: MarketItem[],
  commodities: MarketItem[],
  crypto: MarketItem[]
): Insight[] {
  const all = [...cnIndices, ...globalIndices, ...fx, ...commodities, ...crypto];
  const insights: Insight[] = [];

  // 1. Consecutive moves
  for (const item of all) {
    if (item.history.length < 4) continue;
    const h = item.history;
    let streak = 1;
    const lastDir = h[h.length - 1] >= h[h.length - 2] ? "up" : "down";
    for (let i = h.length - 2; i >= 1; i--) {
      const dir = h[i] >= h[i - 1] ? "up" : "down";
      if (dir === lastDir) streak++;
      else break;
    }
    if (streak >= 3) {
      insights.push({
        type: lastDir === "up" ? "bullish" : "bearish",
        textKey: lastDir === "up" ? "insight.consecutive.up" : "insight.consecutive.down",
        params: { name: item.name, streak: String(streak) },
        asset: item.name,
        symbol: item.symbol,
      });
    }
  }

  // 2. Biggest mover
  if (all.length > 0) {
    const sorted = [...all].sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct));
    const biggest = sorted[0];
    insights.push({
      type: biggest.change_pct >= 0 ? "bullish" : "bearish",
      textKey: biggest.change_pct >= 0 ? "insight.biggestGainer" : "insight.biggestLoser",
      params: { name: biggest.name, pct: Math.abs(biggest.change_pct).toFixed(2) },
      asset: biggest.name,
      symbol: biggest.symbol,
    });
  }

  // 3. Near 30-day high/low
  for (const item of all) {
    if (item.history.length < 5) continue;
    const histMax = Math.max(...item.history);
    const histMin = Math.min(...item.history);
    if (histMax === 0) continue;

    if (item.close > histMax) {
      insights.push({
        type: "bullish",
        textKey: "insight.brokeHigh",
        params: { name: item.name, price: item.close.toLocaleString() },
        asset: item.name, symbol: item.symbol,
      });
    } else if ((histMax - item.close) / histMax < 0.02) {
      insights.push({
        type: "bullish", textKey: "insight.nearHigh",
        params: { name: item.name }, asset: item.name, symbol: item.symbol,
      });
    }

    if (item.close < histMin) {
      insights.push({
        type: "bearish", textKey: "insight.brokeLow",
        params: { name: item.name, price: item.close.toLocaleString() },
        asset: item.name, symbol: item.symbol,
      });
    } else if ((item.close - histMin) / histMin < 0.02) {
      insights.push({
        type: "bearish", textKey: "insight.nearLow",
        params: { name: item.name }, asset: item.name, symbol: item.symbol,
      });
    }
  }

  // 4. Divergence
  if (cnIndices.length > 0 && globalIndices.length > 0) {
    const cnAvg = cnIndices.reduce((s, i) => s + i.change_pct, 0) / cnIndices.length;
    const usItems = globalIndices.filter((i) => ["^GSPC", "^DJI", "^IXIC"].includes(i.symbol));
    const usAvg = usItems.length > 0
      ? usItems.reduce((s, i) => s + i.change_pct, 0) / usItems.length
      : globalIndices.reduce((s, i) => s + i.change_pct, 0) / globalIndices.length;

    if (cnAvg < -0.3 && usAvg > 0.3) {
      insights.push({
        type: "neutral", textKey: "insight.divergence.cnDown",
        params: { cnAvg: cnAvg.toFixed(2), usAvg: usAvg.toFixed(2) },
        asset: "CN vs US", symbol: "DIVERGENCE",
      });
    } else if (cnAvg > 0.3 && usAvg < -0.3) {
      insights.push({
        type: "neutral", textKey: "insight.divergence.cnUp",
        params: { cnAvg: cnAvg.toFixed(2), usAvg: usAvg.toFixed(2) },
        asset: "CN vs US", symbol: "DIVERGENCE",
      });
    }
  }

  // 5. Volatility spike
  for (const item of all) {
    if (item.history.length < 5) continue;
    const h = item.history;
    const changes: number[] = [];
    for (let i = 1; i < h.length; i++) {
      if (h[i - 1] !== 0) changes.push(Math.abs((h[i] - h[i - 1]) / h[i - 1]) * 100);
    }
    if (changes.length === 0) continue;
    const avg = changes.reduce((s, v) => s + v, 0) / changes.length;
    if (avg > 0 && Math.abs(item.change_pct) > 2 * avg) {
      insights.push({
        type: item.change_pct >= 0 ? "bullish" : "bearish",
        textKey: "insight.volatility",
        params: { name: item.name, changePct: Math.abs(item.change_pct).toFixed(2), avgChange: avg.toFixed(2) },
        asset: item.name, symbol: item.symbol,
      });
    }
  }

  return insights;
}

function interpolate(template: string, params: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, value);
  }
  return result;
}

const SIGNAL_STYLES = {
  bearish: {
    dot: "#ff1744",
    bg: "rgba(255, 23, 68, 0.08)",
    border: "rgba(255, 23, 68, 0.2)",
    arrow: "▼",
  },
  bullish: {
    dot: "#00c853",
    bg: "rgba(0, 200, 83, 0.08)",
    border: "rgba(0, 200, 83, 0.2)",
    arrow: "▲",
  },
  neutral: {
    dot: "#2979ff",
    bg: "rgba(41, 121, 255, 0.08)",
    border: "rgba(41, 121, 255, 0.2)",
    arrow: "●",
  },
};

export default function InsightsCard({
  cnIndices, globalIndices, fx, commodities, crypto,
}: InsightsCardProps) {
  const { t } = useI18n();

  const insights = useMemo(
    () => generateInsights(cnIndices, globalIndices, fx, commodities, crypto),
    [cnIndices, globalIndices, fx, commodities, crypto]
  );

  const displayed = useMemo(() => {
    const seen = new Set<string>();
    const result: Insight[] = [];
    for (const ins of insights) {
      const key = `${ins.symbol}-${ins.type}-${ins.textKey}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(ins);
      if (result.length >= 6) break;
    }
    return result;
  }, [insights]);

  if (displayed.length === 0) return null;

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1e2235",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#e8eaed" }}>
          {t("insights.title")}
        </span>
        <span style={{ fontSize: "11px", color: "#5a5e72", marginLeft: "auto" }}>
          {displayed.length} signals
        </span>
      </div>

      {/* Insights grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "10px" }}>
        {displayed.map((ins, i) => {
          const style = SIGNAL_STYLES[ins.type];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: "8px",
              }}
            >
              {/* Signal indicator */}
              <span style={{
                fontSize: "16px",
                color: style.dot,
                fontWeight: 700,
                width: "20px",
                textAlign: "center",
                flexShrink: 0,
              }}>
                {style.arrow}
              </span>

              {/* Content */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#e8eaed", lineHeight: 1.4 }}>
                  {interpolate(t(ins.textKey), ins.params)}
                </div>
                <div style={{
                  fontSize: "10px",
                  color: "#5a5e72",
                  fontFamily: "var(--font-geist-mono), monospace",
                  marginTop: "2px",
                }}>
                  {ins.symbol}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
