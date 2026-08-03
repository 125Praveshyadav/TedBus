import { Link } from "react-router-dom";
import {
  Bookmark,
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
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const itemThemes = [
  {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-100 dark:border-teal-900/50",
    hover:
      "group-hover:bg-teal-50 group-hover:text-teal-600 dark:group-hover:bg-teal-950/30 dark:group-hover:text-teal-400",
  },
  {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-100 dark:border-cyan-900/50",
    hover:
      "group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:group-hover:bg-cyan-950/30 dark:group-hover:text-cyan-400",
  },
  {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/50",
    hover:
      "group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-950/30 dark:group-hover:text-emerald-400",
  },
  {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/50",
    hover:
      "group-hover:bg-amber-50 group-hover:text-amber-600 dark:group-hover:bg-amber-950/30 dark:group-hover:text-amber-400",
  },
  {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-100 dark:border-sky-900/50",
    hover:
      "group-hover:bg-sky-50 group-hover:text-sky-600 dark:group-hover:bg-sky-950/30 dark:group-hover:text-sky-400",
  },
];

const getTheme = (index) => itemThemes[index % itemThemes.length];

const ProfileDropdown = ({ user, logout, closeDropdown }) => {
  const { t } = useTranslation();

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const menuLinks = [
    {
      to: "/profile",
      icon: UserRound,
      label: t("profileMenu.myProfile"),
      desc: t("profileMenu.myProfileDesc"),
    },
    {
      to: "/my-bookings",
      icon: Ticket,
      label: t("profileMenu.myBookings"),
      desc: t("profileMenu.myBookingsDesc"),
    },
    {
      to: "/offers",
      icon: WalletCards,
      label: t("profileMenu.offersCoupons"),
      desc: t("profileMenu.offersCouponsDesc"),
    },
    {
      to: "/forgot-password",
      icon: Settings,
      label: t("profileMenu.security"),
      desc: t("profileMenu.securityDesc"),
    },
  ];

  const communityLinks = [
    {
      to: "/community/profile/me",
      icon: Users,
      label: t("profileMenu.myCommunity"),
      desc: t("profileMenu.myCommunityDesc"),
    },
    {
      to: "/community/profile/me",
      icon: Bookmark,
      label: t("profileMenu.savedPosts"),
      desc: t("profileMenu.savedPostsDesc"),
    },
  ];

  const renderMenuItem = (item, indexOffset = 0) => {
    const Icon = item.icon;
    const theme = getTheme(indexOffset);

    return (
      <Link
        key={item.label}
        to={item.to}
        onClick={closeDropdown}
        role="menuitem"
        className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/60"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${theme.bg} ${theme.text} ${theme.border}`}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p
              className={`truncate text-sm font-black text-slate-800 transition-colors dark:text-slate-200 ${theme.text.replace("text-", "group-hover:text-")}`}
            >
              {item.label}
            </p>

            <p className="truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {item.desc}
            </p>
          </div>
        </div>

        <ChevronRight
          className={`h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 dark:text-slate-600 ${theme.text.replace("text-", "group-hover:text-")}`}
        />
      </Link>
    );
  };

  return (
    <div
      role="menu"
      className="absolute right-0 top-full z-50 mt-2 w-[22rem] max-h-[min(32rem,calc(100vh-5rem))] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 animate-in fade-in slide-in-from-top-2 duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#94a3b8 transparent",
      }}
    >
      {/* Premium Header — Teal/Cyan, not violet */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-cyan-600 to-sky-600 p-4 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 left-0 h-32 w-32 rounded-full bg-cyan-300/25 blur-2xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.07)_75%,transparent_75%,transparent)] [background-size:36px_36px] opacity-20" />

        <div className="relative flex items-center gap-4">
          <div className="shrink-0 rounded-2xl bg-white/15 p-[2px] backdrop-blur">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.name || "User"}
                className="h-14 w-14 rounded-2xl border border-white/30 object-cover shadow-md"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-xl font-black text-white shadow-md">
                {userInitial}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-white/80">
              <Zap className="h-2.5 w-2.5" />
              Account
            </div>

            <h3 className="truncate text-base font-black">
              {user?.name || "TedBus User"}
            </h3>

            <p className="truncate text-xs font-medium text-cyan-100/90">
              {user?.email || "user@tedbus.com"}
            </p>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur">
              {isAdmin ? (
                <>
                  <Crown className="h-3 w-3 text-amber-300" />
                  {t("profileMenu.administrator")}
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  {t("profileMenu.member")}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status strip */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          {t("profileMenu.verifiedAccount")}
        </div>

        <span className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-emerald-500/25">
          {t("profileMenu.active")}
        </span>
      </div>

      {/* Scrollable menu body */}
      <div className="max-h-[calc(100vh-18rem)] overflow-y-auto p-2 [scrollbar-width:thin]">
        {/* Admin quick access */}
        {isAdmin && (
          <div className="mb-2 rounded-2xl bg-slate-950 p-3 text-white shadow-lg dark:border dark:border-slate-800">
            <Link
              to="/admin/dashboard"
              onClick={closeDropdown}
              role="menuitem"
              className="group flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-3 transition hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25">
                  <LayoutDashboard className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-black">
                    {t("profileMenu.adminPanel")}
                  </p>

                  <p className="text-[11px] font-medium text-slate-400">
                    {t("profileMenu.adminPanelDesc")}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-amber-400" />
            </Link>
          </div>
        )}

        {/* Account section */}
        <div className="px-2 pb-1 pt-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {t("profileMenu.account")}
          </p>
        </div>

        <nav className="space-y-0.5">
          {menuLinks.map((item, index) => renderMenuItem(item, index))}
        </nav>

        {/* Community section */}
        <div className="mt-2 border-t border-slate-100 px-2 pb-1 pt-3 dark:border-slate-800">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <Sparkles className="h-3 w-3 text-amber-500" />
            {t("profileMenu.community")}
          </p>
        </div>

        <nav className="space-y-0.5">
          {communityLinks.map((item, index) =>
            renderMenuItem(item, index + menuLinks.length),
          )}
        </nav>

        {/* Help */}
        <div className="mt-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <Link
            to="/contact"
            onClick={closeDropdown}
            role="menuitem"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 transition hover:border-cyan-100 hover:bg-cyan-50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-cyan-900/50 dark:hover:bg-cyan-950/30"
          >
            <div className="flex items-center gap-3 text-sm font-black text-slate-700 dark:text-slate-300">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                <HelpCircle className="h-4 w-4" />
              </div>

              {t("profileMenu.helpSupport")}
            </div>

            <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-400">
              24×7
            </span>
          </Link>
        </div>
      </div>

      {/* Sticky logout footer */}
      <div className="border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={logout}
          className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600 transition hover:bg-gradient-to-r hover:from-rose-600 hover:to-pink-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/25 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
        >
          <span className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            {t("profileMenu.logout")}
          </span>

          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;