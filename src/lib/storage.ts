import fs from "fs";
import path from "path";
import { CommunityReport } from "./types";
import seedReports from "../../data/seed-reports.json";

const DATA_DIR = path.join(process.cwd(), "data");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");

// In-memory cache to ensure speed and fallback
let inMemoryReports: CommunityReport[] | null = null;

function initializeStorage(): CommunityReport[] {
  if (inMemoryReports) {
    return inMemoryReports;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(REPORTS_FILE)) {
      const data = fs.readFileSync(REPORTS_FILE, "utf-8");
      inMemoryReports = JSON.parse(data);
      return inMemoryReports!;
    } else {
      // Seed initial data
      const initial = seedReports as CommunityReport[];
      fs.writeFileSync(REPORTS_FILE, JSON.stringify(initial, null, 2), "utf-8");
      inMemoryReports = [...initial];
      return inMemoryReports;
    }
  } catch (error) {
    console.warn("Using in-memory fallback for reports storage:", error);
    inMemoryReports = [...(seedReports as CommunityReport[])];
    return inMemoryReports;
  }
}

function persistReports(reports: CommunityReport[]): void {
  inMemoryReports = reports;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf-8");
  } catch (error) {
    console.warn("Could not persist reports to disk, cached in-memory only:", error);
  }
}

export function getAllReports(): CommunityReport[] {
  return initializeStorage();
}

export function getReportById(id: string): CommunityReport | undefined {
  const reports = getAllReports();
  return reports.find((r) => r.id === id);
}

export function createReport(
  newReport: Omit<CommunityReport, "id" | "upvotes" | "downvotes" | "createdAt">
): CommunityReport {
  const reports = getAllReports();
  const report: CommunityReport = {
    ...newReport,
    id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    upvotes: 1,
    downvotes: 0,
    createdAt: new Date().toISOString(),
  };

  const updated = [report, ...reports];
  persistReports(updated);
  return report;
}

export function voteReport(id: string, type: "up" | "down"): CommunityReport | null {
  const reports = getAllReports();
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const report = { ...reports[index] };
  if (type === "up") {
    report.upvotes += 1;
  } else {
    report.downvotes += 1;
  }

  reports[index] = report;
  persistReports(reports);
  return report;
}
