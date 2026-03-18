"use client";

import React from "react";

interface LineageNode {
  name: string;
  description: string;
  detail: string;
  color: string;
}

interface LineageLayer {
  id: string;
  label: string;
  sublabel: string;
  nodes: LineageNode[];
  bgColor: string;
  borderColor: string;
  accentColor: string;
}

const layers: LineageLayer[] = [
  {
    id: "source",
    label: "Data Sources",
    sublabel: "Collection",
    bgColor: "rgba(255,193,7,0.06)",
    borderColor: "rgba(255,193,7,0.2)",
    accentColor: "#ffc107",
    nodes: [
      { name: "AKShare", description: "CN Markets", detail: "Daily 18:00 CST", color: "#ffc107" },
      { name: "yfinance", description: "Global Markets", detail: "Daily 06:00 UTC", color: "#ff9100" },
      { name: "Tushare", description: "CN Fundamentals", detail: "Daily 20:00 CST", color: "#ffab40" },
    ],
  },
  {
    id: "ods",
    label: "ODS",
    sublabel: "Raw Landing",
    bgColor: "rgba(224,64,251,0.06)",
    borderColor: "rgba(224,64,251,0.2)",
    accentColor: "#e040fb",
    nodes: [
      { name: "ods_cn_index", description: "Raw CN indices", detail: "JSON / CSV", color: "#e040fb" },
      { name: "ods_global_quote", description: "Raw global quotes", detail: "JSON", color: "#ce93d8" },
      { name: "ods_macro_raw", description: "Raw macro data", detail: "CSV / API", color: "#ba68c8" },
    ],
  },
  {
    id: "dwd",
    label: "DWD",
    sublabel: "Cleaned & Typed",
    bgColor: "rgba(41,121,255,0.06)",
    borderColor: "rgba(41,121,255,0.2)",
    accentColor: "#2979ff",
    nodes: [
      { name: "dwd_price", description: "Standardized OHLCV", detail: "Polars transform", color: "#2979ff" },
      { name: "dwd_index", description: "Typed index data", detail: "DuckDB validation", color: "#448aff" },
      { name: "dwd_macro", description: "Cleaned macro series", detail: "Dedup + fill", color: "#5a9aff" },
    ],
  },
  {
    id: "dws",
    label: "DWS",
    sublabel: "Aggregated Facts",
    bgColor: "rgba(0,200,83,0.06)",
    borderColor: "rgba(0,200,83,0.2)",
    accentColor: "#00c853",
    nodes: [
      { name: "fact_price", description: "Price fact table", detail: "~2.5M rows", color: "#00c853" },
      { name: "fact_index", description: "Index valuations", detail: "~180K rows", color: "#4caf50" },
      { name: "fact_macro", description: "Macro indicators", detail: "~50K rows", color: "#69f0ae" },
      { name: "fact_fx", description: "FX rates", detail: "~300K rows", color: "#00e676" },
    ],
  },
  {
    id: "serving",
    label: "Serving",
    sublabel: "Dashboard JSON",
    bgColor: "rgba(0,229,255,0.06)",
    borderColor: "rgba(0,229,255,0.2)",
    accentColor: "#00e5ff",
    nodes: [
      { name: "market_summary", description: "Dashboard payload", detail: "< 500KB JSON", color: "#00e5ff" },
      { name: "semantic_layer", description: "Metric definitions", detail: "YAML config", color: "#00bcd4" },
    ],
  },
];

export default function DataLineageViz() {
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
          <h3 className="text-sm font-semibold">Data Lineage</h3>
          <p className="text-[10px] text-muted">End-to-end data flow from source to dashboard</p>
        </div>
      </div>

      {/* Horizontal lineage flow */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-0 min-w-[900px]">
          {layers.map((layer, layerIdx) => (
            <React.Fragment key={layer.id}>
              {/* Layer column */}
              <div className="flex-1 min-w-[160px]">
                {/* Layer header */}
                <div className="text-center mb-3">
                  <div className="text-xs font-semibold" style={{ color: layer.accentColor }}>{layer.label}</div>
                  <div className="text-[9px] text-muted uppercase tracking-wider">{layer.sublabel}</div>
                </div>
                {/* Nodes */}
                <div
                  className="rounded-lg border p-2 space-y-2 min-h-[240px]"
                  style={{ backgroundColor: layer.bgColor, borderColor: layer.borderColor }}
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
                      <div className="text-[10px] text-secondary">{node.description}</div>
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

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-5 gap-3">
        {layers.map((layer) => (
          <div key={layer.id} className="text-center">
            <div className="text-lg font-semibold" style={{ color: layer.accentColor }}>{layer.nodes.length}</div>
            <div className="text-[10px] text-muted">{layer.label} Tables</div>
          </div>
        ))}
      </div>
    </div>
  );
}
