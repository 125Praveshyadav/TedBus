import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Bus,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../components/context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

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

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      newErrors.name = "Full name is required";
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      };

      const response = await register(payload);

      toast.success(response?.message || "OTP sent successfully");

      navigate(`/verify-otp/${encodeURIComponent(payload.email)}`, {
        state: {
          email: payload.email,
        },
      });
    } catch (error) {
      const message =
        error?.message ||
        error?.data?.message ||
        "Registration failed. Please try again.";

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

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">
        {/* Left Branding */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600 shadow-lg">
                <Bus className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  TedBus
                </h1>
                <p className="-mt-1 text-xs font-bold uppercase tracking-widest text-red-100">
                  Book. Ride. Relax.
                </p>
              </div>
            </Link>

            <div className="mt-16">
              <h2 className="text-4xl font-black leading-tight">
                Start Your
                <span className="block">Journey With Us</span>
              </h2>

              <p className="mt-5 max-w-md text-base font-medium leading-8 text-red-50">
                Create your TedBus account and book buses across India with
                secure payments, live seat selection and instant tickets.
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {[
              {
                title: "Easy",
                text: "Quick booking",
              },
              {
                title: "Secure",
                text: "Safe payments",
              },
              {
                title: "Offers",
                text: "Save more",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white/15 p-4 backdrop-blur"
              >
                <h3 className="font-black">{item.title}</h3>
                <p className="mt-1 text-xs font-semibold text-red-50">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right Form */}
        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-500/25">
                <Bus className="h-7 w-7" />
              </div>

              <h1 className="text-3xl font-black text-slate-900">
                Ted<span className="text-red-600">Bus</span>
              </h1>
            </div>

            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                <User className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Register to continue with TedBus.
              </p>
            </div>

            {errors.general && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="flex items-start gap-2 text-sm font-bold text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Full Name
                </label>

                <div
                  className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                    errors.name ? "border-red-300" : "border-slate-200"
                  }`}
                >
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                {errors.name && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

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
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Phone Number
                </label>

                <div
                  className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                    errors.phone ? "border-red-300" : "border-slate-200"
                  }`}
                >
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    autoComplete="tel"
                    className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Password
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
                    placeholder="Create password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-12 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-red-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Confirm Password
                </label>

                <div
                  className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-slate-200"
                  }`}
                >
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-12 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-red-600"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.confirmPassword}
                  </p>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Register
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="flex items-start gap-2 text-xs font-bold leading-5 text-green-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                We will send an OTP to your email for verification.
              </p>
            </div>

            <p className="mt-8 text-center text-sm font-semibold text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-black text-red-600 transition hover:text-red-700 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;