import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Package,
  LogOut,
  Edit2,
  Check,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Phone as PhoneIcon,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../services/authService";

export default function Account() {
  const navigate = useNavigate();
  const { user, userProfile, logout, updateProfileData } = useAuth();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'orders'
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Sync profile data into edit form
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name || user?.displayName || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
      });
    }
  }, [userProfile, user]);

  // Fetch orders when switching to orders tab or on mount
  useEffect(() => {
    let isMounted = true;
    if (user?.uid) {
      setIsLoadingOrders(true);
      getUserOrders(user.uid)
        .then((fetchedOrders) => {
          if (isMounted) {
            setOrders(fetchedOrders);
            setIsLoadingOrders(false);
          }
        })
        .catch((err) => {
          console.error("Failed to load orders:", err);
          if (isMounted) setIsLoadingOrders(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage({ type: "", text: "" });

    try {
      await updateProfileData({
        name: profileForm.name,
        phone: profileForm.phone,
        address: profileForm.address,
      });
      setIsEditing(false);
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setProfileMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      setProfileMessage({
        type: "error",
        text: err.message || "Failed to update profile.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-400">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-muted-foreground">
            {status || "Processing"}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-40 lg:pb-24 px-4 lg:px-16 max-w-5xl mx-auto">
      {/* Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-heading text-foreground">My Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal profile and view past orders
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2 rounded-xl liquid-glass border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8 gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-4 text-sm font-medium transition-all relative flex items-center gap-2 ${
            activeTab === "profile"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          Personal Information
          {activeTab === "profile" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 text-sm font-medium transition-all relative flex items-center gap-2 ${
            activeTab === "orders"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="w-4 h-4" />
          My Orders ({orders.length})
          {activeTab === "orders" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {profileMessage.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${
            profileMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400"
              : "bg-red-500/10 border border-red-500/40 text-red-400"
          }`}
        >
          {profileMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{profileMessage.text}</span>
        </motion.div>
      )}

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" ? (
          <motion.div
            key="profile-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="liquid-glass backdrop-blur-md rounded-2xl p-6 lg:p-8"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h2 className="text-xl font-heading italic text-primary">
                Personal Details
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-lg liquid-glass-strong text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfileForm({
                      name: userProfile?.name || user?.displayName || "",
                      phone: userProfile?.phone || "",
                      address: userProfile?.address || "",
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg liquid-glass text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 text-xs font-semibold"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-xs text-white/70 mb-1.5 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Full Name"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1.5 font-medium">
                    Email Address (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    value={user?.email || userProfile?.email || ""}
                    disabled
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white/50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1.5 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="10-digit mobile number"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1.5 font-medium">
                    Default Delivery Address
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.address}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="House/Flat No, Street, City, State, Pincode"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 text-foreground resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 rounded-xl liquid-glass-strong text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/20 border border-white/5">
                  <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/50 font-medium">Full Name</p>
                    <p className="text-base text-foreground font-medium mt-0.5">
                      {userProfile?.name || user?.displayName || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/20 border border-white/5">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/50 font-medium">Email Address</p>
                    <p className="text-base text-foreground font-medium mt-0.5">
                      {user?.email || userProfile?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/20 border border-white/5">
                  <PhoneIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/50 font-medium">Phone Number</p>
                    <p className="text-base text-foreground font-medium mt-0.5">
                      {userProfile?.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/20 border border-white/5">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/50 font-medium">Delivery Address</p>
                    <p className="text-base text-foreground font-medium mt-0.5">
                      {userProfile?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="orders-tab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            {isLoadingOrders ? (
              <div className="liquid-glass backdrop-blur-md rounded-2xl p-12 text-center flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="liquid-glass backdrop-blur-md rounded-2xl p-12 text-center">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-heading text-foreground mb-1">
                  No orders found
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  You haven't placed any orders yet.
                </p>
                <button
                  onClick={() => navigate("/shop")}
                  className="px-6 py-2.5 rounded-xl liquid-glass-strong text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-semibold"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="liquid-glass backdrop-blur-md rounded-2xl p-5 lg:p-6 transition-all border border-white/10"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs text-white/50">
                          #{order.id.slice(0, 10)}...
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-xs text-white/50">Total Amount</p>
                        <p className="text-lg font-heading text-primary font-semibold">
                          ₹{order.totalAmount || order.amount}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="px-3 py-1.5 rounded-lg liquid-glass-strong text-xs text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1 font-medium"
                      >
                        {expandedOrderId === order.id ? (
                          <>
                            Hide Details <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            View Details <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Details */}
                  {expandedOrderId === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-5 pt-5 border-t border-white/10 space-y-4"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                          Items Purchased
                        </h4>
                        <div className="space-y-3">
                          {order.items?.map((item, idx) => (
                            <div
                              key={item.productId || idx}
                              className="flex items-center gap-4 bg-black/20 p-2.5 rounded-xl"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/5"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} × ₹{item.price}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                ₹{item.price * item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment & Shipping Meta */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                        {order.customer?.address && (
                          <div className="bg-black/20 p-3 rounded-xl">
                            <p className="text-white/50 font-medium mb-1">
                              Shipping Address
                            </p>
                            <p className="text-foreground">
                              {order.customer.name}
                            </p>
                            <p className="text-muted-foreground mt-0.5">
                              {order.customer.address}
                            </p>
                            <p className="text-muted-foreground">
                              {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                            </p>
                          </div>
                        )}

                        <div className="bg-black/20 p-3 rounded-xl">
                          <p className="text-white/50 font-medium mb-1">
                            Payment Information
                          </p>
                          <p className="text-foreground">
                            Status: <span className="capitalize">{order.status}</span>
                          </p>
                          {order.payment?.paymentId && (
                            <p className="text-muted-foreground font-mono mt-1 text-[11px] truncate">
                              ID: {order.payment.paymentId}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
