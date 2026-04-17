"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  TrendingUp,
  DollarSign,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Reports", href: "/generate" },
  { icon: Users, label: "Players", href: "/players" },
  { icon: TrendingUp, label: "Trends", href: "/trends" },
  { icon: DollarSign, label: "Funding", href: "/funding" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-[#F1F5F9] flex flex-col z-40 transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#F1F5F9]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
          <Zap size={14} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-[#0F172A] text-base tracking-tight">
            IntelBrief
          </span>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-[#F1F5F9]">
        <div
          className={`flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Search size={14} className="text-[#64748B] flex-shrink-0" />
          {!collapsed && (
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-xs text-[#0F172A] placeholder-[#64748B] outline-none w-full"
            />
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? "bg-[#2563EB] text-white"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon
                size={16}
                className={`flex-shrink-0 ${
                  isActive ? "text-white" : "text-[#64748B] group-hover:text-[#0F172A]"
                }`}
              />
              {!collapsed && (
                <span className="text-sm font-medium">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-[#F1F5F9] px-3 py-4">
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            CR
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#0F172A] truncate">
                Cole Rattler
              </p>
              <p className="text-[10px] text-[#64748B] truncate">Analyst</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all text-xs`}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
