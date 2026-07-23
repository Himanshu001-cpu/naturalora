import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { checkAdminStatus } from "../../services/adminService";

export default function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [adminCheckState, setAdminCheckState] = useState({
    checking: true,
    isAdmin: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function verifyAdmin() {
      if (authLoading) return;

      if (!user?.uid) {
        if (isMounted) {
          setAdminCheckState({ checking: false, isAdmin: false });
        }
        return;
      }

      try {
        const { isAdmin } = await checkAdminStatus(user.uid);
        if (isMounted) {
          setAdminCheckState({ checking: false, isAdmin });
        }
      } catch (err) {
        console.error("Admin verification error:", err);
        if (isMounted) {
          setAdminCheckState({ checking: false, isAdmin: false });
        }
      }
    }

    verifyAdmin();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  // Loading state
  if (authLoading || adminCheckState.checking) {
    return (
      <div className="min-h-screen bg-[hsl(28,30%,8%)] text-foreground flex flex-col items-center justify-center p-4">
        <div className="liquid-glass backdrop-blur-xl border border-primary/20 rounded-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full text-center shadow-2xl">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <div>
            <h3 className="font-heading italic text-xl text-primary mb-1">
              Verifying Administrator Access
            </h3>
            <p className="text-xs text-muted-foreground">
              Checking credentials with Naturalora Security...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not an authorized admin -> Access Denied screen / redirect
  if (!adminCheckState.isAdmin) {
    return (
      <div className="min-h-screen bg-[hsl(28,30%,8%)] text-foreground flex flex-col items-center justify-center p-4">
        <div className="liquid-glass backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 flex flex-col items-center gap-4 max-w-md w-full text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-heading italic text-2xl text-red-400 mb-2">
              Access Restricted
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Your account (<span className="text-white font-mono text-xs">{user.email}</span>) does not have administrator privileges for the Naturalora Control Panel.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-xs transition-transform hover:scale-105"
            >
              Return to Public Store
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
