"use client";

import React, { useMemo } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

interface KpiCardProps {
  name: string;
  symbol: string;
  close: number;
  changePct: number;
  history: number[];
  formatPrice?: (n: number) => string;
}

export default function KpiCard({
  name,
  symbol,
  close,
  changePct,
  history,
  formatPrice,
}: KpiCardProps) {
  const isPositive = changePct >= 0;
  const color = isPositive ? "#00c853" : "#ff1744";
  const bgColor = isPositive ? "rgba(0,200,83,0.06)" : "rgba(255,23,68,0.06)";
  const borderColor = isPositive ? "rgba(0,200,83,0.15)" : "rgba(255,23,68,0.15)";

  const displayPrice = formatPrice
    ? formatPrice(close)
    : close >= 1000
    ? close.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : close.toFixed(close < 10 ? 4 : 2);

  const sparklineOption = useMemo(
    () => ({
      grid: { top: 2, right: 0, bottom: 2, left: 0 },
      xAxis: { type: "category" as const, show: false, data: history.map((_, i) => i) },
      yAxis: { type: "value" as const, show: false, min: Math.min(...history) * 0.999, max: Math.max(...history) * 1.001 },
      series: [
        {
          type: "line" as const,
          data: history,
          smooth: true,
          symbol: "none",
          lineStyle: { width: 1.5, color },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: isPositive ? "rgba(0,200,83,0.25)" : "rgba(255,23,68,0.25)" },
              { offset: 1, color: "rgba(0,0,0,0)" },
            ]),
          },
        },
      ],
      tooltip: { show: false },
    }),
    [history, color, isPositive]
  );

  return (
    <div
      className="card p-4 flex flex-col justify-between min-w-0 animate-fade-in"
      style={{ borderColor, background: bgColor }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <div className="text-xs text-secondary truncate">{name}</div>
          <div className="text-[10px] text-muted font-mono">{symbol}</div>
        </div>
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono font-semibold"
          style={{ color, background: isPositive ? "rgba(0,200,83,0.12)" : "rgba(255,23,68,0.12)" }}
        >
          {isPositive ? "+" : ""}
          {changePct.toFixed(2)}%
        </div>
      </div>

      <div className="text-lg font-semibold font-mono tracking-tight mb-2" style={{ color }}>
        {displayPrice}
      </div>

      <div className="h-10">
        <ReactEChartsCore
          echarts={echarts}
          option={sparklineOption}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "canvas" }}
          notMerge
          lazyUpdate
        />
      </div>
    </div>
  );
}
