"use client";

import React from "react";

interface TechItem {
  name: string;
  description: string;
  highlight?: boolean;
}

interface StackLayer {
  label: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  items: TechItem[];
}

const stackLayers: StackLayer[] = [
  {
    label: "Presentation",
    labelEn: "展示层",
    color: "#00e5ff",
    bgColor: "rgba(0,229,255,0.06)",
    borderColor: "rgba(0,229,255,0.2)",
    items: [
      { name: "Next.js 15", description: "React SSG framework", highlight: true },
      { name: "ECharts 5", description: "Interactive charting" },
      { name: "Tailwind CSS 4", description: "Utility-first styling" },
      { name: "TypeScript", description: "Type-safe frontend" },
    ],
  },
  {
    label: "Semantic",
    labelEn: "语义层",
    color: "#e040fb",
    bgColor: "rgba(224,64,251,0.06)",
    borderColor: "rgba(224,64,251,0.2)",
    items: [
      { name: "metrics.yml", description: "Metric definitions", highlight: true },
      { name: "lineage.yml", description: "Data lineage config" },
      { name: "dimensions.yml", description: "Dimension hierarchies" },
    ],
  },
  {
    label: "Processing",
    labelEn: "处理层",
    color: "#2979ff",
    bgColor: "rgba(41,121,255,0.06)",
    borderColor: "rgba(41,121,255,0.2)",
    items: [
      { name: "Polars", description: "DataFrame processing", highlight: true },
      { name: "DuckDB", description: "Analytical SQL engine", highlight: true },
      { name: "Python 3.12", description: "Pipeline orchestration" },
    ],
  },
  {
    label: "Storage",
    labelEn: "存储层",
    color: "#00c853",
    bgColor: "rgba(0,200,83,0.06)",
    borderColor: "rgba(0,200,83,0.2)",
    items: [
      { name: "Turso", description: "Cloud SQLite (libSQL)", highlight: true },
      { name: "Parquet", description: "Local columnar files" },
      { name: "JSON", description: "Dashboard serving layer" },
    ],
  },
  {
    label: "Collection",
    labelEn: "采集层",
    color: "#ffc107",
    bgColor: "rgba(255,193,7,0.06)",
    borderColor: "rgba(255,193,7,0.2)",
    items: [
      { name: "AKShare", description: "CN market data API" },
      { name: "yfinance", description: "Global market data" },
      { name: "Tushare", description: "CN financial data" },
    ],
  },
  {
    label: "CI / CD",
    labelEn: "部署层",
    color: "#ff5252",
    bgColor: "rgba(255,82,82,0.06)",
    borderColor: "rgba(255,82,82,0.2)",
    items: [
      { name: "GitHub Actions", description: "Scheduled pipelines", highlight: true },
      { name: "Cloudflare Pages", description: "Static site hosting" },
      { name: "Cron Jobs", description: "Daily data refresh" },
    ],
  },
];

export default function TechStackViz() {
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
          <h3 className="text-sm font-semibold">Technology Stack</h3>
          <p className="text-[10px] text-muted">6 layers, {stackLayers.reduce((s, l) => s + l.items.length, 0)} technologies</p>
        </div>
      </div>

      <div className="space-y-3">
        {stackLayers.map((layer, idx) => (
          <div
            key={layer.label}
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
                <span className="text-xs font-semibold" style={{ color: layer.color }}>{layer.label}</span>
                <span className="text-[10px] text-muted ml-2">{layer.labelEn}</span>
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
                  <div className="text-[10px] text-muted">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture principles */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-[10px] uppercase tracking-wider text-muted mb-3">Architecture Principles</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Batch-First", desc: "Daily ETL pipelines" },
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Schema-on-Write", desc: "Validated at ingestion" },
            { icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", label: "Static-First", desc: "Pre-built JSON serving" },
            { icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", label: "Layered DW", desc: "ODS > DWD > DWS" },
          ].map((p) => (
            <div key={p.label} className="rounded-md bg-card border border-border p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d={p.icon} />
                </svg>
                <span className="text-[11px] font-semibold text-foreground">{p.label}</span>
              </div>
              <div className="text-[10px] text-muted">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
