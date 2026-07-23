import React, { useState } from "react";
import { UploadCloud, X, ArrowLeft, ArrowRight, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadProductImageAdmin } from "../../services/adminImageService";

export default function ImageUploader({ images = [], onChange, productId = "new" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    const uploadedUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadProductImageAdmin(file, productId, (p) => {
          const totalProgress = Math.round(((i + p / 100) / files.length) * 100);
          setProgress(totalProgress);
        });
        uploadedUrls.push(url);
      }

      onChange([...images, ...uploadedUrls]);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = (index) => {
    const nextImages = images.filter((_, i) => i !== index);
    onChange(nextImages);
  };

  const handleMove = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const nextImages = [...images];
    const [movedItem] = nextImages.splice(fromIndex, 1);
    nextImages.splice(toIndex, 0, movedItem);
    onChange(nextImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Drop Zone */}
      <label className="liquid-glass border-2 border-dashed border-white/20 hover:border-primary/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5 text-center group">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>
        <p className="text-sm font-semibold text-foreground">
          {uploading ? "Compressing & Uploading..." : "Click or drag images to upload"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports JPG, PNG, WEBP up to 5MB (auto-compressed)
        </p>

        {uploading && (
          <div className="w-full max-w-xs bg-black/40 h-2 rounded-full mt-4 overflow-hidden border border-white/10">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </label>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
          {error}
        </p>
      )}

      {/* Image Thumbnails Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={url + idx}
              className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square bg-black/40 shadow-lg"
            >
              <img
                src={url}
                alt={`Product image ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover badge for first image */}
              {idx === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-primary-foreground font-semibold text-[10px] uppercase shadow">
                  Main Image
                </span>
              )}

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, idx - 1)}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-primary text-white hover:text-black transition-colors"
                    title="Move left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, idx + 1)}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-primary text-white hover:text-black transition-colors"
                    title="Move right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
