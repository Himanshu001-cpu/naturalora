# Naturalora Deployment Checklist

Pre-launch verification checklist covering functional, performance, security, SEO, and accessibility criteria.

## 1. Authentication & Security
- [ ] User registration with email, password, and display name
- [ ] User login and session persistence
- [ ] User logout cleans local session state
- [ ] Protected routes (`/checkout`, `/account`, `/orders`) redirect unauthenticated users to `/login`
- [ ] Admin routes (`/admin/*`) strictly restricted to admin accounts
- [ ] `firestore.rules` deployed to Firebase project
- [ ] No API secrets exposed in client bundle (`.env` configured)

## 2. E-Commerce & Checkout Flow
- [ ] Product catalogue loads from Firestore with fallback static data
- [ ] Product detail page displays price, stock, ratings, and description
- [ ] Cart item addition, quantity updates, and removal work smoothly
- [ ] Shopping cart state persists across browser reloads
- [ ] Checkout pre-fills user profile information
- [ ] Razorpay payment checkout modal opens correctly
- [ ] Razorpay payment verification signature check via Express backend succeeds
- [ ] Order document created in Firestore with status `confirmed`
- [ ] Order confirmation page displays order ID and total amount
- [ ] Order history tab reflects user's past purchases

## 3. Performance & Optimization
- [ ] All customer sub-pages lazy-loaded via `React.lazy()`
- [ ] Heavy dependencies (`three`, `recharts`, `firebase`) split into vendor chunks
- [ ] Images in `public/images/` served in WebP format
- [ ] Admin image uploads compressed client-side before Firebase Storage
- [ ] `prefers-reduced-motion` respected across animation components
- [ ] 3D particle field disabled on low-end mobile devices

## 4. SEO & Accessibility
- [ ] Unique title and meta description on all pages via `SEOHead`
- [ ] Open Graph and Twitter Card tags valid
- [ ] JSON-LD structured data (Organization, WebSite, Product) valid
- [ ] `robots.txt` and `sitemap.xml` accessible in site root
- [ ] Heading hierarchy follows `<h1>` → `<h2>` → `<h3>`
- [ ] Keyboard navigation functional with visible focus indicators
- [ ] ARIA labels present on all interactive icon buttons
- [ ] Skip-to-content link present in `Navbar`

## 5. PWA & Offline Support
- [ ] Web App Manifest valid (`name`, `short_name`, `icons`, `theme_color`)
- [ ] Service worker registered and precaching static assets
- [ ] Offline banner displays when network connection is lost
- [ ] `Offline.jsx` fallback rendered for un-cached page navigation

## 6. Target Lighthouse Scores
- [ ] **Performance:** 95+ (Desktop), 85+ (Mobile low-end)
- [ ] **Accessibility:** 100
- [ ] **Best Practices:** 100
- [ ] **SEO:** 100
