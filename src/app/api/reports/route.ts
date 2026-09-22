import { NextRequest, NextResponse } from "next/server";
import { getAllReports, createReport } from "@/lib/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();
    const sort = searchParams.get("sort") || "popular"; // "popular", "recent", "severity"

    let reports = getAllReports();

    // Filter by category
    if (category && category !== "all") {
      reports = reports.filter((r) => r.category === category);
    }

    // Filter by search query
    if (search) {
      reports = reports.filter(
        (r) =>
          r.siteName.toLowerCase().includes(search) ||
          r.siteUrl.toLowerCase().includes(search) ||
          r.patternType.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search) ||
          r.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    // Sort
    if (sort === "severity") {
      reports.sort((a, b) => b.severityScore - a.severityScore);
    } else if (sort === "recent") {
      reports.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      // Default: popular (highest net upvotes)
      reports.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes));
    }

    return NextResponse.json({ reports });
  } catch (error: any) {
    console.error("Error in GET /api/reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch community reports" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      siteName,
      siteUrl,
      patternType,
      category = "other",
      severityScore,
      description,
      screenshotUrl,
      explanation = [],
      recommendation,
      tags = [],
    } = body;

    if (!siteName || !description) {
      return NextResponse.json(
        { error: "siteName and description are required" },
        { status: 400 }
      );
    }

    const report = createReport({
      siteName: siteName.trim(),
      siteUrl: siteUrl?.trim() || "",
      patternType: patternType || "Deceptive Design Pattern",
      category,
      severityScore: Number(severityScore) || 75,
      description: description.trim(),
      screenshotUrl: screenshotUrl || "",
      explanation: Array.isArray(explanation) ? explanation : [explanation],
      recommendation: recommendation || "Review checkout details before purchase.",
      tags: Array.isArray(tags) ? tags : ["Community Reported"],
      status: "verified",
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/reports:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
