"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

interface QualityScorecardProps {
  score: number;
  generatedAt: string;
  passCount: number;
  warnCount: number;
  failCount: number;
}

export default function QualityScorecard({
  score,
  generatedAt,
  passCount,
  warnCount,
  failCount,
}: QualityScorecardProps) {
  const { t } = useI18n();
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score > 90
      ? "var(--accent-green)"
      : score > 70
        ? "var(--accent-gold)"
        : "var(--accent-red)";
  const colorDim =
    score > 90
      ? "var(--accent-green-dim)"
      : score > 70
        ? "rgba(255, 193, 7, 0.12)"
        : "var(--accent-red-dim)";

  return (
    <div className="card p-6 flex flex-col items-center gap-4">
      <div className="text-[10px] uppercase tracking-wider text-muted self-start">
        {t("quality.overallScore")}
      </div>

      <div className="relative">
        <svg width="170" height="170" viewBox="0 0 170 170">
          {/* Background track */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transform="rotate(-90 85 85)"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
          {/* Glow effect */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transform="rotate(-90 85 85)"
            opacity="0.15"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-[10px] text-muted uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--accent-green)" }}
          />
          <span className="text-xs text-secondary">
            {passCount} {t("quality.passed")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--accent-gold)" }}
          />
          <span className="text-xs text-secondary">
            {warnCount} {t("quality.warnings")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--accent-red)" }}
          />
          <span className="text-xs text-secondary">
            {failCount} {t("quality.failed")}
          </span>
        </div>
      </div>

      <div className="text-[10px] text-muted font-mono mt-1" style={{ color: colorDim }}>
        {t("quality.lastChecked")} {generatedAt}
      </div>
    </div>
  );
}
