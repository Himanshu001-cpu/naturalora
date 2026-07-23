import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Eye, ArrowUpDown, Filter } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { SkeletonTable } from "../../components/admin/SkeletonLoader";
import { useToast } from "../../context/ToastContext";
import { fetchAllCustomersAdmin } from "../../services/adminCustomerService";

export default function Customers() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("spent"); // 'spent' | 'recent' | 'orders'

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCustomersAdmin();
      setCustomers(data);
    } catch (err) {
      showToast(err.message || "Failed to load customers.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "No orders yet";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortBy === "spent") return b.totalSpent - a.totalSpent;
    if (sortBy === "orders") return b.totalOrders - a.totalOrders;
    if (sortBy === "recent") {
      const dateA = a.lastOrderDate ? new Date(a.lastOrderDate) : new Date(0);
      const dateB = b.lastOrderDate ? new Date(b.lastOrderDate) : new Date(0);
      return dateB - dateA;
    }
    return 0;
  });

  const columns = [
    {
      header: "Customer",
      key: "name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/30">
            {row.name?.[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <p className="font-semibold text-foreground truncate">{row.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Total Orders",
      key: "totalOrders",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-foreground px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
          {row.totalOrders} order{row.totalOrders !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      header: "Total Spent",
      key: "totalSpent",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-amber-300 text-sm">
          ₹{row.totalSpent?.toLocaleString("en-IN") || 0}
        </span>
      ),
    },
    {
      header: "Last Order Date",
      key: "lastOrderDate",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.lastOrderDate)}
        </span>
      ),
    },
    {
      header: "Profile",
      key: "actions",
      align: "right",
      render: (row) => (
        <Link
          to={`/admin/customers/${row.uid}`}
          className="p-1.5 rounded-lg text-primary hover:bg-white/10 transition-colors inline-flex items-center gap-1 text-xs font-semibold no-underline"
        >
          <Eye className="w-4 h-4" /> Profile
        </Link>
      ),
    },
  ];

  if (loading) {
    return <SkeletonTable rows={6} />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold">
          Customer Directory
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Registered customer accounts, purchase history, and lifetime customer value.
        </p>
      </div>

      {/* Sort Filter Bar */}
      <div className="liquid-glass border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Filter className="w-4 h-4 text-primary" /> Sort Customers By:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer font-semibold"
          >
            <option value="spent">Highest Spending</option>
            <option value="recent">Most Recent Purchase</option>
            <option value="orders">Most Orders Placed</option>
          </select>
        </div>

        <span className="text-xs text-muted-foreground">
          Total Registered: <span className="font-bold text-foreground">{customers.length}</span>
        </span>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={sortedCustomers}
        searchKey="name"
        searchPlaceholder="Search customer by name or email..."
        pageSize={8}
      />
    </div>
  );
}
