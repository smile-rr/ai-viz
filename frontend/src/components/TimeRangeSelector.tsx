"use client";

import React from "react";

const ALL_RANGES = ["1W", "1M", "3M", "6M", "1Y", "ALL"] as const;

export type TimeRange = (typeof ALL_RANGES)[number];

interface TimeRangeSelectorProps {
  selected: string;
  onChange: (range: string) => void;
  availableRanges?: string[];
}

export default function TimeRangeSelector({
  selected,
  onChange,
  availableRanges,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-1">
      {ALL_RANGES.map((range) => {
        const isAvailable = !availableRanges || availableRanges.includes(range);
        const isActive = selected === range;

        return (
          <button
            key={range}
            disabled={!isAvailable}
            onClick={() => isAvailable && onChange(range)}
            className={`
              px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isAvailable
                    ? "bg-[#1e2235] text-[#8b8fa3] hover:bg-[#262a40] hover:text-[#b0b4c8]"
                    : "bg-[#151724] text-[#3a3e52] cursor-not-allowed"
              }
            `}
          >
            {range}
          </button>
        );
      })}
    </div>
  );
}
