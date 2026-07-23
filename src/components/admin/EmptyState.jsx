import React from "react";
import { FolderOpen } from "lucide-react";

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No items found",
  description = "There are no records matching your current filter criteria.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="liquid-glass border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-heading italic text-xl text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:scale-105 transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
