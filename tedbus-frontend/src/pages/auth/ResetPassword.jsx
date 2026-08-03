import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bus,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import { authService } from "../../services/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const stateEmail = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: stateEmail,
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const passwordStrength = useMemo(() => {
    const password = formData.password;

    let score = 0;

    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (!password) {
      return {
        label: "",
        score: 0,
        color: "bg-slate-200 dark:bg-slate-700",
      };
    }

    if (score <= 1) {
      return {
        label: "Weak",
        score,
        color: "bg-red-500",
      };
    }

    if (score <= 3) {
      return {
        label: "Medium",
        score,
        color: "bg-yellow-500",
      };
    }

    return {
      label: "Strong",
      score,
      color: "bg-green-500",
    };
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === "otp" ? value.replace(/\D/g, "").slice(0, 6) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));

    if (name === "otp") {
      setOtpVerified(false);
      setResetToken("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const email = formData.email.trim();
    const otp = formData.otp.trim();

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!otp) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "Enter valid 6 digit OTP";
    }

    if (!formData.password) {
      newErrors.password = "New password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const verifyResetOtp = async () => {
    const response = await authService.verifyResetOTP({
      email: formData.email.trim().toLowerCase(),
      otp: formData.otp.trim(),
    });

    const token =
      response?.resetToken ||
      response?.token ||
      response?.data?.resetToken ||
      response?.data?.token ||
      "";

    setResetToken(token);
    setOtpVerified(true);

    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      if (!otpVerified) {
        await verifyResetOtp();
      }

      const payload = {
        email: formData.email.trim().toLowerCase(),
        otp: formData.otp.trim(),

        // dono bhej do taaki backend jis naam se expect kare, mil jaye
        password: formData.password,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,

        resetToken,
      };

      const response = await authService.resetPassword(payload);

      toast.success(response?.message || "Password reset successfully 🎉");

      navigate("/login", {
        replace: true,
        state: {
          email: formData.email.trim().toLowerCase(),
        },
      });
    } catch (error) {
      const message =
        error?.message ||
        error?.data?.message ||
        "Password reset failed. Please try again.";

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const email = formData.email.trim().toLowerCase();

    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required to resend OTP",
      }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return;
    }

    try {
      setResendLoading(true);

      const response = await authService.forgotPassword({
        email,
      });

      setTimer(60);
      setFormData((prev) => ({
        ...prev,
        otp: "",
      }));
      setOtpVerified(false);
      setResetToken("");

      toast.success(response?.message || "OTP sent again successfully");
    } catch (error) {
      const message =
        error?.message || error?.data?.message || "Failed to resend OTP";

      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-3 py-6 sm:px-4 sm:py-8 transition-colors duration-300">
      {/* Background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-200/50 dark:bg-red-900/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-100/70 dark:bg-orange-900/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-[fadeIn_0.4s_ease-out] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/40 transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 text-white">
          <Link
            to="/forgot-password"
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-600 shadow-lg">
              <Bus className="h-7 w-7" />
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight">
              Reset Password
            </h1>

            <p className="mt-1.5 text-sm font-semibold text-red-50">
              Enter OTP and create a new secure password.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7">
          {errors.general && (
            <div className="mb-4 rounded-2xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/30 p-3 animate-[fadeIn_0.3s_ease-out]">
              <p className="flex items-start gap-2 text-sm font-bold text-red-700 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {errors.general}
              </p>
            </div>
          )}

          {otpVerified && (
            <div className="mb-4 rounded-2xl border border-green-100 dark:border-green-900/40 bg-green-50 dark:bg-green-900/20 p-3 animate-[fadeIn_0.3s_ease-out]">
              <p className="flex items-start gap-2 text-sm font-bold text-green-700 dark:text-green-400">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                OTP verified. You can reset your password now.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email */}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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

            {/* OTP */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Reset OTP
              </label>

              <input
                type="text"
                name="otp"
                inputMode="numeric"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6 digit OTP"
                maxLength={6}
                className={`w-full rounded-2xl border bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-center text-xl font-black tracking-[0.4em] text-slate-900 dark:text-white outline-none transition placeholder:tracking-normal placeholder:text-sm placeholder:font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-red-500/10 ${
                  errors.otp
                    ? "border-red-300 dark:border-red-800"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              />

              {errors.otp && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.otp}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-300">
                New Password
              </label>

              <div
                className={`relative rounded-2xl border bg-slate-50 dark:bg-slate-800/60 transition focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-4 focus-within:ring-red-500/10 ${
                  errors.password
                    ? "border-red-300 dark:border-red-800"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl bg-transparent py-3 pl-12 pr-12 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition hover:text-red-600 dark:hover:text-red-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-1.5">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.score / 4) * 100}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    Strength:{" "}
                    <span
                      className={
                        passwordStrength.label === "Strong"
                          ? "text-green-600 dark:text-green-400"
                          : passwordStrength.label === "Medium"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                      }
                    >
                      {passwordStrength.label}
                    </span>
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>

              <div
                className={`relative rounded-2xl border bg-slate-50 dark:bg-slate-800/60 transition focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-4 focus-within:ring-red-500/10 ${
                  errors.confirmPassword
                    ? "border-red-300 dark:border-red-800"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl bg-transparent py-3 pl-12 pr-12 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition hover:text-red-600 dark:hover:text-red-400"
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Resend */}
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Resend OTP in{" "}
                  <span className="font-black text-red-600 dark:text-red-400">
                    {timer}s
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="inline-flex items-center justify-center gap-2 text-sm font-black text-red-600 dark:text-red-400 transition hover:text-red-700 dark:hover:text-red-300 hover:underline disabled:opacity-60"
                >
                  {resendLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Resend OTP
                </button>
              )}
            </div>

            {/* Submit */}
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
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 rounded-2xl border border-green-100 dark:border-green-900/40 bg-green-50 dark:bg-green-900/20 p-3">
            <p className="flex items-start gap-2 text-xs font-bold leading-5 text-green-700 dark:text-green-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Use a strong password and never share it with anyone.
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

export default ResetPassword;