"use client";

import TopBar from "@/components/TopBar";
import PlayerTable from "@/components/PlayerTable";
import { mockCompanies } from "@/lib/mockData";
import { Users } from "lucide-react";

export default function PlayersPage() {
  const totalFunding = "€14.2B";
  const byStage = {
    Seed: mockCompanies.filter((c) => c.stage === "Seed").length,
    "Series A": mockCompanies.filter((c) => c.stage === "Series A").length,
    "Series B": mockCompanies.filter((c) => c.stage === "Series B").length,
    "Series C+": mockCompanies.filter((c) => c.stage === "Series C+").length,
    Public: mockCompanies.filter((c) => c.stage === "Public").length,
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Player Database" />
      <main className="p-6 space-y-5">
        {/* Header Stats */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total Players", value: mockCompanies.length.toString(), color: "text-[#0F172A]" },
            { label: "Seed", value: byStage["Seed"].toString(), color: "text-emerald-600" },
            { label: "Series A", value: byStage["Series A"].toString(), color: "text-blue-600" },
            { label: "Series B", value: byStage["Series B"].toString(), color: "text-violet-600" },
            { label: "Series C+", value: byStage["Series C+"].toString(), color: "text-orange-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] px-5 py-4">
              <p className="text-xs text-[#64748B] mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <PlayerTable companies={mockCompanies} />
      </main>
    </div>
  );
}
