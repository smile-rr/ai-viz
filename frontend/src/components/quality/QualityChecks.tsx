"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

interface Check {
  name: string;
  category: string;
  status: string;
  details: string;
}

interface QualityChecksProps {
  checks: Check[];
}

const categoryLabelKeys: Record<string, string> = {
  completeness: "checks.category.completeness",
  validity: "checks.category.validity",
  consistency: "checks.category.consistency",
};

const categoryIcons: Record<string, React.ReactNode> = {
  completeness: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  validity: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  consistency: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

const statusIcon = (status: string) => {
  if (status === "pass") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (status === "warn") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
};

export default function QualityChecks({ checks }: QualityChecksProps) {
  const { t } = useI18n();
  // Group by category
  const grouped: Record<string, Check[]> = {};
  for (const check of checks) {
    if (!grouped[check.category]) grouped[check.category] = [];
    grouped[check.category].push(check);
  }

  return (
    <div className="card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted mb-4">
        {t("checks.title")}
      </div>
      <div className="space-y-5">
        {Object.entries(grouped).map(([category, categoryChecks]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-secondary">
                {categoryIcons[category]}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                {categoryLabelKeys[category] ? t(categoryLabelKeys[category]) : category}
              </span>
              <span className="text-[10px] text-muted font-mono ml-auto">
                {categoryChecks.filter((c) => c.status === "pass").length}/
                {categoryChecks.length} {t("checks.passed")}
              </span>
            </div>
            <div className="space-y-1">
              {categoryChecks.map((check, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-card-hover transition-colors"
                  style={{
                    background:
                      check.status === "fail"
                        ? "var(--accent-red-dim)"
                        : check.status === "warn"
                          ? "rgba(255, 193, 7, 0.06)"
                          : "transparent",
                  }}
                >
                  <span className="flex-shrink-0">{statusIcon(check.status)}</span>
                  <span className="text-xs text-foreground flex-1">
                    {check.name}
                  </span>
                  <span className="text-[10px] text-muted font-mono">
                    {check.details}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
