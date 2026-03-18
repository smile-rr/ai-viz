"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

interface TechItem {
  name: string;
  descKey: string;
  highlight?: boolean;
}

interface StackLayer {
  labelKey: string;
  labelZhKey: string;
  color: string;
  bgColor: string;
  borderColor: string;
  items: TechItem[];
}

const stackLayers: StackLayer[] = [
  {
    labelKey: "techStack.layer.presentation",
    labelZhKey: "techStack.layerZh.presentation",
    color: "#00e5ff",
    bgColor: "rgba(0,229,255,0.06)",
    borderColor: "rgba(0,229,255,0.2)",
    items: [
      { name: "Next.js 15", descKey: "techStack.desc.nextjs", highlight: true },
      { name: "ECharts 5", descKey: "techStack.desc.echarts" },
      { name: "Tailwind CSS 4", descKey: "techStack.desc.tailwind" },
      { name: "TypeScript", descKey: "techStack.desc.typescript" },
    ],
  },
  {
    labelKey: "techStack.layer.semantic",
    labelZhKey: "techStack.layerZh.semantic",
    color: "#e040fb",
    bgColor: "rgba(224,64,251,0.06)",
    borderColor: "rgba(224,64,251,0.2)",
    items: [
      { name: "metrics.yml", descKey: "techStack.desc.metricsYml", highlight: true },
      { name: "lineage.yml", descKey: "techStack.desc.lineageYml" },
      { name: "dimensions.yml", descKey: "techStack.desc.dimensionsYml" },
    ],
  },
  {
    labelKey: "techStack.layer.processing",
    labelZhKey: "techStack.layerZh.processing",
    color: "#2979ff",
    bgColor: "rgba(41,121,255,0.06)",
    borderColor: "rgba(41,121,255,0.2)",
    items: [
      { name: "Polars", descKey: "techStack.desc.polars", highlight: true },
      { name: "DuckDB", descKey: "techStack.desc.duckdb", highlight: true },
      { name: "Python 3.12", descKey: "techStack.desc.python" },
    ],
  },
  {
    labelKey: "techStack.layer.storage",
    labelZhKey: "techStack.layerZh.storage",
    color: "#00c853",
    bgColor: "rgba(0,200,83,0.06)",
    borderColor: "rgba(0,200,83,0.2)",
    items: [
      { name: "Turso", descKey: "techStack.desc.turso", highlight: true },
      { name: "Parquet", descKey: "techStack.desc.parquet" },
      { name: "JSON", descKey: "techStack.desc.json" },
    ],
  },
  {
    labelKey: "techStack.layer.collection",
    labelZhKey: "techStack.layerZh.collection",
    color: "#ffc107",
    bgColor: "rgba(255,193,7,0.06)",
    borderColor: "rgba(255,193,7,0.2)",
    items: [
      { name: "AKShare", descKey: "techStack.desc.akshare" },
      { name: "yfinance", descKey: "techStack.desc.yfinance" },
      { name: "Tushare", descKey: "techStack.desc.tushare" },
    ],
  },
  {
    labelKey: "techStack.layer.cicd",
    labelZhKey: "techStack.layerZh.cicd",
    color: "#ff5252",
    bgColor: "rgba(255,82,82,0.06)",
    borderColor: "rgba(255,82,82,0.2)",
    items: [
      { name: "GitHub Actions", descKey: "techStack.desc.githubActions", highlight: true },
      { name: "Cloudflare Pages", descKey: "techStack.desc.cloudflare" },
      { name: "Cron Jobs", descKey: "techStack.desc.cron" },
    ],
  },
];

export default function TechStackViz() {
  const { t } = useI18n();
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#ff5252]/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold">{t("techStack.title")}</h3>
          <p className="text-[10px] text-muted">{t("techStack.subtitle").replace("{count}", String(stackLayers.reduce((s, l) => s + l.items.length, 0)))}</p>
        </div>
      </div>

      <div className="space-y-3">
        {stackLayers.map((layer, idx) => (
          <div
            key={layer.labelKey}
            className="rounded-lg border p-4 transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: layer.bgColor,
              borderColor: layer.borderColor,
              animationDelay: `${idx * 80}ms`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              {/* Layer number */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ backgroundColor: layer.bgColor, border: `1.5px solid ${layer.borderColor}`, color: layer.color }}
              >
                {idx + 1}
              </div>
              <div>
                <span className="text-xs font-semibold" style={{ color: layer.color }}>{t(layer.labelKey)}</span>
                <span className="text-[10px] text-muted ml-2">{t(layer.labelZhKey)}</span>
              </div>
              {/* Connector line down */}
              {idx < stackLayers.length - 1 && (
                <div className="ml-auto hidden lg:flex items-center gap-1">
                  <div className="h-px w-8" style={{ backgroundColor: layer.borderColor }} />
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={layer.color} strokeWidth="3">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {layer.items.map((item) => (
                <div
                  key={item.name}
                  className={`rounded-md bg-[#0a0a0f]/60 border p-3 transition-all duration-200 hover:border-opacity-60 ${
                    item.highlight ? "border-opacity-50" : "border-opacity-20"
                  }`}
                  style={{ borderColor: item.highlight ? layer.color : "var(--border-color)" }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.highlight && (
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: layer.color, boxShadow: `0 0 6px ${layer.color}` }} />
                    )}
                    <span className="text-[11px] font-semibold text-foreground">{item.name}</span>
                  </div>
                  <div className="text-[10px] text-muted">{t(item.descKey)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture principles */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-[10px] uppercase tracking-wider text-muted mb-3">{t("techStack.principles")}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", labelKey: "techStack.principle.batchFirst", descKey: "techStack.principle.batchFirst.desc" },
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", labelKey: "techStack.principle.schemaOnWrite", descKey: "techStack.principle.schemaOnWrite.desc" },
            { icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", labelKey: "techStack.principle.staticFirst", descKey: "techStack.principle.staticFirst.desc" },
            { icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", labelKey: "techStack.principle.layeredDW", descKey: "techStack.principle.layeredDW.desc" },
          ].map((p) => (
            <div key={p.labelKey} className="rounded-md bg-card border border-border p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d={p.icon} />
                </svg>
                <span className="text-[11px] font-semibold text-foreground">{t(p.labelKey)}</span>
              </div>
              <div className="text-[10px] text-muted">{t(p.descKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
