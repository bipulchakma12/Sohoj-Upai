"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  Shield,
  Home,
  LogOut,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

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

      {/* Footer Nav Links */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>কাস্টমার পোর্টাল</span>
        </Link>
      </div>
    </aside>
  );
};
