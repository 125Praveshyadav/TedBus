import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bus,
  CalendarSearch,
  ChevronDown,
  Gift,
  Headphones,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Navigation,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "../../notifications/NotificationBell";
import GoogleTranslate from "./GoogleTranslate";
import ThemeToggle from "./ThemeToggle";


const NAV_THEMES = [
  {
    // Home
    activeText: "text-red-600 dark:text-red-400",
    activeBg:
      "bg-red-50 dark:bg-red-950/30",
    hoverBg:
      "hover:bg-red-50/80 dark:hover:bg-red-950/20",
    hoverText:
      "hover:text-red-600 dark:hover:text-red-400",
    iconActive: "text-red-600 dark:text-red-400",
    iconHover:
      "group-hover:text-red-500 dark:group-hover:text-red-400",
    dot: "bg-red-600 dark:bg-red-400",
    glowShadow: "shadow-[0_0_12px_rgba(220,38,38,0.7)]",
    mobileBorder: "border-l-red-500",
  },
  {
    // Search Bus
    activeText: "text-violet-600 dark:text-violet-400",
    activeBg:
      "bg-violet-50 dark:bg-violet-950/30",
    hoverBg:
      "hover:bg-violet-50/80 dark:hover:bg-violet-950/20",
    hoverText:
      "hover:text-violet-600 dark:hover:text-violet-400",
    iconActive: "text-violet-600 dark:text-violet-400",
    iconHover:
      "group-hover:text-violet-500 dark:group-hover:text-violet-400",
    dot: "bg-violet-600 dark:bg-violet-400",
    glowShadow:
      "shadow-[0_0_12px_rgba(124,58,237,0.7)]",
    mobileBorder: "border-l-violet-500",
  },
  {
    // Bookings
    activeText: "text-emerald-600 dark:text-emerald-400",
    activeBg:
      "bg-emerald-50 dark:bg-emerald-950/30",
    hoverBg:
      "hover:bg-emerald-50/80 dark:hover:bg-emerald-950/20",
    hoverText:
      "hover:text-emerald-600 dark:hover:text-emerald-400",
    iconActive: "text-emerald-600 dark:text-emerald-400",
    iconHover:
      "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
    dot: "bg-emerald-600 dark:bg-emerald-400",
    glowShadow:
      "shadow-[0_0_12px_rgba(5,150,105,0.7)]",
    mobileBorder: "border-l-emerald-500",
  },
  {
    // Route Planner
    activeText: "text-amber-600 dark:text-amber-400",
    activeBg:
      "bg-amber-50 dark:bg-amber-950/30",
    hoverBg:
      "hover:bg-amber-50/80 dark:hover:bg-amber-950/20",
    hoverText:
      "hover:text-amber-600 dark:hover:text-amber-400",
    iconActive: "text-amber-600 dark:text-amber-400",
    iconHover:
      "group-hover:text-amber-500 dark:group-hover:text-amber-400",
    dot: "bg-amber-600 dark:bg-amber-400",
    glowShadow:
      "shadow-[0_0_12px_rgba(217,119,6,0.7)]",
    mobileBorder: "border-l-amber-500",
  },
  {
    // Community
    activeText: "text-cyan-600 dark:text-cyan-400",
    activeBg:
      "bg-cyan-50 dark:bg-cyan-950/30",
    hoverBg:
      "hover:bg-cyan-50/80 dark:hover:bg-cyan-950/20",
    hoverText:
      "hover:text-cyan-600 dark:hover:text-cyan-400",
    iconActive: "text-cyan-600 dark:text-cyan-400",
    iconHover:
      "group-hover:text-cyan-500 dark:group-hover:text-cyan-400",
    dot: "bg-cyan-600 dark:bg-cyan-400",
    glowShadow:
      "shadow-[0_0_12px_rgba(8,145,178,0.7)]",
    mobileBorder: "border-l-cyan-500",
  },
  {
    // Offers
    activeText: "text-pink-600 dark:text-pink-400",
    activeBg:
      "bg-pink-50 dark:bg-pink-950/30",
    hoverBg:
      "hover:bg-pink-50/80 dark:hover:bg-pink-950/20",
    hoverText:
      "hover:text-pink-600 dark:hover:text-pink-400",
    iconActive: "text-pink-600 dark:text-pink-400",
    iconHover:
      "group-hover:text-pink-500 dark:group-hover:text-pink-400",
    dot: "bg-pink-600 dark:bg-pink-400",
    glowShadow:
      "shadow-[0_0_12px_rgba(219,39,119,0.7)]",
    mobileBorder: "border-l-pink-500",
  },
  {
    // Contact
    activeText: "text-indigo-600 dark:text-indigo-400",
    activeBg:
      "bg-indigo-50 dark:bg-indigo-950/30",
    hoverBg:
      "hover:bg-indigo-50/80 dark:hover:bg-indigo-950/20",
    hoverText:
      "hover:text-indigo-600 dark:hover:text-indigo-400",
    iconActive: "text-indigo-600 dark:text-indigo-400",
    iconHover:
      "group-hover:text-indigo-500 dark:group-hover:text-indigo-400",
    dot: "bg-indigo-600 dark:bg-indigo-400",
    glowShadow:
      "shadow-[0_0_12px_rgba(79,70,229,0.7)]",
    mobileBorder: "border-l-indigo-500",
  },
];

const navLinks = [
  {
    name: "Home",
    path: "/",
    icon: Bus,
    themeIndex: 0,
  },
  {
    name: "Search Bus",
    path: "/search-bus",
    icon: CalendarSearch,
    themeIndex: 1,
  },
  {
    name: "Bookings",
    path: "/my-bookings",
    icon: CalendarSearch,
    protected: true,
    themeIndex: 2,
  },
  {
    name: "Route Planner",
    path: "/route-planner",
    icon: Navigation,
    themeIndex: 3,
  },
  {
    name: "Community",
    path: "/community",
    icon: Users,
    themeIndex: 4,
  },
  {
    name: "Offers",
    path: "/offers",
    icon: Gift,
    themeIndex: 5,
  },
  {
    name: "Contact",
    path: "/contact",
    icon: Headphones,
    themeIndex: 6,
  },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const isAdmin =
    String(user?.role || "").toLowerCase() === "admin";

  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setShowDropdown(false);
  };

  const isRouteActive = (path) => {
    if (path === "/") return location.pathname === "/";

    if (path === "/search-bus") {
      return (
        location.pathname.startsWith("/search-bus") ||
        location.pathname.startsWith("/bus") ||
        location.pathname.startsWith("/seat-selection") ||
        location.pathname.startsWith("/passenger") ||
        location.pathname.startsWith("/booking")
      );
    }

    if (path === "/my-bookings") {
      return (
        location.pathname.startsWith("/my-bookings") ||
        location.pathname.startsWith(
          "/booking-history",
        ) ||
        location.pathname.startsWith("/ticket")
      );
    }

    if (path === "/community") {
      return location.pathname.startsWith("/community");
    }

    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  // Disable body scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-2xl transition-colors duration-300 dark:border-slate-800/60 dark:bg-slate-900/80">
      <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeAllMenus}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-red-500/40 group-active:scale-95 sm:h-11 sm:w-11 sm:rounded-2xl">
            <Bus className="h-5 w-5" />
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Ted
              <span className="text-red-600 dark:text-red-500">
                Bus
              </span>
            </h1>

            <p className="-mt-0.5 hidden text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 sm:block">
              Book · Ride · Relax
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-0.5 rounded-2xl border border-slate-200/60 bg-slate-50/80 p-1 backdrop-blur dark:border-slate-700/60 dark:bg-slate-800/50 xl:gap-0.5">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) {
                return null;
              }

              const Icon = link.icon;
              const active = isRouteActive(link.path);
              const theme = NAV_THEMES[link.themeIndex];

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`group relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[12px] font-bold transition-all duration-300 xl:px-3 xl:text-[13px] ${
                    active
                      ? `${theme.activeBg} ${theme.activeText} shadow-sm`
                      : `text-slate-500 dark:text-slate-400 ${theme.hoverBg} ${theme.hoverText}`
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-all duration-300 ${
                      active
                        ? `${theme.iconActive} scale-110`
                        : `text-slate-400 dark:text-slate-500 ${theme.iconHover}`
                    }`}
                  />

                  <span className="hidden whitespace-nowrap xl:inline">
                    {link.name}
                  </span>

                  <span className="whitespace-nowrap xl:hidden">
                    {link.name.length > 8
                      ? link.name.split(" ")[0]
                      : link.name}
                  </span>

                  {/* Active indicator dot */}
                  {active && (
                    <span
                      className={`absolute -bottom-[13px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${theme.dot} ${theme.glowShadow}`}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="shrink-0">
            <ThemeToggle />
          </div>

          <div className="hidden shrink-0 sm:block">
            <GoogleTranslate />
          </div>

          {/* Not authenticated */}
          {!isAuthenticated && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 hover:shadow-md active:translate-y-0 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-red-900 dark:hover:text-red-400"
              >
                <LogIn className="h-4 w-4" />

                <span className="hidden lg:inline">
                  Login
                </span>
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/35 active:translate-y-0 active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" />

                <span className="hidden lg:inline">
                  Register
                </span>
              </Link>
            </div>
          )}

          {/* Admin */}
          {isAuthenticated && isAdmin && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 px-3 py-2 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] dark:border-slate-600 dark:from-slate-800 dark:to-slate-700"
              >
                <LayoutDashboard className="h-4 w-4 text-red-400" />

                <span className="hidden lg:inline">
                  Admin
                </span>
              </Link>
            </div>
          )}

          {/* Authenticated user */}
          {isAuthenticated && !isAdmin && (
            <>
              <div className="hidden shrink-0 sm:block">
                <NotificationBell />
              </div>

              <div
                className="relative hidden shrink-0 sm:block"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowDropdown((prev) => !prev)
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-2.5 transition-all duration-300 hover:border-red-200 hover:shadow-md active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-900"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="User"
                      className="h-8 w-8 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-sm font-black text-white shadow-md">
                      {userInitial}
                    </div>
                  )}

                  <div className="hidden min-w-0 text-left lg:block">
                    <p className="max-w-[80px] truncate text-sm font-bold leading-tight text-slate-800 dark:text-slate-200">
                      {user?.name?.split(" ")[0] || "User"}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-300 dark:text-slate-500 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-3 w-56 animate-in slide-in-from-top-2 duration-200">
                    <ProfileDropdown
                      user={user}
                      logout={handleLogout}
                      closeDropdown={() =>
                        setShowDropdown(false)
                      }
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:border-red-200 hover:shadow-md active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900 lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5 text-red-600 dark:text-red-400" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-[72px] z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={closeAllMenus}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed left-0 right-0 top-[72px] z-50 max-h-[calc(100dvh-72px)] overflow-y-auto transition-all duration-300 lg:hidden ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-3 mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-white/98 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/98">
          {/* Mobile language */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Language
            </span>

            <GoogleTranslate />
          </div>

          {/* Mobile nav links */}
          <div className="space-y-1 p-3">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) {
                return null;
              }

              const Icon = link.icon;
              const active = isRouteActive(link.path);
              const theme = NAV_THEMES[link.themeIndex];

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeAllMenus}
                  className={`flex items-center gap-3.5 rounded-2xl border-l-4 px-4 py-3.5 text-[15px] font-bold transition-all duration-300 ${
                    active
                      ? `${theme.activeBg} ${theme.activeText} ${theme.mobileBorder} shadow-sm`
                      : `border-l-transparent text-slate-600 active:scale-[0.98] dark:text-slate-400 ${theme.hoverBg}`
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      active
                        ? `${theme.activeBg} ${theme.iconActive}`
                        : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <span>{link.name}</span>

                  {active && (
                    <span
                      className={`ml-auto h-2 w-2 rounded-full ${theme.dot}`}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile bottom */}
          <div className="border-t border-slate-100 p-4 dark:border-slate-800">
            {/* Not authenticated */}
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeAllMenus}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 transition-all active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeAllMenus}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-all active:scale-95"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </div>
            )}

            {/* Admin mobile */}
            {isAuthenticated && isAdmin && (
              <div className="space-y-3 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-xl dark:border-slate-600 dark:from-slate-800 dark:to-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <ShieldCheck className="h-5 w-5 text-red-400" />
                  </div>

                  <div>
                    <p className="text-sm font-black">
                      {user?.name || "Admin"}
                    </p>

                    <p className="text-[10px] font-bold text-slate-400">
                      Administrator
                    </p>
                  </div>
                </div>

                <Link
                  to="/admin/dashboard"
                  onClick={closeAllMenus}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-white/20 active:scale-95"
                >
                  <LayoutDashboard className="h-4 w-4 text-red-400" />
                  Admin Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold transition hover:bg-red-700 active:scale-95"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}

            {/* User mobile */}
            {isAuthenticated && !isAdmin && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-lg dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-800">
                {/* User info */}
                <div className="flex items-center gap-3.5">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-md dark:border-slate-600"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-lg font-black text-white shadow-lg shadow-red-500/25">
                      {userInitial}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-black text-slate-900 dark:text-white">
                      {user?.name || "User"}
                    </p>

                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>

                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <Sparkles className="h-3 w-3" />
                      TedBus Member
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/profile"
                    onClick={closeAllMenus}
                    className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 shadow-sm transition active:scale-95 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="text-xl">👤</span>

                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Profile
                    </span>
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={closeAllMenus}
                    className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 shadow-sm transition active:scale-95 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="text-xl">🔔</span>

                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Alerts
                    </span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3.5 text-sm font-bold text-red-600 transition hover:shadow-md active:scale-95 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;