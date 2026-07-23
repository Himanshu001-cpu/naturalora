import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Create a new order document in the Firestore "orders" collection.
 * Called BEFORE payment to reserve the order. Status starts as "pending".
 *
 * @param {Object} cart - The cart object with items and getSubtotal().
 * @param {Object} customer - Customer details (name, phone, address, etc.).
 * @param {Object} [userInfo] - Authenticated user details { userId, customerName, customerEmail }.
 * @returns {Promise<Object>} The created order with its Firestore document ID.
 */
export const createOrder = async (cart, customer, userInfo = {}) => {
  try {
    const total = cart.getSubtotal();
    const orderData = {
      userId: userInfo.userId || null,
      customerName: customer.name || userInfo.customerName || "",
      customerEmail: userInfo.customerEmail || customer.email || "",
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      amount: total,
      totalAmount: total,
      status: "pending", // will move to "paid" after verification
      paymentId: null,
      createdAt: serverTimestamp(),
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        pincode: customer.pincode,
        city: customer.city,
        state: customer.state,
      },
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);

    return {
      id: docRef.id,
      ...orderData,
      createdAt: new Date().toISOString(), // local fallback for immediate UI use
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order. Please try again.");
  }
};

/**
 * Update an existing order with verified payment details.
 * Called AFTER Razorpay payment is verified on the backend.
 *
 * @param {string} orderId - Firestore document ID of the order.
 * @param {Object} paymentData - Razorpay response data.
 * @param {string} paymentData.razorpay_payment_id
 * @param {string} paymentData.razorpay_order_id
 * @param {string} paymentData.razorpay_signature
 */
export const markOrderPaid = async (orderId, paymentData) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "paid",
      paymentId: paymentData.razorpay_payment_id,
      payment: {
        paymentId: paymentData.razorpay_payment_id,
        razorpayOrderId: paymentData.razorpay_order_id,
        signature: paymentData.razorpay_signature,
        verified: true,
        paidAt: serverTimestamp(),
      },
    });
  } catch (error) {
    console.error("Error updating order payment status:", error);
    // Non-critical — the payment already succeeded; log for reconciliation
  }
};

/**
 * Mark an order as failed.
 *
 * @param {string} orderId - Firestore document ID of the order.
 * @param {string} reason  - Human-readable failure reason.
 */
export const markOrderFailed = async (orderId, reason) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "failed",
      failureReason: reason,
    });
  } catch (error) {
    console.error("Error marking order as failed:", error);
  }
};
