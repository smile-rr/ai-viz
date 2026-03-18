"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

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

const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  fresh: {
    bg: "var(--accent-green-dim)",
    text: "var(--accent-green)",
    dot: "var(--accent-green)",
  },
  stale: {
    bg: "rgba(255, 193, 7, 0.12)",
    text: "var(--accent-gold)",
    dot: "var(--accent-gold)",
  },
  error: {
    bg: "var(--accent-red-dim)",
    text: "var(--accent-red)",
    dot: "var(--accent-red)",
  },
};

const statusLabelKeys: Record<string, string> = {
  fresh: "freshness.status.fresh",
  stale: "freshness.status.stale",
  error: "freshness.status.error",
};

export default function FreshnessTable({ items }: FreshnessTableProps) {
  const { t } = useI18n();
  return (
    <div className="card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted mb-3">
        {t("freshness.title")}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[520px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3">{t("freshness.col.source")}</th>
              <th className="text-left py-2 px-3">{t("freshness.col.market")}</th>
              <th className="text-left py-2 px-3">{t("freshness.col.lastUpdate")}</th>
              <th className="text-left py-2 px-3">{t("freshness.col.status")}</th>
              <th className="text-left py-2 px-3">{t("freshness.col.frequency")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const cfg = statusStyle[item.status] ?? statusStyle.error;
              const statusLabel = t(statusLabelKeys[item.status] ?? statusLabelKeys.error);
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
                      {statusLabel}
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
