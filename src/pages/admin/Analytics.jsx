import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, TrendingUp, Users, Package, Award } from "lucide-react";
import StatsCard from "../../components/admin/StatsCard";
import RevenueChart from "../../components/admin/RevenueChart";
import OrdersChart from "../../components/admin/OrdersChart";
import { SkeletonCard, SkeletonTable } from "../../components/admin/SkeletonLoader";
import { useToast } from "../../context/ToastContext";
import { getAdminAnalyticsData } from "../../services/adminAnalyticsService";

export default function Analytics() {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAdminAnalyticsData()
      .then((analytics) => {
        if (isMounted) {
          setData(analytics);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading analytics:", err);
        showToast("Failed to compile analytics.", "error");
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const { stats, charts, bestSellingProducts, topCategories } = data || {
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      returningCustomerRate: 0,
    },
    charts: { monthlyRevenueChart: [], weeklyOrdersChart: [] },
    bestSellingProducts: [],
    topCategories: [],
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold">
          Analytics & Performance Insights
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Deep dive into sales trends, average order values, top-selling honey varieties, and customer retention.
        </p>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Revenue"
          value={stats.totalRevenue}
          prefix="₹"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
        />
        <StatsCard
          title="Avg. Order Value (AOV)"
          value={stats.averageOrderValue}
          prefix="₹"
          icon={TrendingUp}
        />
        <StatsCard
          title="Returning Customers"
          value={`${stats.returningCustomerRate}%`}
          icon={Users}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="font-heading italic text-xl text-foreground font-semibold">
              Monthly Revenue Trajectory (Last 6 Months)
            </h3>
            <p className="text-xs text-muted-foreground">Aggregated verified sales</p>
          </div>
          <RevenueChart data={charts.monthlyRevenueChart} />
        </div>

        {/* Weekly Orders chart */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="font-heading italic text-xl text-foreground font-semibold">
              Weekly Order Volume (Last 7 Days)
            </h3>
            <p className="text-xs text-muted-foreground">Fulfillment frequency</p>
          </div>
          <OrdersChart data={charts.weeklyOrdersChart} />
        </div>
      </div>

      {/* Grid: Best Sellers & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-heading italic text-xl text-primary font-semibold">
              Top Selling Honey Products
            </h3>
          </div>

          {bestSellingProducts.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">
              No sales data recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {bestSellingProducts.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.quantity} units sold
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-300 text-xs">
                    ₹{item.revenue.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Categories by Revenue */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-heading italic text-xl text-primary font-semibold">
              Category Revenue Breakdown
            </h3>
          </div>

          {topCategories.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">
              No category revenue records yet.
            </p>
          ) : (
            <div className="space-y-3">
              {topCategories.map((cat) => {
                const percentage =
                  stats.totalRevenue > 0
                    ? Math.round((cat.revenue / stats.totalRevenue) * 100)
                    : 0;

                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-foreground">{cat.category} Honey</span>
                      <span className="text-amber-300 font-bold">
                        ₹{cat.revenue.toLocaleString("en-IN")} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
