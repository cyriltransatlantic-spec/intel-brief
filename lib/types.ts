export type Signal = "up" | "down" | "stable";
export type ReportStatus = "Active" | "Draft" | "Archived";
export type ReportDepth = "Quick Brief" | "Full Analysis" | "Deep Dive";
export type Region = "Global" | "Europe" | "France" | "USA" | "Asia";
export type CompanyType = "Startup" | "Scale-up" | "Incumbent";
export type CompanyStage = "Seed" | "Series A" | "Series B" | "Series C+" | "Public";
export type ImpactLevel = "High" | "Medium" | "Low";
export type TrendDirection = "up" | "down" | "stable";

export interface ReportRow {
  slug: string;
  industry: string;
  type: ReportDepth;
  status: ReportStatus;
  region: string;
  execBrief: string;
  geoFocus: string;
  keyPlayer: string;
  estFunding: string;
  signal: Signal;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  type: CompanyType;
  stage: CompanyStage;
  hq: string;
  funding: string;
  founded: number;
  description: string;
  notable: string;
}

export interface Trend {
  id: string;
  title: string;
  signal: string;
  direction: TrendDirection;
  impact: ImpactLevel;
  category: "AI" | "Regulation" | "Funding" | "Market";
  industries: string[];
  lastUpdated: string;
}

export interface GeneratedReport {
  industry: string;
  tagline: string;
  overview: {
    market_size: string;
    growth_rate: string;
    maturity: string;
    geography: string;
    summary: string;
  };
  trends: Array<{
    title: string;
    signal: string;
    direction: TrendDirection;
    impact: ImpactLevel;
  }>;
  players: Array<{
    name: string;
    type: CompanyType;
    stage: CompanyStage;
    hq: string;
    description: string;
    founded: number;
    notable: string;
  }>;
  funding: {
    total_2024: string;
    top_rounds: Array<{
      company: string;
      amount: string;
      stage: CompanyStage;
      date: string;
    }>;
    narrative: string;
  };
  summary: {
    bullets: string[];
    risk: string;
    opportunity: string;
    verdict: string;
  };
  sources?: Array<{
    title: string;
    url: string;
    date: string;
  }>;
}
