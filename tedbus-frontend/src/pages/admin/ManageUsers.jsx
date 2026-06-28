import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Edit,
  Eye,
  Loader2,
  Mail,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services//adminService";

const roleOptions = ["user", "admin"];

const roleClass = {
  admin: "bg-red-50 text-red-600 border-red-100",
  user: "bg-blue-50 text-blue-700 border-blue-100",
};

const statusClass = {
  active: "bg-green-50 text-green-700 border-green-100",
  inactive: "bg-slate-100 text-slate-600 border-slate-200",
  blocked: "bg-red-50 text-red-700 border-red-100",
};

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

const normalizeUser = (user = {}) => {
  return {
    ...user,
    id: user._id || user.id,
    name: user.name || "User",
    email: user.email || "N/A",
    phone: user.phone || "N/A",
    role: user.role || "user",
    status: user.status || (user.isBlocked ? "blocked" : "active"),
    createdAt: user.createdAt || "",
  };
};

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

      const apiUsers =
        response?.users ||
        response?.data?.users ||
        [];

      const normalized = Array.isArray(apiUsers)
        ? apiUsers.map(normalizeUser)
        : [];

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

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter((user) => {
        return (
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.phone?.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [users, roleFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      customers: users.filter((user) => user.role === "user").length,
      active: users.filter((user) => user.status === "active").length,
    };
  }, [users]);

  const handleUpdateUser = async (userId, payload) => {
    try {
      setUpdatingId(userId);

      const response = await adminService.updateUser(userId, payload);

      const updatedUser =
        response?.user ||
        response?.data?.user ||
        null;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? normalizeUser(updatedUser || { ...user, ...payload })
            : user
        )
      );

      toast.success(response?.message || "User updated successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to update user");
    } finally {
      setUpdatingId("");
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) return;

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading users...
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
          <h1 className="text-3xl font-black text-slate-900">
            Manage Users
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            View customers, admins and manage account roles.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={stats.total} />
        <StatCard title="Admins" value={stats.admins} color="red" />
        <StatCard title="Customers" value={stats.customers} color="blue" />
        <StatCard title="Active Users" value={stats.active} color="green" />
      </div>

      {/* Controls */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-red-500"
          >
            <option value="all">All Roles</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
          <h2 className="mt-3 text-xl font-black text-slate-900">
            Unable to load users
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!error && filteredUsers.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Users className="mx-auto h-14 w-14 text-red-600" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            No users found
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Try changing filters or search query.
          </p>
        </div>
      )}

      {/* Table */}
      {!error && filteredUsers.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg font-black text-red-600">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="font-black text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="flex items-center gap-2 font-semibold text-slate-700">
                        <Mail className="h-4 w-4 text-red-600" />
                        {user.email}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Phone className="h-3.5 w-3.5" />
                        {user.phone}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user.id}
                        onChange={(e) =>
                          handleUpdateUser(user.id, {
                            role: e.target.value,
                          })
                        }
                        className={`rounded-xl border px-3 py-2 text-xs font-black uppercase outline-none ${
                          roleClass[user.role] ||
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${
                          statusClass[user.status] ||
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1 font-bold text-slate-700">
                        <CalendarDays className="h-4 w-4 text-red-600" />
                        {formatDate(user.createdAt)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="rounded-xl bg-blue-50 p-3 text-blue-600 transition hover:bg-blue-100"
                          title="View User"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          disabled={deletingId === user.id}
                          className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Delete User"
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>

                        {updatingId === user.id && (
                          <Loader2 className="mt-3 h-4 w-4 animate-spin text-red-600" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-50 text-slate-900",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p
        className={`mt-2 rounded-2xl px-3 py-2 text-2xl font-black ${colors[color]}`}
      >
        {value}
      </p>
    </div>
  );
};

const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              User Details
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex items-center gap-4 rounded-3xl bg-slate-50 p-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-3xl font-black text-white">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {user.name}
              </h3>
              <p className="text-sm font-semibold text-slate-500">
                {user.role?.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Info icon={Mail} label="Email" value={user.email} />
            <Info icon={Phone} label="Phone" value={user.phone} />
            <Info icon={ShieldCheck} label="Role" value={user.role} />
            <Info icon={CalendarDays} label="Joined" value={formatDate(user.createdAt)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
      <Icon className="h-4 w-4 text-red-600" />
      {label}
    </p>
    <p className="mt-2 font-black text-slate-900">{value || "N/A"}</p>
  </div>
);

export default ManageUsers;