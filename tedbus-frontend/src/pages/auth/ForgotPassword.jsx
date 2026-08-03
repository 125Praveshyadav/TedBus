import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bus,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import { authService } from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    setErrors((prev) => ({
      ...prev,
      email: "",
      general: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        email: email.trim().toLowerCase(),
      };

      const response = await authService.forgotPassword(payload);

      toast.success(
        response?.message || "Password reset OTP sent successfully",
      );

      /**
       * ResetPassword page ko state se email milega.
       * Next step me ResetPassword.jsx me OTP + new password flow connect karenge.
       */
      navigate("/reset-password", {
        state: {
          email: payload.email,
        },
      });
    } catch (error) {
      const message =
        error?.message ||
        error?.data?.message ||
        "Failed to send reset OTP. Please try again.";

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-3 py-6 sm:px-4 sm:py-8 transition-colors duration-300">
      {/* Background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-200/50 dark:bg-red-900/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-100/70 dark:bg-orange-900/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-[fadeIn_0.4s_ease-out] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/40 transition-colors duration-300">
        {/* Top Header */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 text-white">
          <Link
            to="/login"
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Login
          </Link>

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-600 shadow-lg">
              <Bus className="h-7 w-7" />
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight">
              Forgot Password?
            </h1>

            <p className="mt-1.5 text-sm font-semibold text-red-50">
              Enter your registered email and we will send a reset OTP.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 sm:p-7">
          {errors.general && (
            <div className="mb-4 rounded-2xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/30 p-3 animate-[fadeIn_0.3s_ease-out]">
              <p className="flex items-start gap-2 text-sm font-bold text-red-700 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {errors.general}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Email Address
              </label>

              <div
                className={`relative rounded-2xl border bg-slate-50 dark:bg-slate-800/60 transition focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-4 focus-within:ring-red-500/10 ${
                  errors.email
                    ? "border-red-300 dark:border-red-800"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-2xl bg-transparent py-3 pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black transition-all duration-200 ${
                loading
                  ? "cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                  : "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 hover:shadow-red-500/40 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send Reset OTP
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 rounded-2xl border border-green-100 dark:border-green-900/40 bg-green-50 dark:bg-green-900/20 p-3">
            <p className="flex items-start gap-2 text-xs font-bold leading-5 text-green-700 dark:text-green-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              For your security, password reset requires OTP verification.
            </p>
          </div>

          <p className="mt-5 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-1 font-black text-red-600 dark:text-red-400 transition-colors duration-200 hover:text-red-700 dark:hover:text-red-300"
            >
              <span className="relative">
                Login
                <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-red-600 dark:bg-red-400 transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default ForgotPassword;