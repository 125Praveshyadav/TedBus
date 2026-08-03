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
    // Full screen — no padding, no max-width, grid fills entire viewport
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/20 sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-orange-100/60 blur-3xl dark:bg-orange-900/10 sm:h-80 sm:w-80" />

      {/* Full-screen grid — no card, no rounded corners */}
      <div className="relative grid min-h-screen w-full lg:grid-cols-2">
        {/* Left Branding — full height */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-600 shadow-lg">
                <Bus className="h-5.5 w-5.5" />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight">TedBus</h1>
                <p className="-mt-1 text-[10px] font-bold uppercase tracking-widest text-red-100">
                  Book. Ride. Relax.
                </p>
              </div>
            </Link>

            <div className="mt-16 xl:mt-24">
              <h2 className="text-4xl font-black leading-tight xl:text-5xl">
                Welcome Back,
                <span className="block">Traveller!</span>
              </h2>

              <p className="mt-5 max-w-md text-sm font-medium leading-6 text-red-50 xl:text-base xl:leading-7">
                Login to manage your bookings, track journeys, access offers and
                continue your TedBus experience.
              </p>
            </div>
          </div>

          <div className="relative grid max-w-lg grid-cols-3 gap-3">
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
                className="rounded-xl bg-white/15 p-4 backdrop-blur"
              >
                <h3 className="text-sm font-black xl:text-base">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[11px] font-semibold text-red-50 xl:text-xs">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right Form — full height, form vertically centered */}
        <section className="flex min-h-screen items-center justify-center bg-white p-5 dark:bg-slate-900 sm:p-8 lg:p-12">
          <div className="w-full max-w-sm sm:max-w-md">
            {/* Mobile Logo */}
            <div className="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-500/25">
                <Bus className="h-5 w-5" />
              </div>

              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Ted<span className="text-red-600">Bus</span>
              </h1>
            </div>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10">
                <LockKeyhole className="h-6 w-6" />
              </div>

              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Login to your account
              </h2>

              <p className="mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">
                Enter your credentials to continue.
              </p>
            </div>

            {errors.general && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-900/20">
                <p className="flex items-start gap-2 text-xs font-bold text-red-700 dark:text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700 dark:text-slate-300 sm:text-sm">
                  Email Address
                </label>

                <div
                  className={`relative rounded-xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 dark:bg-slate-950 dark:focus-within:bg-slate-950 ${
                    errors.email
                      ? "border-red-300 dark:border-red-500/60"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl bg-transparent py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700 dark:text-slate-300 sm:text-sm">
                  Password
                </label>

                <div
                  className={`relative rounded-xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 dark:bg-slate-950 dark:focus-within:bg-slate-950 ${
                    errors.password
                      ? "border-red-300 dark:border-red-500/60"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full rounded-xl bg-transparent py-3 pl-11 pr-11 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-red-600 dark:hover:text-red-400"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember / Forgot */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 sm:text-sm">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 accent-red-600 dark:border-slate-600"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-black text-red-600 transition hover:text-red-700 hover:underline dark:text-red-500 dark:hover:text-red-400 sm:text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black transition ${
                  submitting
                    ? "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                    : "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 active:scale-[0.98] dark:shadow-red-900/30"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-3 dark:border-green-900/40 dark:bg-green-900/15">
              <p className="flex items-start gap-2 text-[11px] font-bold leading-5 text-green-700 dark:text-green-400 sm:text-xs">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                Your login is protected with secure authentication.
              </p>
            </div>

            <p className="mt-6 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 sm:text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-black text-red-600 transition hover:text-red-700 hover:underline dark:text-red-500 dark:hover:text-red-400"
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