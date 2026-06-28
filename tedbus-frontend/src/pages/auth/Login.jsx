import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bus,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../components/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const redirectTo = location.state?.from || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirectTo, {
        replace: true,
      });
    }
  }, [authLoading, isAuthenticated, navigate, redirectTo]);

  const validateForm = () => {
    const newErrors = {};

    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      setSubmitting(true);
const result = await login({
  email: formData.email.trim().toLowerCase(),
  password: formData.password,
});

toast.success(result?.response?.message || "Login successful 🎉");

const loggedInUser = result?.user;

if (loggedInUser?.role === "admin") {
  navigate("/admin/dashboard", {
    replace: true,
  });
} else {
  navigate(redirectTo || "/", {
    replace: true,
  });
}
    } catch (error) {
      const message =
        error?.message ||
        error?.data?.message ||
        "Login failed. Please check your credentials.";

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));

      toast.error(message);
    } finally {
      setSubmitting(false);
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
                Welcome Back,
                <span className="block">Traveller!</span>
              </h2>

              <p className="mt-5 max-w-md text-base font-medium leading-8 text-red-50">
                Login to manage your bookings, track journeys, access offers
                and continue your TedBus experience.
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {[
              {
                title: "Secure",
                text: "Protected login",
              },
              {
                title: "Fast",
                text: "Quick bookings",
              },
              {
                title: "Reliable",
                text: "24/7 support",
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
                <LockKeyhole className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Login to your account
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Enter your credentials to continue.
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
                    placeholder="Enter password"
                    autoComplete="current-password"
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

                {errors.password && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 accent-red-600"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-black text-red-600 transition hover:text-red-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black transition ${
                  submitting
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 active:scale-[0.98]"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="flex items-start gap-2 text-xs font-bold leading-5 text-green-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                Your login is protected with secure authentication.
              </p>
            </div>

            <p className="mt-8 text-center text-sm font-semibold text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-black text-red-600 transition hover:text-red-700 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;