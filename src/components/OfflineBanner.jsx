import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full liquid-glass-strong bg-amber-950/90 text-amber-200 text-xs font-medium border border-amber-500/40 shadow-xl flex items-center gap-2 max-w-sm w-full mx-auto"
    >
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
      <span>You are currently offline. Some features may be limited.</span>
    </div>
  );
}
