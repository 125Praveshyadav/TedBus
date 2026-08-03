import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Award,
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Edit3,
  Globe,
  IndianRupee,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Route,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  TrendingUp,
  UploadCloud,
  User,
  X,
  XCircle,
  Zap,
} from "lucide-react";

import { useAuth } from "../../components/context/AuthContext";

const initialPreferences = {
  whatsapp: true,
  promotions: false,
  bookingAlerts: true,
};

const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

// ── Reusable Toggle ──
const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ${
      enabled ? "bg-red-600" : "bg-slate-300 dark:bg-slate-600"
    }`}
  >
    <span
      className={`h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

// ── Stat Card ──
const StatCard = ({ icon: Icon, label, value, sub, color, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 p-4 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] ${
      onClick ? "cursor-pointer" : "cursor-default"
    }`}
  >
    <div
      className={`pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 blur-2xl ${color}`}
    />
    <div
      className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}
      style={{ backgroundColor: "currentColor", opacity: 0.1 }}
    >
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <p className="text-2xl font-black text-slate-900 dark:text-white">
      {value}
    </p>
    <p className="mt-0.5 text-xs font-bold text-slate-500 dark:text-slate-400">
      {label}
    </p>
    {sub && (
      <p className="mt-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
        {sub}
      </p>
    )}
  </button>
);

// ── Input Field ──
const InputField = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
  error,
  placeholder,
  hint,
}) => (
  <div>
    <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <div
      className={`group relative rounded-2xl border-2 bg-slate-50 transition-all duration-200 dark:bg-slate-800/40 ${
        disabled
          ? "border-slate-200 dark:border-slate-700/50 opacity-70"
          : error
            ? "border-red-300 dark:border-red-500/50"
            : "border-slate-200 dark:border-slate-700/50 focus-within:border-red-500 dark:focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-800/80 focus-within:ring-4 focus-within:ring-red-500/10 dark:focus-within:ring-red-500/20"
      }`}
    >
      <Icon
        className={`absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${
          disabled
            ? "text-slate-300 dark:text-slate-600"
            : "text-slate-400 dark:text-slate-500 group-focus-within:text-red-500"
        }`}
      />
      <input
        type={type}
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl bg-transparent py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:text-slate-500"
      />
    </div>
    {error && (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
        <AlertCircle size={12} />
        {error}
      </p>
    )}
    {hint && !error && (
      <p className="mt-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
        {hint}
      </p>
    )}
  </div>
);

const Profile = () => {
  const { user, logout, updateUser, updateUserPhoto, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.profileImage || "");
  const [toast, setToast] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    gender: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [preferences, setPreferences] = useState(initialPreferences);

  const userInitial = useMemo(
    () => formData.name?.charAt(0)?.toUpperCase() || "U",
    [formData.name]
  );

  // ── Booking Stats ──
  const stats = useMemo(
    () => ({
      totalBookings: user?.totalBookings || user?.bookingCount || 0,
      completedTrips: user?.completedTrips || 0,
      cancelledTrips: user?.cancelledTrips || 0,
      upcomingTrips: user?.upcomingTrips || 0,
      totalSpent: user?.totalSpent || 0,
      tedPoints: user?.tedPoints || user?.rewardPoints || 0,
      citiesVisited: user?.citiesVisited || 0,
      totalDistance: user?.totalDistance || 0,
    }),
    [user]
  );

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "N/A";
    return new Date(user.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [user?.createdAt]);

  const memberDays = useMemo(() => {
    if (!user?.createdAt) return 0;
    return Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [user?.createdAt]);

  const memberTier = useMemo(() => {
    const trips = stats.completedTrips;
    if (trips >= 50) return { name: "Platinum", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-200 dark:border-purple-500/20", icon: Zap };
    if (trips >= 25) return { name: "Gold", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20", icon: Star };
    if (trips >= 10) return { name: "Silver", color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-700/30", border: "border-slate-200 dark:border-slate-600", icon: Award };
    return { name: "Member", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20", icon: Sparkles };
  }, [stats.completedTrips]);

  const successRate = useMemo(() => {
    if (stats.totalBookings === 0) return 0;
    return Math.round((stats.completedTrips / stats.totalBookings) * 100);
  }, [stats]);

  const hasUnsavedPhoto = photoPreview && photoPreview !== user?.profileImage;

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setPhotoPreview(user.profileImage || "");
      const nextData = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        gender: user.gender || "",
      };
      setFormData(nextData);
      setOriginalData(nextData);
    }
  }, [user]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formatted =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: formatted }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone.trim()))
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    if (formData.city && formData.city.trim().length < 2)
      newErrors.city = "Enter a valid city";
    if (formData.gender && !["Male", "Female", "Other"].includes(formData.gender))
      newErrors.gender = "Select a valid gender";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancelEdit = () => {
    if (originalData) setFormData(originalData);
    setErrors({});
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!validateProfile()) return;
    if (!updateUser) {
      showToast("error", "Update function unavailable. Contact support.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        gender: formData.gender,
      };
      const updatedUser = await updateUser(payload);
      const nextData = {
        name: updatedUser?.name || formData.name,
        email: updatedUser?.email || formData.email,
        phone: updatedUser?.phone || formData.phone,
        city: updatedUser?.city || formData.city,
        gender: updatedUser?.gender || formData.gender,
      };
      setFormData(nextData);
      setOriginalData(nextData);
      setEditMode(false);
      showToast("success", "Profile updated successfully!");
    } catch (error) {
      showToast("error", error?.message || "Failed to update. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Image must be less than 2MB");
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleUploadPhoto = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      showToast("error", "Please select a photo first");
      return;
    }
    if (!updateUserPhoto) {
      showToast("error", "Photo upload unavailable. Contact support.");
      return;
    }
    try {
      setUploadingPhoto(true);
      const data = new FormData();
      data.append("profileImage", file);
      const updatedUser = await updateUserPhoto(data);
      setPhotoPreview(updatedUser?.profileImage || "");
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("success", "Profile photo updated!");
    } catch (error) {
      showToast("error", error?.message || "Unable to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelPhoto = () => {
    setPhotoPreview(user?.profileImage || "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  const togglePreference = (key) =>
    setPreferences((p) => ({ ...p, [key]: !p[key] }));

  // ── Loading State ──
  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-red-600/20" />
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const TierIcon = memberTier.icon;

  // ── Sidebar Tabs ──
  const sidebarTabs = [
    { id: "profile", icon: User, label: "Personal Information" },
    { id: "stats", icon: TrendingUp, label: "Travel Statistics" },
    { id: "preferences", icon: Bell, label: "Notifications" },
    { id: "security", icon: Shield, label: "Login & Security" },
  ];

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* ── Toast ── */}
      {toast.message && (
        <div className="fixed right-4 top-20 z-[60] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-right">
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
              toast.type === "success"
                ? "border-emerald-200/60 bg-emerald-50/90 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                : "border-red-200/60 bg-red-50/90 dark:border-red-500/20 dark:bg-red-500/10"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            )}
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-black ${
                  toast.type === "success"
                    ? "text-emerald-800 dark:text-emerald-300"
                    : "text-red-800 dark:text-red-300"
                }`}
              >
                {toast.type === "success" ? "Success" : "Error"}
              </p>
              <p
                className={`mt-0.5 text-xs font-semibold ${
                  toast.type === "success"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToast({ type: "", message: "" })}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 sm:h-56 lg:h-64">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-black/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-orange-400/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Main Content ── */}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Card (overlaps banner) */}
        <div className="-mt-24 mb-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 p-5 shadow-xl backdrop-blur-xl sm:-mt-28 sm:p-7 lg:-mt-32">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            {/* Avatar */}
            <div className="relative shrink-0">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt={formData.name || "User"}
                  className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-xl ring-4 ring-slate-100 dark:border-slate-800 dark:ring-slate-800 sm:h-32 sm:w-32"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-red-600 to-orange-500 text-4xl font-black text-white shadow-xl ring-4 ring-slate-100 dark:border-slate-800 dark:ring-slate-800 sm:h-32 sm:w-32">
                  {userInitial}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 rounded-2xl border-2 border-white bg-slate-900 p-2.5 text-white shadow-lg transition-all duration-200 hover:bg-red-600 hover:scale-105 active:scale-95 dark:border-slate-800 dark:bg-slate-700 dark:hover:bg-red-600"
                title="Change photo"
              >
                <Camera className="h-4 w-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                  {formData.name || "TedBus User"}
                </h1>
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${memberTier.bg} ${memberTier.border} ${memberTier.color}`}
                >
                  <TierIcon className="h-3.5 w-3.5" />
                  {memberTier.name}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 sm:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {formData.email}
                </span>
                {formData.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    +91 {formData.phone}
                  </span>
                )}
                {formData.city && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {formData.city}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 sm:justify-start">
                <CalendarDays className="h-3.5 w-3.5" />
                Member since {memberSince} · {memberDays} days
              </div>

              {/* Photo Upload Actions */}
              {hasUnsavedPhoto && (
                <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
                  <button
                    type="button"
                    onClick={handleUploadPhoto}
                    disabled={uploadingPhoto}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-red-500/25 transition hover:bg-red-700 disabled:opacity-70"
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <UploadCloud className="h-3.5 w-3.5" />
                    )}
                    {uploadingPhoto ? "Uploading..." : "Save Photo"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPhoto}
                    disabled={uploadingPhoto}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-black text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-70"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats (Desktop) */}
            <div className="hidden shrink-0 gap-6 lg:flex">
              {[
                {
                  value: stats.totalBookings,
                  label: "Bookings",
                  color: "text-blue-600 dark:text-blue-400",
                },
                {
                  value: stats.completedTrips,
                  label: "Completed",
                  color: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  value: `₹${stats.totalSpent.toLocaleString("en-IN")}`,
                  label: "Total Spent",
                  color: "text-red-600 dark:text-red-400",
                },
                {
                  value: stats.tedPoints,
                  label: "TedPoints",
                  color: "text-amber-600 dark:text-amber-400",
                },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Quick Stats */}
          <div className="mt-6 grid grid-cols-4 gap-3 lg:hidden">
            {[
              {
                value: stats.totalBookings,
                label: "Bookings",
                color: "text-blue-600 dark:text-blue-400",
              },
              {
                value: stats.completedTrips,
                label: "Completed",
                color: "text-emerald-600 dark:text-emerald-400",
              },
              {
                value: `₹${stats.totalSpent.toLocaleString("en-IN")}`,
                label: "Spent",
                color: "text-red-600 dark:text-red-400",
              },
              {
                value: stats.tedPoints,
                label: "Points",
                color: "text-amber-600 dark:text-amber-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center"
              >
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Layout: Sidebar + Content ── */}
        <div className="flex flex-col gap-6 pb-10 lg:flex-row lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full shrink-0 space-y-4 lg:w-72">
            {/* Tabs */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-2.5 shadow-sm">
              <nav className="space-y-1">
                {sidebarTabs.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setEditMode(false);
                        setErrors({});
                      }}
                      className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
                        active
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                            active
                              ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                          }`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </div>
                        <span className="text-sm font-black">{item.label}</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transition-all duration-200 ${
                          active
                            ? "text-red-400 translate-x-0 opacity-100"
                            : "text-slate-300 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>

              <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

              <button
                type="button"
                onClick={() => navigate("/my-bookings")}
                className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                  <Ticket className="h-[18px] w-[18px]" />
                </div>
                <span className="text-sm font-black">My Bookings</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                  <LogOut className="h-[18px] w-[18px]" />
                </div>
                <span className="text-sm font-black">Sign Out</span>
              </button>
            </div>

            {/* Verified Badge */}
            <div className="rounded-2xl border border-emerald-200/60 dark:border-emerald-500/15 bg-emerald-50/80 dark:bg-emerald-500/5 p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-50 dark:ring-slate-900 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                    Verified Account
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-600/70 dark:text-emerald-500/70">
                    Your identity is confirmed
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Content Area ── */}
          <section className="w-full min-w-0 flex-1">
            {/* ═══ PROFILE TAB ═══ */}
            {activeTab === "profile" && (
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      Personal Details
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Manage your basic profile information
                    </p>
                  </div>

                  {!editMode ? (
                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-slate-800 px-6 py-3 text-sm font-black text-white transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-700 hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      <Edit3 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                      Edit Details
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-black text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-700 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>

                {errors.general && (
                  <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4">
                    <p className="flex items-start gap-2 text-sm font-bold text-red-700 dark:text-red-400">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {errors.general}
                    </p>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <InputField
                    icon={User}
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    error={errors.name}
                    placeholder="Enter full name"
                  />
                  <InputField
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    hint="Email cannot be changed"
                  />
                  <InputField
                    icon={Phone}
                    label="Mobile Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    error={errors.phone}
                    placeholder="10-digit mobile number"
                  />
                  <InputField
                    icon={MapPin}
                    label="City / Location"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!editMode}
                    error={errors.city}
                    placeholder="Enter your city"
                  />

                  {/* Gender */}
                  <div>
                    <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-300">
                      Gender
                    </label>
                    <div
                      className={`group relative rounded-2xl border-2 bg-slate-50 transition-all duration-200 dark:bg-slate-800/40 ${
                        !editMode
                          ? "border-slate-200 dark:border-slate-700/50 opacity-70"
                          : errors.gender
                            ? "border-red-300 dark:border-red-500/50"
                            : "border-slate-200 dark:border-slate-700/50 focus-within:border-red-500 dark:focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-800/80 focus-within:ring-4 focus-within:ring-red-500/10"
                      }`}
                    >
                      <User className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <select
                        name="gender"
                        disabled={!editMode}
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-2xl bg-transparent py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none disabled:cursor-not-allowed disabled:text-slate-400 dark:text-slate-100 dark:disabled:text-slate-500"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.gender && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                        <AlertCircle size={12} />
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ TRAVEL STATISTICS TAB ═══ */}
            {activeTab === "stats" && (
              <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  <StatCard
                    icon={Ticket}
                    label="Total Bookings"
                    value={stats.totalBookings}
                    sub="All-time bookings"
                    color="text-blue-600"
                    onClick={() => navigate("/my-bookings")}
                  />
                  <StatCard
                    icon={CheckCircle2}
                    label="Completed"
                    value={stats.completedTrips}
                    sub={`${successRate}% success rate`}
                    color="text-emerald-600"
                    onClick={() => navigate("/my-bookings")}
                  />
                  <StatCard
                    icon={XCircle}
                    label="Cancelled"
                    value={stats.cancelledTrips}
                    sub="Cancelled trips"
                    color="text-red-600"
                  />
                  <StatCard
                    icon={Clock}
                    label="Upcoming"
                    value={stats.upcomingTrips}
                    sub="Scheduled trips"
                    color="text-violet-600"
                    onClick={() => navigate("/my-bookings")}
                  />
                  <StatCard
                    icon={IndianRupee}
                    label="Total Spent"
                    value={`₹${stats.totalSpent.toLocaleString("en-IN")}`}
                    sub="Lifetime spending"
                    color="text-rose-600"
                  />
                  <StatCard
                    icon={Award}
                    label="TedPoints"
                    value={stats.tedPoints}
                    sub="Reward points earned"
                    color="text-amber-600"
                  />
                  <StatCard
                    icon={Globe}
                    label="Cities Visited"
                    value={stats.citiesVisited}
                    sub="Unique destinations"
                    color="text-cyan-600"
                  />
                  <StatCard
                    icon={Route}
                    label="Distance"
                    value={`${stats.totalDistance.toLocaleString("en-IN")} km`}
                    sub="Total distance covered"
                    color="text-indigo-600"
                  />
                </div>

                {/* Journey Summary */}
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">
                    Journey Summary
                  </h3>

                  {/* Progress Bars */}
                  <div className="space-y-5">
                    {[
                      {
                        label: "Completed",
                        value: stats.completedTrips,
                        total: stats.totalBookings,
                        color: "bg-emerald-500",
                        bg: "bg-emerald-100 dark:bg-emerald-500/20",
                      },
                      {
                        label: "Cancelled",
                        value: stats.cancelledTrips,
                        total: stats.totalBookings,
                        color: "bg-red-500",
                        bg: "bg-red-100 dark:bg-red-500/20",
                      },
                      {
                        label: "Upcoming",
                        value: stats.upcomingTrips,
                        total: stats.totalBookings,
                        color: "bg-violet-500",
                        bg: "bg-violet-100 dark:bg-violet-500/20",
                      },
                    ].map((bar) => {
                      const pct =
                        bar.total > 0
                          ? Math.round((bar.value / bar.total) * 100)
                          : 0;
                      return (
                        <div key={bar.label}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {bar.label}
                            </span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              {bar.value}{" "}
                              <span className="text-xs font-medium text-slate-400">
                                ({pct}%)
                              </span>
                            </span>
                          </div>
                          <div
                            className={`h-3 w-full overflow-hidden rounded-full ${bar.bg}`}
                          >
                            <div
                              className={`h-full rounded-full ${bar.color} transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Avg Spend & Membership */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                          Avg. per Booking
                        </p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">
                          ₹
                          {stats.totalBookings > 0
                            ? Math.round(
                                stats.totalSpent / stats.totalBookings
                              ).toLocaleString("en-IN")
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${memberTier.bg} ${memberTier.color}`}
                      >
                        <TierIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                          Membership Tier
                        </p>
                        <p
                          className={`text-xl font-black ${memberTier.color}`}
                        >
                          {memberTier.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ PREFERENCES TAB ═══ */}
            {activeTab === "preferences" && (
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Notifications & Alerts
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Control how TedBus communicates with you
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "bookingAlerts",
                      title: "Booking Alerts",
                      description:
                        "Ticket confirmations, cancellation, and payment updates",
                      icon: Ticket,
                      color:
                        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
                    },
                    {
                      key: "whatsapp",
                      title: "WhatsApp Updates",
                      description:
                        "Receive tickets and live journey alerts on WhatsApp",
                      icon: Phone,
                      color:
                        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
                    },
                    {
                      key: "promotions",
                      title: "Email Promotions",
                      description:
                        "Exclusive offers, discounts, and travel inspiration",
                      icon: Mail,
                      color:
                        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between gap-4 rounded-2xl border-2 p-5 transition-all duration-200 ${
                          preferences[item.key]
                            ? "border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30"
                            : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/10 opacity-75"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 dark:text-white">
                              {item.title}
                            </h4>
                            <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <Toggle
                          enabled={preferences[item.key]}
                          onChange={() => togglePreference(item.key)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══ SECURITY TAB ═══ */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      Login & Security
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Manage your password and account security
                    </p>
                  </div>

                  {/* Security Tip */}
                  <div className="mb-8 rounded-2xl border border-amber-200/60 dark:border-amber-500/15 bg-amber-50/80 dark:bg-amber-500/5 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-amber-900 dark:text-amber-300">
                          Security Recommendation
                        </h4>
                        <p className="mt-1 text-sm font-medium leading-6 text-amber-700 dark:text-amber-400/80">
                          Update your password regularly and never share login
                          details. Enable booking alerts for real-time security
                          notifications.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="group flex items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-slate-800 px-6 py-4 text-sm font-black text-white shadow-md transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-700 hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      <LockKeyhole className="h-5 w-5 transition-transform group-hover:rotate-12" />
                      Change Password
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-6 py-4 text-sm font-black text-red-600 dark:text-red-400 transition-all duration-200 hover:bg-red-600 dark:hover:bg-red-600 hover:border-red-600 dark:hover:border-red-600 hover:text-white dark:hover:text-white hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Account Activity */}
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
                  <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white mb-6">
                    <CalendarDays className="h-5 w-5 text-red-600 dark:text-red-400" />
                    Account Activity
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Account Created",
                        value: memberSince,
                        icon: CalendarDays,
                        sub: `${memberDays} days ago`,
                      },
                      {
                        label: "Account Status",
                        value: "Active",
                        icon: ShieldCheck,
                        sub: "Email verified",
                        valueColor: "text-emerald-600 dark:text-emerald-400",
                      },
                      {
                        label: "Membership",
                        value: memberTier.name,
                        icon: TierIcon,
                        sub: `${stats.completedTrips} completed trips`,
                        valueColor: memberTier.color,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                              <Icon className="h-[18px] w-[18px]" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                                {item.label}
                              </p>
                              <p
                                className={`text-sm font-black ${
                                  item.valueColor ||
                                  "text-slate-900 dark:text-white"
                                }`}
                              >
                                {item.value}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                            {item.sub}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Profile;