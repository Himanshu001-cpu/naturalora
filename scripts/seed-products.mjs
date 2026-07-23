/**
 * Firestore Seeder — run once to populate the "products" collection.
 *
 * Usage:
 *   node scripts/seed-products.mjs
 *
 * Make sure your Firebase config in src/lib/firebase.js has valid credentials
 * before running this script.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// ── Firebase config (must match src/lib/firebase.js) ──────────────────────────
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Product seed data ─────────────────────────────────────────────────────────
const products = [
  {
    id: "1",
    name: "Wild Forest Honey",
    price: 499,
    image: "/images/honey1.jpg",
    stock: 10,
    description:
      "Deep, earthy, untouched. Raw honey sourced from forest regions.",
  },
  {
    id: "2",
    name: "Himalayan Raw Honey",
    price: 699,
    image: "/images/honey2.jpg",
    stock: 8,
    description:
      "Pure honey harvested from high-altitude Himalayan flora.",
  },
  {
    id: "3",
    name: "Multiflora Honey",
    price: 399,
    image: "/images/honey3.jpg",
    stock: 15,
    description: "Balanced taste from multiple floral sources.",
  },
  {
    id: "4",
    name: "Acacia Honey",
    price: 799,
    image: "/images/honey4.jpg",
    stock: 5,
    description: "Light, smooth honey with delicate sweetness.",
  },
  {
    id: "5",
    name: "Organic Farm Honey",
    price: 549,
    image: "/images/honey5.jpg",
    stock: 12,
    description: "Ethically harvested honey from organic farms.",
  },
];

// ── Seed ───────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding products to Firestore…\n");

  for (const product of products) {
    const { id, ...data } = product;
    await setDoc(doc(db, "products", id), data);
    console.log(`  ✅ ${data.name} (ID: ${id})`);
  }

  console.log("\n🎉 Done! All products seeded.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
