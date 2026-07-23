import React from "react";
import { Link } from "react-router-dom";
import { Settings as SettingsIcon, ShieldCheck, Sparkles, Database, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user, userProfile } = useAuth();

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading italic text-3xl md:text-4xl text-foreground font-bold flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-primary" /> System Settings & Controls
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Manage system configurations, admin roles, and site layout customization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Account Details */}
        <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-primary font-semibold text-lg">
            <ShieldCheck className="w-5 h-5" /> Admin Account Credentials
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <p className="text-muted-foreground text-[11px]">Authenticated Email</p>
              <p className="font-semibold text-foreground font-mono">{user?.email}</p>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <p className="text-muted-foreground text-[11px]">Firebase Auth UID</p>
              <p className="font-mono text-primary text-[11px] truncate">{user?.uid}</p>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <p className="text-muted-foreground text-[11px]">Admin Access Role</p>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Super Admin
              </span>
            </div>
          </div>
        </div>

        {/* Homepage Quick Manager Card */}
        <div className="liquid-glass border border-primary/30 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-lg border-b border-white/10 pb-3">
              <Sparkles className="w-5 h-5" /> Homepage Layout & Banners
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Control which products are featured on the public homepage, set the hero product highlight, and update promotional banner announcements.
            </p>
          </div>

          <Link
            to="/admin/settings/homepage"
            className="w-full py-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold text-center hover:scale-105 transition-transform no-underline shadow-lg shadow-primary/20 block"
          >
            Manage Homepage Content →
          </Link>
        </div>
      </div>

      {/* Database & Firebase Status */}
      <div className="liquid-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-primary font-semibold text-lg">
          <Database className="w-5 h-5" /> Firestore & Storage Status
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <span className="text-muted-foreground">Firestore DB</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <span className="text-muted-foreground">Firebase Storage</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <span className="text-muted-foreground">Firebase Auth</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
