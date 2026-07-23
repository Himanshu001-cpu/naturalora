import React from "react";
import { Menu, Search, Bell, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onMenuToggle, onOpenSearch }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[hsl(28,30%,8%)]/80 backdrop-blur-xl border-b border-amber-500/15 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left side: Mobile menu toggle + Global Search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search button */}
        <button
          onClick={onOpenSearch}
          className="liquid-glass rounded-full px-4 py-2 flex items-center gap-3 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-all border border-amber-500/20 w-48 md:w-72"
        >
          <Search className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">Search products, orders...</span>
          <kbd className="hidden md:inline-block ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-white/50">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right side: Store link, Notifications, Profile badge */}
      <div className="flex items-center gap-3">
        {/* View Public Store */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-amber-300 hover:text-white hover:bg-white/5 transition-all no-underline border border-amber-500/20"
        >
          <span>View Shop</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-semibold text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="hidden md:inline text-xs font-semibold text-foreground">
            {user?.displayName || "Super Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
