import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import BeeFollower from "./components/BeeFollower";
import HoneyField from "./components/HoneyField";
import HoneyCursorLight from "./components/HoneyCursorLight";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

function HashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    let targetId = location.hash.slice(1);
    try {
      targetId = decodeURIComponent(targetId);
    } catch {
      targetId = location.hash.slice(1);
    }

    let frameId;
    let timeoutId;

    const scrollToHash = (attempt = 0) => {
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (attempt < 12) {
        timeoutId = window.setTimeout(() => scrollToHash(attempt + 1), 50);
      }
    };

    frameId = requestAnimationFrame(() => scrollToHash());

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      {/* HoneyField sits at z-0, behind the glass surface */}
      <HoneyField />

      {/* Cursor Interaction (Subtle light) */}
      <HoneyCursorLight />

      {/* z-2 keeps BeeFollower above the cursor-light (z-1) layer */}
      <BeeFollower />

      {/* All page content floats above the honeycomb at z-10 with slight blur */}
      <div className="relative z-10 backdrop-blur-[2px]">
        <HashScroll />
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
