"use client";

import React from "react";
import type { MarketItem } from "@/types/market";
import { useI18n } from "@/i18n/context";

interface HeatmapProps {
  items: MarketItem[];
}

function getHeatColor(pct: number): string {
  if (pct >= 3) return "#00c853";
  if (pct >= 2) return "#00b248";
  if (pct >= 1) return "#009e3d";
  if (pct >= 0.5) return "#2e7d32";
  if (pct >= 0) return "#1b5e20";
  if (pct >= -0.5) return "#b71c1c";
  if (pct >= -1) return "#c62828";
  if (pct >= -2) return "#d32f2f";
  if (pct >= -3) return "#e53935";
  return "#ff1744";
}

function getTextColor(pct: number): string {
  const abs = Math.abs(pct);
  return abs >= 1 ? "#ffffff" : "#e8eaed";
}

function getCellSize(item: MarketItem, allItems: MarketItem[]): number {
  // Size based on relative market value (use close as proxy)
  const maxClose = Math.max(...allItems.map((i) => i.close));
  const minSize = 1;
  const maxSize = 4;
  const ratio = Math.log(item.close + 1) / Math.log(maxClose + 1);
  return minSize + ratio * (maxSize - minSize);
}

export default function Heatmap({ items }: HeatmapProps) {
  const { t } = useI18n();
  const sorted = [...items].sort((a, b) => b.change_pct - a.change_pct);

  return (
    <div className="card p-4 animate-fade-in">
      <div className="section-title">{t("heatmap.title")}</div>

      <div className="flex flex-wrap gap-1.5">
        {sorted.map((item) => {
          const bg = getHeatColor(item.change_pct);
          const textColor = getTextColor(item.change_pct);
          const size = getCellSize(item, items);

          return (
            <div
              key={item.symbol}
              className="rounded-md flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-default"
              style={{
                background: bg,
                minWidth: `${60 + size * 20}px`,
                height: `${50 + size * 10}px`,
                flex: `${size} 1 ${60 + size * 20}px`,
              }}
              title={`${item.name} (${item.symbol}): ${item.close.toLocaleString()} | ${item.change_pct >= 0 ? "+" : ""}${item.change_pct.toFixed(2)}%`}
            >
              <div
                className="text-[10px] font-semibold truncate max-w-full px-1"
                style={{ color: textColor }}
              >
                {item.name}
              </div>
              <div
                className="text-sm font-bold font-mono"
                style={{ color: textColor }}
              >
                {item.change_pct >= 0 ? "+" : ""}
                {item.change_pct.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 mt-4">
        <span className="text-[10px] text-muted mr-1">-3%</span>
        {[-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3].map((v) => (
          <div
            key={v}
            className="w-6 h-3 rounded-sm"
            style={{ background: getHeatColor(v) }}
          />
        ))}
        <span className="text-[10px] text-muted ml-1">+3%</span>
      </div>
    </div>
  );
}
