import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Fetch all orders for admin view, sorted by date descending.
 */
export const fetchAllOrdersAdmin = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders = querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || new Date().toISOString(),
        deliveryStatus: data.deliveryStatus || data.status || "pending",
        statusHistory: data.statusHistory || [],
        adminNotes: data.adminNotes || [],
      };
    });

    // Client-side sort by date descending
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("Failed to load orders: " + error.message);
  }
};

/**
 * Fetch single order details by Firestore doc ID.
 */
export const fetchOrderByIdAdmin = async (orderId) => {
  try {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Order not found");
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : data.createdAt || new Date().toISOString(),
      deliveryStatus: data.deliveryStatus || data.status || "pending",
      statusHistory: data.statusHistory || [],
      adminNotes: data.adminNotes || [],
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw new Error("Failed to load order details: " + error.message);
  }
};

/**
 * Update order status (e.g. pending, packed, shipped, delivered, cancelled).
 * Maintains a statusHistory array with timestamps and admin UID.
 */
export const updateOrderStatusAdmin = async (orderId, newStatus, adminUid = "admin") => {
  try {
    const docRef = doc(db, "orders", orderId);

    const historyItem = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      updatedBy: adminUid,
    };

    await updateDoc(docRef, {
      status: newStatus,
      deliveryStatus: newStatus,
      statusHistory: arrayUnion(historyItem),
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status: " + error.message);
  }
};

/**
 * Add an admin note to an order.
 */
export const addOrderNoteAdmin = async (orderId, noteText, adminUid = "admin") => {
  if (!noteText?.trim()) return false;

  try {
    const docRef = doc(db, "orders", orderId);

    const noteItem = {
      id: "note_" + Date.now(),
      text: noteText.trim(),
      createdAt: new Date().toISOString(),
      createdBy: adminUid,
    };

    await updateDoc(docRef, {
      adminNotes: arrayUnion(noteItem),
      updatedAt: serverTimestamp(),
    });

    return noteItem;
  } catch (error) {
    console.error("Error adding order note:", error);
    throw new Error("Failed to add order note: " + error.message);
  }
};
