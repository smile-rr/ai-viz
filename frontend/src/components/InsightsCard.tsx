"use client";

import React, { useMemo } from "react";
import type { MarketItem } from "@/types/market";

interface InsightsCardProps {
  cnIndices: MarketItem[];
  globalIndices: MarketItem[];
  fx: MarketItem[];
  commodities: MarketItem[];
  crypto: MarketItem[];
}

interface Insight {
  type: "bearish" | "bullish" | "neutral";
  text: string;
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

  // 1. Consecutive moves: check if last 3+ history points move in the same direction
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
        text: `${item.name} ${lastDir === "up" ? "advanced" : "declined"} for ${streak} consecutive sessions`,
        asset: item.name,
        symbol: item.symbol,
      });
    }
  }

  // 2. Biggest mover (largest absolute change_pct)
  if (all.length > 0) {
    const sorted = [...all].sort(
      (a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct)
    );
    const biggest = sorted[0];
    const label =
      biggest.change_pct >= 0 ? "biggest gainer" : "biggest loser";
    insights.push({
      type: biggest.change_pct >= 0 ? "bullish" : "bearish",
      text: `${biggest.name} was the ${label} at ${biggest.change_pct >= 0 ? "+" : ""}${biggest.change_pct.toFixed(2)}%`,
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
    const closeToHigh =
      (histMax - item.close) / histMax < 0.02 && item.close <= histMax;
    const closeToLow =
      (item.close - histMin) / histMin < 0.02 && item.close >= histMin;

    if (item.close > histMax) {
      insights.push({
        type: "bullish",
        text: `${item.name} broke above its 30-day high at ${item.close.toLocaleString()}`,
        asset: item.name,
        symbol: item.symbol,
      });
    } else if (closeToHigh) {
      insights.push({
        type: "bullish",
        text: `${item.name} is trading near its 30-day high`,
        asset: item.name,
        symbol: item.symbol,
      });
    }

    if (item.close < histMin) {
      insights.push({
        type: "bearish",
        text: `${item.name} fell below its 30-day low at ${item.close.toLocaleString()}`,
        asset: item.name,
        symbol: item.symbol,
      });
    } else if (closeToLow) {
      insights.push({
        type: "bearish",
        text: `${item.name} is trading near its 30-day low`,
        asset: item.name,
        symbol: item.symbol,
      });
    }
  }

  // 4. Divergence: CN down but US up, or vice versa
  if (cnIndices.length > 0 && globalIndices.length > 0) {
    const cnAvg =
      cnIndices.reduce((s, i) => s + i.change_pct, 0) / cnIndices.length;
    const usItems = globalIndices.filter((i) =>
      ["^GSPC", "^DJI", "^IXIC"].includes(i.symbol)
    );
    const usAvg =
      usItems.length > 0
        ? usItems.reduce((s, i) => s + i.change_pct, 0) / usItems.length
        : globalIndices.reduce((s, i) => s + i.change_pct, 0) /
          globalIndices.length;

    if (cnAvg < -0.3 && usAvg > 0.3) {
      insights.push({
        type: "neutral",
        text: `Market divergence: China markets down (avg ${cnAvg.toFixed(2)}%) while US markets up (avg +${usAvg.toFixed(2)}%)`,
        asset: "CN vs US",
        symbol: "DIVERGENCE",
      });
    } else if (cnAvg > 0.3 && usAvg < -0.3) {
      insights.push({
        type: "neutral",
        text: `Market divergence: China markets up (avg +${cnAvg.toFixed(2)}%) while US markets down (avg ${usAvg.toFixed(2)}%)`,
        asset: "CN vs US",
        symbol: "DIVERGENCE",
      });
    }
  }

  // 5. Volatility spike: today's change > 2x average absolute change over history
  for (const item of all) {
    if (item.history.length < 5) continue;
    const h = item.history;
    const dailyChanges: number[] = [];
    for (let i = 1; i < h.length; i++) {
      if (h[i - 1] !== 0) {
        dailyChanges.push(Math.abs((h[i] - h[i - 1]) / h[i - 1]) * 100);
      }
    }
    if (dailyChanges.length === 0) continue;
    const avgChange =
      dailyChanges.reduce((s, v) => s + v, 0) / dailyChanges.length;
    if (avgChange > 0 && Math.abs(item.change_pct) > 2 * avgChange) {
      insights.push({
        type: item.change_pct >= 0 ? "bullish" : "bearish",
        text: `${item.name} volatility spike: ${Math.abs(item.change_pct).toFixed(2)}% move vs ${avgChange.toFixed(2)}% avg`,
        asset: item.name,
        symbol: item.symbol,
      });
    }
  }

  return insights;
}

const DOT_COLORS: Record<Insight["type"], string> = {
  bearish: "#ff1744",
  bullish: "#00c853",
  neutral: "#2979ff",
};

export default function InsightsCard({
  cnIndices,
  globalIndices,
  fx,
  commodities,
  crypto,
}: InsightsCardProps) {
  const insights = useMemo(
    () => generateInsights(cnIndices, globalIndices, fx, commodities, crypto),
    [cnIndices, globalIndices, fx, commodities, crypto]
  );

  // Show 4-6 insights, deduplicate by symbol+type, prioritize variety
  const displayed = useMemo(() => {
    const seen = new Set<string>();
    const result: Insight[] = [];
    for (const ins of insights) {
      const key = `${ins.symbol}-${ins.type}-${ins.text.substring(0, 30)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(ins);
      if (result.length >= 6) break;
    }
    return result;
  }, [insights]);

  if (displayed.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-fade-in">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Market Insights
      </h3>
      <div className="space-y-2">
        {displayed.map((ins, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 py-1.5 border-b border-border/50 last:border-b-0"
          >
            <span
              className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: DOT_COLORS[ins.type] }}
            />
            <div className="min-w-0">
              <p className="text-xs text-secondary leading-relaxed">
                {ins.text}
              </p>
              <span className="text-[10px] text-muted font-mono">
                {ins.symbol}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
