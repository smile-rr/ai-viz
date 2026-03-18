"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

interface ArchiveEntry {
  date: string;
  type: "daily" | "weekly" | "monthly";
  title: string;
}

interface ReportArchiveProps {
  entries: ArchiveEntry[];
}

const typeBadgeClasses: Record<string, string> = {
  daily: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  weekly: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  monthly: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
};

const typeBadgeKeys: Record<string, string> = {
  daily: "archive.type.daily",
  weekly: "archive.type.weekly",
  monthly: "archive.type.monthly",
};

export default function ReportArchive({ entries }: ReportArchiveProps) {
  const { t } = useI18n();
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t("archive.title")}</span>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-[#0a0a12]">
            <th className="text-left text-[10px] uppercase tracking-wider text-muted font-medium px-5 py-2.5">{t("archive.col.date")}</th>
            <th className="text-left text-[10px] uppercase tracking-wider text-muted font-medium px-5 py-2.5">{t("archive.col.type")}</th>
            <th className="text-left text-[10px] uppercase tracking-wider text-muted font-medium px-5 py-2.5">{t("archive.col.title")}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const badgeClasses = typeBadgeClasses[entry.type] ?? typeBadgeClasses.daily;
            const badgeLabel = t(typeBadgeKeys[entry.type] ?? typeBadgeKeys.daily);
            return (
              <tr
                key={`${entry.date}-${entry.type}-${i}`}
                className={`border-b border-border/50 hover:bg-card-hover transition-colors cursor-pointer ${
                  i === 0 ? "bg-blue-500/5" : ""
                }`}
              >
                <td className="px-5 py-3 text-xs font-mono text-secondary">{entry.date}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${badgeClasses}`}
                  >
                    {badgeLabel}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-secondary">{entry.title}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
