import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Check } from "lucide-react";
import ImageUploader from "../../components/admin/ImageUploader";
import { SkeletonForm } from "../../components/admin/SkeletonLoader";
import { useToast } from "../../context/ToastContext";
import {
  createProductAdmin,
  updateProductAdmin,
} from "../../services/adminProductService";
import { fetchProductById } from "../../lib/api";

export default function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    category: "Raw",
    price: "",
    discountPrice: "",
    weight: "500g",
    stock: "10",
    origin: "Himalayas, India",
    harvestSeason: "Spring / Autumn",
    floralSource: "Wildflowers & Forest Flora",
    purityNotes: "100% Raw, Unfiltered, Cold-Extracted, Zero Additives",
    nutritionalInfo: "Energy: 304 kcal, Carbs: 82g, Natural Sugars: 80g per 100g",
    images: [],
    isFeatured: false,
    isBestseller: false,
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;
    setLoading(true);

    fetchProductById(id)
      .then((data) => {
        if (isMounted && data) {
          setFormData({
            name: data.name || "",
            shortDescription: data.shortDescription || data.tagline || "",
            fullDescription: data.fullDescription || data.description || "",
            category: data.category || "Raw",
            price: data.price?.toString() || "",
            discountPrice: data.discountPrice?.toString() || "",
            weight: data.weight || "500g",
            stock: data.stock?.toString() || "0",
            origin: data.origin || "",
            harvestSeason: data.harvestSeason || "",
            floralSource: data.floralSource || "",
            purityNotes: data.purityNotes || "",
            nutritionalInfo: data.nutritionalInfo || "",
            images: data.images || (data.image ? [data.image] : []),
            isFeatured: Boolean(data.isFeatured),
            isBestseller: Boolean(data.isBestseller),
            isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        showToast("Failed to load product details.", "error");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Product name is required.";
    if (!formData.price || Number(formData.price) <= 0)
      errs.price = "Valid price > 0 is required.";
    if (formData.stock === "" || Number(formData.stock) < 0)
      errs.stock = "Stock quantity cannot be negative.";
    if (!formData.shortDescription.trim())
      errs.shortDescription = "Short description / tagline is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please fix errors before submitting.", "warning");
      return;
    }

    setSaving(true);
    try {
      if (isEditMode) {
        await updateProductAdmin(id, formData);
        showToast("Product updated successfully!", "success");
      } else {
        await createProductAdmin(formData);
        showToast("New product created successfully!", "success");
      }
      navigate("/admin/products");
    } catch (err) {
      showToast(err.message || "Failed to save product.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SkeletonForm />;
  }

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header & Back link */}
      <div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3 font-medium no-underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Configure pricing, stock, sourcing specifications, and image gallery.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="self-start sm:self-auto px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Product
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Details Card */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            1. Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Acacia Wild Honey"
                className={`w-full bg-black/30 border ${
                  errors.name ? "border-red-500" : "border-white/10"
                } rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 cursor-pointer"
              >
                <option value="Raw">Raw Honey</option>
                <option value="Wild">Wild Forest Honey</option>
                <option value="Infused">Infused / Speciality</option>
                <option value="Organic">Organic Farm</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">
              Short Description / Tagline *
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="e.g. Deep, earthy, untouched raw forest honey."
              className={`w-full bg-black/30 border ${
                errors.shortDescription ? "border-red-500" : "border-white/10"
              } rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60`}
            />
            {errors.shortDescription && (
              <p className="text-red-400 text-xs mt-1">{errors.shortDescription}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">
              Full Description
            </label>
            <textarea
              name="fullDescription"
              rows={4}
              value={formData.fullDescription}
              onChange={handleChange}
              placeholder="Detailed description of taste, texture, harvest process, and health benefits..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 resize-none"
            />
          </div>
        </div>

        {/* Pricing & Inventory Card */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            2. Pricing & Stock
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                className={`w-full bg-black/30 border ${
                  errors.price ? "border-red-500" : "border-white/10"
                } rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60`}
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Discount Price (₹, optional)
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="399"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Jar Weight / Volume *
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="500g"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                className={`w-full bg-black/30 border ${
                  errors.stock ? "border-red-500" : "border-white/10"
                } rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60`}
              />
              {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            3. Product Specifications & Origin
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Origin Region
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="High Himalayan Valleys"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Harvest Season
              </label>
              <input
                type="text"
                name="harvestSeason"
                value={formData.harvestSeason}
                onChange={handleChange}
                placeholder="Early Spring"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Floral Source
              </label>
              <input
                type="text"
                name="floralSource"
                value={formData.floralSource}
                onChange={handleChange}
                placeholder="Acacia Blossoms"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Purity & Lab Verification Notes
              </label>
              <textarea
                name="purityNotes"
                rows={2}
                value={formData.purityNotes}
                onChange={handleChange}
                placeholder="Lab tested for zero adulteration, non-heated..."
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Nutritional Information
              </label>
              <textarea
                name="nutritionalInfo"
                rows={2}
                value={formData.nutritionalInfo}
                onChange={handleChange}
                placeholder="Energy: 304 kcal per 100g..."
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Card */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            4. Product Images
          </h3>

          <ImageUploader
            images={formData.images}
            onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
            productId={id || "new"}
          />
        </div>

        {/* Toggles & Visibility */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            5. Status & Showcase Toggles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center gap-3 p-4 rounded-xl bg-black/30 border border-white/10 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 accent-primary rounded"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">Active Status</p>
                <p className="text-[11px] text-muted-foreground">
                  Visible in customer shop listing
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-xl bg-black/30 border border-white/10 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 accent-primary rounded"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">Featured Product</p>
                <p className="text-[11px] text-muted-foreground">
                  Highlighted on homepage
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-xl bg-black/30 border border-white/10 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isBestseller"
                checked={formData.isBestseller}
                onChange={handleChange}
                className="w-4 h-4 accent-primary rounded"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">Bestseller Badge</p>
                <p className="text-[11px] text-muted-foreground">
                  Show top-seller badge in store
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2.5 rounded-full border border-white/10 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> {isEditMode ? "Update Product" : "Publish Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
