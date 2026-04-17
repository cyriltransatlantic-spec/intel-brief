"use client";

import TopBar from "@/components/TopBar";
import { useState } from "react";
import { Key, Bell, Globe, Shield } from "lucide-react";

export default function SettingsPage() {
  const [anthropicKey, setAnthropicKey] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [defaultRegion, setDefaultRegion] = useState("Europe");

  return (
    <div className="min-h-screen">
      <TopBar title="Settings" />
      <main className="p-6 max-w-2xl space-y-5">
        {/* API Keys */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-[#2563EB]" />
            <h2 className="font-semibold text-[#0F172A]">API Configuration</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Anthropic API Key", value: anthropicKey, onChange: setAnthropicKey, help: "Required for AI report generation" },
            ].map(({ label, value, onChange, help }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{label}</label>
                <input
                  type="password"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                />
                <p className="text-xs text-[#64748B] mt-1">{help}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={16} className="text-[#2563EB]" />
            <h2 className="font-semibold text-[#0F172A]">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Default Region</label>
              <select
                value={defaultRegion}
                onChange={(e) => setDefaultRegion(e.target.value)}
                className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-white"
              >
                {["Global", "Europe", "France", "USA", "Asia"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Email Notifications</p>
                <p className="text-xs text-[#64748B]">Get notified when reports are ready</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-10 h-5 rounded-full transition-colors relative ${notifications ? "bg-[#2563EB]" : "bg-[#CBD5E1]"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white text-sm font-semibold shadow-sm">
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
