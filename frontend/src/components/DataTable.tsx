"use client";

import React, { useMemo } from "react";
import { useI18n } from "@/i18n/context";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { MarketItem } from "@/types/market";

echarts.use([LineChart, GridComponent, CanvasRenderer]);

interface DataTableProps {
  title: string;
  items: MarketItem[];
  formatPrice?: (n: number) => string;
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const color = positive ? "#00c853" : "#ff1744";
  const option = useMemo(
    () => ({
      grid: { top: 2, right: 0, bottom: 2, left: 0 },
      xAxis: { type: "category" as const, show: false, data: data.map((_, i) => i) },
      yAxis: {
        type: "value" as const,
        show: false,
        min: Math.min(...data) * 0.999,
        max: Math.max(...data) * 1.001,
      },
      series: [
        {
          type: "line" as const,
          data,
          smooth: true,
          symbol: "none",
          lineStyle: { width: 1.2, color },
        },
      ],
    }),
    [data, color]
  );

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: "24px", width: "60px" }}
      className="hidden sm:block"
      opts={{ renderer: "canvas" }}
      notMerge
      lazyUpdate
    />
  );
}

export default function DataTable({ title, items, formatPrice }: DataTableProps) {
  const { t } = useI18n();
  const fmt = (n: number) => {
    if (formatPrice) return formatPrice(n);
    if (n >= 1000) return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n.toFixed(n < 10 ? 4 : 2);
  };

  return (
    <div className="card p-4 animate-fade-in">
      <div className="section-title">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4">{t("table.col.name")}</th>
              <th className="text-right py-2 pr-4">{t("table.col.price")}</th>
              <th className="text-right py-2 pr-4">{t("table.col.chgPct")}</th>
              <th className="text-right py-2 hidden sm:table-cell">{t("table.col.trend30d")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isPositive = item.change_pct >= 0;
              const color = isPositive ? "#00c853" : "#ff1744";
              return (
                <tr
                  key={item.symbol}
                  className="border-b border-border/50 hover:bg-card-hover transition-colors"
                >
                  <td className="py-2.5 pr-4">
                    <div className="text-foreground text-xs font-medium">{item.name}</div>
                    <div className="text-[10px] text-muted font-mono">{item.symbol}</div>
                  </td>
                  <td className="text-right py-2.5 pr-4 font-mono text-xs text-foreground">
                    {fmt(item.close)}
                  </td>
                  <td className="text-right py-2.5 pr-4">
                    <span
                      className="inline-block px-1.5 py-0.5 rounded text-xs font-mono font-semibold"
                      style={{
                        color,
                        background: isPositive ? "rgba(0,200,83,0.1)" : "rgba(255,23,68,0.1)",
                      }}
                    >
                      {isPositive ? "+" : ""}
                      {item.change_pct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="text-right py-2.5 hidden sm:table-cell">
                    <div className="flex justify-end">
                      <MiniSparkline data={item.history} positive={isPositive} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
