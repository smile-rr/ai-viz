"use client";

import React, { useState } from "react";

interface GuideToggleProps {
  content: string;
}

export default function GuideToggle({ content }: GuideToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="inline-flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors"
        style={{
          background: open
            ? "rgba(41, 121, 255, 0.15)"
            : "rgba(41, 121, 255, 0.08)",
          color: open
            ? "rgba(41, 121, 255, 1)"
            : "rgba(41, 121, 255, 0.6)",
          border: `1px solid ${open ? "rgba(41, 121, 255, 0.3)" : "rgba(41, 121, 255, 0.12)"}`,
        }}
        aria-label="Toggle data guide"
        title="Data guide"
      >
        ?
      </button>
      {open && (
        <div
          className="mt-2 animate-fade-in"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "8px",
            padding: "12px 16px",
            background: "rgba(41, 121, 255, 0.06)",
            border: "1px solid rgba(41, 121, 255, 0.15)",
            borderRadius: "8px",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "#8b8fa3",
            zIndex: 10,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
