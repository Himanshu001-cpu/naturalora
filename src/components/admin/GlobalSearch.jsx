import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, ShoppingBag, Users, X, ArrowRight, Loader2 } from "lucide-react";
import { fetchAllProductsAdmin } from "../../services/adminProductService";
import { fetchAllOrdersAdmin } from "../../services/adminOrderService";
import { fetchAllCustomersAdmin } from "../../services/adminCustomerService";

export default function GlobalSearch({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ products: [], orders: [], customers: [] });

  // Fetch index data when opened
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchAllProductsAdmin().catch(() => []),
      fetchAllOrdersAdmin().catch(() => []),
      fetchAllCustomersAdmin().catch(() => []),
    ]).then(([prods, ords, custs]) => {
      if (isMounted) {
        setData({ products: prods, orders: ords, customers: custs });
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchTerm = query.trim().toLowerCase();

  const filteredProducts = searchTerm
    ? data.products.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm) ||
          p.category?.toLowerCase().includes(searchTerm)
      )
    : [];

  const filteredOrders = searchTerm
    ? data.orders.filter(
        (o) =>
          o.id?.toLowerCase().includes(searchTerm) ||
          o.customerName?.toLowerCase().includes(searchTerm) ||
          o.customerEmail?.toLowerCase().includes(searchTerm)
      )
    : [];

  const filteredCustomers = searchTerm
    ? data.customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchTerm) ||
          c.email?.toLowerCase().includes(searchTerm) ||
          c.phone?.includes(searchTerm)
      )
    : [];

  const hasResults =
    filteredProducts.length > 0 ||
    filteredOrders.length > 0 ||
    filteredCustomers.length > 0;

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="liquid-glass border border-amber-500/30 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Search input bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, customers..."
            className="w-full bg-transparent text-foreground placeholder-white/40 text-base focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-white/40 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground px-2 py-1 rounded bg-white/5 border border-white/10"
          >
            ESC
          </button>
        </div>

        {/* Results container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Indexing store records...</span>
            </div>
          ) : !searchTerm ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              Type at least 1 character to search products, orders, or customers.
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              No results found for "<span className="text-foreground">{query}</span>"
            </div>
          ) : (
            <>
              {/* Products */}
              {filteredProducts.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Products ({filteredProducts.length})
                  </div>
                  <div className="space-y-1">
                    {filteredProducts.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelect(`/admin/products/${product.id}/edit`)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 hover:bg-primary/10 border border-white/5 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-9 h-9 rounded-lg object-cover bg-black/40 border border-white/10"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div className="truncate">
                            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ₹{product.price} • Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders */}
              {filteredOrders.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> Orders ({filteredOrders.length})
                  </div>
                  <div className="space-y-1">
                    {filteredOrders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        onClick={() => handleSelect(`/admin/orders/${order.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 hover:bg-primary/10 border border-white/5 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                            Order #{order.id.slice(0, 10)}... — {order.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹{order.totalAmount || order.amount} • Status: {order.status}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {filteredCustomers.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Customers ({filteredCustomers.length})
                  </div>
                  <div className="space-y-1">
                    {filteredCustomers.slice(0, 4).map((customer) => (
                      <div
                        key={customer.uid}
                        onClick={() => handleSelect(`/admin/customers/${customer.uid}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 hover:bg-primary/10 border border-white/5 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                            {customer.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {customer.email} • Spent: ₹{customer.totalSpent || 0}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
