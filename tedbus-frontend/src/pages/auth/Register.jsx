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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-3 py-6 sm:px-4 sm:py-8 transition-colors duration-300">
      {/* Background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-200/50 dark:bg-red-900/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-100/70 dark:bg-orange-900/10 blur-3xl" />

      <div
        className="relative grid w-full max-w-5xl animate-[fadeIn_0.4s_ease-out] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/40 lg:grid-cols-2 transition-colors duration-300"
      >
        {/* Left Branding */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-red-600 shadow-lg">
                <Bus className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight">TedBus</h1>
                <p className="-mt-1 text-[11px] font-bold uppercase tracking-widest text-red-100">
                  Book. Ride. Relax.
                </p>
              </div>
            </Link>

            <div className="mt-10">
              <h2 className="text-3xl font-black leading-tight">
                Start Your
                <span className="block">Journey With Us</span>
              </h2>

              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-red-50">
                Create your TedBus account and book buses across India with
                secure payments, live seat selection and instant tickets.
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {[
              { title: "Easy", text: "Quick booking" },
              { title: "Secure", text: "Safe payments" },
              { title: "Offers", text: "Save more" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white/15 p-3 backdrop-blur transition hover:bg-white/20"
              >
                <h3 className="font-black">{item.title}</h3>
                <p className="mt-1 text-[11px] font-semibold text-red-50">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right Form */}
        <section className="p-5 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-md">
            {/* Mobile Logo */}
            <div className="mb-5 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-500/25">
                <Bus className="h-6 w-6" />
              </div>

              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Ted<span className="text-red-600">Bus</span>
              </h1>
            </div>

            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <User className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Create your account
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Register to continue with TedBus.
              </p>
            </div>

            {errors.general && (
              <div className="mb-4 rounded-2xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/30 p-3 animate-[fadeIn_0.3s_ease-out]">
                <p className="flex items-start gap-2 text-sm font-bold text-red-700 dark:text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-300">
                  Full Name
                </label>

                <div
                  className={`relative rounded-2xl border bg-slate-50 dark:bg-slate-800/60 transition focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-4 focus-within:ring-red-500/10 ${
                    errors.name
                      ? "border-red-300 dark:border-red-800"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-2xl bg-transparent py-3 pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {errors.name && (
                  <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

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
                  <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>

                <div
                  className={`relative rounded-2xl border bg-slate-50 dark:bg-slate-800/60 transition focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-4 focus-within:ring-red-500/10 ${
                    errors.phone
                      ? "border-red-300 dark:border-red-800"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    autoComplete="tel"
                    className="w-full rounded-2xl bg-transparent py-3 pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-300">
                  Password
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
                    placeholder="Create password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl bg-transparent py-3 pl-12 pr-12 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition hover:text-red-600 dark:hover:text-red-400"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                  <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
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
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl bg-transparent py-3 pl-12 pr-12 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition hover:text-red-600 dark:hover:text-red-400"
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
                  <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Register
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 rounded-2xl border border-green-100 dark:border-green-900/40 bg-green-50 dark:bg-green-900/20 p-3">
              <p className="flex items-start gap-2 text-xs font-bold leading-5 text-green-700 dark:text-green-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                We will send an OTP to your email for verification.
              </p>
            </div>

            <p className="mt-5 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
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
        </section>
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

export default Register;