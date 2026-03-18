"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

interface TableInfo {
  rows: number;
  last_update: string | null;
}

interface TableStatsProps {
  tables: Record<string, TableInfo>;
}

export default function TableStats({ tables }: TableStatsProps) {
  const { t } = useI18n();
  const entries = Object.entries(tables);
  const maxRows = Math.max(...entries.map(([, t]) => t.rows), 1);

  return (
    <div className="card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted mb-4">
        {t("tableStats.title")}
      </div>
      <div className="space-y-3">
        {entries.map(([name, info]) => {
          const pct = (info.rows / maxRows) * 100;
          const isEmpty = info.rows === 0;
          const barColor = isEmpty
            ? "var(--border-color)"
            : "var(--accent-blue)";
          const barBg = isEmpty
            ? "transparent"
            : "var(--accent-blue-dim)";

          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-foreground">
                  {name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-secondary">
                    {info.rows === 0
                      ? t("tableStats.noData")
                      : info.rows.toLocaleString() + " " + t("tableStats.rows")}
                  </span>
                  <span className="text-[10px] font-mono text-muted">
                    {info.last_update ?? "--"}
                  </span>
                </div>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--bg-secondary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: isEmpty ? "100%" : `${Math.max(pct, 2)}%`,
                    background: barColor,
                    opacity: isEmpty ? 0.2 : 1,
                    boxShadow: isEmpty
                      ? "none"
                      : `0 0 8px ${barBg}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--accent-blue)" }}
          />
          <span className="text-[10px] text-muted">{t("tableStats.hasData")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--border-color)" }}
          />
          <span className="text-[10px] text-muted">{t("tableStats.empty")}</span>
        </div>
      </div>
    </div>
  );
}
