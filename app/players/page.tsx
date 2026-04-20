"use client";

import TopBar from "@/components/TopBar";
import { useReports } from "@/context/ReportContext";
import { Bookmark, BookmarkX, Sparkles } from "lucide-react";
import Link from "next/link";

const stageBadgeColors: Record<string, string> = {
  Seed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Series A": "bg-blue-50 text-blue-700 border-blue-200",
  "Series B": "bg-violet-50 text-violet-700 border-violet-200",
  "Series C+": "bg-orange-50 text-orange-700 border-orange-200",
  Public: "bg-slate-50 text-slate-600 border-slate-200",
};

const typeBadgeColors: Record<string, string> = {
  Startup: "bg-emerald-50 text-emerald-700",
  "Scale-up": "bg-blue-50 text-blue-700",
  Incumbent: "bg-amber-50 text-amber-700",
};

export default function SavedStartupsPage() {
  const { savedStartups, unsaveStartup } = useReports();

  return (
    <div className="min-h-screen">
      <TopBar title="Saved Startups" />
      <main className="p-6 space-y-5">
        {savedStartups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
              <Bookmark size={28} className="text-[#CBD5E1]" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-[#0F172A] mb-1">No saved startups</h3>
              <p className="text-sm text-[#64748B]">
                Open a report and bookmark players from the Players tab.
              </p>
            </div>
            <Link
              href="/generate"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white text-sm font-semibold"
            >
              <Sparkles size={14} />
              Generate Report
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#64748B]">
                {savedStartups.length} startup{savedStartups.length !== 1 ? "s" : ""} saved across{" "}
                {new Set(savedStartups.map((s) => s.industry)).size} sector
                {new Set(savedStartups.map((s) => s.industry)).size !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    {["Company", "Sector", "Type", "Stage", "HQ", "Notable", ""].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] tracking-wide"
                      >
                        {col.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {savedStartups.map((s) => (
                    <tr
                      key={`${s.name}-${s.industry}`}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {s.name[0]}
                          </div>
                          <span className="font-semibold text-sm text-[#0F172A]">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#64748B]">{s.industry}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                            typeBadgeColors[s.type] ?? "bg-slate-50 text-slate-600"
                          }`}
                        >
                          {s.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                            stageBadgeColors[s.stage] ?? "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {s.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-[#64748B]">{s.hq}</td>
                      <td className="px-4 py-3.5 text-xs text-[#64748B] max-w-xs">{s.notable}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => unsaveStartup(s.name, s.industry)}
                          title="Remove from saved"
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <BookmarkX size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
