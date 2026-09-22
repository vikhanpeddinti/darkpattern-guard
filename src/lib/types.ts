export interface AnalysisResult {
  darkPatternDetected: boolean;
  patternType: string;
  severityScore: number; // 0 to 100
  explanation: string[];
  recommendation: string;
}

export interface CommunityReport {
  id: string;
  siteName: string;
  siteUrl: string;
  patternType: string;
  category: string;
  severityScore: number;
  description: string;
  screenshotUrl?: string;
  explanation: string[];
  recommendation: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  tags: string[];
  status?: "verified" | "pending" | "flagged";
}

export type DarkPatternCategory =
  | "all"
  | "pre-checked"
  | "hidden-fees"
  | "urgency-trap"
  | "roach-motel"
  | "confirmshaming"
  | "sneak-into-basket"
  | "trick-questions";

export interface PatternInfo {
  id: DarkPatternCategory;
  name: string;
  severity: "high" | "critical" | "medium";
  description: string;
  typicalOccurrence: string;
  howToSpot: string;
  countermeasure: string;
}
