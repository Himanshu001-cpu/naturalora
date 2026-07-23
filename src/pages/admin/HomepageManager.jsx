import React, { useEffect, useState } from "react";
import { Save, Sparkles, Check, Loader2 } from "lucide-react";
import { SkeletonForm } from "../../components/admin/SkeletonLoader";
import { useToast } from "../../context/ToastContext";
import {
  getHomepageConfigAdmin,
  updateHomepageConfigAdmin,
} from "../../services/adminHomepageService";
import { fetchAllProductsAdmin } from "../../services/adminProductService";

export default function HomepageManager() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);

  const [config, setConfig] = useState({
    featuredProductIds: [],
    heroProductId: "",
    bannerText: "",
    promotionalText: "",
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([getHomepageConfigAdmin(), fetchAllProductsAdmin()])
      .then(([cfg, prods]) => {
        if (isMounted) {
          setProducts(prods);
          setConfig({
            featuredProductIds: cfg.featuredProductIds || [],
            heroProductId: cfg.heroProductId || "",
            bannerText: cfg.bannerText || "100% Pure, Organic & Lab-Tested Forest Honey",
            promotionalText:
              cfg.promotionalText ||
              "Raw, unprocessed honey sourced from pristine landscapes. No additives. No shortcuts. Just purity.",
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading homepage config:", err);
        showToast("Failed to load homepage settings.", "error");
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFeatured = (productId) => {
    setConfig((prev) => {
      const exists = prev.featuredProductIds.includes(productId);
      const updated = exists
        ? prev.featuredProductIds.filter((id) => id !== productId)
        : [...prev.featuredProductIds, productId];

      return { ...prev, featuredProductIds: updated };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHomepageConfigAdmin(config);
      showToast("Homepage layout configuration saved!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SkeletonForm />;
  }

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" /> Homepage Content Control
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Customize featured products, hero highlight, promotional banners, and site announcements.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="self-start sm:self-auto px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Featured Products Selector */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="font-heading italic text-xl text-primary font-semibold">
              Featured Products Carousel
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Select products to showcase on the homepage product grid ({config.featuredProductIds.length} selected)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-2">
            {products.map((prod) => {
              const isSelected = config.featuredProductIds.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  onClick={() => handleToggleFeatured(prod.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/15 border-primary text-foreground shadow-md"
                      : "bg-black/20 border-white/10 text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <img
                    src={prod.images?.[0] || prod.image || "/images/honey1.jpg"}
                    alt={prod.name}
                    className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">₹{prod.price}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-bold"
                        : "border border-white/20"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Product Selection */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            Hero Highlight Product
          </h3>
          <p className="text-xs text-muted-foreground">
            Select a main hero product to highlight in the hero banner.
          </p>

          <select
            value={config.heroProductId}
            onChange={(e) => setConfig((prev) => ({ ...prev, heroProductId: e.target.value }))}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 cursor-pointer"
          >
            <option value="">-- No specific hero product selected --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₹{p.price})
              </option>
            ))}
          </select>
        </div>

        {/* Banner Text & Promotional Subtext */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
          <h3 className="font-heading italic text-xl text-primary font-semibold border-b border-white/10 pb-3">
            Homepage Announcement & Promo Text
          </h3>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">
              Hero Headline Banner Text
            </label>
            <input
              type="text"
              value={config.bannerText}
              onChange={(e) => setConfig((prev) => ({ ...prev, bannerText: e.target.value }))}
              placeholder="e.g. Nature's Gold, Perfected."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">
              Promotional Subtext
            </label>
            <textarea
              rows={3}
              value={config.promotionalText}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, promotionalText: e.target.value }))
              }
              placeholder="e.g. Raw, unprocessed honey sourced from pristine landscapes. No additives. No shortcuts. Just purity."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Save Homepage Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
