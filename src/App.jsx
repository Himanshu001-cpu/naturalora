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
