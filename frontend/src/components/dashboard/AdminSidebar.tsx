"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3, AlertCircle, Users, ShoppingCart, Leaf,
  Award, Package, BarChart2, MessageSquare, Megaphone,
  Settings, LogOut, X, ChevronLeft, ChevronRight, TrendingUp,
} from "lucide-react";

const navItems = [
  { title: "Dashboard",     href: "/admin",              icon: BarChart3,    section: "main" },
  { title: "Campaigns",     href: "/admin/campaigns",    icon: AlertCircle,  section: "main" },
  { title: "Teams",         href: "/admin/teams",        icon: Users,        section: "main" },
  { title: "Users & Donors",href: "/admin/users",        icon: Users,        section: "main" },
  { title: "Transactions",  href: "/admin/transactions", icon: ShoppingCart, section: "main" },
  { title: "Inventory",     href: "/admin/inventory",    icon: TrendingUp,   section: "main" },
  { title: "Categories",    href: "/admin/categories",   icon: Leaf,         section: "management" },
  { title: "Hall of Fame",  href: "/admin/hall-of-fame", icon: Award,        section: "management" },
  { title: "Relief Goods",  href: "/admin/goods",        icon: Package,      section: "management" },
  { title: "Support",       href: "/admin/support",      icon: MessageSquare,section: "management" },
  { title: "Settings",      href: "/admin/settings",     icon: Settings,     section: "settings" },
];

const sectionTitles: Record<string, string> = {
  main: "Main",
  management: "Management",
  settings: "Settings",
};

const groupedItems = navItems.reduce(
  (acc, item) => {
    const group = acc.find((g) => g.section === item.section);
    if (group) group.items.push(item);
    else acc.push({ section: item.section, items: [item] });
    return acc;
  },
  [] as Array<{ section: string; items: typeof navItems }>,
);

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-setu-700 text-white border-r border-setu-600 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-setu-600 h-[65px] ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
          {!collapsed && <h1 className="text-xl font-display font-bold">Setu Admin</h1>}
          <button
            onClick={() => onCollapse(!collapsed)}
            className="text-setu-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-setu-600"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {groupedItems.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <h3 className="text-xs font-semibold text-setu-300 uppercase tracking-wider mb-2 px-4">
                  {sectionTitles[group.section]}
                </h3>
              )}
              <ul className={`space-y-1 ${collapsed ? "px-2" : "px-3"}`}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.title : undefined}
                        className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${
                          collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
                        } ${
                          isActive
                            ? "bg-setu-500 text-white shadow"
                            : "text-setu-100 hover:bg-setu-600 hover:text-white"
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className={`border-t border-setu-600 p-3`}>
          <button
            onClick={() => setShowConfirm(true)}
            title={collapsed ? "Logout" : undefined}
            className={`flex items-center gap-3 w-full rounded-lg text-setu-100 hover:bg-setu-600 hover:text-white transition-all duration-200 ${
              collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-setu-700 text-white border-r border-setu-600 transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 border-b border-setu-600 h-[65px]">
          <h1 className="text-xl font-display font-bold">Setu Admin</h1>
          <button onClick={onMobileClose} className="text-setu-100 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {groupedItems.map((group) => (
            <div key={group.section}>
              <h3 className="text-xs font-semibold text-setu-300 uppercase tracking-wider mb-2 px-4">
                {sectionTitles[group.section]}
              </h3>
              <ul className="space-y-1 px-3">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onMobileClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-setu-500 text-white shadow"
                            : "text-setu-100 hover:bg-setu-600 hover:text-white"
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-setu-600 p-3">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-setu-100 hover:bg-setu-600 rounded-lg transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Logout confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={22} className="text-red-500" />
            </div>
            <h3 className="text-[17px] font-bold text-gray-900 text-center mb-1">Sign out?</h3>
            <p className="text-[13px] text-gray-500 text-center mb-6">You will be redirected to the login page.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold transition-colors"
              >
                Yes, logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
