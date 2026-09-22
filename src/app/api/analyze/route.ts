import { NextRequest, NextResponse } from "next/server";
import { analyzeContentWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, imageBase64, mimeType } = body;

    if (!text && !imageBase64) {
      return NextResponse.json(
        {
          error: "Either an image screenshot (base64) or URL/text snippet is required.",
        },
        { status: 400 }
      );
    }

    const result = await analyzeContentWithGemini({
      text: typeof text === "string" ? text.trim() : undefined,
      imageBase64: typeof imageBase64 === "string" ? imageBase64 : undefined,
      mimeType: typeof mimeType === "string" ? mimeType : "image/png",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze dark patterns",
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
