"use client";

import React, { useMemo } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { MarketItem } from "@/types/market";

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

interface MarketChartProps {
  title: string;
  items: MarketItem[];
  colors?: string[];
  height?: number;
  normalized?: boolean;
}

const DEFAULT_COLORS = ["#2979ff", "#00c853", "#ff9100", "#e040fb", "#00e5ff", "#ffc107"];

export default function MarketChart({
  title,
  items,
  colors = DEFAULT_COLORS,
  height = 320,
  normalized: forceNormalized,
}: MarketChartProps) {
  const option = useMemo(() => {
    if (!items.length) return {};

    const days = items[0]?.history.length || 30;
    const xData = Array.from({ length: days }, (_, i) => `D-${days - i}`);

    // Auto-detect if normalization needed: when max/min ratio > 3x
    const closes = items.map((i) => i.close).filter(Boolean);
    const maxClose = Math.max(...closes);
    const minClose = Math.min(...closes);
    const shouldNormalize = forceNormalized ?? (maxClose / (minClose || 1) > 3);

    return {
      backgroundColor: "transparent",
      grid: {
        top: 45,
        right: 16,
        bottom: 30,
        left: 12,
        containLabel: true,
      },
      legend: {
        top: 5,
        right: 0,
        textStyle: { color: "#8b8fa3", fontSize: 11 },
        icon: "roundRect",
        itemWidth: 12,
        itemHeight: 3,
        itemGap: 16,
      },
      tooltip: {
        trigger: "axis" as const,
        backgroundColor: "#1a1d2e",
        borderColor: "#2a2f45",
        textStyle: { color: "#e8eaed", fontSize: 12 },
        axisPointer: {
          type: "cross" as const,
          lineStyle: { color: "#2a2f45" },
          crossStyle: { color: "#2a2f45" },
          label: { backgroundColor: "#1a1d2e", color: "#8b8fa3", fontSize: 10 },
        },
        formatter: (params: Array<{ seriesName: string; value: number; color: string; marker: string; dataIndex: number; seriesIndex: number }>) => {
          if (!Array.isArray(params)) return "";
          return params
            .map((p) => {
              if (shouldNormalize) {
                // Show both percentage change and actual price
                const item = items[p.seriesIndex];
                const actualPrice = item?.history[p.dataIndex];
                const formatted = actualPrice != null
                  ? actualPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : "-";
                return `${p.marker} <span style="color:#8b8fa3">${p.seriesName}</span>&nbsp;&nbsp;<b>${p.value >= 0 ? "+" : ""}${p.value.toFixed(2)}%</b> <span style="color:#5a5e72">(${formatted})</span>`;
              }
              return `${p.marker} <span style="color:#8b8fa3">${p.seriesName}</span>&nbsp;&nbsp;<b>${
                typeof p.value === "number" ? p.value.toLocaleString("en-US", { minimumFractionDigits: 2 }) : p.value
              }</b>`;
            })
            .join("<br/>");
        },
      },
      xAxis: {
        type: "category" as const,
        data: xData,
        axisLine: { lineStyle: { color: "#1e2235" } },
        axisTick: { show: false },
        axisLabel: {
          color: "#5a5e72",
          fontSize: 10,
          interval: Math.floor(days / 6),
        },
      },
      yAxis: {
        type: "value" as const,
        splitLine: { lineStyle: { color: "#1e2235", type: "dashed" as const } },
        axisLabel: {
          color: "#5a5e72",
          fontSize: 10,
          formatter: shouldNormalize
            ? (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`
            : (v: number) => {
                if (v >= 10000) return (v / 1000).toFixed(0) + "k";
                return v.toLocaleString();
              },
        },
        scale: true,
      },
      series: items.map((item, idx) => {
        let data: number[];
        if (shouldNormalize && item.history.length > 0) {
          const base = item.history[0] || 1;
          data = item.history.map((v) => +((v / base - 1) * 100).toFixed(4));
        } else {
          data = item.history;
        }

        return {
          name: item.name,
          type: "line" as const,
          data,
          smooth: true,
          symbol: "none",
          lineStyle: { width: 2, color: colors[idx % colors.length] },
          emphasis: {
            lineStyle: { width: 3 },
          },
        };
      }),
    };
  }, [items, colors, forceNormalized]);

  const subtitle = useMemo(() => {
    const closes = items.map((i) => i.close).filter(Boolean);
    const maxClose = Math.max(...closes);
    const minClose = Math.min(...closes);
    return (maxClose / (minClose || 1) > 3) ? "(Normalized %)" : "";
  }, [items]);

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-baseline gap-2">
        <div className="section-title">{title}</div>
        {subtitle && <span className="text-[10px] text-muted">{subtitle}</span>}
      </div>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height: `${height}px`, width: "100%" }}
        opts={{ renderer: "canvas" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
