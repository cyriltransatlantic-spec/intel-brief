"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ReportRow } from "@/lib/types";

interface ReportTableProps {
  reports: ReportRow[];
}

const StatusBadge = ({ status }: { status: ReportRow["status"] }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Draft: "bg-slate-50 text-slate-600 border border-slate-200",
    Archived: "bg-orange-50 text-orange-700 border border-orange-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === "Active" ? "bg-emerald-500" : status === "Draft" ? "bg-slate-400" : "bg-orange-500"}`} />
      {status}
    </span>
  );
};

const SignalIcon = ({ signal }: { signal: ReportRow["signal"] }) => {
  if (signal === "up") return <TrendingUp size={16} className="text-emerald-500" />;
  if (signal === "down") return <TrendingDown size={16} className="text-red-500" />;
  return <Minus size={16} className="text-amber-500" />;
};

export default function ReportTable({ reports }: ReportTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h2 className="font-semibold text-[#0F172A] text-sm">
          Overview of Reports — Trends and Players by Sector
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">Click any row to open the full report</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {["INDUSTRY", "TYPE", "STATUS", "REGION", "EXEC. BRIEF", "GEO FOCUS", "KEY PLAYER", "EST. FUNDING", "SIGNAL"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] tracking-wide whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((row) => (
              <tr
                key={row.slug}
                onClick={() => router.push(`/report/${row.slug}`)}
                className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3.5">
                  <span className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {row.industry}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-md">
                    {row.type}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3.5 text-sm text-[#64748B]">{row.region}</td>
                <td className="px-4 py-3.5 max-w-xs">
                  <p className="text-xs text-[#64748B] truncate">{row.execBrief}</p>
                </td>
                <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{row.geoFocus}</td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-[#0F172A]">{row.keyPlayer}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-semibold text-[#0F172A]">{row.estFunding}</span>
                </td>
                <td className="px-4 py-3.5">
                  <SignalIcon signal={row.signal} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
