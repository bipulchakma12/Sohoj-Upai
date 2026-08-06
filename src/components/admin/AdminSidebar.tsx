"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  Shield,
  Home,
  LogOut,
  User,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name?: string; phone?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminUser");
      if (stored) {
        setAdminUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
  };

  const navItems = [
    {
      name: "ড্যাশবোর্ড (Dashboard)",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "বুকিং সমূহ (Bookings)",
      href: "/admin/bookings",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      name: "টেকনিশিয়ান (Technicians)",
      href: "/admin/technicians",
      icon: <UserCheck className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white font-bold shadow-lg shadow-brand/30">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-white text-lg leading-none">সহজ উপায়</h2>
          <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Admin User Info Card */}
      <div className="mx-4 mt-4 p-3 bg-slate-850 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">
            {adminUser?.name || "Admin Manager"}
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            {adminUser?.phone || "01700000000"}
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-brand text-white shadow-md shadow-brand/20 font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav Links & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>কাস্টমার পোর্টাল</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট (Logout)</span>
        </button>
      </div>
    </aside>
  );
};
