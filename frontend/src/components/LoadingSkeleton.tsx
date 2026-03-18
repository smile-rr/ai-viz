"use client";

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-5 w-24" />
            <div className="skeleton h-8 w-full" />
          </div>
        ))}
      </div>

      {/* Chart row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="skeleton h-3 w-32 mb-4" />
            <div className="skeleton h-72 w-full" />
          </div>
        ))}
      </div>

      {/* Tables row skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="skeleton h-3 w-28" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="skeleton h-8 w-full" />
            ))}
          </div>
        ))}
      </div>

      {/* Heatmap skeleton */}
      <div className="card p-4">
        <div className="skeleton h-3 w-48 mb-4" />
        <div className="skeleton h-32 w-full" />
      </div>
    </div>
  );
}
