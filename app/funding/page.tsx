"use client";

import TopBar from "@/components/TopBar";
import { mockCompanies } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fundingData = [
  { company: "Northvolt", amount: 9200 },
  { company: "Wiz", amount: 1900 },
  { company: "Qonto", amount: 622 },
  { company: "Alan", amount: 490 },
  { company: "Owkin", amount: 270 },
  { company: "Pigment", amount: 220 },
  { company: "Notion", amount: 330 },
  { company: "Nabla", amount: 45 },
];

export default function FundingPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Funding" />
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Tracked", value: "€13.1B", color: "text-blue-600", sub: "Across all sectors" },
            { label: "Largest Round", value: "€9.2B", color: "text-emerald-600", sub: "Northvolt — Climate Tech" },
            { label: "Avg Round Size", value: "€340M", color: "text-violet-600", sub: "Series B+" },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-5 py-4">
              <p className="text-xs text-[#64748B] mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
          <h2 className="font-semibold text-[#0F172A] mb-4 text-sm">Top Companies by Funding (€M)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fundingData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="company" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}M`} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: 12 }}
                formatter={(v: unknown) => [`€${v}M`, "Funding"]}
              />
              <Bar dataKey="amount" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="font-semibold text-[#0F172A] text-sm">All Tracked Companies — Funding</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                {["Company", "Industry", "Stage", "HQ", "Total Funding", "Founded"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] tracking-wide">
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockCompanies.sort((a, b) => b.funding.localeCompare(a.funding)).map((co) => (
                <tr key={co.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 font-semibold text-sm text-[#0F172A]">{co.name}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{co.industry}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">{co.stage}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{co.hq}</td>
                  <td className="px-4 py-3 font-bold text-sm text-[#2563EB]">{co.funding}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{co.founded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
