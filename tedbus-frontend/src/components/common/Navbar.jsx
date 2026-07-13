import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Bus,
  CalendarSearch,
  Gift,
  Headphones,
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "../../notifications/NotificationBell";
import GoogleTranslate from "./GoogleTranslate";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const navLinks = [
    { name: "Home", path: "/", icon: Bus },
    { name: "Search Bus", path: "/search-bus", icon: CalendarSearch },
    { name: "My Bookings", path: "/my-bookings", icon: CalendarSearch, protected: true },
    { name: "Community", path: "/community", icon: Users },
    { name: "Offers", path: "/offers", icon: Gift },
    { name: "Contact", path: "/contact", icon: Headphones },
  ];

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
        location.pathname.startsWith("/booking-history") ||
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-2xl shadow-sm dark:border-slate-800 dark:bg-slate-950/80 transition-colors duration-300">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link
          to="/"
          onClick={closeAllMenus}
          className="group flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0px_4px_10px_rgba(220,38,38,0.3)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <Bus className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Ted<span className="text-red-600 dark:text-red-500">Bus</span>
            </h1>
            <p className="-mt-1 hidden text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:block">
              Book. Ride. Relax.
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => {
            if (link.protected && !isAuthenticated) return null;
            const Icon = link.icon;
            const active = isRouteActive(link.path);
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`group relative flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  active
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-transform ${
                    active
                      ? "text-red-600 dark:text-red-400 scale-110"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                {link.name}
                {active && (
                  <span className="absolute -bottom-[22px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          
          <div>
            <ThemeToggle />
          </div>
          <div className="hidden sm:block">
            <GoogleTranslate />
          </div>

          {/* Not Logged In */}
          {!isAuthenticated && (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-100 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-red-400"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </div>
          )}

          {/* Admin Panel */}
          {isAuthenticated && isAdmin && (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition-all hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700"
              >
                <LayoutDashboard className="h-4 w-4 text-red-500" />
                Admin Panel
              </Link>
            </div>
          )}

          {/* Logged In User */}
          {isAuthenticated && !isAdmin && (
            <>
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center gap-3 rounded-[1.25rem] border-2 border-slate-100 bg-white p-1.5 pr-4 transition-all hover:border-red-100 shadow-sm active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-900/50"
                >
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="User" className="h-9 w-9 rounded-[0.85rem] object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-[0.85rem] bg-red-50 text-sm font-black text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      {userInitial}
                    </div>
                  )}
                  <div className="hidden min-w-0 text-left md:block">
                    <p className="max-w-[120px] truncate text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {user?.name?.split(" ")[0] || "User"}
                    </p>
                  </div>
                  <ChevronDown className={`ml-1 h-4 w-4 text-slate-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56">
                    <ProfileDropdown user={user} logout={handleLogout} closeDropdown={() => setShowDropdown(false)} />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white text-slate-600 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {menuOpen ? <X className="h-6 w-6 text-red-600 dark:text-red-400" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute left-0 top-[100%] w-full px-4 pb-4 pt-2 lg:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
            
            {/* Mobile Language Selector Header */}
            <div className="flex items-center justify-between px-4 py-2 mb-2 bg-slate-50 rounded-2xl dark:bg-slate-800">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Language</span>
              <GoogleTranslate />
            </div>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                if (link.protected && !isAuthenticated) return null;
                const Icon = link.icon;
                const active = isRouteActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeAllMenus}
                    className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[15px] font-bold ${
                      active
                        ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="my-4 border-t border-slate-100/80 dark:border-slate-800" />

            <div className="px-1">
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={closeAllMenus} className="flex justify-center items-center gap-2 rounded-2xl border-2 border-slate-100 py-3.5 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300">
                    <LogIn className="h-4 w-4" /> Login
                  </Link>
                  <Link to="/register" onClick={closeAllMenus} className="flex justify-center items-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20">
                    <UserPlus className="h-4 w-4" /> Register
                  </Link>
                </div>
              )}

              {isAuthenticated && isAdmin && (
                <div className="rounded-[1.5rem] bg-slate-900 p-4 text-white dark:bg-slate-800 dark:border dark:border-slate-700">
                  <Link to="/admin/dashboard" onClick={closeAllMenus} className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3.5 text-sm font-bold">
                    <LayoutDashboard className="h-4 w-4 text-red-400" /> Admin Dashboard
                  </Link>
                  <button onClick={handleLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}

              {isAuthenticated && !isAdmin && (
                <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="mb-5 flex items-center gap-4 px-2">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="h-14 w-14 rounded-[1rem] object-cover border-2 border-white dark:border-slate-700" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-red-600 text-lg font-black text-white">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-black text-slate-900 dark:text-white">{user?.name || "User"}</p>
                      <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Link to="/profile" onClick={closeAllMenus} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-white shadow-sm dark:bg-slate-800">
                      <span className="text-lg">👤</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Profile</span>
                    </Link>
                    <Link to="/notifications" onClick={closeAllMenus} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-white shadow-sm dark:bg-slate-800">
                      <span className="text-lg">🔔</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Alerts</span>
                    </Link>
                  </div>
                  <button onClick={handleLogout} className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-sm font-bold text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;