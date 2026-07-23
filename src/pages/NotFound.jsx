import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <span className="text-8xl md:text-9xl font-heading font-bold text-amber-500/20 select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-amber-100 mb-3">
        Page Not Found
      </h1>
      <p className="text-base text-amber-200/70 max-w-md mb-8">
        The honey jar you are looking for might have been moved or doesn't exist.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors border border-border"
        >
          Explore Shop
        </Link>
      </div>
    </div>
  );
}
