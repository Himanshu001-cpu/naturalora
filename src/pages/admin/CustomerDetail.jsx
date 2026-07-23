import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  Eye,
} from "lucide-react";
import StatusBadge from "../../components/admin/StatusBadge";
import { SkeletonForm } from "../../components/admin/SkeletonLoader";
import { useToast } from "../../context/ToastContext";
import { fetchCustomerByIdAdmin } from "../../services/adminCustomerService";

export default function CustomerDetail() {
  const { uid } = useParams();
  const { showToast } = useToast();

  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchCustomerByIdAdmin(uid)
      .then((data) => {
        if (isMounted) {
          setCustomerData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading customer profile:", err);
        showToast("Failed to load customer profile.", "error");
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [uid]);

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

  if (loading) {
    return <SkeletonForm />;
  }

  if (!customerData) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Customer profile not found.
      </div>
    );
  }

  const { profile, orders, totalOrders, totalSpent } = customerData;

  // Extract unique shipping addresses from orders
  const uniqueAddresses = Array.from(
    new Set(
      orders
        .map((o) =>
          o.customer?.address
            ? `${o.customer.address}, ${o.customer.city}, ${o.customer.state} - ${o.customer.pincode}`
            : null
        )
        .filter(Boolean)
    )
  );

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header & Back link */}
      <div>
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3 font-medium no-underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Customers
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-xl">
            {profile.name?.[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold">
              {profile.name || "Customer Profile"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              UID: {profile.uid}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-glass border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">
              Total Orders
            </p>
            <p className="font-heading italic text-3xl font-bold text-foreground mt-1">
              {totalOrders}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="liquid-glass border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">
              Lifetime Spent
            </p>
            <p className="font-heading italic text-3xl font-bold text-amber-300 mt-1">
              ₹{totalSpent.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="liquid-glass border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">
              Member Since
            </p>
            <p className="font-heading italic text-xl font-bold text-foreground mt-1">
              {formatDate(profile.createdAt)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Profile Details + Saved Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            Contact Information
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-muted-foreground text-[11px]">Email Address</p>
                <p className="font-medium text-foreground">{profile.email || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-muted-foreground text-[11px]">Phone Number</p>
                <p className="font-medium text-foreground">{profile.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground text-[11px]">Default Address</p>
                <p className="font-medium text-foreground leading-relaxed">
                  {profile.address || "Not set in profile"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Addresses History */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            Shipping Address History ({uniqueAddresses.length})
          </h3>

          {uniqueAddresses.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-4">
              No delivery addresses recorded from past orders.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {uniqueAddresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/20 border border-white/5 text-xs text-foreground leading-relaxed flex items-start gap-2.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{addr}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order History Table */}
      <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
        <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
          Order History ({orders.length})
        </h3>

        {orders.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            This customer has not placed any orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-2">Order ID</th>
                  <th className="pb-3 px-2">Date</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-mono text-primary font-semibold">
                      #{order.id.slice(0, 10)}...
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-2 font-bold text-amber-300">
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
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
