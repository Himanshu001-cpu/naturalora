import React, { useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  const { message, type, duration } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getVariantStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-950/80 border-emerald-500/40 text-emerald-300",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
        };
      case "error":
        return {
          bg: "bg-red-950/80 border-red-500/40 text-red-300",
          icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
        };
      case "warning":
        return {
          bg: "bg-amber-950/80 border-amber-500/40 text-amber-300",
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
        };
      case "info":
      default:
        return {
          bg: "bg-amber-900/60 border-primary/40 text-amber-200",
          icon: <Info className="w-5 h-5 text-primary shrink-0" />,
        };
    }
  };

  const { bg, icon } = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className={`pointer-events-auto liquid-glass border rounded-xl p-4 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 ${bg}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon}
        <p className="text-xs md:text-sm font-medium leading-snug truncate">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
