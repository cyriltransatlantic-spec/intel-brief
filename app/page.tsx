"use client";

import TopBar from "@/components/TopBar";
import ReportTable from "@/components/ReportTable";
import { mockReports } from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const reportsData = [
  { day: "Mon", ai: 3, saved: 2 },
  { day: "Tue", ai: 5, saved: 4 },
  { day: "Wed", ai: 4, saved: 3 },
  { day: "Thu", ai: 7, saved: 5 },
  { day: "Fri", ai: 6, saved: 4 },
  { day: "Sat", ai: 2, saved: 1 },
  { day: "Sun", ai: 3, saved: 2 },
];

const coverageData = [
  { month: "Oct", industries: 12 },
  { month: "Nov", industries: 18 },
  { month: "Dec", industries: 22 },
  { month: "Jan", industries: 28 },
  { month: "Feb", industries: 34 },
  { month: "Mar", industries: 40 },
  { month: "Apr", industries: 46 },
];

export default function DashboardPage() {
  const startups = 34;
  const scaleups = 34;
  const incumbents = 900;
  const total = startups + scaleups + incumbents;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none fixed top-0 right-0 rounded-full"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)",
          opacity: 0.06,
          filter: "blur(60px)",
          transform: "translate(25%, -25%)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 rounded-full"
        style={{
          left: 224,
          width: 500,
          height: 500,
          background: "radial-gradient(circle, #34D399 0%, transparent 70%)",
          opacity: 0.06,
          filter: "blur(60px)",
          transform: "translateY(25%)",
        }}
      />

      <TopBar title="Dashboard" />

      <main className="p-6 space-y-6 relative">
        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-5">
          {/* Card 1: Total Firms */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0F172A] text-sm">Total Firms Tracked</h3>
              <span className="text-2xl font-bold text-[#0F172A]">{total.toLocaleString()}</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Startups", value: startups, color: "#2563EB" },
                { label: "Scale-ups", value: scaleups, color: "#10B981" },
                { label: "Incumbents", value: incumbents, color: "#F59E0B" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-1 h-8 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#64748B]">{label}</span>
                      <span className="font-semibold text-[#0F172A]">{value.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ background: color, width: `${(value / total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Reports Generated */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0F172A] text-sm">Reports Generated</h3>
              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#2563EB] inline-block" />
                  AI-gen
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#93C5FD] inline-block" />
                  Saved
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={reportsData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="ai" name="AI-generated" fill="#2563EB" radius={[3, 3, 0, 0]} />
                <Bar dataKey="saved" name="Saved" fill="#93C5FD" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Card 3: Industry Coverage */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0F172A] text-sm">Industry Coverage</h3>
              <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                92% European
              </span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={coverageData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="coverageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="industries"
                  name="Industries"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fill="url(#coverageGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Active Reports",
              value: mockReports.filter((r) => r.status === "Active").length.toString(),
              sub: "Updated this week",
              color: "text-emerald-600",
            },
            { label: "Regions Covered", value: "12", sub: "4 continents", color: "text-blue-600" },
            { label: "Signals Tracked", value: "847", sub: "+23 this week", color: "text-violet-600" },
            { label: "Key Players", value: "1,240", sub: "Across all sectors", color: "text-amber-600" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-5 py-4">
              <p className="text-xs text-[#64748B] mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Reports Table */}
        <ReportTable reports={mockReports} />
      </main>
    </div>
  );
}
