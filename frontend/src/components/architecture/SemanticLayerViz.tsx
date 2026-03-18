"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/i18n/context";

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

// Detailed metric explanations keyed by metric name
const metricExplanations: Record<string, {
  exampleKey: string;
  usageKey: string;
  joinsKey: string;
}> = {
  daily_return: { exampleKey: "semantic.example.daily_return", usageKey: "semantic.usage.daily_return", joinsKey: "semantic.joins.daily_return" },
  cumulative_return: { exampleKey: "semantic.example.cumulative_return", usageKey: "semantic.usage.cumulative_return", joinsKey: "semantic.joins.cumulative_return" },
  volatility_20d: { exampleKey: "semantic.example.volatility_20d", usageKey: "semantic.usage.volatility_20d", joinsKey: "semantic.joins.volatility_20d" },
  volume_ratio: { exampleKey: "semantic.example.volume_ratio", usageKey: "semantic.usage.volume_ratio", joinsKey: "semantic.joins.volume_ratio" },
  turnover_rate: { exampleKey: "semantic.example.turnover_rate", usageKey: "semantic.usage.turnover_rate", joinsKey: "semantic.joins.turnover_rate" },
  pe_percentile: { exampleKey: "semantic.example.pe_percentile", usageKey: "semantic.usage.pe_percentile", joinsKey: "semantic.joins.pe_percentile" },
  pb_percentile: { exampleKey: "semantic.example.pb_percentile", usageKey: "semantic.usage.pb_percentile", joinsKey: "semantic.joins.pb_percentile" },
  northbound_net: { exampleKey: "semantic.example.northbound_net", usageKey: "semantic.usage.northbound_net", joinsKey: "semantic.joins.northbound_net" },
  sector_net_inflow: { exampleKey: "semantic.example.sector_net_inflow", usageKey: "semantic.usage.sector_net_inflow", joinsKey: "semantic.joins.sector_net_inflow" },
  gdp_yoy: { exampleKey: "semantic.example.gdp_yoy", usageKey: "semantic.usage.gdp_yoy", joinsKey: "semantic.joins.gdp_yoy" },
  cpi_yoy: { exampleKey: "semantic.example.cpi_yoy", usageKey: "semantic.usage.cpi_yoy", joinsKey: "semantic.joins.cpi_yoy" },
  pmi_value: { exampleKey: "semantic.example.pmi_value", usageKey: "semantic.usage.pmi_value", joinsKey: "semantic.joins.pmi_value" },
  sharpe_ratio: { exampleKey: "semantic.example.sharpe_ratio", usageKey: "semantic.usage.sharpe_ratio", joinsKey: "semantic.joins.sharpe_ratio" },
  max_drawdown: { exampleKey: "semantic.example.max_drawdown", usageKey: "semantic.usage.max_drawdown", joinsKey: "semantic.joins.max_drawdown" },
  dividend_yield: { exampleKey: "semantic.example.dividend_yield", usageKey: "semantic.usage.dividend_yield", joinsKey: "semantic.joins.dividend_yield" },
  rsi_14d: { exampleKey: "semantic.example.rsi_14d", usageKey: "semantic.usage.rsi_14d", joinsKey: "semantic.joins.rsi_14d" },
};

export default function SemanticLayerViz() {
  const { t } = useI18n();
  const [data, setData] = useState<SemanticData | null>(null);
  const [activeCategory, setActiveCategory] = useState("price");
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

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
          <h3 className="text-sm font-semibold">{t("semantic.title")}</h3>
          <p className="text-[10px] text-muted">{t("semantic.subtitle").replace("{count}", String(data.metrics.length)).replace("{categories}", String(Object.keys(categoryMeta).length))}</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-[#0a0a0f] rounded-lg border border-border w-fit max-w-full overflow-x-auto">
        {Object.entries(categoryMeta).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => { setActiveCategory(key); setExpandedMetric(null); }}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex-shrink-0 ${
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
        {filteredMetrics.map((metric) => {
          const isExpanded = expandedMetric === metric.name;
          const explanation = metricExplanations[metric.name];
          return (
            <div
              key={metric.name}
              className={`rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer ${isExpanded ? "md:col-span-2" : ""}`}
              style={{ backgroundColor: meta.bgColor, borderColor: isExpanded ? meta.color : meta.borderColor }}
              onClick={() => setExpandedMetric(isExpanded ? null : metric.name)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: meta.color }}>{metric.display_name}</div>
                    <div className="text-[11px] text-secondary">{metric.display_name_en}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                      style={{ borderColor: meta.borderColor, color: meta.color }}
                    >
                      {unitLabels[metric.unit] ?? metric.unit}
                    </span>
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2"
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
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

              {/* Expandable detail section */}
              {isExpanded && explanation && (
                <div className="border-t border-border/30 px-4 py-3 bg-[#0a0a0f]/40 space-y-3 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                  {/* Example calculation */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>{t("semantic.exampleCalc")}</span>
                    </div>
                    <div className="text-[11px] text-secondary leading-relaxed pl-5">{t(explanation.exampleKey)}</div>
                  </div>
                  {/* When to use */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>{t("semantic.whenToUse")}</span>
                    </div>
                    <div className="text-[11px] text-secondary leading-relaxed pl-5">{t(explanation.usageKey)}</div>
                  </div>
                  {/* Source & joins */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>{t("semantic.sourceJoins")}</span>
                    </div>
                    <div className="text-[11px] text-secondary leading-relaxed pl-5 font-mono">{t(explanation.joinsKey)}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dimensions Section */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <span className="text-xs font-semibold">{t("semantic.analysisDimensions")}</span>
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
