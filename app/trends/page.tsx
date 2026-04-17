"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import TrendCard from "@/components/TrendCard";
import { mockTrends } from "@/lib/mockData";
import { Trend } from "@/lib/types";

const CATEGORIES: Array<Trend["category"] | "All"> = ["All", "AI", "Regulation", "Funding", "Market"];

export default function TrendsPage() {
  const [filter, setFilter] = useState<"All" | "High">("All");
  const [category, setCategory] = useState<Trend["category"] | "All">("All");

  const filtered = mockTrends
    .filter((t) => filter === "All" || t.impact === "High")
    .filter((t) => category === "All" || t.category === category);

  const grouped = CATEGORIES.filter((c) => c !== "All").reduce<
    Record<string, typeof mockTrends>
  >((acc, cat) => {
    const items = filtered.filter((t) => t.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <TopBar title="Trend Tracker" />
      <main className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Trends", value: mockTrends.length.toString(), color: "text-[#0F172A]" },
            { label: "High Impact", value: mockTrends.filter((t) => t.impact === "High").length.toString(), color: "text-red-600" },
            { label: "Upward", value: mockTrends.filter((t) => t.direction === "up").length.toString(), color: "text-emerald-600" },
            { label: "Downward", value: mockTrends.filter((t) => t.direction === "down").length.toString(), color: "text-red-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-5 py-4">
              <p className="text-xs text-[#64748B] mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === cat
                    ? "bg-[#2563EB] text-white"
                    : "bg-white text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["All Trends", "High Impact Only"].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt === "All Trends" ? "All" : "High")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  (opt === "All Trends" ? filter === "All" : filter === "High")
                    ? "bg-[#0F172A] text-white border-[#0F172A]"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Grid */}
        {category === "All" ? (
          Object.entries(grouped).map(([cat, trends]) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-semibold text-[#0F172A] text-sm">{cat}</h2>
                <div className="flex-1 h-px bg-[#E2E8F0]" />
                <span className="text-xs text-[#64748B]">{trends.length} signal{trends.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {trends.map((trend) => (
                  <TrendCard key={trend.id} trend={trend} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#64748B] text-sm">
            No trends match the current filters.
          </div>
        )}
      </main>
    </div>
  );
}
