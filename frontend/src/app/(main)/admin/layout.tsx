"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import AdminSidebar from "@/src/components/dashboard/AdminSidebar";
import type { Metadata } from "next";
import { appMetaData } from "@/src/utils/metaData";

type User = {
  _id: string;
  name: string;
  role: "user" | "admin";
};

export const metaData: Metadata = appMetaData;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (!storedUser) { router.push("/login"); return; }
    const user: User = JSON.parse(storedUser);
    if (user.role !== "admin") {
      router.push("/");
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-cream text-setu-950">
      <AdminSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-setu-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden text-setu-700 hover:text-setu-900"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-display font-semibold text-setu-700">
                Admin Dashboard
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-setu-700">{currentUser?.name || "Loading..."}</p>
              <p className="text-xs text-setu-500 capitalize">{currentUser?.role || ""}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto relative bg-cream [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
