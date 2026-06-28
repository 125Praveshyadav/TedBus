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

      toast.success(response?.message || "Password reset OTP sent successfully");

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      {/* Background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-red-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        {/* Top Header */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 text-white">
          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-red-600 shadow-lg">
              <Bus className="h-9 w-9" />
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm font-semibold text-red-50">
              Enter your registered email and we will send a reset OTP.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          {errors.general && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="flex items-start gap-2 text-sm font-bold text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {errors.general}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Email Address
              </label>

              <div
                className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                  errors.email ? "border-red-300" : "border-slate-200"
                }`}
              >
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black transition ${
                loading
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 active:scale-[0.98]"
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
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
            <p className="flex items-start gap-2 text-xs font-bold leading-5 text-green-700">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              For your security, password reset requires OTP verification.
            </p>
          </div>

          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-black text-red-600 transition hover:text-red-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;