import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";
import { useAuth } from "../../components/context/AuthContext";

const validatePhone = (phone) => {
  if (!phone) return true;
  return /^[6-9]\d{9}$/.test(phone);
};

const AdminProfile = () => {
  const { user, setUser } = useAuth();

  const fileInputRef = useRef(null);

  const [admin, setAdmin] = useState(user || null);
  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    gender: "",
  });

  const [photoPreview, setPhotoPreview] = useState("");

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrors({});

      const response = await adminService.getAdminProfile();

      const adminData =
        response?.admin ||
        response?.data?.admin ||
        user;

      setAdmin(adminData);

      setFormData({
        name: adminData?.name || "",
        email: adminData?.email || "",
        phone: adminData?.phone || "",
        city: adminData?.city || "",
        gender: adminData?.gender || "",
      });

      setPhotoPreview(adminData?.profileImage || "");

      if (setUser) {
        setUser(adminData);
        localStorage.setItem("user", JSON.stringify(adminData));
      }
    } catch (error) {
      setErrors({
        general: error?.message || "Unable to load admin profile",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (name, value) => {
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
      newErrors.name = "Name is required";
    }

    if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = "Enter valid 10 digit mobile number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) return;

    try {
      setSavingProfile(true);

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        gender: formData.gender,
      };

      const response = await adminService.updateAdminProfile(payload);

      const updatedAdmin =
        response?.admin ||
        response?.data?.admin ||
        {
          ...admin,
          ...payload,
        };

      setAdmin(updatedAdmin);

      if (setUser) {
        setUser(updatedAdmin);
        localStorage.setItem("user", JSON.stringify(updatedAdmin));
      }

      toast.success(response?.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error?.message || "Unable to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleUploadPhoto = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast.error("Please select a profile photo");
      return;
    }

    try {
      setUploadingPhoto(true);
      

      const data = new FormData();
      data.append("profileImage", file);

      const response = await adminService.updateAdminProfilePhoto(data);

      const updatedAdmin =
        response?.admin ||
        response?.data?.admin ||
        admin;

      setAdmin(updatedAdmin);
      setPhotoPreview(updatedAdmin?.profileImage || "");

      if (setUser) {
        setUser(updatedAdmin);
        localStorage.setItem("user", JSON.stringify(updatedAdmin));
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(response?.message || "Profile photo updated successfully");
    } catch (error) {
      toast.error(error?.message || "Unable to upload profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updatePasswordField = (name, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      password: "",
    }));
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setChangingPassword(true);

      const response = await adminService.changeAdminPassword(passwordData);

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success(response?.message || "Password changed successfully");
    } catch (error) {
      toast.error(error?.message || "Unable to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading admin profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
          <UserRound className="h-8 w-8 text-red-600" />
          Admin Profile
        </h1>

        <p className="mt-1 text-sm font-semibold text-slate-500">
          Manage your admin information, profile photo and password.
        </p>
      </div>

      {errors.general && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
          <p className="flex items-start gap-2 text-sm font-bold text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            {errors.general}
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        {/* Left Profile Photo */}
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-32 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

            <div className="-mt-16 flex flex-col items-center px-6 pb-6">
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={admin?.name}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-5xl font-black text-white shadow-lg">
                    {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 rounded-full border-2 border-white bg-red-600 p-3 text-white shadow-lg hover:bg-red-700"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-900">
                {admin?.name}
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {admin?.email}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-xs font-black text-green-700">
                <ShieldCheck className="h-4 w-4" />
                Administrator
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleUploadPhoto}
                disabled={uploadingPhoto}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {uploadingPhoto ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <UploadCloud className="h-5 w-5" />
                )}
                {uploadingPhoto ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-green-100 bg-green-50 p-5">
            <p className="flex items-start gap-2 text-sm font-bold leading-6 text-green-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              Your admin profile is used for dashboard identity and activity
              tracking.
            </p>
          </div>
        </aside>

        {/* Right Content */}
        <section className="space-y-6">
          {/* Profile Form */}
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">
                Profile Information
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Update your basic admin details.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={updateField}
                error={errors.name}
                icon={UserRound}
              />

              <Input
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={updateField}
                icon={Mail}
                disabled
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={updateField}
                error={errors.phone}
                icon={Phone}
              />

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={updateField}
                icon={MapPin}
              />

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Gender
                </label>

                <select
                  value={formData.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-red-500/25 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingProfile ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </form>

          {/* Change Password */}
          <form
            onSubmit={handleChangePassword}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">
                Change Password
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Keep your admin account secure.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <PasswordInput
                label="Old Password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={updatePasswordField}
                show={showPasswords.old}
                setShow={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    old: !prev.old,
                  }))
                }
                error={errors.oldPassword}
              />

              <PasswordInput
                label="New Password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={updatePasswordField}
                show={showPasswords.new}
                setShow={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
                error={errors.newPassword}
              />

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={updatePasswordField}
                show={showPasswords.confirm}
                setShow={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                error={errors.confirmPassword}
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {changingPassword ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LockKeyhole className="h-5 w-5" />
              )}
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  error,
  disabled = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <div
        className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      >
        {Icon && (
          <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        )}

        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full rounded-2xl bg-transparent py-4 pr-4 text-sm font-bold text-slate-800 outline-none disabled:cursor-not-allowed disabled:text-slate-500 ${
            Icon ? "pl-12" : "pl-4"
          }`}
        />
      </div>

      {error && (
        <p className="mt-1 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
  error,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <div
        className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      >
        <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-12 text-sm font-bold text-slate-800 outline-none"
        />

        <button
          type="button"
          onClick={setShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default AdminProfile;