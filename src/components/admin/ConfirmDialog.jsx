import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  description = "Are you sure you want to perform this action? This cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="liquid-glass border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                variant === "danger"
                  ? "bg-red-500/10 border border-red-500/30 text-red-400"
                  : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading italic text-xl text-foreground font-semibold">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50 ${
                variant === "danger"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{confirmLabel}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
