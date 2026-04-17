"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Trend } from "@/lib/types";

interface TrendCardProps {
  trend: Trend;
}

const categoryColors: Record<Trend["category"], string> = {
  AI: "bg-violet-50 text-violet-700 border-violet-200",
  Regulation: "bg-amber-50 text-amber-700 border-amber-200",
  Funding: "bg-blue-50 text-blue-700 border-blue-200",
  Market: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const impactColors = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function TrendCard({ trend }: TrendCardProps) {
  const DirectionIcon =
    trend.direction === "up"
      ? TrendingUp
      : trend.direction === "down"
      ? TrendingDown
      : Minus;

  const dirColor =
    trend.direction === "up"
      ? "text-emerald-500"
      : trend.direction === "down"
      ? "text-red-500"
      : "text-amber-500";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <DirectionIcon size={18} className={dirColor} />
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[trend.category]}`}
          >
            {trend.category}
          </span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${impactColors[trend.impact]}`}
        >
          {trend.impact} Impact
        </span>
      </div>

      <h3 className="font-semibold text-[#0F172A] text-sm mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
        {trend.title}
      </h3>

      <p className="text-xs text-[#64748B] leading-relaxed mb-4">{trend.signal}</p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {trend.industries.map((ind) => (
            <span
              key={ind}
              className="text-[10px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] px-2 py-0.5 rounded-full"
            >
              {ind}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
          {new Date(trend.lastUpdated).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
}
