import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import GlobalSearch from "./GlobalSearch";
import { ToastProvider } from "../../context/ToastContext";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[hsl(28,30%,8%)] text-foreground flex flex-col font-body selection:bg-primary/30 selection:text-primary">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Global Search Modal */}
        <GlobalSearch
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />

        {/* Main Content Area */}
        <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
          {/* Topbar Header */}
          <Topbar
            onMenuToggle={() => setSidebarOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
          />

          {/* Page Body */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
