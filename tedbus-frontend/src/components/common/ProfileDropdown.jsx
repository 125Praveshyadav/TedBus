import { Link } from "react-router-dom";
import {
  ChevronRight,
  Crown,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
  WalletCards,
} from "lucide-react";

const ProfileDropdown = ({ user, logout, closeDropdown }) => {
  const isAdmin =
    String(user?.role || "").toLowerCase() === "admin";

  const menuLinks = [
    {
      to: "/profile",
      icon: UserRound,
      label: "My Profile",
      desc: "View and edit your details",
    },
    {
      to: "/my-bookings",
      icon: Ticket,
      label: "My Bookings",
      desc: "All your trips and tickets",
    },
    {
      to: "/offers",
      icon: WalletCards,
      label: "Offers & Coupons",
      desc: "Active deals and discounts",
    },
    {
      to: "/forgot-password",
      icon: Settings,
      label: "Security",
      desc: "Update password & login info",
    },
  ];

  return (
    <div
      role="menu"
      className="absolute right-0 top-14 z-50 w-[22rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 backdrop-blur-md"
    >
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-5 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

        <div className="relative flex items-center gap-4">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.name || "User"}
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white/15 text-xl font-black backdrop-blur-md">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-black">
              {user?.name || "TedBus User"}
            </h3>
            <p className="truncate text-xs font-medium text-red-50">
              {user?.email || "user@tedbus.com"}
            </p>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur">
              {isAdmin ? (
                <>
                  <Crown className="h-3 w-3 text-amber-300" />
                  Administrator
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  TedBus Member
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Strip */}
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-green-50 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-black text-green-700">
            <ShieldCheck className="h-4 w-4" />
            Verified TedBus Account
          </div>

          <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
            Active
          </span>
        </div>
      </div>

      {/* Admin Quick Access */}
      {isAdmin && (
        <div className="border-b border-slate-100 p-3">
          <Link
            to="/admin/dashboard"
            onClick={closeDropdown}
            className="group flex items-center justify-between gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
                <LayoutDashboard className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black">Admin Panel</p>
                <p className="text-[11px] font-medium text-slate-300">
                  Manage TedBus platform
                </p>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-white" />
          </Link>
        </div>
      )}

      {/* Links */}
      <nav className="p-2">
        {menuLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeDropdown}
              className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-red-50 group-hover:text-red-600">
                  <Icon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-800 group-hover:text-red-600">
                    {item.label}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-red-600" />
            </Link>
          );
        })}
      </nav>

      {/* Help */}
      <div className="border-t border-slate-100 p-3">
        <Link
          to="/contact"
          onClick={closeDropdown}
          className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3 transition hover:bg-slate-100"
        >
          <div className="flex items-center gap-3 text-sm font-black text-slate-700">
            <HelpCircle className="h-4 w-4 text-red-600" />
            Help & Support
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            24×7
          </span>
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white"
        >
          <span className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            Logout
          </span>

          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;