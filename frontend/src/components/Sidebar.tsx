"use client";

import React from "react";

interface SidebarProps {
  open: boolean;
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "cn-markets",
    label: "China Markets",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "global",
    label: "Global Markets",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: "fx",
    label: "FX Rates",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "commodities",
    label: "Commodities",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "crypto",
    label: "Crypto",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
      </svg>
    ),
  },
];

export default function Sidebar({ open, activeSection, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 z-40 bg-[#0c0c14] border-r border-border transition-all duration-300 ease-in-out ${
        open ? "w-48" : "w-14"
      }`}
    >
      <nav className="flex flex-col gap-1 p-2 mt-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-all duration-200 ${
              activeSection === item.id
                ? "bg-blue-dim text-blue"
                : "text-secondary hover:text-foreground hover:bg-card"
            }`}
            title={item.label}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {open && (
              <span className="truncate text-xs font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {open && (
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <div className="p-3 rounded-md bg-card border border-border">
            <div className="text-[10px] uppercase tracking-wider text-muted mb-1">System</div>
            <div className="text-xs text-secondary">Refresh: Daily 18:00 CST</div>
            <div className="text-xs text-secondary">CN: AKShare / Tushare</div>
            <div className="text-xs text-secondary">Global: Yahoo Finance</div>
          </div>
        </div>
      )}
    </aside>
  );
}
