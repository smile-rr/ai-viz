"use client";

import React from "react";

interface FreshnessItem {
  source: string;
  market: string;
  last_update: string;
  status: string;
  frequency: string;
}

interface FreshnessTableProps {
  items: FreshnessItem[];
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  fresh: {
    label: "Fresh",
    bg: "var(--accent-green-dim)",
    text: "var(--accent-green)",
    dot: "var(--accent-green)",
  },
  stale: {
    label: "Stale",
    bg: "rgba(255, 193, 7, 0.12)",
    text: "var(--accent-gold)",
    dot: "var(--accent-gold)",
  },
  error: {
    label: "Error",
    bg: "var(--accent-red-dim)",
    text: "var(--accent-red)",
    dot: "var(--accent-red)",
  },
};

export default function FreshnessTable({ items }: FreshnessTableProps) {
  return (
    <div className="card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted mb-3">
        Data Freshness
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3">Source</th>
              <th className="text-left py-2 px-3">Market</th>
              <th className="text-left py-2 px-3">Last Update</th>
              <th className="text-left py-2 px-3">Status</th>
              <th className="text-left py-2 px-3">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const cfg = statusConfig[item.status] ?? statusConfig.error;
              return (
                <tr
                  key={idx}
                  className="border-b border-border/50 hover:bg-card-hover transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono text-secondary">
                    {item.source}
                  </td>
                  <td className="py-2.5 px-3 text-foreground">
                    {item.market}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-secondary">
                    {item.last_update}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ background: cfg.bg, color: cfg.text }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: cfg.dot }}
                      />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-muted">{item.frequency}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
