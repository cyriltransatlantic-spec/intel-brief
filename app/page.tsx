"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import { useReports } from "@/context/ReportContext";
import { Sparkles, Clock, Bookmark, ChevronRight, Globe, Layers, FileText } from "lucide-react";

const depthColors: Record<string, string> = {
  "Quick Brief": "bg-slate-50 text-slate-600 border-slate-200",
  "Full Analysis": "bg-blue-50 text-blue-700 border-blue-200",
  "Deep Dive": "bg-violet-50 text-violet-700 border-violet-200",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function SessionsPage() {
  const router = useRouter();
  const { sessions, savedStartups } = useReports();

  return (
    <div className="min-h-screen">
      <TopBar title="Sessions" />

      <main className="p-6 space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Reports Generated",
              value: sessions.length,
              icon: FileText,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Saved Startups",
              value: savedStartups.length,
              icon: Bookmark,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              label: "Industries Covered",
              value: new Set(sessions.map((s) => s.industry)).size,
              icon: Globe,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-5 py-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-xs text-[#64748B]">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#64748B]" />
              <h2 className="font-semibold text-[#0F172A] text-sm">Recent Sessions</h2>
            </div>
            <Link
              href="/generate"
              className="flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:underline"
            >
              <Sparkles size={12} />
              New Report
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center">
                <Sparkles size={28} className="text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-[#0F172A] mb-1">No sessions yet</h3>
                <p className="text-sm text-[#64748B]">
                  Generate your first intelligence report to get started.
                </p>
              </div>
              <button
                onClick={() => router.push("/generate")}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white text-sm font-semibold"
              >
                Generate Report
              </button>
            </div>
          ) : (
            <ul>
              {sessions.map((session, i) => (
                <li key={session.slug}>
                  <Link
                    href={`/report/${session.slug}`}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-[#F8FAFC] transition-colors ${
                      i < sessions.length - 1 ? "border-b border-[#F1F5F9]" : ""
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                      {session.industry[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#0F172A] truncate">
                        {session.industry}
                      </p>
                      <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                        <Globe size={10} />
                        {session.region}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${
                        depthColors[session.depth] ?? "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {session.depth}
                    </span>
                    <span className="text-xs text-[#94A3B8] whitespace-nowrap">
                      {timeAgo(session.generatedAt)}
                    </span>
                    <ChevronRight size={14} className="text-[#CBD5E1] flex-shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Saved startups preview */}
        {savedStartups.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Bookmark size={14} className="text-[#64748B]" />
                <h2 className="font-semibold text-[#0F172A] text-sm">Saved Startups</h2>
                <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                  {savedStartups.length}
                </span>
              </div>
              <Link
                href="/players"
                className="flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:underline"
              >
                View all
                <ChevronRight size={12} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 p-4">
              {savedStartups.slice(0, 8).map((s) => (
                <div
                  key={`${s.name}-${s.industry}`}
                  className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {s.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A]">{s.name}</p>
                    <p className="text-[10px] text-[#64748B]">{s.stage} · {s.hq}</p>
                  </div>
                </div>
              ))}
              {savedStartups.length > 8 && (
                <div className="flex items-center px-3 py-2 text-xs text-[#64748B]">
                  +{savedStartups.length - 8} more
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
