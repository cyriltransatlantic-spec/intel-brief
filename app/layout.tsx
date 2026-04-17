import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ReportProvider } from "@/context/ReportContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IntelBrief — Industry Intelligence",
  description: "Professional industry intelligence briefing platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#F8FAFC]`}>
        <ReportProvider>
          <div className="flex h-full min-h-screen">
            <Sidebar />
            <div
              id="main-content"
              className="flex-1 flex flex-col min-h-screen transition-all duration-300"
              style={{ marginLeft: "224px" }}
            >
              {children}
            </div>
          </div>
        </ReportProvider>
      </body>
    </html>
  );
}
