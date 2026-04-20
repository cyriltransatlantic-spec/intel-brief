"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GeneratedReport, ReportSession, SavedStartup } from "@/lib/types";

const SESSIONS_KEY = "intel-brief:sessions";
const REPORTS_KEY = "intel-brief:reports";
const SAVED_KEY = "intel-brief:saved-startups";

interface ReportContextValue {
  sessions: ReportSession[];
  reports: Record<string, GeneratedReport>;
  savedStartups: SavedStartup[];
  saveReport: (
    slug: string,
    report: GeneratedReport,
    meta: { industry: string; region: string; depth: string }
  ) => void;
  getReport: (slug: string) => GeneratedReport | undefined;
  saveStartup: (startup: Omit<SavedStartup, "savedAt">) => void;
  unsaveStartup: (name: string, industry: string) => void;
  isStartupSaved: (name: string, industry: string) => boolean;
}

const ReportContext = createContext<ReportContextValue>({
  sessions: [],
  reports: {},
  savedStartups: [],
  saveReport: () => {},
  getReport: () => undefined,
  saveStartup: () => {},
  unsaveStartup: () => {},
  isStartupSaved: () => false,
});

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ReportSession[]>(() =>
    loadFromStorage<ReportSession[]>(SESSIONS_KEY, [])
  );
  const [reports, setReports] = useState<Record<string, GeneratedReport>>(() =>
    loadFromStorage<Record<string, GeneratedReport>>(REPORTS_KEY, {})
  );
  const [savedStartups, setSavedStartups] = useState<SavedStartup[]>(() =>
    loadFromStorage<SavedStartup[]>(SAVED_KEY, [])
  );

  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedStartups));
  }, [savedStartups]);

  const saveReport = (
    slug: string,
    report: GeneratedReport,
    meta: { industry: string; region: string; depth: string }
  ) => {
    setReports((prev) => ({ ...prev, [slug]: report }));
    setSessions((prev) => {
      const session: ReportSession = {
        slug,
        industry: meta.industry,
        region: meta.region,
        depth: meta.depth,
        generatedAt: new Date().toISOString(),
      };
      return [session, ...prev.filter((s) => s.slug !== slug)];
    });
  };

  const getReport = (slug: string) => reports[slug];

  const saveStartup = (startup: Omit<SavedStartup, "savedAt">) => {
    setSavedStartups((prev) => {
      if (prev.some((s) => s.name === startup.name && s.industry === startup.industry))
        return prev;
      return [{ ...startup, savedAt: new Date().toISOString() }, ...prev];
    });
  };

  const unsaveStartup = (name: string, industry: string) => {
    setSavedStartups((prev) =>
      prev.filter((s) => !(s.name === name && s.industry === industry))
    );
  };

  const isStartupSaved = (name: string, industry: string) =>
    savedStartups.some((s) => s.name === name && s.industry === industry);

  return (
    <ReportContext.Provider
      value={{
        sessions,
        reports,
        savedStartups,
        saveReport,
        getReport,
        saveStartup,
        unsaveStartup,
        isStartupSaved,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export const useReports = () => useContext(ReportContext);
