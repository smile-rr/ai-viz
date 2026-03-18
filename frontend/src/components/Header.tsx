"use client";

import React, { useMemo } from "react";
import { useI18n } from "@/i18n/context";

interface HeaderProps {
  date: string;
  generatedAt?: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  isRefreshing?: boolean;
}

/** Check if a market is currently in trading hours */
function getMarketStatus(): { label: string; labelZh: string; isOpen: boolean } {
  const now = new Date();
  const utcH = now.getUTCHours();
  const utcM = now.getUTCMinutes();
  const utcMinutes = utcH * 60 + utcM;
  const day = now.getUTCDay(); // 0=Sun, 6=Sat

  if (day === 0 || day === 6) {
    return { label: "Markets Closed", labelZh: "休市", isOpen: false };
  }

  // A-share: 01:30–07:00 UTC (09:30–15:00 CST)
  if (utcMinutes >= 90 && utcMinutes <= 420) {
    return { label: "CN Trading", labelZh: "A股交易中", isOpen: true };
  }
  // US: 14:30–21:00 UTC (09:30–16:00 ET)
  if (utcMinutes >= 870 && utcMinutes <= 1260) {
    return { label: "US Trading", labelZh: "美股交易中", isOpen: true };
  }
  // EU: 08:00–16:30 UTC
  if (utcMinutes >= 480 && utcMinutes <= 990) {
    return { label: "EU Trading", labelZh: "欧洲交易中", isOpen: true };
  }

  return { label: "After Hours", labelZh: "盘后", isOpen: false };
}

export default function Header({
  date,
  generatedAt,
  sidebarOpen,
  onToggleSidebar,
  isRefreshing,
}: HeaderProps) {
  const { locale, setLocale, t } = useI18n();

  const displayTimestamp = generatedAt
    ? generatedAt
    : date
      ? new Date(date + "T00:00:00").toLocaleDateString(
          locale === "zh" ? "zh-CN" : "en-US",
          { weekday: "long", year: "numeric", month: "long", day: "numeric" }
        )
      : "";

  const marketStatus = useMemo(() => getMarketStatus(), []);

  const toggleLocale = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-12 sm:h-14 px-2 sm:px-4 border-b border-border bg-[#0c0c14]/95 backdrop-blur-md">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-md hover:bg-card transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
            {sidebarOpen ? (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="15" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? "bg-green animate-pulse" : "bg-muted"}`}
            />
            <span className="text-sm sm:text-base font-bold tracking-wider text-foreground">
              AI-VIZ
            </span>
          </div>
          <span className="text-xs text-muted font-mono hidden sm:inline">{t("header.terminal")}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Data timestamp */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="font-mono">{displayTimestamp}</span>
        </div>

        {/* Market status badge */}
        <div
          className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-md text-[10px] sm:text-xs font-medium ${
            marketStatus.isOpen
              ? "bg-green-dim text-green"
              : "bg-card text-muted border border-border"
          } ${isRefreshing ? "animate-pulse" : ""}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              marketStatus.isOpen ? "bg-green" : "bg-muted"
            } ${isRefreshing ? "animate-ping" : ""}`}
          />
          <span className="hidden sm:inline">{locale === "zh" ? marketStatus.labelZh : marketStatus.label}</span>
          <span className="sm:hidden">{marketStatus.isOpen ? (locale === "zh" ? "开" : "Live") : (locale === "zh" ? "休" : "Off")}</span>
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLocale}
          className="flex items-center justify-center px-1.5 sm:px-2 py-1 rounded-md bg-card border border-border text-[10px] sm:text-xs font-medium text-secondary hover:text-foreground hover:border-border-hover transition-colors"
          title={locale === "en" ? "Switch to Chinese" : "Switch to English"}
        >
          {locale === "en" ? "\u4e2d" : "EN"}
        </button>
      </div>
    </header>
  );
}
