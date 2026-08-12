import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Eye,
  Loader2,
  Mail,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
  Crown,
  UserCheck,
  Sparkles,
  Zap,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services//adminService";

const roleOptions = ["user", "admin"];

const ROLE_STYLES = {
  admin: {
    badge: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-red-500/30",
    soft: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    icon: Crown,
  },
  user: {
    badge: "bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-slate-800/30",
    soft: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: UserCheck,
  },
};

const STATUS_STYLES = {
  active: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  inactive: {
    badge: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  blocked: {
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    dot: "bg-red-500",
  },
};

const AVATAR_GRADIENTS = [
  "from-red-500 to-orange-500",
  "from-slate-800 to-slate-600",
  "from-red-700 to-rose-500",
  "from-orange-500 to-red-500",
  "from-slate-900 to-red-800",
  "from-red-600 to-slate-800",
  "from-rose-600 to-red-500",
];

const getAvatarGradient = (seed = "") => {
  const hash = String(seed)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeUser = (user = {}) => ({
  ...user,
  id: user._id || user.id,
  name: user.name || "User",
  email: user.email || "N/A",
  phone: user.phone || "N/A",
  role: user.role || "user",
  status: user.status || (user.isBlocked ? "blocked" : "active"),
  createdAt: user.createdAt || "",
});

/* ============================================
   LOADING SKELETON
   ============================================ */
const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="h-12 w-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-11 w-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="grid gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
    <div className="h-20 w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  </div>
);

/* ============================================
   MAIN COMPONENT
   ============================================ */
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getUsers();
      const apiUsers = response?.users || response?.data?.users || [];
      const normalized = Array.isArray(apiUsers) ? apiUsers.map(normalizeUser) : [];
      setUsers(normalized);
    } catch (err) {
      setError(err?.message || "Unable to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, roleFilter, searchQuery]);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      customers: users.filter((u) => u.role === "user").length,
      active: users.filter((u) => u.status === "active").length,
    }),
    [users]
  );

  const handleUpdateUser = async (userId, payload) => {
    try {
      setUpdatingId(userId);
      const response = await adminService.updateUser(userId, payload);
      const updatedUser = response?.user || response?.data?.user || null;
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? normalizeUser(updatedUser || { ...u, ...payload }) : u))
      );
      toast.success(response?.message || "User updated successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to update user");
    } finally {
      setUpdatingId("");
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      setDeletingId(user.id);
      const response = await adminService.deleteUser(user.id);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      toast.success(response?.message || "User deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to delete user");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-[60vh]">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-red-500/[0.08] blur-3xl dark:bg-red-500/10" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-rose-500/[0.06] blur-3xl dark:bg-rose-500/10" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-orange-500/[0.05] blur-3xl dark:bg-orange-500/10" />
      </div>

      <div className="relative space-y-6">
        {/* ===== Header ===== */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-red-950 to-red-900 text-white shadow-xl shadow-red-900/40 dark:from-red-600 dark:via-red-700 dark:to-slate-900">
                <Users className="h-5 w-5" />
              </div>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-md shadow-red-500/40">
                <Sparkles className="h-2.5 w-2.5 text-white" />
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Manage{" "}
                <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent dark:from-red-500 dark:via-red-400 dark:to-orange-400">
                  Users
                </span>
              </h1>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Zap className="h-3 w-3 text-red-500" />
                View customers, admins and manage account roles
              </p>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-black text-slate-600 backdrop-blur-sm transition-all hover:border-red-200 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-red-900/60 dark:hover:text-red-400"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Users", value: stats.total, icon: Users, gradient: "from-slate-900 to-slate-700", iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
            { label: "Admins", value: stats.admins, icon: Crown, gradient: "from-red-600 to-red-500", iconBg: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
            { label: "Customers", value: stats.customers, icon: UserCheck, gradient: "from-orange-500 to-red-500", iconBg: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
            { label: "Active Now", value: stats.active, icon: ShieldCheck, gradient: "from-emerald-600 to-teal-500", iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="animate-in fade-in slide-in-from-bottom-2 relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg hover:shadow-red-500/[0.08] dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none dark:hover:border-red-900/60"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards", animationDuration: "400ms" }}
            >
              <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.gradient}`} />
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {s.label}
                  </p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">
                    {s.value.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Controls ===== */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="h-1 bg-gradient-to-r from-slate-900 via-red-700 to-red-500" />
          <div className="p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, phone..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-10 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-600 dark:focus:bg-slate-800 dark:focus:ring-red-500/10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-4 pr-10 text-sm font-black text-slate-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:focus:border-red-600 dark:focus:bg-slate-800"
                >
                  <option value="all">All Roles</option>
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {r.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <span className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-3.5 py-2 text-xs font-black text-red-700 dark:border-red-900/50 dark:from-red-950/30 dark:to-orange-950/30 dark:text-red-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                {filteredUsers.length} of {users.length}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Error ===== */}
        {error && (
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-xl shadow-red-500/5 dark:border-red-900/40 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-900/40">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">Unable to load users</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-red-800 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-red-900/30 transition hover:-translate-y-0.5"
            >
              <RefreshCcw className="h-4 w-4" /> Retry
            </button>
          </div>
        )}

        {/* ===== Empty ===== */}
        {!error && filteredUsers.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 via-red-900 to-red-700 text-white shadow-xl shadow-red-900/30">
              <Users className="h-9 w-9" />
            </div>
            <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">No users found</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Try changing filters or search query.
            </p>
          </div>
        )}

        {/* ===== User Cards (Grid) ===== */}
        {!error && filteredUsers.length > 0 && (
          <div className="space-y-2.5">
            {filteredUsers.map((user, idx) => {
              const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.user;
              const statusStyle = STATUS_STYLES[user.status] || STATUS_STYLES.inactive;
              const RoleIcon = roleStyle.icon;

              return (
                <div
                  key={user.id}
                  className="animate-in fade-in slide-in-from-bottom-1 group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg hover:shadow-red-500/[0.08] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-red-900/60"
                  style={{
                    animationDelay: `${idx * 40}ms`,
                    animationFillMode: "backwards",
                    animationDuration: "400ms",
                  }}
                >
                  {/* Left accent bar on hover */}
                  <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-slate-900 via-red-700 to-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="grid gap-4 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-5">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
                      <div className="relative">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${getAvatarGradient(user.name)} text-lg font-black text-white shadow-lg`}
                        >
                          {getInitials(user.name)}
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${statusStyle.dot} dark:border-slate-900`}
                        />
                      </div>
                    </div>

                    {/* Middle: Info */}
                    <div className="min-w-0 space-y-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-black text-slate-900 dark:text-white">
                            {user.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide shadow-sm ${roleStyle.badge}`}
                          >
                            <RoleIcon className="h-2.5 w-2.5" />
                            {user.role}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${statusStyle.badge}`}
                          >
                            <span className={`h-1 w-1 rounded-full ${statusStyle.dot}`} />
                            {user.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                          ID: {String(user.id).slice(-10)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <Mail className="h-3.5 w-3.5 text-red-500" />
                          <span className="truncate">{user.email}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <Phone className="h-3.5 w-3.5 text-orange-500" />
                          {user.phone}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          Joined {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 sm:border-t-0 sm:pt-0">
                      {/* Role Select */}
                      <div className="relative">
                        <select
                          value={user.role}
                          disabled={updatingId === user.id}
                          onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                          className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-[10px] font-black uppercase text-slate-700 outline-none transition hover:border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900/60"
                        >
                          {roleOptions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        {updatingId === user.id ? (
                          <Loader2 className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin text-red-500" />
                        ) : (
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedUser(user)}
                        className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={deletingId === user.id}
                        className="flex items-center justify-center rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-2.5 text-red-600 transition-all hover:from-red-600 hover:to-red-700 hover:text-white hover:shadow-md hover:shadow-red-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/40 dark:from-red-500/10 dark:to-orange-500/10 dark:text-red-400 dark:hover:from-red-600 dark:hover:to-red-700 dark:hover:text-white"
                        title="Delete User"
                      >
                        {deletingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-orange-500 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.08]" />
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {selectedUser && (
          <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </div>
    </div>
  );
};

/* ============================================
   PREMIUM MODAL
   ============================================ */
const UserDetailsModal = ({ user, onClose }) => {
  const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.user;
  const statusStyle = STATUS_STYLES[user.status] || STATUS_STYLES.inactive;
  const RoleIcon = roleStyle.icon;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in zoom-in-95 slide-in-from-bottom-2 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl duration-300 dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header — Dark Luxury Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 p-6 text-white">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-red-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${getAvatarGradient(user.name)} text-2xl font-black text-white shadow-xl ring-4 ring-white/10`}
                >
                  {getInitials(user.name)}
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-950 ${statusStyle.dot}`}
                />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide shadow-sm ${roleStyle.badge}`}
                  >
                    <RoleIcon className="h-3 w-3" />
                    {user.role}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-white backdrop-blur-sm">
                    {user.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <InfoTile icon={Mail} label="Email Address" value={user.email} color="red" />
          <InfoTile icon={Phone} label="Phone Number" value={user.phone} color="orange" />
          <InfoTile icon={ShieldCheck} label="Role" value={user.role?.toUpperCase()} color="slate" />
          <InfoTile icon={CalendarDays} label="Joined On" value={formatDate(user.createdAt)} color="emerald" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="mr-auto font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500">
            ID: {user.id}
          </p>
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-slate-900 to-red-800 px-5 py-2 text-sm font-black text-white shadow-md shadow-red-900/30 transition hover:-translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const INFO_COLORS = {
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

const InfoTile = ({ icon: Icon, label, value, color = "slate" }) => (
  <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3.5 transition-all hover:border-red-100 hover:shadow-sm dark:border-slate-800 dark:from-slate-800/50 dark:to-slate-900 dark:hover:border-red-900/40">
    <div className="flex items-center gap-2">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${INFO_COLORS[color]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
    </div>
    <p className="mt-2 truncate text-sm font-black text-slate-900 dark:text-white">
      {value || "N/A"}
    </p>
  </div>
);

export default ManageUsers;