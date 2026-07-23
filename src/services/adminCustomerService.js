import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Fetch all registered customers and calculate lifetime order metrics.
 */
export const fetchAllCustomersAdmin = async () => {
  try {
    const usersSnap = await getDocs(collection(db, "users"));
    const ordersSnap = await getDocs(collection(db, "orders"));

    const allOrders = ordersSnap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    const customers = usersSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      const userUid = docSnap.id;

      // Find user orders by userId or matching email
      const userOrders = allOrders.filter(
        (o) =>
          o.userId === userUid ||
          (o.customerEmail && data.email && o.customerEmail.toLowerCase() === data.email.toLowerCase())
      );

      // Total spent (sum of paid or completed orders)
      const validOrders = userOrders.filter(
        (o) => o.status === "paid" || o.status === "delivered" || o.status === "shipped" || o.status === "packed"
      );

      const totalSpent = validOrders.reduce(
        (acc, curr) => acc + Number(curr.totalAmount || curr.amount || 0),
        0
      );

      // Latest order date
      let lastOrderDate = null;
      if (userOrders.length > 0) {
        const sorted = [...userOrders].sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        const latest = sorted[0];
        lastOrderDate = latest.createdAt?.toDate
          ? latest.createdAt.toDate().toISOString()
          : latest.createdAt || null;
      }

      return {
        uid: userUid,
        id: userUid,
        name: data.name || "Customer",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        totalOrders: userOrders.length,
        totalSpent: totalSpent,
        lastOrderDate: lastOrderDate,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || new Date().toISOString(),
      };
    });

    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Failed to load customer directory: " + error.message);
  }
};

/**
 * Fetch a single customer's full profile and order history.
 */
export const fetchCustomerByIdAdmin = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);

    let customerProfile = null;
    if (userSnap.exists()) {
      customerProfile = { uid: userSnap.id, ...userSnap.data() };
    }

    // Fetch customer's orders
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", uid));
    const ordersSnap = await getDocs(q);

    let customerOrders = ordersSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || new Date().toISOString(),
      };
    });

    // If customer record missing in `users`, fallback to order customer info
    if (!customerProfile && customerOrders.length > 0) {
      const sampleOrder = customerOrders[0];
      customerProfile = {
        uid: uid,
        name: sampleOrder.customerName || sampleOrder.customer?.name || "Customer",
        email: sampleOrder.customerEmail || sampleOrder.customer?.email || "",
        phone: sampleOrder.customer?.phone || "",
        address: sampleOrder.customer?.address || "",
      };
    }

    customerOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const totalSpent = customerOrders
      .filter((o) => o.status !== "failed" && o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || o.amount || 0), 0);

    return {
      profile: customerProfile || { uid, name: "Unknown Customer", email: "", phone: "", address: "" },
      orders: customerOrders,
      totalOrders: customerOrders.length,
      totalSpent: totalSpent,
    };
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw new Error("Failed to load customer profile: " + error.message);
  }
};
