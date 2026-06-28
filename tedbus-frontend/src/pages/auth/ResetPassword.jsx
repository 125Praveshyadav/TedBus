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
        color: "bg-slate-200",
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      {/* Background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-red-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 text-white">
          <Link
            to="/forgot-password"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-red-600 shadow-lg">
              <Bus className="h-9 w-9" />
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight">
              Reset Password
            </h1>

            <p className="mt-2 text-sm font-semibold text-red-50">
              Enter OTP and create a new secure password.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {errors.general && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="flex items-start gap-2 text-sm font-bold text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {errors.general}
              </p>
            </div>
          )}

          {otpVerified && (
            <div className="mb-5 rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="flex items-start gap-2 text-sm font-bold text-green-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                OTP verified. You can reset your password now.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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

            {/* OTP */}
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
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
                className={`w-full rounded-2xl border bg-slate-50 px-4 py-4 text-center text-xl font-black tracking-[0.4em] text-slate-900 outline-none transition placeholder:tracking-normal placeholder:text-sm placeholder:font-bold placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 ${
                  errors.otp ? "border-red-300" : "border-slate-200"
                }`}
              />

              {errors.otp && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.otp}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                New Password
              </label>

              <div
                className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                  errors.password ? "border-red-300" : "border-slate-200"
                }`}
              >
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-12 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-red-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.score / 4) * 100}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs font-bold text-slate-500">
                    Strength:{" "}
                    <span
                      className={
                        passwordStrength.label === "Strong"
                          ? "text-green-600"
                          : passwordStrength.label === "Medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }
                    >
                      {passwordStrength.label}
                    </span>
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Confirm Password
              </label>

              <div
                className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                  errors.confirmPassword ? "border-red-300" : "border-slate-200"
                }`}
              >
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-12 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-red-600"
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Resend */}
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm font-semibold text-slate-500">
                  Resend OTP in{" "}
                  <span className="font-black text-red-600">{timer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="inline-flex items-center justify-center gap-2 text-sm font-black text-red-600 transition hover:text-red-700 hover:underline disabled:opacity-60"
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
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black transition ${
                loading
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 active:scale-[0.98]"
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
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
            <p className="flex items-start gap-2 text-xs font-bold leading-5 text-green-700">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Use a strong password and never share it with anyone.
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

export default ResetPassword;
