"use client";

import { Bell, Search } from "lucide-react";

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 sticky top-0 z-30">
      <h1 className="text-lg font-bold text-[#0F172A]">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 w-56">
          <Search size={14} className="text-[#64748B]" />
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent text-sm text-[#0F172A] placeholder-[#64748B] outline-none w-full"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors">
          <Bell size={18} className="text-[#64748B]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] ring-2 ring-[#2563EB] ring-offset-2 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          CR
        </div>
      </div>
    </header>
  );
}
