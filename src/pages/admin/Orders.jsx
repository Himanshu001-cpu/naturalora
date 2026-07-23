import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Eye, ShoppingBag, ArrowRight } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import { SkeletonTable } from "../../components/admin/SkeletonLoader";
import { useToast } from "../../context/ToastContext";
import {
  fetchAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../../services/adminOrderService";

export default function Orders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [deliveryFilter, setDeliveryFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrdersAdmin();
      setOrders(data);
    } catch (err) {
      showToast(err.message || "Failed to load orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAdmin(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus, deliveryStatus: newStatus } : o
        )
      );
      showToast(`Order #${orderId.slice(0, 8)} status updated to ${newStatus}`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
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

  // Filter application
  const filteredOrders = orders.filter((o) => {
    if (deliveryFilter !== "All" && o.deliveryStatus?.toLowerCase() !== deliveryFilter.toLowerCase()) {
      return false;
    }
    if (paymentFilter !== "All") {
      const statusLower = o.status?.toLowerCase() || "";
      if (paymentFilter === "Paid" && statusLower !== "paid" && statusLower !== "completed") return false;
      if (paymentFilter === "Pending" && statusLower !== "pending") return false;
      if (paymentFilter === "Failed" && statusLower !== "failed") return false;
    }
    return true;
  });

  const columns = [
    {
      header: "Order ID",
      key: "id",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-primary font-semibold text-xs">
          #{row.id.slice(0, 10)}...
        </span>
      ),
    },
    {
      header: "Customer",
      key: "customerName",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-foreground truncate">{row.customerName || "Guest User"}</p>
          <p className="text-[11px] text-muted-foreground truncate">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      header: "Date",
      key: "createdAt",
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground text-xs">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: "Amount",
      key: "totalAmount",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-amber-300">
          ₹{row.totalAmount || row.amount}
        </span>
      ),
    },
    {
      header: "Payment Status",
      key: "status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} type="order" />,
    },
    {
      header: "Fulfillment",
      key: "deliveryStatus",
      render: (row) => (
        <select
          value={row.deliveryStatus || row.status || "pending"}
          onChange={(e) => handleQuickStatusChange(row.id, e.target.value)}
          className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none cursor-pointer"
        >
          <option value="pending">Pending</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      header: "Details",
      key: "actions",
      align: "right",
      render: (row) => (
        <Link
          to={`/admin/orders/${row.id}`}
          className="p-1.5 rounded-lg text-primary hover:bg-white/10 transition-colors inline-flex items-center gap-1 text-xs font-semibold no-underline"
        >
          <Eye className="w-4 h-4" /> View
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
          Order Management
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Monitor incoming purchases, verify payment status, and update shipping workflows.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="liquid-glass border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2 font-medium">
          <Filter className="w-4 h-4 text-primary" /> Filter Orders:
        </div>

        {/* Fulfillment Filter */}
        <select
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
        >
          <option value="All">All Fulfillment Statuses</option>
          <option value="pending">Pending</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
        >
          <option value="All">All Payment States</option>
          <option value="Paid">Paid / Verified</option>
          <option value="Pending">Pending Payment</option>
          <option value="Failed">Failed Payment</option>
        </select>

        {(deliveryFilter !== "All" || paymentFilter !== "All") && (
          <button
            onClick={() => {
              setDeliveryFilter("All");
              setPaymentFilter("All");
            }}
            className="text-xs text-primary hover:underline ml-auto font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchKey="customerName"
        searchPlaceholder="Search order by customer name..."
        pageSize={8}
      />
    </div>
  );
}
