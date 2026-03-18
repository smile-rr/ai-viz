"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

interface CoverageMatrixProps {
  coverage: Record<string, Record<string, boolean>>;
}

const assetLabelKeys: Record<string, string> = {
  equity: "coverage.asset.equity",
  index: "coverage.asset.index",
  macro: "coverage.asset.macro",
  fx: "coverage.asset.fx",
  commodity: "coverage.asset.commodity",
  crypto: "coverage.asset.crypto",
};

export default function CoverageMatrix({ coverage }: CoverageMatrixProps) {
  const { t } = useI18n();
  const markets = Object.keys(coverage);
  const assetClasses = markets.length > 0 ? Object.keys(coverage[markets[0]]) : [];

  const totalCells = markets.length * assetClasses.length;
  const coveredCells = markets.reduce(
    (acc, m) =>
      acc + assetClasses.filter((a) => coverage[m][a]).length,
    0
  );
  const coveragePct = totalCells > 0 ? Math.round((coveredCells / totalCells) * 100) : 0;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-wider text-muted">
          {t("coverage.title")}
        </div>
        <span className="text-[10px] font-mono text-secondary">
          {coveredCells}/{totalCells} ({coveragePct}%)
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[420px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3">{t("coverage.col.market")}</th>
              {assetClasses.map((ac) => (
                <th key={ac} className="text-center py-2 px-3">
                  {assetLabelKeys[ac] ? t(assetLabelKeys[ac]) : ac}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {markets.map((market) => (
              <tr
                key={market}
                className="border-b border-border/50 hover:bg-card-hover transition-colors"
              >
                <td className="py-2.5 px-3 font-medium text-foreground">
                  {market}
                </td>
                {assetClasses.map((ac) => (
                  <td key={ac} className="text-center py-2.5 px-3">
                    {coverage[market][ac] ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--accent-green)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="inline-block"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className="text-muted">--</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
