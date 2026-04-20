"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import GenerationProgress, { Step } from "@/components/GenerationProgress";
import { useReports } from "@/context/ReportContext";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Layers,
  Database,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS: Step[] = [
  { id: "search", label: "Searching web sources...", status: "pending" },
  { id: "players", label: "Identifying key players...", status: "pending" },
  { id: "funding", label: "Analyzing funding data...", status: "pending" },
  { id: "synthesis", label: "Synthesizing insights...", status: "pending" },
  { id: "format", label: "Formatting report...", status: "pending" },
];

type Region = "Global" | "Europe" | "France" | "USA" | "Asia";
type Depth = "Quick Brief" | "Full Analysis" | "Deep Dive";

export default function GeneratePage() {
  const router = useRouter();
  const { saveReport } = useReports();

  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState<Region>("Europe");
  const [depth, setDepth] = useState<Depth>("Full Analysis");
  const [includeFunding, setIncludeFunding] = useState(true);
  const [includePlayers, setIncludePlayers] = useState(true);
  const [includeTrends, setIncludeTrends] = useState(true);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [crunchbaseKey, setCrunchbaseKey] = useState("");
  const [dealroomKey, setDealroomKey] = useState("");
  const [pappersKey, setPappersKey] = useState("");

  const [steps, setSteps] = useState<Step[]>(STEPS.map((s) => ({ ...s })));
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState("");
  const [error, setError] = useState("");

  const advanceStep = (
    currentSteps: Step[],
    activeId: string,
    doneId?: string
  ): Step[] =>
    currentSteps.map((s) =>
      s.id === doneId
        ? { ...s, status: "done" }
        : s.id === activeId
        ? { ...s, status: "active" }
        : s
    );

  const handleGenerate = async () => {
    if (!industry.trim()) return;
    setError("");
    setIsDone(false);
    setIsGenerating(true);

    // Reset steps
    const fresh = STEPS.map((s) => ({ ...s, status: "pending" as const }));
    setSteps(fresh);

    // Animate steps progressively while API call runs
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    setSteps((s) => advanceStep(s, "search"));
    const apiCall = fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry, region, depth }),
    });

    await delay(1200);
    setSteps((s) => advanceStep(s, "players", "search"));
    await delay(1400);
    setSteps((s) => advanceStep(s, "funding", "players"));
    await delay(1600);
    setSteps((s) => advanceStep(s, "synthesis", "funding"));

    try {
      const res = await apiCall;
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }
      const data = await res.json();

      setSteps((s) => advanceStep(s, "format", "synthesis"));
      await delay(600);
      setSteps((s) =>
        s.map((step) =>
          step.id === "format" ? { ...step, status: "done" } : step
        )
      );

      // Save to context
      const slug =
        industry
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, "-") || "custom-report";
      saveReport(slug, data, { industry, region, depth });
      setGeneratedSlug(slug);
      setIsDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSteps((s) =>
        s.map((step) =>
          step.status === "active" ? { ...step, status: "pending" } : step
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const Toggle = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[#0F172A]">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative ${
          checked ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      <TopBar title="Generate New Report" />
      <main className="flex h-[calc(100vh-56px)]">
        {/* Left Panel */}
        <div className="w-2/5 border-r border-[#E2E8F0] p-6 overflow-y-auto bg-white flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
              Industry or Sector
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. French Fintech, AI Healthcare..."
              className="w-full text-base border border-[#E2E8F0] rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all placeholder-[#94A3B8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                Region
              </label>
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full appearance-none border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-white pr-8"
                >
                  {["Global", "Europe", "France", "USA", "Asia"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
                Report Depth
              </label>
              <div className="relative">
                <select
                  value={depth}
                  onChange={(e) => setDepth(e.target.value as Depth)}
                  className="w-full appearance-none border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-white pr-8"
                >
                  {["Quick Brief", "Full Analysis", "Deep Dive"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-xl p-4 space-y-1">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">
              Include
            </p>
            <Toggle checked={includeFunding} onChange={setIncludeFunding} label="Funding Data" />
            <Toggle checked={includePlayers} onChange={setIncludePlayers} label="Key Players" />
            <Toggle checked={includeTrends} onChange={setIncludeTrends} label="Market Trends" />
          </div>

          {/* Data Sources Accordion */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Database size={14} className="text-[#64748B]" />
                Data Sources (API Keys)
              </span>
              <ChevronRight
                size={14}
                className={`text-[#64748B] transition-transform ${sourcesOpen ? "rotate-90" : ""}`}
              />
            </button>
            {sourcesOpen && (
              <div className="border-t border-[#E2E8F0] p-4 space-y-4">
                {[
                  { label: "Crunchbase API Key", value: crunchbaseKey, onChange: setCrunchbaseKey },
                  { label: "Dealroom API Key", value: dealroomKey, onChange: setDealroomKey },
                  { label: "Pappers.fr API Key", value: pappersKey, onChange: setPappersKey },
                ].map(({ label, value, onChange }) => (
                  <div key={label}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${value ? "bg-[#10B981]" : "bg-[#CBD5E1]"}`}
                      />
                      <label className="text-xs font-medium text-[#64748B]">{label}</label>
                    </div>
                    <input
                      type="password"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder="Enter key..."
                      className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !industry.trim()}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] hover:from-[#1E40AF] hover:to-[#2563EB] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles size={16} />
            {isGenerating ? "Generating Report..." : "Generate Report"}
          </button>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-[#F8FAFC] flex flex-col items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {!isGenerating && !isDone && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center max-w-sm"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center">
                  <Sparkles size={36} className="text-white" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-xl mb-2">
                  Your report will appear here
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Fill in the industry details on the left and click Generate Report. Claude AI
                  will research and compile a full intelligence briefing.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-[#64748B]">
                  {[
                    { icon: Globe, text: "Web research" },
                    { icon: Layers, text: "Player analysis" },
                    { icon: Database, text: "Funding data" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="bg-white border border-[#E2E8F0] rounded-xl p-3 flex flex-col items-center gap-2"
                    >
                      <Icon size={16} className="text-[#2563EB]" />
                      {text}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md"
              >
                <h3 className="font-bold text-[#0F172A] mb-1 text-lg">
                  Generating Intelligence Report
                </h3>
                <p className="text-sm text-[#64748B] mb-6">
                  Analyzing {industry} — {region}
                </p>
                <GenerationProgress steps={steps} />
              </motion.div>
            )}

            {isDone && !isGenerating && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
              >
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0F172A]">Report Ready</h3>
                      <p className="text-xs text-[#64748B]">
                        {industry} · {region} · {depth}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B] mb-5">
                    Your intelligence briefing has been generated and is ready to view.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/report/${generatedSlug}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white text-sm font-semibold"
                    >
                      <ExternalLink size={14} />
                      Open Full Report
                    </button>
                    <button
                      onClick={() => router.push("/")}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
                    >
                      <Save size={14} />
                      Save to Dashboard
                    </button>
                  </div>
                </div>
                <div className="mt-4 w-full">
                  <GenerationProgress steps={steps} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
