/**
 * Razorpay Payment Service
 *
 * Handles the full client-side payment lifecycle:
 *   1. Load Razorpay SDK  (lazy, one-time)
 *   2. Create an order via the backend
 *   3. Open Razorpay Checkout modal
 *   4. Verify payment signature via the backend
 *
 * ⚠ The secret key is NEVER present in this file — all sensitive
 *   operations happen on the Express server (/server).
 */

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// ── Razorpay Key ID (public, safe to embed) ──────────────────────────────
// Set VITE_RAZORPAY_KEY_ID in a .env at the project root.
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxxxx";

// ---------------------------------------------------------------------------
// 1. Load the Razorpay Checkout SDK (idempotent)
// ---------------------------------------------------------------------------
let scriptLoaded = false;

const loadRazorpayScript = () => {
  if (scriptLoaded) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      scriptLoaded = true;
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ---------------------------------------------------------------------------
// 2. Create an order on the backend
// ---------------------------------------------------------------------------
const createRazorpayOrder = async (amount) => {
  const res = await fetch(`${API_BASE}/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || "Failed to create payment order");
  }

  return res.json();
};

// ---------------------------------------------------------------------------
// 3. Verify payment signature on the backend
// ---------------------------------------------------------------------------
const verifyPayment = async (paymentData) => {
  const res = await fetch(`${API_BASE}/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });

  if (!res.ok) {
    throw new Error("Payment verification failed");
  }

  return res.json();
};

// ---------------------------------------------------------------------------
// 4. Main entry point — opens the Razorpay checkout
// ---------------------------------------------------------------------------
/**
 * Initiates the full payment flow.
 *
 * @param {Object}  opts
 * @param {number}  opts.amount       - Total in ₹
 * @param {Object}  opts.customer     - { name, phone, email? }
 * @param {string}  [opts.description] - Displayed in the checkout modal
 *
 * @returns {Promise<{ razorpay_order_id, razorpay_payment_id, razorpay_signature, verified }>}
 *          Resolves on successful verified payment.
 *          Rejects on SDK load failure, modal dismiss, or verification failure.
 */
export const initiatePayment = ({ amount, customer, description }) => {
  return new Promise(async (resolve, reject) => {
    // ── Load SDK ────────────────────────────────────────────────────────
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      return reject(new Error("Razorpay SDK failed to load. Check your connection."));
    }

    // ── Create backend order ────────────────────────────────────────────
    let order;
    try {
      order = await createRazorpayOrder(amount);
    } catch (err) {
      return reject(err);
    }

    // ── Open checkout modal ─────────────────────────────────────────────
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,          // in paise
      currency: order.currency || "INR",
      name: "Naturalora",
      description: description || "Premium Honey Purchase",
      order_id: order.id,
      prefill: {
        name: customer?.name || "",
        contact: customer?.phone || "",
        email: customer?.email || "",
      },
      theme: { color: "#f6c453" },
      // ── Success handler ──
      handler: async (response) => {
        try {
          const verification = await verifyPayment(response);
          if (verification.success) {
            resolve({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              verified: true,
            });
          } else {
            reject(new Error("Payment verification failed"));
          }
        } catch {
          reject(new Error("Payment verification failed"));
        }
      },
      // ── User closed modal without paying ──
      modal: {
        ondismiss: () => {
          reject(new Error("Payment cancelled by user"));
        },
      },
    };

    const paymentObject = new window.Razorpay(options);

    // Handle network / Razorpay-side failures
    paymentObject.on("payment.failed", (response) => {
      reject(
        new Error(
          response.error?.description || "Payment failed. Please try again."
        )
      );
    });

    paymentObject.open();
  });
};
