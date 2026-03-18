"use client";

import React from "react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="card p-8 max-w-md text-center">
        <div className="w-12 h-12 rounded-full bg-red-dim flex items-center justify-center mx-auto mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff1744"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="text-foreground font-semibold mb-2">Data Load Error</h3>
        <p className="text-secondary text-sm mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-md bg-blue text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
