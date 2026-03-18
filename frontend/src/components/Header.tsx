"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

interface HeaderProps {
  date: string;
  generatedAt?: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  isRefreshing?: boolean;
  refreshCountdown?: string;
  showRefresh?: boolean;
}

export default function Header({
  date,
  generatedAt,
  sidebarOpen,
  onToggleSidebar,
  isRefreshing,
  refreshCountdown,
  showRefresh = true,
}: HeaderProps) {
  const { locale, setLocale, t } = useI18n();

  // Show full timestamp if available, otherwise fall back to date-only formatting
  const displayTimestamp = generatedAt
    ? generatedAt
    : date
      ? new Date(date + "T00:00:00").toLocaleDateString(
          locale === "zh" ? "zh-CN" : "en-US",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : "";

  const toggleLocale = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 border-b border-border bg-[#0c0c14]/95 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-card transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span className="text-base font-bold tracking-wider text-foreground">
              AI-VIZ
            </span>
          </div>
          <span className="text-xs text-muted font-mono">{t("header.terminal")}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="font-mono">{displayTimestamp}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-dim text-green text-xs font-medium ${
              isRefreshing ? "animate-pulse" : ""
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full bg-green ${isRefreshing ? "animate-ping" : ""}`} />
            {t("header.live")}
          </div>
          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="flex items-center justify-center px-2 py-1 rounded-md bg-card border border-border text-xs font-medium text-secondary hover:text-foreground hover:border-border-hover transition-colors"
            title={locale === "en" ? "Switch to Chinese" : "Switch to English"}
          >
            {locale === "en" ? "\u4e2d" : "EN"}
          </button>
          {showRefresh && (
            <span className="hidden md:inline text-[10px] text-muted font-mono">
              {t("header.autoRefresh")}
              {refreshCountdown && (
                <span className="ml-1 text-secondary">({refreshCountdown})</span>
              )}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
