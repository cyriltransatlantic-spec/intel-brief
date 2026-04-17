"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { Company } from "@/lib/types";

interface PlayerTableProps {
  companies: Company[];
}

const stageBadgeColors: Record<Company["stage"], string> = {
  Seed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Series A": "bg-blue-50 text-blue-700 border-blue-200",
  "Series B": "bg-violet-50 text-violet-700 border-violet-200",
  "Series C+": "bg-orange-50 text-orange-700 border-orange-200",
  Public: "bg-slate-50 text-slate-600 border-slate-200",
};

type SortKey = keyof Company;

export default function PlayerTable({ companies }: PlayerTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Company | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const types = ["All", "Startup", "Scale-up", "Incumbent"];

  const filtered = companies
    .filter((c) => typeFilter === "All" || c.type === typeFilter)
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = String(a[sortKey]);
      const bv = String(b[sortKey]);
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : (
      <ChevronDown size={12} className="opacity-30" />
    );

  return (
    <div className="flex gap-4">
      <div className={`flex-1 bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden transition-all`}>
        {/* Filters */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
          <div className="flex gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  typeFilter === t
                    ? "bg-[#2563EB] text-white"
                    : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                {(["name", "industry", "stage", "hq", "funding", "founded"] as SortKey[]).map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] tracking-wide cursor-pointer hover:text-[#0F172A] whitespace-nowrap"
                      onClick={() => handleSort(col)}
                    >
                      <div className="flex items-center gap-1 uppercase">
                        {col}
                        <SortIcon col={col} />
                      </div>
                    </th>
                  )
                )}
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] tracking-wide uppercase">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((co) => (
                <tr
                  key={co.id}
                  onClick={() => setSelected(co)}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3.5 font-semibold text-sm text-[#0F172A]">{co.name}</td>
                  <td className="px-4 py-3.5 text-sm text-[#64748B]">{co.industry}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${stageBadgeColors[co.stage]}`}>
                      {co.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#64748B] whitespace-nowrap">{co.hq}</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-[#0F172A]">{co.funding}</td>
                  <td className="px-4 py-3.5 text-sm text-[#64748B]">{co.founded}</td>
                  <td className="px-4 py-3.5 text-xs text-[#64748B] max-w-xs truncate">{co.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel */}
      {selected && (
        <div className="w-72 bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5 flex-shrink-0 animate-in slide-in-from-right-4 duration-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#0F172A]">{selected.name}</h3>
              <p className="text-xs text-[#64748B] mt-0.5">{selected.industry}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="p-1 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { label: "Stage", value: selected.stage },
              { label: "Type", value: selected.type },
              { label: "HQ", value: selected.hq },
              { label: "Founded", value: String(selected.founded) },
              { label: "Total Funding", value: selected.funding },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[#F1F5F9]">
                <span className="text-xs text-[#64748B]">{label}</span>
                <span className="text-xs font-semibold text-[#0F172A]">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-xs text-[#64748B] leading-relaxed">{selected.description}</p>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-semibold text-amber-800 mb-1">Notable</p>
            <p className="text-xs text-amber-700">{selected.notable}</p>
          </div>
        </div>
      )}
    </div>
  );
}
