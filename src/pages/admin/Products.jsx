import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Copy, Eye, Filter, RefreshCw, Package } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { SkeletonTable } from "../../components/admin/SkeletonLoader";
import { useToast } from "../../context/ToastContext";
import {
  fetchAllProductsAdmin,
  deleteProductAdmin,
  duplicateProductAdmin,
} from "../../services/adminProductService";

export default function Products() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStockStatus, setSelectedStockStatus] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Confirm delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProductsAdmin();
      setProducts(data);
    } catch (err) {
      showToast(err.message || "Failed to load products.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.productId) return;
    setIsDeleting(true);

    try {
      await deleteProductAdmin(deleteModal.productId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.productId));
      showToast(`Product "${deleteModal.productName}" deleted successfully.`, "success");
      setDeleteModal({ isOpen: false, productId: null, productName: "" });
    } catch (err) {
      showToast(err.message || "Failed to delete product.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (productId) => {
    try {
      const duplicated = await duplicateProductAdmin(productId);
      setProducts((prev) => [duplicated, ...prev]);
      showToast("Product duplicated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to duplicate product.", "error");
    }
  };

  // Filter application
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;

    if (selectedStockStatus === "In Stock" && Number(p.stock) <= 0) return false;
    if (selectedStockStatus === "Low Stock" && (Number(p.stock) >= 5 || Number(p.stock) <= 0))
      return false;
    if (selectedStockStatus === "Out of Stock" && Number(p.stock) > 0) return false;

    if (selectedStatus === "Active" && !p.isActive) return false;
    if (selectedStatus === "Inactive" && p.isActive) return false;

    return true;
  });

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const columns = [
    {
      header: "Image",
      key: "image",
      render: (row) => (
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/30 border border-white/10 shrink-0">
          <img
            src={row.images?.[0] || row.image || "/images/honey1.jpg"}
            alt={row.name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      header: "Product Name",
      key: "name",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-foreground truncate max-w-xs">{row.name}</p>
          <p className="text-[11px] text-muted-foreground font-mono">{row.weight || "500g"}</p>
        </div>
      ),
    },
    {
      header: "Category",
      key: "category",
      sortable: true,
      render: (row) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">
          {row.category || "Raw"}
        </span>
      ),
    },
    {
      header: "Price",
      key: "price",
      sortable: true,
      render: (row) => (
        <div className="font-semibold text-amber-300">
          ₹{row.price}
          {row.discountPrice && (
            <span className="text-[11px] text-muted-foreground line-through ml-1.5 font-normal">
              ₹{row.discountPrice}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Stock",
      key: "stock",
      sortable: true,
      render: (row) => <StatusBadge status={row.stock} type="stock" />,
    },
    {
      header: "Status",
      key: "isActive",
      sortable: true,
      render: (row) => <StatusBadge status={row.isActive} type="product" />,
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => navigate(`/admin/products/${row.id}/edit`)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors"
            title="Edit product"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDuplicate(row.id)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-white/10 transition-colors"
            title="Duplicate product"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setDeleteModal({ isOpen: true, productId: row.id, productName: row.name })
            }
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <SkeletonTable rows={6} />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold">
            Product Catalog
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Manage your honey inventory, details, pricing, and showcase status.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:scale-105 transition-transform flex items-center gap-2 no-underline shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="liquid-glass border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2 font-medium">
          <Filter className="w-4 h-4 text-primary" /> Filter By:
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
        >
          <option value="All">All Categories</option>
          {categories.filter((c) => c !== "All").map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Stock Filter */}
        <select
          value={selectedStockStatus}
          onChange={(e) => setSelectedStockStatus(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
        >
          <option value="All">All Stock Levels</option>
          <option value="In Stock">In Stock (&gt;= 5)</option>
          <option value="Low Stock">Low Stock (&lt; 5)</option>
          <option value="Out of Stock">Out of Stock (0)</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active Only</option>
          <option value="Inactive">Inactive Only</option>
        </select>

        {(selectedCategory !== "All" ||
          selectedStockStatus !== "All" ||
          selectedStatus !== "All") && (
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedStockStatus("All");
              setSelectedStatus("All");
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
        data={filteredProducts}
        searchKey="name"
        searchPlaceholder="Search product by name..."
        pageSize={8}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="Delete Product"
        description={`Are you sure you want to permanently delete "${deleteModal.productName}"? This action cannot be undone.`}
        confirmLabel="Delete Product"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, productId: null, productName: "" })}
      />
    </div>
  );
}
