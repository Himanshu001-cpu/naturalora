import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { ShoppingBag, Search, Menu } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...honeyTransition, delay: 0.2 }}
      className={`fixed top-0 md:top-4 left-1/2 -translate-x-1/2 z-50 w-full md:w-[95%] max-w-6xl transition-all duration-700 ${
        scrolled ? "bg-background/80 md:liquid-glass-strong border-b md:border-none border-border/30" : "bg-background/50 md:liquid-glass"
      } ${isMobile ? "backdrop-blur-md rounded-none" : "backdrop-blur-xl rounded-2xl"}`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-auto md:py-3">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 no-underline">
          <img
            src="/images/logo.png"
            alt="Naturalora"
            className="h-8 w-8 md:h-10 md:w-10 rounded-md md:rounded-lg object-cover"
          />
          <span className="font-heading text-lg md:text-xl italic text-foreground tracking-wide">
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

        {/* CTA + Mobile Icons */}
        <div className="flex items-center gap-4 md:gap-3">
          <Link
            to="/shop"
            className="hidden md:inline-flex items-center gap-2 bg-white text-[hsl(28,30%,10%)] font-body font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 no-underline"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop Now
          </Link>

          {/* Mobile Icons: Search & Cart */}
          <div className="flex md:hidden items-center gap-3">
            <button className="text-foreground p-1" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="text-foreground p-1 relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
