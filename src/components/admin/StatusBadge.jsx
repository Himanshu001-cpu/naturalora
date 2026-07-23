import React from "react";
import { CheckCircle2, Clock, Truck, Package, XCircle, AlertTriangle } from "lucide-react";

export default function StatusBadge({ status, type = "order" }) {
  const normalized = status?.toString().toLowerCase() || "";

  if (type === "order") {
    switch (normalized) {
      case "paid":
      case "delivered":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="capitalize">{status}</span>
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case "packed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Package className="w-3.5 h-3.5" /> Packed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "cancelled":
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-400">
            <XCircle className="w-3.5 h-3.5" />
            <span className="capitalize">{status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-muted-foreground border border-white/10 capitalize">
            {status || "Processing"}
          </span>
        );
    }
  }

  // Product status
  if (type === "product") {
    if (normalized === "active" || status === true) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-muted-foreground border border-white/10">
        Inactive
      </span>
    );
  }

  // Stock status
  if (type === "stock") {
    const stockNum = Number(status);
    if (stockNum <= 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-400">
          <XCircle className="w-3 h-3" /> Out of Stock
        </span>
      );
    }
    if (stockNum < 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400">
          <AlertTriangle className="w-3 h-3" /> Low Stock ({stockNum})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
        In Stock ({stockNum})
      </span>
    );
  }

  return <span className="text-xs">{status}</span>;
}
