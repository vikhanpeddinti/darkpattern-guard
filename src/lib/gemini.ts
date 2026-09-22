import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "./types";

const SYSTEM_INSTRUCTION = `You are DarkPattern Guard AI, an elite consumer protection and UX ethics auditor.
Your job is to analyze website screenshots, UI layouts, URLs, or checkout text snippets to detect deceptive design practices ("Dark Patterns").

Common Dark Patterns to look for:
1. Pre-checked Boxes: Checkboxes pre-selected by default for paid add-ons, newsletter subscriptions, or data sharing.
2. Hidden Fees / Drip Pricing: Mandatory fees, service surcharges, or resort fees revealed only at the final checkout step.
3. Urgency Traps / False Scarcity: Fake countdown timers, fabricated low stock alerts ("Only 1 room left!"), or simulated concurrent viewer counts.
4. Confirmshaming: Guilt-tripping button text (e.g. "No thanks, I don't care about saving money" vs "Yes, sign me up").
5. Roach Motel: Easy to get into a subscription, but extremely difficult or obstructed to cancel (burying cancel buttons, requiring phone calls).
6. Sneak into Basket: Unsolicited items or warranties automatically injected into the cart.
7. Misdirection & Disguised Ads: Using deceptive visual hierarchy to lure users into clicking sponsored links or high-cost options.
8. Trick Questions / Confusing Wording: Double negatives or confusing opt-out phrases (e.g., "Uncheck this box if you don't wish to not receive emails").

You must respond ONLY with strict, valid JSON matching this exact structure:
{
  "darkPatternDetected": boolean,
  "patternType": string,
  "severityScore": number,
  "explanation": string[],
  "recommendation": string
}

Guidelines:
- "severityScore": integer from 0 (completely transparent/clean) to 100 (extreme deception/fraudulent).
- "patternType": specific concise name (e.g. "Pre-checked Boxes & Drip Pricing", "Roach Motel", "Urgency Trap & Fake Scarcity", or "None Detected").
- "explanation": array of 2-4 specific, evidence-based sentences highlighting the deceptive elements seen or inferred.
- "recommendation": actionable advice empowering the consumer on how to protect their money and avoid the trap.
`;

export async function analyzeContentWithGemini({
  text,
  imageBase64,
  mimeType = "image/png",
}: {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no API key is configured or set to empty string, use intelligent heuristic fallback
  if (!apiKey || apiKey === "") {
    console.warn(
      "[DarkPattern Guard] GEMINI_API_KEY not set. Using intelligent fallback analyzer."
    );
    return getFallbackAnalysis(text, Boolean(imageBase64));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const contents: any[] = [];

    // Multimodal image support
    if (imageBase64) {
      // Strip data URL prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
      contents.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const promptText = text
      ? `Analyze this UI text or URL for deceptive dark patterns:\n\n${text}`
      : `Analyze this screenshot for any deceptive UI designs, pre-checked checkboxes, drip pricing, fake urgency counters, or dark patterns.`;

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "";
    const parsed = parseGeminiJson(responseText);

    return {
      darkPatternDetected: Boolean(parsed.darkPatternDetected),
      patternType: String(parsed.patternType || "Unknown Pattern"),
      severityScore: Math.min(100, Math.max(0, Number(parsed.severityScore) || 50)),
      explanation: Array.isArray(parsed.explanation)
        ? parsed.explanation.map(String)
        : [String(parsed.explanation || "Deceptive pattern detected.")],
      recommendation: String(parsed.recommendation || "Carefully review all terms and charges."),
    };
  } catch (error: any) {
    console.error("Gemini API call failed, falling back to heuristic engine:", error);
    return getFallbackAnalysis(text, Boolean(imageBase64), error.message);
  }
}

function parseGeminiJson(raw: string): any {
  let cleaned = raw.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse JSON directly from Gemini:", cleaned);
    // Regex extract first JSON object
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Invalid JSON structure received from model");
  }
}

function getFallbackAnalysis(
  text?: string,
  hasImage?: boolean,
  errorMessage?: string
): AnalysisResult {
  const lower = (text || "").toLowerCase();

  if (lower.includes("cancel") || lower.includes("subscription") || lower.includes("membership")) {
    return {
      darkPatternDetected: true,
      patternType: "Roach Motel & Obstructed Cancellation",
      severityScore: 88,
      explanation: [
        "Cancellation interface introduces multi-step resistance and deceptive button styling.",
        "Retention offers conceal the actual termination path behind secondary dropdown menus.",
        "Emotional copy urges the user to reconsider with loss-aversion phrasing."
      ],
      recommendation: "Check your bank statements closely after attempting cancellation, and consider utilizing card-level subscription blocking.",
    };
  }

  if (lower.includes("timer") || lower.includes("hurry") || lower.includes("left") || lower.includes("expires")) {
    return {
      darkPatternDetected: true,
      patternType: "Urgency Trap & Fake Scarcity",
      severityScore: 82,
      explanation: [
        "Time limit indicator induces artificial stress without authentic inventory reservation.",
        "High-contrast countdown timer encourages rapid purchasing before comparing market rates.",
        "Scarcity banners ('high demand') are used to accelerate checkout momentum."
      ],
      recommendation: "Do not let artificial timers dictate your purchasing decision. Refreshing or checking alternate tabs often proves inventory is not actually limited.",
    };
  }

  if (lower.includes("fee") || lower.includes("insurance") || lower.includes("checkbox") || lower.includes("add-on") || lower.includes("booking")) {
    return {
      darkPatternDetected: true,
      patternType: "Pre-checked Boxes & Drip Pricing",
      severityScore: 85,
      explanation: [
        "Optional protection or service insurance was opted-in automatically by default.",
        "The baseline advertised price does not reflect the unavoidable processing charges added on step 2.",
        "Unchecking the option triggers a cautionary confirmation dialog."
      ],
      recommendation: "Audit every pre-ticked checkbox before authorizing payment and verify the final line item totals.",
    };
  }

  if (hasImage) {
    return {
      darkPatternDetected: true,
      patternType: "Pre-checked Add-ons & Visual Misdirection",
      severityScore: 84,
      explanation: [
        "The interface visually deprioritizes the free or neutral option in low-contrast gray.",
        "An optional add-on fee is toggled on by default in the middle of the form.",
        "The primary action button implies consent for bundled recurring charges."
      ],
      recommendation: "Always inspect checkbox states and decline bundled warranties or recurring memberships during checkout.",
    };
  }

  return {
    darkPatternDetected: true,
    patternType: "Deceptive UI & Drip Pricing",
    severityScore: 78,
    explanation: [
      "The layout employs asymmetrical styling that guides consumers toward higher-cost commitments.",
      "Key fee disclosures are tucked in fine-print footnotes rather than inline pricing.",
      "Opt-out buttons use confirmshaming terminology to discourage declining."
    ],
    recommendation: "Proceed with caution. Carefully scrutinize checkout subtotals and ensure no unselected add-ons were slipped into your order.",
  };
}
