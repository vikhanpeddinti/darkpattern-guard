import { NextRequest, NextResponse } from "next/server";
import { voteReport } from "@/lib/storage";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, type } = body; // type: "up" | "down"

    if (!id || (type !== "up" && type !== "down")) {
      return NextResponse.json(
        { error: "Valid report id and vote type ('up' or 'down') are required." },
        { status: 400 }
      );
    }

    const updated = voteReport(id, type);
    if (!updated) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report: updated });
  } catch (error: any) {
    console.error("Error in PATCH /api/reports/vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}
