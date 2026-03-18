"use client";

import React, { useMemo } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { MarketItem } from "@/types/market";

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

interface CommodityBarProps {
  title: string;
  items: MarketItem[];
}

export default function CommodityBar({ title, items }: CommodityBarProps) {
  const option = useMemo(() => {
    return {
      backgroundColor: "transparent",
      grid: {
        top: 10,
        right: 40,
        bottom: 10,
        left: 10,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis" as const,
        backgroundColor: "#1a1d2e",
        borderColor: "#2a2f45",
        textStyle: { color: "#e8eaed", fontSize: 12 },
        formatter: (params: Array<{ name: string; value: number; marker: string }>) => {
          if (!Array.isArray(params) || !params[0]) return "";
          const p = params[0];
          return `${p.marker} ${p.name}&nbsp;&nbsp;<b>${p.value >= 0 ? "+" : ""}${p.value.toFixed(2)}%</b>`;
        },
      },
      xAxis: {
        type: "value" as const,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#1e2235", type: "dashed" as const } },
        axisLabel: {
          color: "#5a5e72",
          fontSize: 10,
          formatter: (v: number) => `${v}%`,
        },
      },
      yAxis: {
        type: "category" as const,
        data: items.map((i) => i.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#8b8fa3", fontSize: 11 },
      },
      series: [
        {
          type: "bar" as const,
          data: items.map((i) => ({
            value: i.change_pct,
            itemStyle: {
              color: i.change_pct >= 0
                ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "rgba(0,200,83,0.3)" },
                    { offset: 1, color: "#00c853" },
                  ])
                : new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: "rgba(255,23,68,0.3)" },
                    { offset: 1, color: "#ff1744" },
                  ]),
              borderRadius: [0, 3, 3, 0],
            },
          })),
          barWidth: 18,
          label: {
            show: true,
            position: "right" as const,
            color: "#8b8fa3",
            fontSize: 10,
            formatter: (p: { value: number }) => `${p.value >= 0 ? "+" : ""}${p.value.toFixed(2)}%`,
          },
        },
      ],
    };
  }, [items]);

  return (
    <div className="card p-4 animate-fade-in">
      <div className="section-title">{title}</div>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height: `${Math.max(items.length * 50, 160)}px`, width: "100%" }}
        opts={{ renderer: "canvas" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
