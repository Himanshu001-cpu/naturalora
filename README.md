# Naturalora — Premium Raw Honey E-Commerce

Naturalora is a high-performance, accessible, and SEO-optimized e-commerce platform for premium organic honey. Built with React 19, Vite, Tailwind CSS v4, Firebase, Zustand, and Razorpay.

---

## 🌟 Tech Stack

- **Core:** React 19, Vite 8
- **Styling:** Tailwind CSS v4, shadcn/ui primitives, Framer Motion (`motion`)
- **3D & Canvas:** Three.js, `@react-three/fiber`
- **State Management:** Zustand 4 (with persistence middleware)
- **Backend Services:** Firebase Authentication, Firestore Database, Firebase Storage
- **Payments:** Razorpay Gateway + Express payment verification server
- **Optimization:** `react-helmet-async`, `vite-plugin-pwa`, `vite-plugin-compression`, `sharp`

---

## 📁 Folder Structure Overview

```
naturalora/
├── docs/                      # Deployment checklist, architecture, & security rules
├── public/                    # Static assets, WebP images, icons, sitemap, & robots.txt
├── scripts/                   # Image optimization & product seeder scripts
├── server/                    # Node.js Express server for Razorpay order & signature verification
├── src/
│   ├── assets/                # Inline SVG icons
│   ├── components/            # Reusable UI & animation components
│   │   ├── admin/             # Admin dashboard UI components
│   │   ├── cart/              # Cart drawer & item list components
│   │   └── ui/                # shadcn/ui primitive components
│   ├── context/               # AuthContext & ToastContext providers
│   ├── hooks/                 # Custom React hooks (useReducedMotion, useOnlineStatus, etc.)
│   ├── lib/                   # Firebase config, analytics module, payment service
│   ├── pages/                 # Customer & Admin pages
│   ├── services/              # Firestore API service methods
│   ├── store/                 # Zustand cart store
│   └── utils/                 # Logger, retry fetch, & error mapper utilities
├── firestore.rules            # Firestore security rules
├── firebase.json              # Firebase Hosting configuration
├── netlify.toml               # Netlify deployment configuration
└── vite.config.js             # Vite build, PWA, & compression config
```

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
- Node.js 18+
- npm or yarn

### 2. Installation
```bash
# Install frontend dependencies
npm install

# Install payment backend dependencies
cd server && npm install && cd ..
```

### 3. Environment Variables
Copy `.env.example` to `.env` in the root directory:

```env
# Razorpay Public Key — safe for client
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# Backend API URL
VITE_API_BASE=http://localhost:5000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef

# Analytics & Site URL
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://naturalora.com
```

Copy `server/.env.example` to `server/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
PORT=5000
```

### 4. Running Locally

```bash
# Terminal 1: Start Payment Express Server
cd server && npm run dev

# Terminal 2: Start Vite Dev Server
npm run dev
```

---

## 🚀 Available Scripts

- `npm run dev` — Launch Vite dev server
- `npm run build` — Create optimized production bundle
- `npm run build:analyze` — Build with interactive bundle size visualizer
- `npm run preview` — Locally preview production build
- `npm run lint` — Run ESLint check

---

## 🚢 Deployment Guide

### Option A: Netlify
1. Connect repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables in Netlify Dashboard.

### Option B: Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

---

## 🛡️ Security Rules
Apply `firestore.rules` to your Firebase Firestore database to enforce role-based access control for customers and administrators.

---

## 📄 Documentation
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Security Specifications](docs/SECURITY.md)
- [Pre-launch Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)
