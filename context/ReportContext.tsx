"use client";

import React, { createContext, useContext, useState } from "react";
import { GeneratedReport } from "@/lib/types";
import { mockReportData } from "@/lib/mockData";

interface ReportContextValue {
  reports: Record<string, GeneratedReport>;
  saveReport: (slug: string, report: GeneratedReport) => void;
  getReport: (slug: string) => GeneratedReport | undefined;
}

const ReportContext = createContext<ReportContextValue>({
  reports: mockReportData,
  saveReport: () => {},
  getReport: () => undefined,
});

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Record<string, GeneratedReport>>(mockReportData);

  const saveReport = (slug: string, report: GeneratedReport) => {
    setReports((prev) => ({ ...prev, [slug]: report }));
  };

  const getReport = (slug: string) => reports[slug];

  return (
    <ReportContext.Provider value={{ reports, saveReport, getReport }}>
      {children}
    </ReportContext.Provider>
  );
}

export const useReports = () => useContext(ReportContext);
