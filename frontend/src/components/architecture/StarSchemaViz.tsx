"use client";

import React, { useState } from "react";

interface TableDef {
  name: string;
  type: "fact" | "dimension";
  columns: string[];
  rowCount: string;
  description: string;
}

const factTables: TableDef[] = [
  { name: "fact_price", type: "fact", columns: ["date_key", "asset_key", "open", "high", "low", "close", "volume", "change_pct"], rowCount: "~2.5M", description: "Daily OHLCV price data" },
  { name: "fact_index", type: "fact", columns: ["date_key", "index_key", "pe_ttm", "pb", "dividend_yield", "turnover"], rowCount: "~180K", description: "Index valuation metrics" },
  { name: "fact_macro", type: "fact", columns: ["date_key", "indicator_key", "value", "yoy_change", "mom_change"], rowCount: "~50K", description: "Macroeconomic indicators" },
  { name: "fact_fx", type: "fact", columns: ["date_key", "pair_key", "rate", "bid", "ask", "change_pct"], rowCount: "~300K", description: "FX pair exchange rates" },
  { name: "fact_commodity", type: "fact", columns: ["date_key", "commodity_key", "price", "volume", "open_interest"], rowCount: "~200K", description: "Commodity futures data" },
  { name: "fact_fund_flow", type: "fact", columns: ["date_key", "sector_key", "main_inflow", "main_outflow", "retail_net"], rowCount: "~120K", description: "Sector fund flow data" },
  { name: "fact_cross_border", type: "fact", columns: ["date_key", "channel_key", "buy_amount", "sell_amount", "net_amount"], rowCount: "~15K", description: "Northbound/Southbound flows" },
];

const dimTables: TableDef[] = [
  { name: "dim_date", type: "dimension", columns: ["date_key", "year", "quarter", "month", "week", "is_trading_day", "lunar_date"], rowCount: "~15K", description: "Date dimension with trading calendar" },
  { name: "dim_asset", type: "dimension", columns: ["asset_key", "symbol", "name", "asset_class", "exchange", "sector", "region"], rowCount: "~8K", description: "Asset master data" },
  { name: "dim_market", type: "dimension", columns: ["market_key", "name", "country", "timezone", "currency", "open_time", "close_time"], rowCount: "~30", description: "Market/Exchange reference" },
  { name: "dim_indicator", type: "dimension", columns: ["indicator_key", "name", "category", "frequency", "unit", "source"], rowCount: "~200", description: "Macro indicator definitions" },
];

export default function StarSchemaViz() {
  const [selectedTable, setSelectedTable] = useState<TableDef | null>(null);

  const TableCard = ({ table, style }: { table: TableDef; style?: React.CSSProperties }) => {
    const isFact = table.type === "fact";
    const isSelected = selectedTable?.name === table.name;
    return (
      <button
        onClick={() => setSelectedTable(isSelected ? null : table)}
        style={style}
        className={`group relative rounded-lg border p-3 text-left transition-all duration-300 cursor-pointer ${
          isFact
            ? `bg-[#0d1a2e] border-[#1a3a5c] hover:border-[#2979ff] hover:shadow-[0_0_20px_rgba(41,121,255,0.15)] ${isSelected ? "border-[#2979ff] shadow-[0_0_24px_rgba(41,121,255,0.2)]" : ""}`
            : `bg-[#0d2418] border-[#1a4032] hover:border-[#00c853] hover:shadow-[0_0_20px_rgba(0,200,83,0.15)] ${isSelected ? "border-[#00c853] shadow-[0_0_24px_rgba(0,200,83,0.2)]" : ""}`
        }`}
      >
        {/* Glow dot */}
        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isFact ? "bg-[#2979ff]" : "bg-[#00c853]"}`} style={{ boxShadow: `0 0 6px ${isFact ? "#2979ff" : "#00c853"}` }} />
        <div className={`text-[10px] font-mono uppercase tracking-wider mb-1 ${isFact ? "text-[#5a9aff]" : "text-[#4ae08a]"}`}>
          {isFact ? "FACT" : "DIM"}
        </div>
        <div className="text-sm font-semibold text-foreground mb-1">{table.name}</div>
        <div className="text-[10px] text-muted mb-2">{table.description}</div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-secondary">{table.columns.length} cols</span>
          <span className={`text-[10px] font-mono ${isFact ? "text-[#5a9aff]" : "text-[#4ae08a]"}`}>{table.rowCount} rows</span>
        </div>
      </button>
    );
  };

  // Connections between dims and facts
  const connections: { dim: string; facts: string[] }[] = [
    { dim: "dim_date", facts: ["fact_price", "fact_index", "fact_macro", "fact_fx", "fact_commodity", "fact_fund_flow", "fact_cross_border"] },
    { dim: "dim_asset", facts: ["fact_price", "fact_index", "fact_commodity"] },
    { dim: "dim_market", facts: ["fact_price", "fact_fx", "fact_fund_flow", "fact_cross_border"] },
    { dim: "dim_indicator", facts: ["fact_macro", "fact_index"] },
  ];

  const highlightedFacts = selectedTable?.type === "dimension"
    ? connections.find(c => c.dim === selectedTable.name)?.facts ?? []
    : [];
  const highlightedDims = selectedTable?.type === "fact"
    ? connections.filter(c => c.facts.includes(selectedTable.name)).map(c => c.dim)
    : [];

  const isHighlighted = (name: string) => {
    if (!selectedTable) return true;
    if (selectedTable.name === name) return true;
    return highlightedFacts.includes(name) || highlightedDims.includes(name);
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#2979ff]/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2979ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Star Schema Model</h3>
          <p className="text-[10px] text-muted">Click any table to explore relationships</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#2979ff]" />
            <span className="text-[10px] text-secondary">Fact Tables</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#00c853]" />
            <span className="text-[10px] text-secondary">Dimensions</span>
          </div>
        </div>
      </div>

      {/* Star Schema Layout */}
      <div className="relative">
        {/* Dimension tables - top row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {dimTables.map((t) => (
            <div key={t.name} className={`transition-opacity duration-300 ${isHighlighted(t.name) ? "opacity-100" : "opacity-25"}`}>
              <TableCard table={t} />
            </div>
          ))}
        </div>

        {/* Connection lines visual */}
        <div className="flex justify-center my-2">
          <div className="flex items-center gap-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#00c853]/40 to-[#2979ff]/40" />
            <div className="text-[9px] text-muted uppercase tracking-widest px-2 py-1 rounded border border-border bg-[#0a0a0f]">
              foreign key joins
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-[#2979ff]/40 via-[#00c853]/40 to-transparent" />
          </div>
        </div>

        {/* Fact tables - main grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {factTables.slice(0, 4).map((t) => (
            <div key={t.name} className={`transition-opacity duration-300 ${isHighlighted(t.name) ? "opacity-100" : "opacity-25"}`}>
              <TableCard table={t} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3 max-w-3xl mx-auto">
          {factTables.slice(4).map((t) => (
            <div key={t.name} className={`transition-opacity duration-300 ${isHighlighted(t.name) ? "opacity-100" : "opacity-25"}`}>
              <TableCard table={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Selected table detail */}
      {selectedTable && (
        <div className="mt-6 p-4 rounded-lg bg-[#0a0a0f] border border-border animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${selectedTable.type === "fact" ? "bg-[#2979ff]" : "bg-[#00c853]"}`} />
            <span className="text-sm font-semibold font-mono">{selectedTable.name}</span>
            <span className="text-[10px] text-muted ml-2">{selectedTable.description}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedTable.columns.map((col, i) => (
              <span
                key={col}
                className={`text-[11px] font-mono px-2 py-1 rounded border ${
                  i === 0 || col.endsWith("_key")
                    ? "bg-[#ffc107]/10 border-[#ffc107]/30 text-[#ffc107]"
                    : "bg-card border-border text-secondary"
                }`}
              >
                {col.endsWith("_key") ? "\u{1F511} " : ""}{col}
              </span>
            ))}
          </div>
          {(highlightedDims.length > 0 || highlightedFacts.length > 0) && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-[10px] text-muted uppercase tracking-wider">Related tables: </span>
              {[...highlightedDims, ...highlightedFacts].map(name => (
                <span key={name} className="text-[11px] font-mono text-secondary ml-2">{name}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
