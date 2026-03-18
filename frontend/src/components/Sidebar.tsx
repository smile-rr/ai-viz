"use client";

import React from "react";
import { useI18n } from "@/i18n/context";

interface SidebarProps {
  open: boolean;
  activeSection: string;
  onNavigate: (section: string) => void;
}

interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
}

interface NavGroup {
  groupKey: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    groupKey: "nav.dashboard",
    items: [
      {
        id: "overview",
        labelKey: "nav.overview",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
    ],
  },
  {
    groupKey: "nav.markets",
    items: [
      {
        id: "cn-markets",
        labelKey: "nav.cn-markets",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
      {
        id: "global",
        labelKey: "nav.global",
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
        labelKey: "nav.fx",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
      {
        id: "commodities",
        labelKey: "nav.commodities",
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
        labelKey: "nav.crypto",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
          </svg>
        ),
      },
    ],
  },
  {
    groupKey: "nav.analytics",
    items: [
      {
        id: "reports",
        labelKey: "nav.reports",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
    ],
  },
  {
    groupKey: "nav.platform",
    items: [
      {
        id: "architecture",
        labelKey: "nav.architecture",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        ),
      },
      {
        id: "quality",
        labelKey: "nav.quality",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar({ open, activeSection, onNavigate }: SidebarProps) {
  const { t } = useI18n();

  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 z-40 bg-[#0c0c14] border-r border-border transition-all duration-300 ease-in-out ${
        open ? "w-48" : "w-14"
      }`}
    >
      <nav className="flex flex-col p-2 mt-2">
        {navGroups.map((group, groupIdx) => (
          <div key={group.groupKey}>
            {/* Divider between groups (not before first) */}
            {groupIdx > 0 && (
              <div className="mx-2 my-1.5 border-t border-border/50" />
            )}

            {/* Group header — only visible when expanded */}
            {open && (
              <div className="px-2.5 pt-2 pb-1">
                <span className="text-[10px] uppercase tracking-widest text-muted font-semibold">
                  {t(group.groupKey)}
                </span>
              </div>
            )}

            {/* Nav items */}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-blue-dim text-blue"
                      : "text-secondary hover:text-foreground hover:bg-card"
                  }`}
                  title={t(item.labelKey)}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {open && (
                    <span className="truncate text-xs font-medium">
                      {t(item.labelKey)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {open && (
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <div className="p-3 rounded-md bg-card border border-border">
            <div className="text-[10px] uppercase tracking-wider text-muted mb-1">System</div>
            <div className="text-xs text-secondary">{t("system.refreshFreq")}</div>
            <div className="text-xs text-secondary">{t("system.cnSource")}</div>
            <div className="text-xs text-secondary">{t("system.globalSource")}</div>
          </div>
        </div>
      )}
    </aside>
  );
}
