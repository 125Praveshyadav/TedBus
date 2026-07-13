import { Link } from "react-router-dom";
import {
  Bookmark, ChevronRight, Crown, HelpCircle, LayoutDashboard, LogOut,
  Settings, ShieldCheck, Sparkles, Ticket, UserRound, Users, WalletCards,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ProfileDropdown = ({ user, logout, closeDropdown }) => {
  const { t } = useTranslation();
  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const menuLinks = [
    { to: "/profile", icon: UserRound, label: t("profileMenu.myProfile"), desc: t("profileMenu.myProfileDesc") },
    { to: "/my-bookings", icon: Ticket, label: t("profileMenu.myBookings"), desc: t("profileMenu.myBookingsDesc") },
    { to: "/offers", icon: WalletCards, label: t("profileMenu.offersCoupons"), desc: t("profileMenu.offersCouponsDesc") },
    { to: "/forgot-password", icon: Settings, label: t("profileMenu.security"), desc: t("profileMenu.securityDesc") },
  ];

  const communityLinks = [
    { to: "/community/profile/me", icon: Users, label: t("profileMenu.myCommunity"), desc: t("profileMenu.myCommunityDesc"), accent: true },
    { to: "/community/profile/me", icon: Bookmark, label: t("profileMenu.savedPosts"), desc: t("profileMenu.savedPostsDesc") },
  ];

  return (
    <div
      role="menu"
      className="absolute right-0 top-14 z-50 w-[22rem] max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/15 backdrop-blur-md"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-5 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

        <div className="relative flex items-center gap-4">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user?.name || "User"} className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white/15 text-xl font-black backdrop-blur-md">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-black">{user?.name || "TedBus User"}</h3>
            <p className="truncate text-xs font-medium text-red-50">{user?.email || "user@tedbus.com"}</p>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur">
              {isAdmin ? (
                <><Crown className="h-3 w-3 text-amber-300" />{t("profileMenu.administrator")}</>
              ) : (
                <><Sparkles className="h-3 w-3 text-amber-300" />{t("profileMenu.member")}</>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Strip */}
      <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-green-50 dark:bg-green-900/20 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-black text-green-700 dark:text-green-400">
            <ShieldCheck className="h-4 w-4" />
            {t("profileMenu.verifiedAccount")}
          </div>
          <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
            {t("profileMenu.active")}
          </span>
        </div>
      </div>

      {/* Admin Quick Access */}
      {isAdmin && (
        <div className="border-b border-slate-100 dark:border-slate-800 p-3">
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
                <p className="text-sm font-black">{t("profileMenu.adminPanel")}</p>
                <p className="text-[11px] font-medium text-slate-300">{t("profileMenu.adminPanelDesc")}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-white" />
          </Link>
        </div>
      )}

      {/* Account Section */}
      <div className="px-3 pt-3">
        <p className="mb-1 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("profileMenu.account")}
        </p>
      </div>

      <nav className="p-2 pt-1">
        {menuLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeDropdown}
              className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-red-600">{item.label}</p>
                  <p className="text-[11px] font-medium text-slate-400">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-red-600" />
            </Link>
          );
        })}
      </nav>

      {/* Community Section */}
      <div className="border-t border-slate-100 dark:border-slate-800 px-3 pt-3">
        <p className="mb-1 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          🌟 {t("profileMenu.community")}
        </p>
      </div>

      <nav className="p-2 pt-1">
        {communityLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={closeDropdown}
              className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  item.accent
                    ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md shadow-red-500/25"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:text-red-600"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-red-600">{item.label}</p>
                  <p className="text-[11px] font-medium text-slate-400">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-red-600" />
            </Link>
          );
        })}
      </nav>

      {/* Help */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3">
        <Link
          to="/contact"
          onClick={closeDropdown}
          className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-3 transition hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <div className="flex items-center gap-3 text-sm font-black text-slate-700 dark:text-slate-300">
            <HelpCircle className="h-4 w-4 text-red-600" />
            {t("profileMenu.helpSupport")}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">24×7</span>
        </Link>
      </div>

      {/* Logout */}
      <div className="sticky bottom-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <button
          type="button"
          onClick={logout}
          className="group flex w-full items-center justify-between gap-3 rounded-2xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-black text-red-600 dark:text-red-400 transition hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white"
        >
          <span className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            {t("profileMenu.logout")}
          </span>
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;