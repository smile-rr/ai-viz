"use client";

import React, { useState } from "react";
import { useI18n } from "@/i18n/context";

interface FieldDef {
  name: string;
  type: string;
  descKey: string;
  isPK?: boolean;
  isFK?: boolean;
}

interface TableDef {
  name: string;
  type: "fact" | "dimension";
  columns: string[];
  rowCount: string;
  descKey: string;
  purposeKey: string;
  fields: FieldDef[];
}

const factTables: TableDef[] = [
  {
    name: "fact_price", type: "fact",
    columns: ["date_key", "asset_key", "open", "high", "low", "close", "volume", "change_pct"],
    rowCount: "~2.5M", descKey: "starSchema.desc.fact_price", purposeKey: "starSchema.purpose.fact_price",
    fields: [
      { name: "date_key", type: "DATE", descKey: "starSchema.field.fact_price.date_key", isFK: true },
      { name: "asset_key", type: "VARCHAR", descKey: "starSchema.field.fact_price.asset_key", isFK: true },
      { name: "open", type: "DECIMAL", descKey: "starSchema.field.fact_price.open" },
      { name: "high", type: "DECIMAL", descKey: "starSchema.field.fact_price.high" },
      { name: "low", type: "DECIMAL", descKey: "starSchema.field.fact_price.low" },
      { name: "close", type: "DECIMAL", descKey: "starSchema.field.fact_price.close" },
      { name: "volume", type: "BIGINT", descKey: "starSchema.field.fact_price.volume" },
      { name: "change_pct", type: "DECIMAL", descKey: "starSchema.field.fact_price.change_pct" },
    ],
  },
  {
    name: "fact_index", type: "fact",
    columns: ["date_key", "asset_key", "open", "high", "low", "close", "volume", "pe_ttm", "pb"],
    rowCount: "~180K", descKey: "starSchema.desc.fact_index", purposeKey: "starSchema.purpose.fact_index",
    fields: [
      { name: "date_key", type: "DATE", descKey: "starSchema.field.fact_index.date_key", isFK: true },
      { name: "asset_key", type: "VARCHAR", descKey: "starSchema.field.fact_index.asset_key", isFK: true },
      { name: "open", type: "DECIMAL", descKey: "starSchema.field.fact_index.open" },
      { name: "high", type: "DECIMAL", descKey: "starSchema.field.fact_index.high" },
      { name: "low", type: "DECIMAL", descKey: "starSchema.field.fact_index.low" },
      { name: "close", type: "DECIMAL", descKey: "starSchema.field.fact_index.close" },
      { name: "volume", type: "BIGINT", descKey: "starSchema.field.fact_index.volume" },
      { name: "pe_ttm", type: "DECIMAL", descKey: "starSchema.field.fact_index.pe_ttm" },
      { name: "pb", type: "DECIMAL", descKey: "starSchema.field.fact_index.pb" },
    ],
  },
  {
    name: "fact_macro", type: "fact",
    columns: ["date_key", "indicator_key", "value", "yoy_change", "mom_change"],
    rowCount: "~50K", descKey: "starSchema.desc.fact_macro", purposeKey: "starSchema.purpose.fact_macro",
    fields: [
      { name: "date_key", type: "DATE", descKey: "starSchema.field.fact_macro.date_key", isFK: true },
      { name: "indicator_key", type: "VARCHAR", descKey: "starSchema.field.fact_macro.indicator_key", isFK: true },
      { name: "value", type: "DECIMAL", descKey: "starSchema.field.fact_macro.value" },
      { name: "yoy_change", type: "DECIMAL", descKey: "starSchema.field.fact_macro.yoy_change" },
      { name: "mom_change", type: "DECIMAL", descKey: "starSchema.field.fact_macro.mom_change" },
    ],
  },
  {
    name: "fact_fx", type: "fact",
    columns: ["date_key", "pair", "rate", "change_pct"],
    rowCount: "~300K", descKey: "starSchema.desc.fact_fx", purposeKey: "starSchema.purpose.fact_fx",
    fields: [
      { name: "date_key", type: "DATE", descKey: "starSchema.field.fact_fx.date_key", isFK: true },
      { name: "pair", type: "VARCHAR", descKey: "starSchema.field.fact_fx.pair" },
      { name: "rate", type: "DECIMAL", descKey: "starSchema.field.fact_fx.rate" },
      { name: "change_pct", type: "DECIMAL", descKey: "starSchema.field.fact_fx.change_pct" },
    ],
  },
  {
    name: "fact_commodity", type: "fact",
    columns: ["date_key", "asset_key", "price", "change_pct", "volume"],
    rowCount: "~200K", descKey: "starSchema.desc.fact_commodity", purposeKey: "starSchema.purpose.fact_commodity",
    fields: [
      { name: "date_key", type: "DATE", descKey: "starSchema.field.fact_commodity.date_key", isFK: true },
      { name: "asset_key", type: "VARCHAR", descKey: "starSchema.field.fact_commodity.asset_key", isFK: true },
      { name: "price", type: "DECIMAL", descKey: "starSchema.field.fact_commodity.price" },
      { name: "change_pct", type: "DECIMAL", descKey: "starSchema.field.fact_commodity.change_pct" },
      { name: "volume", type: "BIGINT", descKey: "starSchema.field.fact_commodity.volume" },
    ],
  },
  {
    name: "fact_fund_flow", type: "fact",
    columns: ["date_key", "sector", "net_inflow", "main_inflow", "main_outflow", "retail_inflow", "retail_outflow"],
    rowCount: "~120K", descKey: "starSchema.desc.fact_fund_flow", purposeKey: "starSchema.purpose.fact_fund_flow",
    fields: [
      { name: "date_key", type: "DATE", descKey: "starSchema.field.fact_fund_flow.date_key", isFK: true },
      { name: "sector", type: "VARCHAR", descKey: "starSchema.field.fact_fund_flow.sector" },
      { name: "net_inflow", type: "DECIMAL", descKey: "starSchema.field.fact_fund_flow.net_inflow" },
      { name: "main_inflow", type: "DECIMAL", descKey: "starSchema.field.fact_fund_flow.main_inflow" },
      { name: "main_outflow", type: "DECIMAL", descKey: "starSchema.field.fact_fund_flow.main_outflow" },
      { name: "retail_inflow", type: "DECIMAL", descKey: "starSchema.field.fact_fund_flow.retail_inflow" },
      { name: "retail_outflow", type: "DECIMAL", descKey: "starSchema.field.fact_fund_flow.retail_outflow" },
    ],
  },
  {
    name: "fact_cross_border", type: "fact",
    columns: ["date_key", "direction", "net_buy", "buy_amount", "sell_amount"],
    rowCount: "~15K", descKey: "starSchema.desc.fact_cross_border", purposeKey: "starSchema.purpose.fact_cross_border",
    fields: [
      { name: "date_key", type: "DATE", descKey: "starSchema.field.fact_cross_border.date_key", isFK: true },
      { name: "direction", type: "VARCHAR", descKey: "starSchema.field.fact_cross_border.direction" },
      { name: "net_buy", type: "DECIMAL", descKey: "starSchema.field.fact_cross_border.net_buy" },
      { name: "buy_amount", type: "DECIMAL", descKey: "starSchema.field.fact_cross_border.buy_amount" },
      { name: "sell_amount", type: "DECIMAL", descKey: "starSchema.field.fact_cross_border.sell_amount" },
    ],
  },
];

const dimTables: TableDef[] = [
  {
    name: "dim_date", type: "dimension",
    columns: ["date_key", "year", "quarter", "month", "week", "is_cn_trading", "is_us_trading"],
    rowCount: "~15K", descKey: "starSchema.desc.dim_date", purposeKey: "starSchema.purpose.dim_date",
    fields: [
      { name: "date_key", type: "DATE", descKey: "starSchema.field.dim_date.date_key", isPK: true },
      { name: "year", type: "INT", descKey: "starSchema.field.dim_date.year" },
      { name: "quarter", type: "INT", descKey: "starSchema.field.dim_date.quarter" },
      { name: "month", type: "INT", descKey: "starSchema.field.dim_date.month" },
      { name: "week", type: "INT", descKey: "starSchema.field.dim_date.week" },
      { name: "is_cn_trading", type: "BOOL", descKey: "starSchema.field.dim_date.is_cn_trading" },
      { name: "is_us_trading", type: "BOOL", descKey: "starSchema.field.dim_date.is_us_trading" },
    ],
  },
  {
    name: "dim_asset", type: "dimension",
    columns: ["asset_key", "name", "asset_type", "exchange", "market", "sector", "industry"],
    rowCount: "~8K", descKey: "starSchema.desc.dim_asset", purposeKey: "starSchema.purpose.dim_asset",
    fields: [
      { name: "asset_key", type: "VARCHAR", descKey: "starSchema.field.dim_asset.asset_key", isPK: true },
      { name: "name", type: "VARCHAR", descKey: "starSchema.field.dim_asset.name" },
      { name: "asset_type", type: "VARCHAR", descKey: "starSchema.field.dim_asset.asset_type" },
      { name: "exchange", type: "VARCHAR", descKey: "starSchema.field.dim_asset.exchange" },
      { name: "market", type: "VARCHAR", descKey: "starSchema.field.dim_asset.market" },
      { name: "sector", type: "VARCHAR", descKey: "starSchema.field.dim_asset.sector" },
      { name: "industry", type: "VARCHAR", descKey: "starSchema.field.dim_asset.industry" },
    ],
  },
  {
    name: "dim_market", type: "dimension",
    columns: ["market_key", "timezone", "currency", "open_time", "close_time"],
    rowCount: "~30", descKey: "starSchema.desc.dim_market", purposeKey: "starSchema.purpose.dim_market",
    fields: [
      { name: "market_key", type: "VARCHAR", descKey: "starSchema.field.dim_market.market_key", isPK: true },
      { name: "timezone", type: "VARCHAR", descKey: "starSchema.field.dim_market.timezone" },
      { name: "currency", type: "VARCHAR", descKey: "starSchema.field.dim_market.currency" },
      { name: "open_time", type: "TIME", descKey: "starSchema.field.dim_market.open_time" },
      { name: "close_time", type: "TIME", descKey: "starSchema.field.dim_market.close_time" },
    ],
  },
  {
    name: "dim_indicator", type: "dimension",
    columns: ["indicator_key", "name", "name_cn", "category", "frequency", "source"],
    rowCount: "~200", descKey: "starSchema.desc.dim_indicator", purposeKey: "starSchema.purpose.dim_indicator",
    fields: [
      { name: "indicator_key", type: "VARCHAR", descKey: "starSchema.field.dim_indicator.indicator_key", isPK: true },
      { name: "name", type: "VARCHAR", descKey: "starSchema.field.dim_indicator.name" },
      { name: "name_cn", type: "VARCHAR", descKey: "starSchema.field.dim_indicator.name_cn" },
      { name: "category", type: "VARCHAR", descKey: "starSchema.field.dim_indicator.category" },
      { name: "frequency", type: "VARCHAR", descKey: "starSchema.field.dim_indicator.frequency" },
      { name: "source", type: "VARCHAR", descKey: "starSchema.field.dim_indicator.source" },
    ],
  },
];

export default function StarSchemaViz() {
  const { t } = useI18n();
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
        <div className="text-[10px] text-muted mb-2">{t(table.descKey)}</div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-secondary">{table.columns.length} {t("starSchema.cols")}</span>
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
          <h3 className="text-sm font-semibold">{t("starSchema.title")}</h3>
          <p className="text-[10px] text-muted">{t("starSchema.subtitle")}</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#2979ff]" />
            <span className="text-[10px] text-secondary">{t("starSchema.factTables")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#00c853]" />
            <span className="text-[10px] text-secondary">{t("starSchema.dimensions")}</span>
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
              {t("starSchema.fkJoins")}
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

      {/* Selected table detail panel */}
      {selectedTable && (
        <div className="mt-6 rounded-lg bg-[#0a0a0f] border border-border animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${selectedTable.type === "fact" ? "bg-[#2979ff]" : "bg-[#00c853]"}`}
                  style={{ boxShadow: `0 0 8px ${selectedTable.type === "fact" ? "#2979ff" : "#00c853"}` }} />
                <span className="text-sm font-bold font-mono text-foreground">{selectedTable.name}</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  selectedTable.type === "fact"
                    ? "border-[#2979ff]/30 text-[#5a9aff] bg-[#2979ff]/10"
                    : "border-[#00c853]/30 text-[#4ae08a] bg-[#00c853]/10"
                }`}>
                  {selectedTable.type === "fact" ? "FACT TABLE" : "DIMENSION"}
                </span>
              </div>
              <p className="text-xs text-secondary mt-1">{t(selectedTable.purposeKey)}</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted">{t("starSchema.estimatedRows")}</div>
              <div className={`text-sm font-mono font-semibold ${selectedTable.type === "fact" ? "text-[#5a9aff]" : "text-[#4ae08a]"}`}>
                {selectedTable.rowCount}
              </div>
            </div>
          </div>

          {/* Field-level detail table */}
          <div className="px-5 py-3">
            <div className="text-[10px] uppercase tracking-wider text-muted mb-2">{t("starSchema.fieldDetails")}</div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-[10px] font-semibold text-muted uppercase tracking-wider py-2 pr-4 w-[140px]">{t("starSchema.col.field")}</th>
                  <th className="text-[10px] font-semibold text-muted uppercase tracking-wider py-2 pr-4 w-[80px]">{t("starSchema.col.type")}</th>
                  <th className="text-[10px] font-semibold text-muted uppercase tracking-wider py-2 pr-4 w-[60px]">{t("starSchema.col.key")}</th>
                  <th className="text-[10px] font-semibold text-muted uppercase tracking-wider py-2">{t("starSchema.col.description")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedTable.fields.map((field) => (
                  <tr key={field.name} className="border-b border-border/20 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2 pr-4">
                      <span className={`text-[11px] font-mono font-medium ${
                        field.isPK ? "text-[#ffc107]" : field.isFK ? "text-[#ff9100]" : "text-foreground"
                      }`}>
                        {field.name}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <span className="text-[10px] font-mono text-muted px-1.5 py-0.5 rounded bg-white/[0.04] border border-border/30">
                        {field.type}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      {field.isPK && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ffc107]/10 border border-[#ffc107]/30 text-[#ffc107]">
                          PK
                        </span>
                      )}
                      {field.isFK && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ff9100]/10 border border-[#ff9100]/30 text-[#ff9100]">
                          FK
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      <span className="text-[11px] text-secondary leading-relaxed">{t(field.descKey)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Related tables */}
          {(highlightedDims.length > 0 || highlightedFacts.length > 0) && (
            <div className="px-5 py-3 border-t border-border/50 bg-white/[0.01]">
              <span className="text-[10px] text-muted uppercase tracking-wider">{t("starSchema.relatedTables")} </span>
              {[...highlightedDims, ...highlightedFacts].map(name => {
                const isDim = name.startsWith("dim_");
                return (
                  <button
                    key={name}
                    onClick={() => {
                      const all = [...factTables, ...dimTables];
                      const found = all.find(t => t.name === name);
                      if (found) setSelectedTable(found);
                    }}
                    className={`text-[11px] font-mono ml-2 px-2 py-0.5 rounded border cursor-pointer transition-colors ${
                      isDim
                        ? "border-[#00c853]/30 text-[#4ae08a] hover:bg-[#00c853]/10"
                        : "border-[#2979ff]/30 text-[#5a9aff] hover:bg-[#2979ff]/10"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
