import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  CreditCard,
  Plus,
  Send,
  Loader2,
} from "lucide-react";
import StatusBadge from "../../components/admin/StatusBadge";
import { SkeletonForm } from "../../components/admin/SkeletonLoader";
import { useToast } from "../../context/ToastContext";
import {
  fetchOrderByIdAdmin,
  updateOrderStatusAdmin,
  addOrderNoteAdmin,
} from "../../services/adminOrderService";

export default function OrderDetail() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Admin notes state
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await fetchOrderByIdAdmin(id);
      setOrder(data);
    } catch (err) {
      showToast(err.message || "Failed to load order.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateOrderStatusAdmin(id, newStatus);
      setOrder((prev) => ({
        ...prev,
        status: newStatus,
        deliveryStatus: newStatus,
        statusHistory: [
          ...prev.statusHistory,
          { status: newStatus, timestamp: new Date().toISOString(), updatedBy: "admin" },
        ],
      }));
      showToast(`Order status updated to "${newStatus}"`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update status.", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    try {
      const addedNote = await addOrderNoteAdmin(id, newNote);
      setOrder((prev) => ({
        ...prev,
        adminNotes: [...(prev.adminNotes || []), addedNote],
      }));
      setNewNote("");
      showToast("Internal note added.", "success");
    } catch (err) {
      showToast(err.message || "Failed to add note.", "error");
    } finally {
      setAddingNote(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <SkeletonForm />;
  }

  if (!order) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Order not found.
      </div>
    );
  }

  const currentStatus = (order.deliveryStatus || order.status || "pending").toLowerCase();
  const stages = ["pending", "packed", "shipped", "delivered"];
  const currentStageIndex = stages.indexOf(currentStatus);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header & Back link */}
      <div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3 font-medium no-underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold">
                Order #{order.id.slice(0, 10)}
              </h1>
              <StatusBadge status={order.status} type="order" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Status Update Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Update Status:</span>
            <select
              value={order.deliveryStatus || order.status || "pending"}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              className="bg-black/40 border border-primary/40 rounded-xl px-4 py-2 text-xs font-semibold text-primary focus:outline-none cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual Order Timeline */}
      <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="font-heading italic text-xl text-primary font-semibold mb-6">
          Order Timeline & Fulfillment Progress
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {stages.map((stage, idx) => {
            const isPassed = currentStageIndex >= idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={stage}
                className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isPassed
                    ? "bg-primary/10 border-primary/40 text-foreground"
                    : "bg-black/20 border-white/5 text-muted-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                    isPassed
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className="capitalize text-xs font-semibold">{stage}</span>
                {isCurrent && (
                  <span className="text-[10px] text-primary font-mono mt-1">Current State</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Order Items + Customer & Address */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchased Items (2 cols) */}
        <div className="lg:col-span-2 liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            Items Purchased ({order.items?.length || 0})
          </h3>

          <div className="space-y-4">
            {order.items?.map((item, idx) => (
              <div
                key={item.productId || idx}
                className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-white/5"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
                  <img
                    src={item.image || "/images/honey1.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <div className="font-semibold text-amber-300 text-sm">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{order.totalAmount || order.amount}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-emerald-400 font-medium">Free Express Delivery</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-foreground pt-2 border-t border-white/10">
              <span>Total Amount</span>
              <span className="text-xl font-heading text-amber-300">
                ₹{order.totalAmount || order.amount}
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Customer, Shipping Address & Payment Meta */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm border-b border-white/10 pb-3">
              <User className="w-4 h-4" /> Customer Profile
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium text-foreground">{order.customerName || "Customer"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground truncate">{order.customerEmail || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">{order.customer?.phone || "N/A"}</p>
            </div>
          </div>

          {/* Address Card */}
          <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm border-b border-white/10 pb-3">
              <MapPin className="w-4 h-4" /> Shipping Address
            </div>
            <p className="text-xs text-foreground font-medium">{order.customer?.name}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {order.customer?.address}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
            </p>
          </div>

          {/* Payment Card */}
          <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm border-b border-white/10 pb-3">
              <CreditCard className="w-4 h-4" /> Payment Info
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gateway Status</p>
              <p className="text-xs font-semibold text-emerald-400 capitalize mt-0.5">
                {order.status}
              </p>
            </div>
            {order.paymentId && (
              <div>
                <p className="text-xs text-muted-foreground">Razorpay Payment ID</p>
                <p className="text-xs font-mono text-amber-300 truncate mt-0.5">
                  {order.paymentId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Notes Section */}
      <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
        <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
          Internal Admin Notes
        </h3>

        {/* Existing Notes */}
        {order.adminNotes?.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {order.adminNotes.map((note) => (
              <div
                key={note.id || note.createdAt}
                className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-mono text-primary font-semibold">
                    Admin ({note.createdBy || "Super Admin"})
                  </span>
                  <span>{formatDate(note.createdAt)}</span>
                </div>
                <p className="text-foreground leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No internal notes recorded for this order yet.
          </p>
        )}

        {/* Add Note Input */}
        <form onSubmit={handleAddNote} className="flex gap-3">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add internal note (e.g. Verified tracking number with BlueDart...)"
            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={addingNote || !newNote.trim()}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:scale-105 transition-transform disabled:opacity-50"
          >
            {addingNote ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Add Note</span>
          </button>
        </form>
      </div>
    </div>
  );
}
