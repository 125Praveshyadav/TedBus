import { Bell, Home, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const AdminTopbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-red-700 bg-red-600 text-white shadow-lg shadow-red-900/10">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-2xl bg-white/15 p-3 transition hover:bg-white/25 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h2 className="text-xl font-black">Admin Dashboard</h2>
            <p className="text-xs font-semibold text-red-100">
              Manage TedBus platform
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-red-200" />

            <input
              type="text"
              placeholder="Search bookings, buses, users..."
              className="w-full rounded-2xl border border-white/20 bg-white/15 py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none placeholder:text-red-100 focus:bg-white/20"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Back to Website */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-50 md:inline-flex"
          >
            <Home className="h-4 w-4" />
            Back to Website
          </button>

          <button className="relative rounded-2xl bg-white/15 p-3 transition hover:bg-white/25">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-yellow-300 ring-2 ring-red-600" />
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white font-black text-red-600">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <p className="text-sm font-black">{user?.name || "Admin"}</p>
              <p className="-mt-0.5 text-xs font-semibold text-red-100">
                Administrator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-white/15 p-3 transition hover:bg-white/25"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Back Button */}
      <div className="border-t border-white/10 px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-red-600"
        >
          <Home className="h-4 w-4" />
          Back to Website
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;