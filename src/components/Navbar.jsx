import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Honey", href: "/#our-honey" },
  { label: "Sourcing", href: "/#sourcing" },
  { label: "Process", href: "/#process" },
  { label: "Reviews", href: "/#reviews" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...honeyTransition, delay: 0.2 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-700 ${
        scrolled ? "liquid-glass-strong" : "liquid-glass"
      } rounded-2xl`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img
            src="/images/logo.png"
            alt="Naturalora"
            className="h-10 w-10 rounded-lg object-cover"
          />
          <span className="font-heading text-xl italic text-foreground tracking-wide">
            Naturalora
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-body text-muted-foreground hover:text-primary transition-colors duration-300 no-underline tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-2 bg-white text-[hsl(28,30%,10%)] font-body font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 no-underline"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop Now
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-foreground block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 bg-foreground block"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-foreground block"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: mobileOpen ? "auto" : 0,
          opacity: mobileOpen ? 1 : 0,
        }}
        transition={honeyTransition}
        className="md:hidden overflow-hidden"
      >
        <div className="flex flex-col gap-3 px-6 pb-5 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-body text-muted-foreground hover:text-primary transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/shop"
            className="sm:hidden inline-flex items-center justify-center gap-2 bg-white text-[hsl(28,30%,10%)] font-body font-semibold text-sm px-5 py-2.5 rounded-full no-underline mt-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop Now
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}
