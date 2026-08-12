import { useEffect, useRef, useState } from "react";
import { Bell, Home, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const AdminTopbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 text-white shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-2xl p-3 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h2 className="text-xl font-black tracking-tight">Admin Dashboard</h2>
            <p className="-mt-0.5 text-xs font-semibold text-slate-400">
              Manage TedBus platform
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="hidden max-w-md flex-1 md:block">
          <div
            className={`group relative rounded-2xl transition-all duration-200 ${
              searchFocused ? "ring-2 ring-red-500/60" : "ring-1 ring-white/10"
            }`}
          >
            <Search
              className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                searchFocused ? "text-red-400" : "text-slate-500"
              }`}
            />
            <input
              type="text"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search bookings, buses, users..."
              className="w-full rounded-2xl bg-white/[0.06] py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none placeholder:text-slate-500 placeholder:font-medium transition-colors focus:bg-white/[0.09]"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 sm:block">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          {/* Back to Website */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="hidden items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25 transition hover:shadow-red-600/40 hover:brightness-110 md:inline-flex"
          >
            <Home className="h-4 w-4" />
            Back to Website
          </button>

          {/* Notifications */}
          <button className="group relative rounded-2xl p-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
            <Bell className="h-5 w-5 transition-transform duration-200 group-hover:-rotate-6" />
            <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-slate-950" />
            </span>
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-white/10 md:block" />

          {/* Profile */}
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-3 rounded-2xl p-1.5 pr-3 transition hover:bg-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 font-black text-white ring-2 ring-white/10">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="text-left">
                <p className="text-sm font-black leading-tight">{user?.name || "Admin"}</p>
                <p className="text-xs font-semibold leading-tight text-slate-400">
                  Administrator
                </p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 origin-top-right animate-in fade-in slide-in-from-top-2 duration-150 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/admin/profile");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/admin/settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  Settings
                </button>
                <div className="my-1 h-px bg-white/10" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Logout (mobile / always-visible icon) */}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl p-3 text-red-300 transition hover:bg-red-500/10 hover:text-red-200 md:hidden"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile: search + back button */}
      <div className="space-y-2 border-t border-white/5 px-4 py-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search bookings, buses, users..."
            className="w-full rounded-2xl bg-white/[0.06] py-3 pl-11 pr-4 text-sm font-semibold text-white outline-none placeholder:text-slate-500 placeholder:font-medium"
          />
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-600/25"
        >
          <Home className="h-4 w-4" />
          Back to Website
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;