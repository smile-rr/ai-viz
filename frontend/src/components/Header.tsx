"use client";

import React from "react";

interface HeaderProps {
  date: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ date, sidebarOpen, onToggleSidebar }: HeaderProps) {
  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

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
          <span className="text-xs text-muted font-mono">TERMINAL</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="font-mono">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-dim text-green text-xs font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-green" />
          LIVE
        </div>
      </div>
    </header>
  );
}
