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
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

const navLinks = [
  {
    name: "Home",
    path: "/",
    icon: Bus,
  },
  {
    name: "Search Bus",
    path: "/search-bus",
    icon: CalendarSearch,
  },
  {
    name: "My Bookings",
    path: "/my-bookings",
    icon: CalendarSearch,
    protected: true,
  },
  {
    name: "Offers",
    path: "/offers",
    icon: Gift,
  },
  {
    name: "Contact",
    path: "/contact",
    icon: Headphones,
  },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeAllMenus}
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-500/25 transition group-hover:scale-105">
            <Bus className="h-6 w-6" />
          </div>

          <div className="leading-tight">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Ted<span className="text-red-600">Bus</span>
            </h1>
            <p className="-mt-1 hidden text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
              Book. Ride. Relax.
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            if (link.protected && !isAuthenticated) return null;

            const Icon = link.icon;
            const active = isRouteActive(link.path);

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`
                  group relative flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all
                  ${
                    active
                      ? "bg-red-50 text-red-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-red-600"
                  }
                `}
              >
                <Icon
                  className={`
                    h-4 w-4 transition
                    ${
                      active
                        ? "text-red-600"
                        : "text-slate-400 group-hover:text-red-600"
                    }
                  `}
                />
                {link.name}

                {active && (
                  <span className="absolute inset-x-4 -bottom-[19px] h-1 rounded-full bg-red-600" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Not Logged In */}
          {!isAuthenticated && (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-95"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </div>
          )}

          {/* Logged In Admin: ONLY Admin Panel button */}
          {isAuthenticated && isAdmin && (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-95"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Panel
              </Link>
            </div>
          )}

          {/* Logged In Normal User: Profile dropdown */}
          {isAuthenticated && !isAdmin && (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 transition hover:border-red-200 hover:bg-red-50/40"
                aria-expanded={showDropdown}
                aria-label="Open profile menu"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user?.name || "User"}
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-500 text-sm font-black text-white shadow-md shadow-red-500/25">
                    {userInitial}
                  </div>
                )}

                <div className="hidden min-w-0 text-left md:block">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Welcome
                  </p>
                  <p className="max-w-[140px] truncate text-sm font-bold text-slate-800">
                    {user?.name || "TedBus User"}
                  </p>
                </div>

                <ChevronDown
                  className={`hidden h-4 w-4 text-slate-500 transition md:block ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <ProfileDropdown
                  user={user}
                  logout={handleLogout}
                  closeDropdown={() => setShowDropdown(false)}
                />
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden">
          <div className="mx-auto max-w-7xl space-y-2">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) return null;

              const Icon = link.icon;
              const active = isRouteActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeAllMenus}
                  className={`
                    flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition
                    ${
                      active
                        ? "bg-red-50 text-red-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }
                  `}
                >
                  <Icon
                    className={`
                      h-5 w-5
                      ${active ? "text-red-600" : "text-slate-400"}
                    `}
                  />
                  {link.name}
                </Link>
              );
            })}

            <div className="my-3 border-t border-slate-100" />

            {/* Mobile Not Logged In */}
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeAllMenus}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeAllMenus}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/25"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Admin: only Admin Panel + Logout */}
            {isAuthenticated && isAdmin && (
              <div className="rounded-3xl bg-slate-50 p-4">
                <Link
                  to="/admin/dashboard"
                  onClick={closeAllMenus}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Panel
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm font-black text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Normal User */}
            {isAuthenticated && !isAdmin && (
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="mb-4 flex items-center gap-3">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.name || "User"}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 font-black text-white">
                      {userInitial}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-800">
                      {user?.name || "TedBus User"}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {user?.email || "user@tedbus.com"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/profile"
                    onClick={closeAllMenus}
                    className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-slate-700"
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;