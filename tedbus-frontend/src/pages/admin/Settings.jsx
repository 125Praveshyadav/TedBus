import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Building2,
  Camera,
  CheckCircle2,
  Image,
  Loader2,
  Mail,
  Percent,
  Phone,
  RefreshCcw,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";
import { useAuth } from "../../components/context/AuthContext";

const defaultSettings = {
  platformName: "TedBus",
  contactEmail: "support@tedbus.com",
  supportNumber: "",
  logo: "",
  commissionRate: 10,
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true;
  return /^[6-9]\d{9}$/.test(phone);
};

const Settings = () => {
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [settings, setSettings] = useState(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState("");

  const hasChanges = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setErrors({});

      const response = await adminService.getSettings();

      const apiSettings =
        response?.settings ||
        response?.data?.settings ||
        defaultSettings;

      const nextSettings = {
        platformName: apiSettings.platformName || "TedBus",
        contactEmail: apiSettings.contactEmail || "support@tedbus.com",
        supportNumber: apiSettings.supportNumber || "",
        logo: apiSettings.logo || "",
        commissionRate:
          apiSettings.commissionRate !== undefined
            ? apiSettings.commissionRate
            : 10,
      };

      setSettings(nextSettings);
      setOriginalSettings(nextSettings);
      setLogoPreview(nextSettings.logo || "");
    } catch (err) {
      setErrors({
        general: err?.message || "Unable to load settings",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateField = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateSettings = () => {
    const newErrors = {};

    if (!settings.platformName.trim()) {
      newErrors.platformName = "Platform name is required";
    }

    if (!settings.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!validateEmail(settings.contactEmail.trim())) {
      newErrors.contactEmail = "Enter a valid contact email";
    }

    if (!validatePhone(settings.supportNumber.trim())) {
      newErrors.supportNumber = "Enter a valid 10 digit Indian mobile number";
    }

    if (
      settings.commissionRate === "" ||
      Number(settings.commissionRate) < 0 ||
      Number(settings.commissionRate) > 100
    ) {
      newErrors.commissionRate = "Commission rate must be between 0 and 100";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogoUrlChange = (value) => {
    updateField("logo", value);
    setLogoPreview(value);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > 1024 * 1024 * 2) {
      toast.error("Logo size should be less than 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;

      setLogoPreview(base64);
      updateField("logo", base64);

      toast.success("Logo preview updated");
    };

    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview("");
    updateField("logo", "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setLogoPreview(originalSettings.logo || "");
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateSettings()) return;

    try {
      setSaving(true);

      const payload = {
        platformName: settings.platformName.trim(),
        contactEmail: settings.contactEmail.trim().toLowerCase(),
        supportNumber: settings.supportNumber.trim(),
        logo: settings.logo,
        commissionRate: Number(settings.commissionRate),
      };

      const response = await adminService.updateSettings(payload);

      const updatedSettings =
        response?.settings ||
        response?.data?.settings ||
        payload;

      const nextSettings = {
        platformName: updatedSettings.platformName || payload.platformName,
        contactEmail: updatedSettings.contactEmail || payload.contactEmail,
        supportNumber: updatedSettings.supportNumber || payload.supportNumber,
        logo: updatedSettings.logo || payload.logo,
        commissionRate:
          updatedSettings.commissionRate !== undefined
            ? updatedSettings.commissionRate
            : payload.commissionRate,
      };

      setSettings(nextSettings);
      setOriginalSettings(nextSettings);
      setLogoPreview(nextSettings.logo || "");

      toast.success(response?.message || "Settings updated successfully");
    } catch (err) {
      const message = err?.message || "Unable to update settings";

      setErrors({
        general: message,
      });

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
            <SettingsIcon className="h-8 w-8 text-red-600" />
            Settings
          </h1>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Manage platform branding, support details and commission settings.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Error */}
      {errors.general && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
          <p className="flex items-start gap-2 text-sm font-bold text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            {errors.general}
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Main Settings Form */}
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Platform Details */}
          <section>
            <div className="mb-5">
              <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
                <Building2 className="h-5 w-5 text-red-600" />
                Platform Details
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                Basic information shown across the TedBus platform.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Platform Name"
                name="platformName"
                value={settings.platformName}
                onChange={updateField}
                error={errors.platformName}
                icon={Building2}
                placeholder="TedBus"
              />

              <Input
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={updateField}
                error={errors.contactEmail}
                icon={Mail}
                placeholder="support@tedbus.com"
              />

              <Input
                label="Support Number"
                name="supportNumber"
                value={settings.supportNumber}
                onChange={(name, value) =>
                  updateField(name, value.replace(/\D/g, "").slice(0, 10))
                }
                error={errors.supportNumber}
                icon={Phone}
                placeholder="9876543210"
              />

              <Input
                label="Commission Rate (%)"
                name="commissionRate"
                type="number"
                value={settings.commissionRate}
                onChange={updateField}
                error={errors.commissionRate}
                icon={Percent}
                placeholder="10"
              />
            </div>
          </section>

          {/* Branding */}
          <section className="border-t border-slate-100 pt-6">
            <div className="mb-5">
              <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
                <Image className="h-5 w-5 text-red-600" />
                Branding
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                Upload or paste a logo URL for your platform.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
              {/* Logo Preview */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Logo Preview
                </p>

                <div className="flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="TedBus Logo"
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="mx-auto h-10 w-10 text-slate-300" />
                      <p className="mt-2 text-xs font-bold text-slate-400">
                        No logo selected
                      </p>
                    </div>
                  )}
                </div>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                    Remove Logo
                  </button>
                )}
              </div>

              {/* Logo Controls */}
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Logo URL
                  </label>

                  <input
                    type="text"
                    value={settings.logo}
                    onChange={(e) => handleLogoUrlChange(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />

                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    You can paste an image URL or upload a logo below.
                  </p>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-red-300 bg-red-50 px-5 py-4 text-sm font-black text-red-600 transition hover:bg-red-100"
                  >
                    <UploadCloud className="h-5 w-5" />
                    Upload Logo
                  </button>

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Recommended size: 512×512px. Max size: 2MB.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-bold leading-5 text-amber-700">
                    Production Note: This page currently stores logo as a URL or
                    base64 string. For true production upload, connect this to
                    Cloudinary using your existing Cloudinary config.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChanges || saving}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset Changes
            </button>

            <button
              type="submit"
              disabled={!hasChanges || saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>

        {/* Right Side */}
        <aside className="space-y-6">
          {/* Admin Profile Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl font-black text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-black text-slate-900">
                  {user?.name || "Admin"}
                </h3>
                <p className="truncate text-sm font-semibold text-slate-500">
                  {user?.email || "admin@tedbus.com"}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="flex items-start gap-2 text-xs font-bold leading-5 text-green-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                You are logged in as an administrator.
              </p>
            </div>
          </div>

          {/* Current Config */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">
              Current Configuration
            </h3>

            <div className="mt-5 space-y-4">
              <ConfigRow label="Platform" value={settings.platformName} />
              <ConfigRow label="Email" value={settings.contactEmail} />
              <ConfigRow
                label="Support"
                value={settings.supportNumber || "Not set"}
              />
              <ConfigRow
                label="Commission"
                value={`${settings.commissionRate || 0}%`}
              />
            </div>
          </div>

          {/* Save Status */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">
              Save Status
            </h3>

            {hasChanges ? (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="flex items-start gap-2 text-sm font-bold text-amber-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  You have unsaved changes.
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-4">
                <p className="flex items-start gap-2 text-sm font-bold text-green-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  All settings are saved.
                </p>
              </div>
            )}
          </div>
        </aside>
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
  type = "text",
  error,
  placeholder,
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
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-2xl bg-transparent py-4 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 ${
            Icon ? "pl-12" : "pl-4"
          }`}
        />
      </div>

      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

const ConfigRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className="max-w-[180px] truncate text-sm font-black text-slate-900">
        {value}
      </span>
    </div>
  );
};

export default Settings;