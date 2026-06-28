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
  Edit3,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Ticket,
  UploadCloud,
  User,
  X,
} from "lucide-react";

import { useAuth } from "../../components/context/AuthContext";

const initialPreferences = {
  whatsapp: true,
  promotions: false,
  bookingAlerts: true,
};

const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

const Profile = () => {
  const {
    user,
    logout,
    updateUser,
    updateUserPhoto,
    loading,
  } = useAuth();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [photoPreview, setPhotoPreview] = useState(
    user?.profileImage || ""
  );

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

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

  const userInitial = useMemo(() => {
    return formData.name?.charAt(0)?.toUpperCase() || "U";
  }, [formData.name]);

  const totalTrips = user?.totalTrips || user?.bookingCount || 0;
  const tedPoints = user?.tedPoints || user?.rewardPoints || 0;

  const hasUnsavedPhoto =
    photoPreview && photoPreview !== user?.profileImage;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
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
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        type: "",
        message: "",
      });
    }, 3000);
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

  const validateProfile = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (formData.city && formData.city.trim().length < 2) {
      newErrors.city = "Enter a valid city";
    }

    if (
      formData.gender &&
      !["Male", "Female", "Other"].includes(formData.gender)
    ) {
      newErrors.gender = "Select a valid gender";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setFormData(originalData);
    }

    setErrors({});
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!validateProfile()) return;

    if (!updateUser) {
      showToast(
        "error",
        "updateUser function missing in AuthContext. Please update AuthContext first."
      );
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
      showToast(
        "error",
        error?.message || "Failed to update profile. Please try again."
      );
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

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleUploadPhoto = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      showToast("error", "Please select a profile photo");
      return;
    }

    if (!updateUserPhoto) {
      showToast(
        "error",
        "updateUserPhoto missing in AuthContext. Please update AuthContext."
      );
      return;
    }

    try {
      setUploadingPhoto(true);

      const data = new FormData();
      data.append("profileImage", file);

      const updatedUser = await updateUserPhoto(data);

      setPhotoPreview(updatedUser?.profileImage || "");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showToast("success", "Profile photo updated successfully");
    } catch (error) {
      showToast(
        "error",
        error?.message || "Unable to upload profile photo"
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelPhoto = () => {
    setPhotoPreview(user?.profileImage || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">
              Loading profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 font-sans sm:px-6 lg:px-8">
      {/* Toast */}
      {toast.message && (
        <div className="fixed right-5 top-24 z-50 w-[calc(100%-2.5rem)] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl ${
              toast.type === "success"
                ? "border-green-100"
                : "border-red-100"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-green-600" />
            ) : (
              <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
            )}

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-slate-900">
                {toast.type === "success" ? "Success" : "Error"}
              </h4>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast({ type: "", message: "" })}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full space-y-6 lg:w-1/3">
          {/* User Card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-28 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

            <div className="relative -mt-14 flex flex-col items-center px-6 pb-6">
              {/* Avatar Block */}
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={formData.name || "User"}
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-4xl font-black text-white shadow-md">
                    {userInitial}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-red-600 p-2 text-white shadow-lg transition hover:bg-red-700"
                  title="Change profile photo"
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

              {/* Photo Action Buttons (only show when new image selected) */}
              {hasUnsavedPhoto && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleUploadPhoto}
                    disabled={uploadingPhoto}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-black text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="h-4 w-4" />
                    )}
                    {uploadingPhoto ? "Uploading..." : "Upload"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelPhoto}
                    disabled={uploadingPhoto}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <h2 className="mt-4 text-center text-xl font-black text-slate-900">
                {formData.name || "TedBus User"}
              </h2>

              <p className="mt-1 max-w-full truncate text-center text-sm font-semibold text-slate-500">
                {formData.email}
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-600">
                <Award className="h-4 w-4" />
                TedBus Member
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate("/my-bookings")}
                className="p-4 text-center transition hover:bg-slate-50"
              >
                <p className="text-2xl font-black text-slate-900">
                  {totalTrips}
                </p>
                <p className="text-xs font-bold text-slate-500">
                  Total Trips
                </p>
              </button>

              <div className="p-4 text-center">
                <p className="text-2xl font-black text-red-600">
                  {tedPoints}
                </p>
                <p className="text-xs font-bold text-slate-500">
                  TedPoints
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            <nav className="space-y-1">
              {[
                {
                  id: "profile",
                  icon: User,
                  label: "Personal Information",
                },
                {
                  id: "preferences",
                  icon: Bell,
                  label: "Notifications & Alerts",
                },
                {
                  id: "security",
                  icon: Shield,
                  label: "Login & Security",
                },
              ].map((item) => {
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
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition ${
                      active
                        ? "bg-red-50 text-red-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 ${
                          active ? "text-red-600" : "text-slate-400"
                        }`}
                      />
                      <span className="text-sm font-black">
                        {item.label}
                      </span>
                    </div>

                    {active && <ChevronRight className="h-4 w-4" />}
                  </button>
                );
              })}

              <div className="my-2 border-t border-slate-100" />

              <button
                type="button"
                onClick={() => navigate("/my-bookings")}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-slate-600 transition hover:bg-slate-50"
              >
                <Ticket className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-black">My Bookings</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-black">Sign Out</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Content */}
        <section className="w-full lg:w-2/3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Personal Details
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Manage your basic profile information.
                  </p>
                </div>

                {!editMode ? (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Details
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
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
                <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4">
                  <p className="flex items-start gap-2 text-sm font-bold text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {errors.general}
                  </p>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {/* Full Name */}
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
                      disabled={!editMode}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none disabled:cursor-not-allowed disabled:text-slate-500"
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

                  <div className="relative rounded-2xl border border-slate-200 bg-slate-50">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full cursor-not-allowed rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-500 outline-none"
                    />
                  </div>

                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Email cannot be changed.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Mobile Number
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
                      disabled={!editMode}
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none disabled:cursor-not-allowed disabled:text-slate-500"
                    />
                  </div>

                  {errors.phone && (
                    <p className="mt-1 text-xs font-semibold text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    City / Location
                  </label>

                  <div
                    className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                      errors.city ? "border-red-300" : "border-slate-200"
                    }`}
                  >
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="city"
                      disabled={!editMode}
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none disabled:cursor-not-allowed disabled:text-slate-500"
                    />
                  </div>

                  {errors.city && (
                    <p className="mt-1 text-xs font-semibold text-red-600">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Gender
                  </label>

                  <select
                    name="gender"
                    disabled={!editMode}
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full rounded-2xl border bg-slate-50 px-4 py-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:text-slate-500 ${
                      errors.gender ? "border-red-300" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  {errors.gender && (
                    <p className="mt-1 text-xs font-semibold text-red-600">
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-black text-slate-900">
                Alerts & Notifications
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                Control how TedBus communicates with you.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    key: "bookingAlerts",
                    title: "Booking Alerts",
                    description:
                      "Receive ticket, cancellation and payment updates.",
                  },
                  {
                    key: "whatsapp",
                    title: "WhatsApp Updates",
                    description:
                      "Receive tickets and journey alerts on WhatsApp.",
                  },
                  {
                    key: "promotions",
                    title: "Email Promotions",
                    description:
                      "Get exclusive offers, discounts and travel inspiration.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-5 transition hover:border-slate-200"
                  >
                    <div>
                      <h4 className="font-black text-slate-900">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePreference(item.key)}
                      className={`flex h-7 w-14 items-center rounded-full p-1 transition ${
                        preferences[item.key]
                          ? "bg-red-600"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`h-5 w-5 rounded-full bg-white shadow transition ${
                          preferences[item.key]
                            ? "translate-x-7"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-black text-slate-900">
                Login & Security
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                Manage your password and secure your account.
              </p>

              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-4">
                  <Shield className="mt-1 h-6 w-6 shrink-0 text-amber-600" />

                  <div>
                    <h4 className="font-black text-amber-900">
                      Keep your account secure
                    </h4>

                    <p className="mt-1 text-sm font-semibold leading-6 text-amber-700">
                      We recommend updating your password regularly and never
                      sharing your login details with anyone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black text-white shadow-md transition hover:bg-slate-800"
                >
                  <LockKeyhole className="h-5 w-5" />
                  Change Password
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-sm font-black text-red-600 transition hover:bg-red-100"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h4 className="flex items-center gap-2 font-black text-slate-900">
                  <CalendarDays className="h-5 w-5 text-red-600" />
                  Account Activity
                </h4>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Joined TedBus on{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;