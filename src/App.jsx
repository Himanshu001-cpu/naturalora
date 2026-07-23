import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import Navbar from "./components/Navbar";
import BeeFollower from "./components/BeeFollower";
import HoneyField from "./components/HoneyField";
import HoneyCursorLight from "./components/HoneyCursorLight";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineBanner from "./components/OfflineBanner";
import { initAnalytics, trackPageView } from "./lib/analytics";

// Home is kept eagerly loaded for fast first contentful paint
import Home from "./pages/Home";

// Customer pages lazy-loaded
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin imports
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";

// Lazy-loaded admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminProductForm = lazy(() => import("./pages/admin/ProductForm"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminOrderDetail = lazy(() => import("./pages/admin/OrderDetail"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminCustomerDetail = lazy(() => import("./pages/admin/CustomerDetail"));
const AdminInventory = lazy(() => import("./pages/admin/Inventory"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminHomepageManager = lazy(() => import("./pages/admin/HomepageManager"));

function HashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    let targetId = location.hash.slice(1);
    try {
      targetId = decodeURIComponent(targetId);
    } catch {
      targetId = location.hash.slice(1);
    }

    let timeoutId;

    const scrollToHash = () => {
      const target = document.getElementById(targetId);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    timeoutId = window.setTimeout(scrollToHash, 50);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname, location.hash]);

  return null;
}

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
      <p className="text-xs font-medium text-muted-foreground">Loading Naturalora...</p>
    </div>
  );
}

function AdminPageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
      <p className="text-xs font-medium text-muted-foreground">Loading workspace...</p>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location.pathname, location.search]);

  // Render Admin Workspace
  if (isAdminRoute) {
    return (
      <ErrorBoundary>
        <AdminRoute>
          <AdminLayout>
            <Suspense fallback={<AdminPageFallback />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/new" element={<AdminProductForm />} />
                <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/customers/:uid" element={<AdminCustomerDetail />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/settings/homepage" element={<AdminHomepageManager />} />
                <Route path="/admin/homepage" element={<AdminHomepageManager />} />
                <Route path="/admin/*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AdminLayout>
        </AdminRoute>
      </ErrorBoundary>
    );
  }

  // Render Customer-facing Application
  return (
    <ErrorBoundary>
      <div className="bg-background min-h-screen overflow-x-hidden">
        {/* Offline connectivity banner */}
        <OfflineBanner />

        {/* HoneyField sits at z-0, behind the glass surface */}
        <HoneyField />

        {/* Cursor Interaction (Subtle light) */}
        <HoneyCursorLight />

        {/* z-2 keeps BeeFollower above the cursor-light (z-1) layer */}
        <BeeFollower />

        {/* All page content floats above the honeycomb at z-10 with slight blur */}
        <main id="main-content" className="relative z-10 backdrop-blur-[2px]">
          <HashScroll />
          <Navbar />
          <Suspense fallback={<LoadingFallback />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}



