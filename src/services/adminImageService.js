import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../lib/firebase";

/**
 * Client-side image compression using HTML5 Canvas.
 * Resizes max dimension to 1200px and converts to JPEG quality 0.82.
 * @param {File} file - Original file object
 * @param {number} [maxWidth=1200] - Max width/height
 * @param {number} [quality=0.82] - Compression quality (0 to 1)
 * @returns {Promise<Blob>} Compressed blob
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      return reject(new Error("File must be an image."));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas compression failed."));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Uploads a product image file to Firebase Storage after compression.
 * Shows progress callback.
 * 
 * @param {File} file - Image file
 * @param {string} productId - Product ID or "temp"
 * @param {function} [onProgress] - Callback (percentage: number) => void
 * @returns {Promise<string>} Download URL of uploaded image
 */
export const uploadProductImageAdmin = async (file, productId = "products", onProgress = () => {}) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error("Invalid image format. Allowed: JPG, JPEG, PNG, WEBP");
  }

  const MAX_SIZE_MB = 5;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image size exceeds limit of ${MAX_SIZE_MB}MB.`);
  }

  // 1. Compress image
  onProgress(10);
  const compressedBlob = await compressImage(file, 1200, 0.82);

  // 2. Generate unique storage ref
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileName = `${timestamp}_${randomStr}.jpg`;
  const storagePath = `products/${productId}/${fileName}`;
  const storageRef = ref(storage, storagePath);

  // 3. Upload bytes with progress tracking & Cache-Control headers
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, compressedBlob, {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000, immutable",
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 90 + 10
        );
        onProgress(progress);
      },
      (error) => {
        console.error("Firebase Storage Upload Error:", error);
        reject(new Error("Image upload failed: " + error.message));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onProgress(100);
          resolve(downloadURL);
        } catch (err) {
          reject(new Error("Failed to retrieve image URL: " + err.message));
        }
      }
    );
  });
};

/**
 * Delete an image from Firebase Storage by URL.
 */
export const deleteProductImageAdmin = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes("firebasestorage")) {
    return true; // Ignore local static images (/images/honey1.jpg)
  }

  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.warn("Could not delete image from Storage:", error.message);
    return false;
  }
};
