"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabNavProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function TabNav({ tabs, active, onChange }: TabNavProps) {
  return (
    <div className="flex border-b border-[#E2E8F0]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
            active === tab.id
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
