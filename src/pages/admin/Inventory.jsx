import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, Plus, Minus, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import StatusBadge from "../../components/admin/StatusBadge";
import { SkeletonTable } from "../../components/admin/SkeletonLoader";
import { useToast } from "../../context/ToastContext";
import {
  fetchAllProductsAdmin,
  updateProductStockAdmin,
} from "../../services/adminProductService";
import { fetchAllOrdersAdmin } from "../../services/adminOrderService";

export default function Inventory() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        fetchAllProductsAdmin(),
        fetchAllOrdersAdmin(),
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      showToast(err.message || "Failed to load inventory.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockAdjust = async (productId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    setUpdatingId(productId);

    try {
      await updateProductStockAdmin(productId, newStock);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );
      showToast("Stock updated successfully.", "success");
    } catch (err) {
      showToast(err.message || "Failed to adjust stock.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkOutOfStock = async (productId) => {
    setUpdatingId(productId);
    try {
      await updateProductStockAdmin(productId, 0);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: 0 } : p))
      );
      showToast("Product marked out of stock.", "warning");
    } catch (err) {
      showToast(err.message || "Failed to update stock.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <SkeletonTable rows={6} />;
  }

  // Stock Aggregations
  const totalStock = products.reduce((acc, curr) => acc + Number(curr.stock || 0), 0);

  // Reserved stock: pending / packed orders item count
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.deliveryStatus === "packed"
  );

  const reservedStock = pendingOrders.reduce((acc, order) => {
    if (Array.isArray(order.items)) {
      return acc + order.items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    }
    return acc;
  }, 0);

  // Sold stock: paid / delivered orders
  const completedOrders = orders.filter(
    (o) => o.status === "paid" || o.status === "delivered" || o.deliveryStatus === "shipped"
  );

  const soldStock = completedOrders.reduce((acc, order) => {
    if (Array.isArray(order.items)) {
      return acc + order.items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    }
    return acc;
  }, 0);

  const lowStockCount = products.filter((p) => Number(p.stock) < 5).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold">
            Inventory Management
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Track current stock levels, reserved units, and quickly adjust inventory.
          </p>
        </div>

        <button
          onClick={loadData}
          className="self-start sm:self-auto px-4 py-2.5 rounded-full liquid-glass border border-amber-500/20 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Inventory
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-glass border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">
              Current Available Stock
            </p>
            <p className="font-heading italic text-3xl font-bold text-foreground mt-1">
              {totalStock} <span className="text-xs font-normal text-muted-foreground">units</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="liquid-glass border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">
              Reserved (Pending Orders)
            </p>
            <p className="font-heading italic text-3xl font-bold text-amber-300 mt-1">
              {reservedStock} <span className="text-xs font-normal text-muted-foreground">units</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="liquid-glass border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">
              Total Units Sold
            </p>
            <p className="font-heading italic text-3xl font-bold text-emerald-400 mt-1">
              {soldStock} <span className="text-xs font-normal text-muted-foreground">units</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Low Stock Banner */}
      {lowStockCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              <strong className="font-semibold">{lowStockCount} products</strong> have stock levels below 5 units. Please replenish stock soon.
            </span>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
        <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
          Inventory Control Panel ({products.length} Products)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground font-semibold uppercase text-[11px] tracking-wider">
                <th className="pb-3 px-3">Product</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Unit Price</th>
                <th className="pb-3 px-3">Stock Level</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images?.[0] || prod.image || "/images/honey1.jpg"}
                        alt={prod.name}
                        className="w-9 h-9 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-foreground truncate max-w-xs">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {prod.weight || "500g"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-amber-300">
                    ₹{prod.price}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-base">
                    {prod.stock}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={prod.stock} type="stock" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleStockAdjust(prod.id, Number(prod.stock), -1)}
                        disabled={updatingId === prod.id || Number(prod.stock) <= 0}
                        className="w-7 h-7 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 flex items-center justify-center text-foreground disabled:opacity-30"
                        title="Decrease stock"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleStockAdjust(prod.id, Number(prod.stock), +1)}
                        disabled={updatingId === prod.id}
                        className="w-7 h-7 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 flex items-center justify-center text-foreground disabled:opacity-30"
                        title="Increase stock"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMarkOutOfStock(prod.id)}
                        disabled={updatingId === prod.id || Number(prod.stock) === 0}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 disabled:opacity-30 ml-2"
                      >
                        Out of Stock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
