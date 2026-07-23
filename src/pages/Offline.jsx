import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function Offline() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400">
        <WifiOff className="w-10 h-10" />
      </div>
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-amber-100 mb-3">
        You Are Offline
      </h1>
      <p className="text-base text-amber-200/70 max-w-md mb-8">
        It looks like you've lost your internet connection. Please check your network and try again.
      </p>
      <button
        onClick={handleReload}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
      >
        <RefreshCw className="w-4 h-4" />
        Reload Page
      </button>
    </div>
  );
}
