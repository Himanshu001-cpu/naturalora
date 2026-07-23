import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Fetch all products from Firestore for admin view (no filters/cache).
 */
export const fetchAllProductsAdmin = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        price: Number(data.price || 0),
        discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
        stock: Number(data.stock || 0),
        isFeatured: Boolean(data.isFeatured),
        isBestseller: Boolean(data.isBestseller),
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        images: data.images || (data.image ? [data.image] : []),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching all products for admin:", error);
    throw new Error("Failed to load products. Please check permissions or connection.");
  }
};

/**
 * Create a new product in Firestore.
 */
export const createProductAdmin = async (productData) => {
  try {
    const payload = {
      name: productData.name?.trim() || "",
      shortDescription: productData.shortDescription?.trim() || "",
      fullDescription: productData.fullDescription?.trim() || "",
      tagline: productData.shortDescription?.trim() || "",
      description: productData.fullDescription?.trim() || productData.shortDescription?.trim() || "",
      category: productData.category || "Raw",
      price: Number(productData.price || 0),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
      weight: productData.weight?.trim() || "500g",
      stock: Number(productData.stock || 0),
      origin: productData.origin?.trim() || "",
      harvestSeason: productData.harvestSeason?.trim() || "",
      floralSource: productData.floralSource?.trim() || "",
      purityNotes: productData.purityNotes?.trim() || "",
      nutritionalInfo: productData.nutritionalInfo?.trim() || "",
      image: productData.images?.[0] || productData.image || "/images/honey1.jpg",
      images: productData.images || (productData.image ? [productData.image] : []),
      isFeatured: Boolean(productData.isFeatured),
      isBestseller: Boolean(productData.isBestseller),
      isActive: productData.isActive !== undefined ? Boolean(productData.isActive) : true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "products"), payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product: " + error.message);
  }
};

/**
 * Update an existing product document.
 */
export const updateProductAdmin = async (productId, updates) => {
  try {
    const docRef = doc(db, "products", productId);
    const payload = {
      ...updates,
      ...(updates.price !== undefined && { price: Number(updates.price) }),
      ...(updates.stock !== undefined && { stock: Number(updates.stock) }),
      ...(updates.discountPrice !== undefined && {
        discountPrice: updates.discountPrice ? Number(updates.discountPrice) : null,
      }),
      ...(updates.images?.length > 0 && { image: updates.images[0] }),
      ...(updates.shortDescription !== undefined && { tagline: updates.shortDescription }),
      ...(updates.fullDescription !== undefined && { description: updates.fullDescription }),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, payload);
    return { id: productId, ...payload };
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product: " + error.message);
  }
};

/**
 * Delete a product document.
 */
export const deleteProductAdmin = async (productId) => {
  try {
    const docRef = doc(db, "products", productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product: " + error.message);
  }
};

/**
 * Duplicate a product.
 */
export const duplicateProductAdmin = async (productId) => {
  try {
    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Product to duplicate not found.");
    }

    const data = docSnap.data();
    const duplicatedData = {
      ...data,
      name: `${data.name} (Copy)`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    delete duplicatedData.id;

    const newDocRef = await addDoc(collection(db, "products"), duplicatedData);
    return { id: newDocRef.id, ...duplicatedData };
  } catch (error) {
    console.error("Error duplicating product:", error);
    throw new Error("Failed to duplicate product: " + error.message);
  }
};

/**
 * Update stock level directly (inventory adjustment).
 */
export const updateProductStockAdmin = async (productId, newStock) => {
  try {
    const docRef = doc(db, "products", productId);
    await updateDoc(docRef, {
      stock: Math.max(0, Number(newStock)),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating stock:", error);
    throw new Error("Failed to update stock: " + error.message);
  }
};
