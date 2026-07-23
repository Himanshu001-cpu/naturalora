import React from "react";

export function SkeletonCard() {
  return (
    <div className="liquid-glass border border-white/10 rounded-2xl p-6 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="w-10 h-10 rounded-xl bg-white/10" />
      </div>
      <div className="h-8 bg-white/15 rounded w-1/2" />
      <div className="h-3 bg-white/10 rounded w-2/3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="liquid-glass border border-white/10 rounded-2xl p-6 animate-pulse space-y-4">
      <div className="h-8 bg-white/10 rounded w-full mb-6" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-lg bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded w-1/3" />
            <div className="h-3 bg-white/5 rounded w-1/4" />
          </div>
          <div className="h-6 bg-white/10 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 animate-pulse space-y-6">
      <div className="h-8 bg-white/10 rounded w-1/4 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-10 bg-white/5 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-10 bg-white/5 rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-1/4" />
        <div className="h-24 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}
