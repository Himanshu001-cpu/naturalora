import React, { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Loader2, AlertTriangle, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setGeneralError("");

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setGeneralError(err.message || "Failed to log in. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 flex flex-col items-center justify-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full liquid-glass backdrop-blur-md [border-radius:24px] p-6 sm:p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-14 h-14 rounded-full liquid-glass-strong mx-auto mb-4 flex items-center justify-center text-primary"
          >
            <LogIn className="w-6 h-6" />
          </motion.div>
          <h1 className="text-2xl font-heading text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Log in to your Naturalora account
          </p>
        </div>

        {generalError && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 [border-radius:12px] mb-6 text-sm flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/70 mb-1.5 font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                disabled={isSubmitting}
                className={`w-full bg-black/20 border ${
                  errors.email ? "border-red-500/60" : "border-white/10"
                } rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 text-foreground transition-colors disabled:opacity-50`}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full bg-black/20 border ${
                  errors.password ? "border-red-500/60" : "border-white/10"
                } rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 text-foreground transition-colors disabled:opacity-50`}
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full mt-2 [border-radius:12px] liquid-glass-strong py-3.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            state={{ from: location.state?.from }}
            className="text-primary hover:underline font-medium ml-1"
          >
            Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
