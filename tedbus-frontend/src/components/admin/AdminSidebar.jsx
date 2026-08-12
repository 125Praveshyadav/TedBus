import React, { useState, useRef, useEffect } from "react"; // useState add kiya dropdown ke liye
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3, Bus, CreditCard, FileText, LayoutDashboard, LogOut, Menu, Route,
  Settings, Star, UserCircle, Users, X, BadgePercent,
  MessagesSquare, MessageSquare, Flag, ChevronDown, ChevronUp, Newspaper, Bell,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../components/context/AuthContext";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Community Dropdown state
  const [communityOpen, setCommunityOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Auto-open the Community dropdown if the current route is inside it
  useEffect(() => {
    if (location.pathname.startsWith("/admin/community") || location.pathname === "/admin/send-notification") {
      setCommunityOpen(true);
    }
  }, [location.pathname]);

  // Measure children height so the dropdown can animate smoothly to "auto"
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(communityOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [communityOpen, collapsed]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Buses", path: "/admin/buses", icon: Bus },
    { label: "Routes", path: "/admin/routes", icon: Route },
    { label: "Bookings", path: "/admin/bookings", icon: FileText },
    { label: "Users", path: "/admin/users", icon: Users },
    // Community Dropdown Parent
    {
      label: "Community",
      isDropdown: true,
      icon: MessagesSquare,
      isOpen: communityOpen,
      toggle: () => setCommunityOpen((v) => !v),
      children: [
        { label: "Overview Stats", path: "/admin/community-stats", icon: BarChart3 },
        { label: "Manage Posts", path: "/admin/community-posts", icon: Newspaper },
        { label: "Manage Forums", path: "/admin/community-forums", icon: MessageSquare },
        { label: "Spam Reports", path: "/admin/community-reports", icon: Flag },
        { label: "Send Notification", path: "/admin/send-notification", icon: Bell },
      ],
    },
    { label: "Payments", path: "/admin/payments", icon: CreditCard },
    { label: "Reviews", path: "/admin/reviews", icon: Star },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
    { label: "Settings", path: "/admin/settings", icon: Settings },
    { label: "Profile", path: "/admin/profile", icon: UserCircle },
    { label: "Coupons", path: "/admin/coupons", icon: BadgePercent },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-white/5
        bg-[radial-gradient(ellipse_120%_60%_at_0%_0%,rgba(220,38,38,0.14),transparent_55%),linear-gradient(180deg,#0a0e1a_0%,#0b0f1d_100%)]
        text-white shadow-2xl shadow-black/40
        transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${collapsed ? "lg:w-[92px]" : "lg:w-[280px]"} w-[280px]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Ambient glow accent */}
        <div className="pointer-events-none absolute -left-16 top-24 h-40 w-40 rounded-full bg-red-600/20 blur-3xl" />

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-3 z-10 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header / Brand */}
        <div className={`relative flex h-20 shrink-0 items-center border-b border-white/5 px-5 ${collapsed ? "lg:justify-center lg:px-0" : "justify-between"}`}>
          <div className="flex items-center gap-3">
            <div className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-600/40 ring-1 ring-white/10 transition-transform duration-300 hover:scale-105">
              <Bus className="h-6 w-6 transition-transform duration-500 group-hover:-translate-y-0.5" />
              <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            {!collapsed && (
              <div className="animate-in fade-in slide-in-from-left-1 duration-300">
                <h1 className="text-xl font-black tracking-tight">TedBus</h1>
                <p className="-mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Admin Panel
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:block"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="mx-auto mt-2 hidden rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:block"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Menu */}
        <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            if (item.isDropdown) {
              const childActive = item.children.some((c) => location.pathname === c.path);
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={item.toggle}
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200
                      ${childActive ? "bg-white/[0.06] text-white" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"}
                      ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                          childActive ? "text-red-400" : "group-hover:scale-110"
                        }`}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        size={14}
                        className={`text-slate-500 transition-transform duration-300 ${item.isOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    )}
                  </button>

                  {/* Collapsed tooltip */}
                  {collapsed && hoveredItem === item.label && (
                    <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white shadow-xl ring-1 ring-white/10 animate-in fade-in slide-in-from-left-1 duration-150">
                      {item.label}
                    </div>
                  )}

                  {/* Submenu — smooth height animation, hidden entirely when collapsed */}
                  {!collapsed && (
                    <div
                      style={{ height: contentHeight }}
                      className="overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    >
                      <div ref={contentRef} className="ml-[22px] space-y-0.5 border-l border-white/10 py-1 pl-3">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                              `group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 ${
                                isActive
                                  ? "bg-red-500/10 text-red-400"
                                  : "text-slate-400 hover:translate-x-0.5 hover:bg-white/5 hover:text-white"
                              }`
                            }
                          >
                            <child.icon size={14} className="shrink-0" />
                            <span>{child.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={item.path} className="relative">
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200
                    ${collapsed ? "lg:justify-center lg:px-0" : ""}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/30"
                        : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active left indicator */}
                      <span
                        className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white transition-all duration-300 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                          !isActive && "group-hover:scale-110"
                        }`}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>

                {collapsed && hoveredItem === item.label && (
                  <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white shadow-xl ring-1 ring-white/10 animate-in fade-in slide-in-from-left-1 duration-150">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="relative shrink-0 border-t border-white/5 p-3">
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoveredItem("Logout")}
            onMouseLeave={() => setHoveredItem(null)}
            className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-200 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {!collapsed && <span>Logout</span>}
          </button>
          {collapsed && hoveredItem === "Logout" && (
            <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white shadow-xl ring-1 ring-white/10 animate-in fade-in slide-in-from-left-1 duration-150">
              Logout
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;