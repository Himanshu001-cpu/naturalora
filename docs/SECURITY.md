# Naturalora Frontend & API Security

Documentation of security practices, CSP recommendations, payment protection, and database access controls.

## 1. Environment Variable Management
- Public configuration (`VITE_RAZORPAY_KEY_ID`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.) are safe for client bundling.
- Sensitive payment secrets (`RAZORPAY_KEY_SECRET`) are strictly kept on the Express server (`server/.env`) and **NEVER** imported or exposed to Vite client code.

## 2. Content Security Policy (CSP) Recommendations

When deploying to Firebase Hosting or Netlify, configure the following CSP headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://firebasestorage.googleapis.com https://images.unsplash.com https://www.google-analytics.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.razorpay.com https://www.google-analytics.com http://localhost:5000; frame-src 'self' https://api.razorpay.com;
```

## 3. Firestore Security Rules
Deploy `firestore.rules` to your Firebase project:

- **Users:** Users can only read and write their own profile document (`/users/{uid}`).
- **Products:** Public read access; write operations restricted to authenticated admin users (`/admins/{uid}`).
- **Orders:** Users can only create orders assigned to their own `userId` and read their own order documents.
- **Admins:** Read access restricted to the admin document owner; no client-side write access.

## 4. Payment Security Flow
1. Client initiates order request to Express backend (`POST /create-order`).
2. Server calculates order amount in paise and creates order via Razorpay API using `RAZORPAY_KEY_SECRET`.
3. Client receives `order_id` and opens Razorpay Checkout modal with public `VITE_RAZORPAY_KEY_ID`.
4. Upon successful payment, client posts payment payload (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`) to server (`POST /verify-payment`).
5. Server verifies HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`.
6. Client updates Firestore order status only after verification returns `{ success: true }`.
