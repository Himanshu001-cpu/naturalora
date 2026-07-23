import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs last month",
  prefix = "",
  suffix = "",
}) {
  const isPositive = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-glass border border-white/10 rounded-2xl p-5 lg:p-6 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 shadow-xl"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <h3 className="font-heading italic text-3xl font-semibold text-foreground mt-1 text-shimmer">
            {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}{suffix}
          </h3>
        </div>
        {Icon && (
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-semibold ${
              isPositive
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/15 text-red-400 border border-red-500/20"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          <span className="text-muted-foreground text-[11px]">{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
}
