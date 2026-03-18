"use client";

import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function TabNav({ tabs, activeTab, onChange }: TabNavProps) {
  return (
    <div className="flex gap-1 p-1 bg-card border border-border rounded-lg w-fit overflow-x-auto whitespace-nowrap max-w-full" style={{ scrollSnapType: "x mandatory" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex-shrink-0 ${
            activeTab === tab.id
              ? "bg-[#2979ff] text-white shadow-sm"
              : "text-secondary hover:text-foreground hover:bg-border/50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
