import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import StatsCard from "../../components/admin/StatsCard";
import StatusBadge from "../../components/admin/StatusBadge";
import RevenueChart from "../../components/admin/RevenueChart";
import OrdersChart from "../../components/admin/OrdersChart";
import { SkeletonCard, SkeletonTable } from "../../components/admin/SkeletonLoader";
import { getAdminAnalyticsData } from "../../services/adminAnalyticsService";
import { fetchAllOrdersAdmin } from "../../services/adminOrderService";
import { fetchAllProductsAdmin } from "../../services/adminProductService";
import { fetchAllCustomersAdmin } from "../../services/adminCustomerService";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const [analyticsData, orders, products, customers] = await Promise.all([
        getAdminAnalyticsData(),
        fetchAllOrdersAdmin(),
        fetchAllProductsAdmin(),
        fetchAllCustomersAdmin(),
      ]);

      setAnalytics(analyticsData);
      setLatestOrders(orders.slice(0, 5));
      setLowStockProducts(products.filter((p) => Number(p.stock) < 5));
      setRecentCustomers(customers.slice(0, 5));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonTable rows={4} />
      </div>
    );
  }

  const { stats, charts } = analytics || {
    stats: { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0 },
    charts: { monthlyRevenueChart: [], weeklyOrdersChart: [] },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold">
            Executive Overview
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Real-time sales, order fulfillment, and inventory analytics for Naturalora.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto px-4 py-2.5 rounded-full liquid-glass border border-amber-500/20 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Revenue"
          value={stats.totalRevenue}
          prefix="₹"
          icon={DollarSign}
          trend={12.4}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          trend={8.2}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend={15.3}
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading italic text-xl text-foreground font-semibold">
                Revenue This Month
              </h3>
              <p className="text-xs text-muted-foreground">Monthly sales trajectory</p>
            </div>
            <Link
              to="/admin/analytics"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium no-underline"
            >
              Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <RevenueChart data={charts.monthlyRevenueChart} />
        </div>

        {/* Weekly Orders Chart */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading italic text-xl text-foreground font-semibold">
                Orders This Week
              </h3>
              <p className="text-xs text-muted-foreground">Daily volume Breakdown</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium no-underline"
            >
              All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <OrdersChart data={charts.weeklyOrdersChart} />
        </div>
      </div>

      {/* Bottom Grid: Latest Orders & Low Stock / Recent Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Orders (2 cols) */}
        <div className="lg:col-span-2 liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading italic text-xl text-foreground font-semibold">
                Latest Orders
              </h3>
              <p className="text-xs text-muted-foreground">Recent transactions requiring fulfillment</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium no-underline"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {latestOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No orders placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground font-medium uppercase tracking-wider">
                    <th className="pb-3 px-2">Order ID</th>
                    <th className="pb-3 px-2">Customer</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {latestOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 font-mono text-primary font-medium">
                        #{order.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-2 font-medium text-foreground">
                        {order.customerName || "Customer"}
                      </td>
                      <td className="py-3 px-2 font-semibold text-amber-300">
                        ₹{order.totalAmount || order.amount}
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={order.status} type="order" />
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-xs text-primary hover:underline font-semibold no-underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock & Recent Customers Column (1 col) */}
        <div className="space-y-6">
          {/* Low Stock Warning */}
          <div className="liquid-glass border border-amber-500/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading italic text-lg text-foreground font-semibold">
                Low Stock Alerts ({lowStockProducts.length})
              </h3>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                All inventory levels are currently healthy!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {lowStockProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-white/5 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-medium text-foreground truncate">{prod.name}</p>
                      <p className="text-[11px] text-muted-foreground">{prod.category}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      {prod.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/admin/inventory"
              className="mt-4 block text-center text-xs text-primary hover:underline font-medium no-underline"
            >
              Manage Inventory →
            </Link>
          </div>

          {/* Recent Customers */}
          <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading italic text-lg text-foreground font-semibold">
                Recent Customers
              </h3>
              <Link
                to="/admin/customers"
                className="text-xs text-primary hover:underline font-medium no-underline"
              >
                View All
              </Link>
            </div>

            {recentCustomers.length === 0 ? (
              <p className="text-xs text-muted-foreground">No customer records yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentCustomers.map((cust) => (
                  <Link
                    key={cust.uid}
                    to={`/admin/customers/${cust.uid}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors no-underline"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                      {cust.name?.[0]?.toUpperCase() || "C"}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-medium text-foreground truncate">
                        {cust.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {cust.email}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
