import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BadgePercent,
  Edit,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscount: "",
  minPurchase: 0,
  expiryDate: "",
  usageLimit: "",
  isActive: true,
};

const formatDateInput = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().split("T")[0];
};

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getCoupons();

      const apiCoupons =
        response?.coupons ||
        response?.data?.coupons ||
        [];

      setCoupons(Array.isArray(apiCoupons) ? apiCoupons : []);
    } catch (err) {
      setError(err?.message || "Unable to load coupons");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const filteredCoupons = useMemo(() => {
    if (!searchQuery.trim()) return coupons;

    const query = searchQuery.trim().toLowerCase();

    return coupons.filter((coupon) =>
      coupon.code?.toLowerCase().includes(query)
    );
  }, [coupons, searchQuery]);

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData(initialForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);

    setFormData({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || "",
      maxDiscount: coupon.maxDiscount || "",
      minPurchase: coupon.minPurchase || 0,
      expiryDate: formatDateInput(coupon.expiryDate),
      usageLimit: coupon.usageLimit || "",
      isActive: coupon.isActive,
    });

    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingCoupon(null);
    setFormData(initialForm);
    setFormErrors({});
  };

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.code.trim()) {
      errors.code = "Coupon code is required";
    }

    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      errors.discountValue = "Valid discount value is required";
    }

    if (!formData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    }

    if (
      formData.discountType === "percentage" &&
      Number(formData.discountValue) > 100
    ) {
      errors.discountValue = "Percentage cannot be greater than 100";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => {
    return {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      minPurchase: Number(formData.minPurchase || 0),
      expiryDate: new Date(formData.expiryDate),
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      isActive: Boolean(formData.isActive),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = buildPayload();

      if (editingCoupon) {
        const response = await adminService.updateCoupon(
          editingCoupon._id || editingCoupon.id,
          payload
        );

        const updated =
          response?.coupon ||
          response?.data?.coupon ||
          {
            ...editingCoupon,
            ...payload,
          };

        setCoupons((prev) =>
          prev.map((item) =>
            (item._id || item.id) === (editingCoupon._id || editingCoupon.id)
              ? updated
              : item
          )
        );

        toast.success(response?.message || "Coupon updated successfully");
      } else {
        const response = await adminService.createCoupon(payload);

        const created =
          response?.coupon ||
          response?.data?.coupon ||
          payload;

        setCoupons((prev) => [created, ...prev]);

        toast.success(response?.message || "Coupon created successfully");
      }

      closeModal();
    } catch (err) {
      const message = err?.message || "Unable to save coupon";

      setFormErrors((prev) => ({
        ...prev,
        general: message,
      }));

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (coupon) => {
    const id = coupon._id || coupon.id;

    const confirmed = window.confirm(
      `Are you sure you want to delete coupon ${coupon.code}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await adminService.deleteCoupon(id);

      setCoupons((prev) =>
        prev.filter((item) => (item._id || item.id) !== id)
      );

      toast.success(response?.message || "Coupon deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to delete coupon");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading coupons...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
            <BadgePercent className="h-8 w-8 text-red-600" />
            Manage Coupons
          </h1>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Create offers that appear on TedBus home page.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Add Coupon
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
          <p className="mt-3 font-bold text-red-700">{error}</p>
          <button
            onClick={fetchCoupons}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {!error && filteredCoupons.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <BadgePercent className="mx-auto h-14 w-14 text-red-600" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            No coupons found
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Create coupons to show exclusive offers on home page.
          </p>
        </div>
      )}

      {!error && filteredCoupons.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Min Purchase</th>
                  <th className="px-6 py-4">Usage</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCoupons.map((coupon) => {
                  const id = coupon._id || coupon.id;

                  return (
                    <tr
                      key={id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <span className="rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-600">
                          {coupon.code}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-black text-slate-900">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                        {coupon.maxDiscount && (
                          <p className="text-xs font-semibold text-slate-400">
                            Max ₹{coupon.maxDiscount}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-700">
                        ₹{coupon.minPurchase || 0}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-700">
                        {coupon.usedCount || 0}/{coupon.usageLimit || "∞"}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-700">
                        {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-black ${
                            coupon.isActive
                              ? "border-green-100 bg-green-50 text-green-700"
                              : "border-red-100 bg-red-50 text-red-700"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(coupon)}
                            className="rounded-xl bg-blue-50 p-3 text-blue-600 transition hover:bg-blue-100"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(coupon)}
                            disabled={deletingId === id}
                            className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                          >
                            {deletingId === id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <CouponModal
          formData={formData}
          errors={formErrors}
          saving={saving}
          editingCoupon={editingCoupon}
          updateField={updateField}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const CouponModal = ({
  formData,
  errors,
  saving,
  editingCoupon,
  updateField,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {editingCoupon ? "Edit Coupon" : "Add Coupon"}
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              Create offers for users.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl bg-slate-100 p-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 p-6 md:grid-cols-2">
          {errors.general && (
            <div className="md:col-span-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
              {errors.general}
            </div>
          )}

          <Input
            label="Coupon Code"
            value={formData.code}
            onChange={(value) => updateField("code", value.toUpperCase())}
            error={errors.code}
            placeholder="TED50"
          />

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Discount Type
            </label>
            <select
              value={formData.discountType}
              onChange={(e) => updateField("discountType", e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-red-500"
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat Amount</option>
            </select>
          </div>

          <Input
            label="Discount Value"
            type="number"
            value={formData.discountValue}
            onChange={(value) => updateField("discountValue", value)}
            error={errors.discountValue}
            placeholder="50"
          />

          <Input
            label="Max Discount"
            type="number"
            value={formData.maxDiscount}
            onChange={(value) => updateField("maxDiscount", value)}
            placeholder="300"
          />

          <Input
            label="Minimum Purchase"
            type="number"
            value={formData.minPurchase}
            onChange={(value) => updateField("minPurchase", value)}
            placeholder="500"
          />

          <Input
            label="Usage Limit"
            type="number"
            value={formData.usageLimit}
            onChange={(value) => updateField("usageLimit", value)}
            placeholder="100"
          />

          <Input
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={(value) => updateField("expiryDate", value)}
            error={errors.expiryDate}
          />

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Status
            </label>
            <select
              value={formData.isActive ? "active" : "inactive"}
              onChange={(e) =>
                updateField("isActive", e.target.value === "active")
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-red-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingCoupon ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", error, placeholder }) => (
  <div>
    <label className="mb-2 block text-sm font-black text-slate-700">
      {label}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-red-500 ${
        error ? "border-red-300" : "border-slate-200"
      }`}
    />
    {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
  </div>
);

export default ManageCoupons;