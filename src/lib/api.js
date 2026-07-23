import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Fetch all products from the Firestore "products" collection.
 * @returns {Promise<Array>} Array of product objects with Firestore doc IDs.
 */
export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to load products. Please try again later.");
  }
};

/**
 * Fetch a single product by its Firestore document ID.
 * @param {string} id - The Firestore document ID.
 * @returns {Promise<Object>} The product object.
 */
export const fetchProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Product not found");
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    // Re-throw "not found" as-is, wrap everything else
    if (error.message === "Product not found") {
      throw error;
    }
    console.error("Error fetching product:", error);
    throw new Error("Failed to load product. Please try again later.");
  }
};
