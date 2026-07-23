# Naturalora System Architecture

## Architecture Overview

Naturalora is built as a production-grade single page application (SPA) with a decoupled Node.js Express server for Razorpay payments and Firebase for authentication, database, and asset storage.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React 19 Frontend (Vite)                        │
│                                                                        │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐   │
│   │ App Router   │   │ AuthContext  │   │ Zustand Cart Store       │   │
│   └──────┬───────┘   └──────┬───────┘   └────────────┬─────────────┘   │
└──────────┼──────────────────┼────────────────────────┼─────────────────┘
           │                  │                        │
           ▼                  ▼                        ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│           Firebase Cloud             │   │ Express Payment API Server  │
│  - Authentication                    │   │ - POST /create-order        │
│  - Firestore DB                      │   │ - POST /verify-payment      │
│  - Storage (Asset buckets)           │   └──────────────┬──────────────┘
└──────────────────────────────────────┘                  │
                                                          ▼
                                           ┌─────────────────────────────┐
                                           │       Razorpay Gateway      │
                                           └─────────────────────────────┘
```

## Key Technology Decisions

- **React 19 + Vite 8:** Modern ESM build pipeline with fast HMR and optimized production bundling.
- **Tailwind CSS v4:** Theme engine defined in CSS variables (`src/index.css`) with glassmorphic design system.
- **Zustand:** Lightweight cart state with localStorage persistence.
- **Firebase SDK 12:** Realtime auth listener, Firestore document syncing, and client-side image storage.
- **Razorpay Integration:** Server-side HMAC-SHA256 signature verification preventing payment tampering.
- **Three.js & Motion:** Dynamic 3D particle background (`Antigravity`) with automatic motion preference and low-end hardware fallbacks.
