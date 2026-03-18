"use client";

import React, { useState } from "react";
import { useI18n } from "@/i18n/context";

interface LineageNode {
  name: string;
  descKey: string;
  detail: string;
  color: string;
}

interface LineageLayer {
  id: string;
  labelKey: string;
  sublabelKey: string;
  nodes: LineageNode[];
  bgColor: string;
  borderColor: string;
  accentColor: string;
  explanationKey: string;
}

const layers: LineageLayer[] = [
  {
    id: "source",
    labelKey: "lineage.layer.source",
    sublabelKey: "lineage.layer.source.sub",
    bgColor: "rgba(255,193,7,0.06)",
    borderColor: "rgba(255,193,7,0.2)",
    accentColor: "#ffc107",
    explanationKey: "lineage.explain.source",
    nodes: [
      { name: "AKShare", descKey: "lineage.node.akshare", detail: "Daily 18:00 CST", color: "#ffc107" },
      { name: "yfinance", descKey: "lineage.node.yfinance", detail: "Daily 06:00 UTC", color: "#ff9100" },
      { name: "Tushare", descKey: "lineage.node.tushare", detail: "Daily 20:00 CST", color: "#ffab40" },
    ],
  },
  {
    id: "ods",
    labelKey: "lineage.layer.ods",
    sublabelKey: "lineage.layer.ods.sub",
    bgColor: "rgba(224,64,251,0.06)",
    borderColor: "rgba(224,64,251,0.2)",
    accentColor: "#e040fb",
    explanationKey: "lineage.explain.ods",
    nodes: [
      { name: "ods_cn_index", descKey: "lineage.node.ods_cn_index", detail: "JSON / CSV", color: "#e040fb" },
      { name: "ods_global_quote", descKey: "lineage.node.ods_global_quote", detail: "JSON", color: "#ce93d8" },
      { name: "ods_macro_raw", descKey: "lineage.node.ods_macro_raw", detail: "CSV / API", color: "#ba68c8" },
    ],
  },
  {
    id: "dwd",
    labelKey: "lineage.layer.dwd",
    sublabelKey: "lineage.layer.dwd.sub",
    bgColor: "rgba(41,121,255,0.06)",
    borderColor: "rgba(41,121,255,0.2)",
    accentColor: "#2979ff",
    explanationKey: "lineage.explain.dwd",
    nodes: [
      { name: "dwd_price", descKey: "lineage.node.dwd_price", detail: "Polars transform", color: "#2979ff" },
      { name: "dwd_index", descKey: "lineage.node.dwd_index", detail: "DuckDB validation", color: "#448aff" },
      { name: "dwd_macro", descKey: "lineage.node.dwd_macro", detail: "Dedup + fill", color: "#5a9aff" },
    ],
  },
  {
    id: "dws",
    labelKey: "lineage.layer.dws",
    sublabelKey: "lineage.layer.dws.sub",
    bgColor: "rgba(0,200,83,0.06)",
    borderColor: "rgba(0,200,83,0.2)",
    accentColor: "#00c853",
    explanationKey: "lineage.explain.dws",
    nodes: [
      { name: "fact_price", descKey: "lineage.node.fact_price", detail: "~2.5M rows", color: "#00c853" },
      { name: "fact_index", descKey: "lineage.node.fact_index", detail: "~180K rows", color: "#4caf50" },
      { name: "fact_macro", descKey: "lineage.node.fact_macro", detail: "~50K rows", color: "#69f0ae" },
      { name: "fact_fx", descKey: "lineage.node.fact_fx", detail: "~300K rows", color: "#00e676" },
    ],
  },
  {
    id: "serving",
    labelKey: "lineage.layer.serving",
    sublabelKey: "lineage.layer.serving.sub",
    bgColor: "rgba(0,229,255,0.06)",
    borderColor: "rgba(0,229,255,0.2)",
    accentColor: "#00e5ff",
    explanationKey: "lineage.explain.serving",
    nodes: [
      { name: "market_summary", descKey: "lineage.node.market_summary", detail: "< 500KB JSON", color: "#00e5ff" },
      { name: "semantic_layer", descKey: "lineage.node.semantic_layer", detail: "YAML config", color: "#00bcd4" },
    ],
  },
];

export default function DataLineageViz() {
  const { t } = useI18n();
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold">{t("lineage.title")}</h3>
          <p className="text-[10px] text-muted">{t("lineage.subtitle")}</p>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] text-muted">{t("lineage.clickToExpand")}</span>
        </div>
      </div>

      {/* Horizontal lineage flow */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-0 min-w-[900px]">
          {layers.map((layer, layerIdx) => (
            <React.Fragment key={layer.id}>
              {/* Layer column */}
              <div className="flex-1 min-w-[160px]">
                {/* Layer header - clickable */}
                <button
                  className="text-center mb-3 w-full cursor-pointer group"
                  onClick={() => setExpandedLayer(expandedLayer === layer.id ? null : layer.id)}
                >
                  <div className="text-xs font-semibold group-hover:underline" style={{ color: layer.accentColor }}>{t(layer.labelKey)}</div>
                  <div className="text-[9px] text-muted uppercase tracking-wider">{t(layer.sublabelKey)}</div>
                  <svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={layer.accentColor} strokeWidth="2"
                    className={`mx-auto mt-1 transition-transform duration-200 ${expandedLayer === layer.id ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {/* Nodes */}
                <div
                  className="rounded-lg border p-2 space-y-2 min-h-[240px]"
                  style={{ backgroundColor: layer.bgColor, borderColor: expandedLayer === layer.id ? layer.accentColor : layer.borderColor, transition: "border-color 0.2s" }}
                >
                  {layer.nodes.map((node) => (
                    <div
                      key={node.name}
                      className="rounded-md bg-[#0a0a0f]/70 border border-border p-2.5 hover:border-border-hover transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color, boxShadow: `0 0 4px ${node.color}` }} />
                        <span className="text-[11px] font-mono font-semibold text-foreground">{node.name}</span>
                      </div>
                      <div className="text-[10px] text-secondary">{t(node.descKey)}</div>
                      <div className="text-[9px] text-muted mt-1 font-mono">{node.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow between layers */}
              {layerIdx < layers.length - 1 && (
                <div className="flex items-center justify-center w-10 flex-shrink-0 self-stretch pt-8">
                  <div className="relative h-full flex items-center">
                    {/* Animated flowing line */}
                    <div className="w-10 h-px relative overflow-hidden">
                      <div
                        className="absolute inset-0 h-px"
                        style={{
                          background: `linear-gradient(90deg, ${layer.accentColor}40, ${layers[layerIdx + 1].accentColor}40)`,
                        }}
                      />
                      <div
                        className="absolute top-0 h-px w-4"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${layers[layerIdx + 1].accentColor}, transparent)`,
                          animation: "flowRight 2s linear infinite",
                        }}
                      />
                    </div>
                    {/* Arrow head */}
                    <svg
                      width="6" height="10" viewBox="0 0 6 10"
                      className="absolute -right-1 top-1/2 -translate-y-1/2"
                      style={{ color: layers[layerIdx + 1].accentColor }}
                    >
                      <path d="M0 0 L6 5 L0 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Flow animation keyframes */}
      <style jsx>{`
        @keyframes flowRight {
          0% { left: -16px; }
          100% { left: calc(100% + 16px); }
        }
      `}</style>

      {/* Expanded layer explanation */}
      {expandedLayer && (() => {
        const layer = layers.find(l => l.id === expandedLayer)!;
        return (
          <div
            className="mt-2 mb-4 rounded-lg border p-4 animate-fade-in"
            style={{ backgroundColor: layer.bgColor, borderColor: layer.accentColor }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.accentColor, boxShadow: `0 0 8px ${layer.accentColor}` }} />
              <span className="text-xs font-semibold" style={{ color: layer.accentColor }}>{t(layer.labelKey)}</span>
              <span className="text-[10px] text-muted">- {t("lineage.stageDetails")}</span>
            </div>
            <div className="text-[11px] text-secondary leading-relaxed whitespace-pre-line">{t(layer.explanationKey)}</div>
          </div>
        );
      })()}

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 sm:grid-cols-5 gap-3">
        {layers.map((layer) => (
          <button
            key={layer.id}
            className="text-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setExpandedLayer(expandedLayer === layer.id ? null : layer.id)}
          >
            <div className="text-lg font-semibold" style={{ color: layer.accentColor }}>{layer.nodes.length}</div>
            <div className="text-[10px] text-muted">{t(layer.labelKey)} {t("lineage.tables")}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
