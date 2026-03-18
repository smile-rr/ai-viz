"use client";

import React, { useState, useEffect } from "react";

interface Metric {
  name: string;
  display_name: string;
  display_name_en: string;
  formula: string;
  unit: string;
  source_table: string;
  category: string;
}

interface Dimension {
  name: string;
  display_name: string;
  hierarchy?: string[];
  values: string[];
}

interface SemanticData {
  metrics: Metric[];
  dimensions: Dimension[];
}

const categoryMeta: Record<string, { label: string; labelEn: string; color: string; bgColor: string; borderColor: string }> = {
  price: { label: "价格", labelEn: "Price", color: "#2979ff", bgColor: "rgba(41,121,255,0.08)", borderColor: "rgba(41,121,255,0.25)" },
  valuation: { label: "估值", labelEn: "Valuation", color: "#e040fb", bgColor: "rgba(224,64,251,0.08)", borderColor: "rgba(224,64,251,0.25)" },
  flow: { label: "资金流", labelEn: "Flow", color: "#00c853", bgColor: "rgba(0,200,83,0.08)", borderColor: "rgba(0,200,83,0.25)" },
  macro: { label: "宏观", labelEn: "Macro", color: "#ffc107", bgColor: "rgba(255,193,7,0.08)", borderColor: "rgba(255,193,7,0.25)" },
};

const unitLabels: Record<string, string> = {
  percent: "%",
  ratio: "x",
  CNY_100M: "亿元",
  index: "idx",
};

export default function SemanticLayerViz() {
  const [data, setData] = useState<SemanticData | null>(null);
  const [activeCategory, setActiveCategory] = useState("price");

  useEffect(() => {
    fetch("/data/semantic_layer.json")
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="card p-6">
        <div className="skeleton h-64" />
      </div>
    );
  }

  const filteredMetrics = data.metrics.filter(m => m.category === activeCategory);
  const meta = categoryMeta[activeCategory];

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#e040fb]/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e040fb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Semantic Layer</h3>
          <p className="text-[10px] text-muted">{data.metrics.length} metrics across {Object.keys(categoryMeta).length} categories</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-[#0a0a0f] rounded-lg border border-border w-fit">
        {Object.entries(categoryMeta).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              activeCategory === key
                ? "text-foreground shadow-sm"
                : "text-muted hover:text-secondary"
            }`}
            style={activeCategory === key ? { backgroundColor: cat.bgColor, color: cat.color, boxShadow: `0 0 12px ${cat.bgColor}` } : {}}
          >
            <span className="mr-1.5">{cat.label}</span>
            <span className="opacity-70">{cat.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {filteredMetrics.map((metric) => (
          <div
            key={metric.name}
            className="rounded-lg border p-4 transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: meta.bgColor, borderColor: meta.borderColor }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-semibold" style={{ color: meta.color }}>{metric.display_name}</div>
                <div className="text-[11px] text-secondary">{metric.display_name_en}</div>
              </div>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                style={{ borderColor: meta.borderColor, color: meta.color }}
              >
                {unitLabels[metric.unit] ?? metric.unit}
              </span>
            </div>
            <div className="mt-3 p-2 rounded bg-[#0a0a0f]/60 border border-border/50">
              <code className="text-[11px] font-mono text-secondary leading-relaxed break-all">{metric.formula}</code>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
              </svg>
              <span className="text-[10px] font-mono text-muted">{metric.source_table}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dimensions Section */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <span className="text-xs font-semibold">Analysis Dimensions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.dimensions.map((dim) => (
            <div key={dim.name} className="rounded-lg bg-[#0d1a2e] border border-[#1a3a5c] p-4">
              <div className="text-xs font-semibold text-[#5a9aff] mb-1">{dim.display_name}</div>
              <div className="text-[10px] font-mono text-muted mb-3">{dim.name}</div>
              {dim.hierarchy && (
                <div className="flex items-center gap-1 mb-3">
                  {dim.hierarchy.map((h, i) => (
                    <React.Fragment key={h}>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2979ff]/10 text-[#5a9aff] font-mono">{h}</span>
                      {i < dim.hierarchy!.length - 1 && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5a9aff" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {dim.values.map((v) => (
                  <span key={v} className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-border text-secondary">{v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
