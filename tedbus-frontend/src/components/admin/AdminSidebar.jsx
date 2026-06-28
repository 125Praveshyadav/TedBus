import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bus,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Route,
  Settings,
  Star,
  UserCircle,
  Users,
  X,
  BadgePercent,
} from "lucide-react";

import { useAuth } from "../../components/context/AuthContext";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Buses", path: "/admin/buses", icon: Bus },
  { label: "Routes", path: "/admin/routes", icon: Route },
  { label: "Bookings", path: "/admin/bookings", icon: FileText },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "Reports", path: "/admin/reports", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
  { label: "Profile", path: "/admin/profile", icon: UserCircle },
  {
    label: "Coupons",
    path: "/admin/coupons",
    icon: BadgePercent,
  },
];

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  setCollapsed,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay - Navbar ke neeche se start */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0  z-40 bg-slate-900/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0  z-40 flex w-72 flex-col border-r border-red-900/20 bg-slate-950 text-white transition-all duration-300 ${
          collapsed ? "lg:w-24" : "lg:w-72"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo/Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30">
              <Bus className="h-6 w-6" />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-xl font-black">TedBus</h1>
                <p className="-mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Admin Panel
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-xl p-2 text-slate-400 hover:bg-white/10 lg:block"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
