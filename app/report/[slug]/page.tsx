"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import TabNav from "@/components/TabNav";
import FundingChart from "@/components/FundingChart";
import { useReports } from "@/context/ReportContext";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  TrendingUp as TrendingUpIcon,
  BarChart3,
  Globe,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "trends", label: "Trends" },
  { id: "players", label: "Players" },
  { id: "funding", label: "Funding" },
  { id: "summary", label: "Summary" },
  { id: "sources", label: "Sources" },
];

const stageBadgeColors: Record<string, string> = {
  Seed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Series A": "bg-blue-50 text-blue-700 border-blue-200",
  "Series B": "bg-violet-50 text-violet-700 border-violet-200",
  "Series C+": "bg-orange-50 text-orange-700 border-orange-200",
  Public: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function ReportPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { getReport, saveStartup, unsaveStartup, isStartupSaved } = useReports();
  const [activeTab, setActiveTab] = useState("overview");
  const [playerFilter, setPlayerFilter] = useState("All");

  const report = getReport(slug);

  if (!report) {
    return (
      <div className="min-h-screen">
        <TopBar title="Report Not Found" />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] gap-4">
          <Sparkles size={48} className="text-[#CBD5E1]" />
          <h2 className="text-xl font-bold text-[#0F172A]">Report not found</h2>
          <p className="text-[#64748B] text-sm">
            This report doesn&apos;t exist yet. Generate it first.
          </p>
          <button
            onClick={() => router.push("/generate")}
            className="mt-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white text-sm font-semibold"
          >
            Generate Report
          </button>
        </div>
      </div>
    );
  }

  const DirectionIcon = ({ dir }: { dir: string }) =>
    dir === "up" ? (
      <TrendingUp size={16} className="text-emerald-500" />
    ) : dir === "down" ? (
      <TrendingDown size={16} className="text-red-500" />
    ) : (
      <Minus size={16} className="text-amber-500" />
    );

  const impactColor = (impact: string) =>
    impact === "High"
      ? "bg-red-50 text-red-700 border-red-200"
      : impact === "Medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-600 border-slate-200";

  const filteredPlayers =
    playerFilter === "All"
      ? report.players
      : report.players.filter((p) => p.type === playerFilter);

  const visibleTabs =
    report.sources && report.sources.length > 0
      ? TABS
      : TABS.filter((t) => t.id !== "sources");

  return (
    <div className="min-h-screen">
      <TopBar title={`Report: ${report.industry}`} />

      <main className="p-6 space-y-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {/* Report Header */}
        <div className="bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] rounded-xl p-6 text-white">
          <div>
            <h1 className="text-2xl font-bold mb-1">{report.industry}</h1>
            <p className="text-blue-100 text-sm">{report.tagline}</p>
          </div>
          <div className="flex gap-4 mt-5">
            {[
              { label: "Market Size", value: report.overview.market_size, icon: BarChart3 },
              { label: "Growth Rate", value: report.overview.growth_rate, icon: TrendingUpIcon },
              { label: "Maturity", value: report.overview.maturity, icon: Sparkles },
              { label: "Geography", value: report.overview.geography, icon: Globe },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/10 rounded-lg px-4 py-3 flex-1">
                <div className="flex items-center gap-1.5 text-blue-200 text-xs mb-1">
                  <Icon size={12} />
                  {label}
                </div>
                <p className="font-bold text-white text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="px-6 pt-0">
            <TabNav tabs={visibleTabs} active={activeTab} onChange={setActiveTab} />
          </div>

          <div className="p-6">
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3">
                  <h3 className="font-semibold text-[#0F172A] mb-3">Sector Overview</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {report.overview.summary}
                  </p>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-3">
                  {[
                    { label: "Market Size", value: report.overview.market_size, color: "text-blue-600" },
                    { label: "Growth Rate", value: report.overview.growth_rate, color: "text-emerald-600" },
                    { label: "Stage", value: report.overview.maturity, color: "text-violet-600" },
                    { label: "HQ Region", value: report.overview.geography, color: "text-amber-600" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                      <p className="text-xs text-[#64748B] mb-1">{label}</p>
                      <p className={`font-bold text-sm ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trends */}
            {activeTab === "trends" && (
              <div className="space-y-3">
                {report.trends.map((trend, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <DirectionIcon dir={trend.direction} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <h4 className="font-semibold text-[#0F172A] text-sm">{trend.title}</h4>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${impactColor(trend.impact)}`}
                        >
                          {trend.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B]">{trend.signal}</p>
                      <div className="mt-2 h-1.5 bg-[#F1F5F9] rounded-full w-full">
                        <div
                          className={`h-1.5 rounded-full ${
                            trend.impact === "High"
                              ? "bg-red-400 w-4/5"
                              : trend.impact === "Medium"
                              ? "bg-amber-400 w-1/2"
                              : "bg-slate-300 w-1/4"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Players */}
            {activeTab === "players" && (
              <div>
                <div className="flex gap-2 mb-4">
                  {["All", "Startup", "Scale-up", "Incumbent"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setPlayerFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        playerFilter === f
                          ? "bg-[#2563EB] text-white"
                          : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      {["Company", "Type", "Stage", "HQ", "Description", "Notable", ""].map((col) => (
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
                    {filteredPlayers.map((player, i) => {
                      const saved = isStartupSaved(player.name, report.industry);
                      return (
                        <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {player.name[0]}
                              </div>
                              <span className="font-semibold text-sm text-[#0F172A]">{player.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded-md">
                              {player.type}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                stageBadgeColors[player.stage] ?? "bg-slate-50 text-slate-600 border-slate-200"
                              }`}
                            >
                              {player.stage}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-[#64748B]">{player.hq}</td>
                          <td className="px-4 py-3.5 text-xs text-[#64748B] max-w-xs">{player.description}</td>
                          <td className="px-4 py-3.5 text-xs text-[#64748B] max-w-xs">{player.notable}</td>
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() =>
                                saved
                                  ? unsaveStartup(player.name, report.industry)
                                  : saveStartup({ ...player, industry: report.industry })
                              }
                              title={saved ? "Remove from saved" : "Save startup"}
                              className={`p-1.5 rounded-lg transition-colors ${
                                saved
                                  ? "text-[#2563EB] bg-blue-50 hover:bg-red-50 hover:text-red-500"
                                  : "text-[#CBD5E1] hover:text-[#2563EB] hover:bg-blue-50"
                              }`}
                            >
                              {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Funding */}
            {activeTab === "funding" && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
                    <p className="text-xs text-blue-600 mb-1">Total Funding (2024)</p>
                    <p className="text-3xl font-bold text-[#1D4ED8]">{report.funding.total_2024}</p>
                  </div>
                  <p className="text-sm text-[#64748B] flex-1 leading-relaxed">
                    {report.funding.narrative}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A] text-sm mb-3">Top Rounds by Amount</h4>
                  <FundingChart data={report.funding.top_rounds} />
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      {["Company", "Amount", "Stage", "Date"].map((col) => (
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
                    {report.funding.top_rounds.map((round, i) => (
                      <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-4 py-3 font-semibold text-sm text-[#0F172A]">{round.company}</td>
                        <td className="px-4 py-3 font-bold text-sm text-[#2563EB]">{round.amount}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                              stageBadgeColors[round.stage] ?? "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {round.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#64748B]">{round.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {activeTab === "summary" && (
              <div className="space-y-5">
                <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5">
                  <h4 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-[#2563EB]" />
                    Key Insights
                  </h4>
                  <ul className="space-y-2">
                    {report.summary.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#64748B]">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <h4 className="font-semibold text-red-800 mb-2 text-sm">Risk</h4>
                    <p className="text-sm text-red-700 leading-relaxed">{report.summary.risk}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <h4 className="font-semibold text-emerald-800 mb-2 text-sm">Opportunity</h4>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      {report.summary.opportunity}
                    </p>
                  </div>
                </div>

                <div className="border-l-4 border-[#2563EB] bg-blue-50 rounded-r-xl p-5">
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide mb-2">
                    Analyst Verdict
                  </p>
                  <p className="text-sm text-[#0F172A] italic leading-relaxed">
                    {report.summary.verdict}
                  </p>
                </div>
              </div>
            )}

            {/* Sources */}
            {activeTab === "sources" && report.sources && (
              <div className="space-y-2">
                {report.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ExternalLink size={11} className="text-[#64748B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">
                        {src.title}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-0.5 truncate">{src.url}</p>
                    </div>
                    <span className="text-xs text-[#94A3B8] whitespace-nowrap">{src.date}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
