# 🛡️ DarkPattern Guard

> **AI-Powered Consumer Defense Portal & Crowdsourced Wall of Shame for Deceptive UI Designs**  
> Built for **NextGen-AI Hackathon (Problem Statement 2)** powered by **Google Gemini 1.5 Flash**.

---

## 📌 Problem Statement 2: E-Commerce & Subscription Deception

### The Problem
E-commerce websites, travel booking aggregators, and subscription services routinely trick consumers into paying extra using deceptive UI design practices ("Dark Patterns"):
- **Pre-checked Boxes**: Automatically opting consumers into paid travel protection, priority shipping, or newsletter spam.
- **Hidden Fees & Drip Pricing**: Unveiling mandatory "resort fees", cleaning surcharges, or processing fees on the final checkout page.
- **Urgency Traps & False Scarcity**: JavaScript countdown timers that induce panic and reset on page reload.
- **Roach Motel Subscriptions**: One-click signups with deliberate multi-step friction, guilt-tripping confirmshaming, and phone call requirements to cancel.

### The Challenge & Solution
Build a consumer reporting portal where users submit deceptive site links or screenshots, maintaining a community-voted index of unethical web layouts.

**DarkPattern Guard** solves this by providing:
1. **Multimodal AI Inspector**: Consumers upload checkout screenshots or paste suspicious links. Google Gemini 1.5 Flash analyzes the visual hierarchy, detects deceptive patterns, evaluates a 0-100 severity rating, breaks down evidence into bullet points, and provides an actionable **User Safety Tip**.
2. **Community Wall of Shame**: A searchable, filterable community feed of deceptive layouts with real-time upvoting/downvoting to warn fellow shoppers.
3. **Dark Pattern Field Guide & Taxonomy**: Educational glossary explaining 7 core dark patterns, how to spot them in seconds, and defensive countermeasures.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Multimodal Vision Scanner** | Powered by `@google/genai` with Gemini 1.5 Flash analyzing PNG/JPG/WEBP screenshots or URLs. |
| **Strict JSON Output** | Returns structured data: `darkPatternDetected`, `patternType`, `severityScore`, `explanation[]`, and `recommendation`. |
| **Instant Test Presets** | 1-click test scenarios (*Airline Flight Insurance*, *Gym Roach Motel Cancel*, *Ticket Urgency Timer*) for immediate evaluator demos. |
| **Severity Rating Gauge** | Visual meter categorized into **Red for High Risk (≥70)**, **Yellow for Medium Risk (40-69)**, and **Green for Low Risk (<40)**. |
| **Wall of Shame (Community Index)** | Interactive grid listing sample & submitted dark patterns with category filter pills and domain search bar. |
| **Community Voting** | Real-time functional Upvote and Downvote counters with optimistic UI updates. |
| **Zero-Cost Architecture** | Runs entirely on free tools: Google AI Studio free tier + local JSON persistence (no paid database needed). |

---

## 🛠️ Tech Stack

- **AI Model & SDK**: Google Gemini 1.5 Flash via `@google/genai` (Google AI Studio free tier)
- **Frontend Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS with custom cyber-defense color tokens, glassmorphism, and radial glowing backgrounds
- **Icons**: Lucide-React
- **Database & Storage**: Zero-cost local JSON storage (`data/reports.json`) with an in-memory fallback cache

---

## 📁 Project Structure

```
e:\NextGen-AI Hackthon\
├── .env.local                     # Environment variables (GEMINI_API_KEY)
├── package.json                   # Dependencies: next, @google/genai, tailwindcss, lucide-react
├── tsconfig.json                  # TypeScript compiler settings
├── next.config.mjs                # Next.js configuration
├── tailwind.config.ts             # Custom dark cyberpunk color palette
├── postcss.config.mjs             # PostCSS plugins
├── data/
│   ├── seed-reports.json          # Pre-seeded deceptive pattern cases
│   └── reports.json               # Local persistent database
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts       # Gemini 1.5 Flash multimodal dark pattern audit API
│   │   │   └── reports/
│   │   │       ├── route.ts       # GET/POST community reports
│   │   │       └── vote/
│   │   │           └── route.ts   # PATCH upvote/downvote counter API
│   │   ├── globals.css            # Dark mode theme & glassmorphism utilities
│   │   ├── layout.tsx             # Root layout with SEO metadata
│   │   └── page.tsx               # Full single-page frontend application
│   ├── components/
│   │   ├── Navbar.tsx             # Top navigation & action links
│   │   ├── Hero.tsx               # Hero banner with live counters
│   │   ├── AnalyzerSection.tsx    # Drag-and-drop file upload box, URL field, & 'Analyze Layout' button
│   │   ├── AnalysisResultCard.tsx # Severity rating (Red/Yellow), pattern badge, bullets, safety tip
│   │   ├── CommunityIndex.tsx     # Feed with upvote/downvote, category filters, domain search bar
│   │   ├── ReportCard.tsx         # Card with thumbnail, tags, and expandable breakdown
│   │   ├── SubmitReportModal.tsx  # Form to publish report to community index
│   │   ├── PatternGlossaryModal.tsx # Educational dark pattern taxonomy guide
│   │   └── StatsBanner.tsx        # Hackathon architecture overview
│   └── lib/
│       ├── types.ts               # TypeScript interfaces (AnalysisResult, CommunityReport)
│       ├── gemini.ts              # Gemini API client & structured prompt builder
│       ├── glossary.ts            # Dark pattern taxonomy data
│       └── storage.ts             # Local JSON file & in-memory storage manager
```

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on v24.x)
- npm (v9.0.0 or higher)

### 1. Clone or Open the Repository
```bash
cd "e:\NextGen-AI Hackthon"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Credentials
Create or edit `.env.local` in the project root:
```env
# Get your free Gemini API key from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```
> **Note**: If `GEMINI_API_KEY` is not provided or left blank, the app runs an intelligent demo heuristic engine so evaluators can test the entire UI and reporting flow out-of-the-box!

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🔌 API Reference

### 1. Analyze Layout (`POST /api/analyze`)
Accepts an image screenshot (base64) or URL/text snippet:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Flight Checkout: [x] Pre-checked: Travel insurance $29.99 auto-selected."}'
```
**Response Format**:
```json
{
  "darkPatternDetected": true,
  "patternType": "Pre-checked Boxes & Drip Pricing",
  "severityScore": 85,
  "explanation": [
    "Optional protection or service insurance was opted-in automatically by default.",
    "The baseline advertised price does not reflect the unavoidable processing charges added on step 2.",
    "Unchecking the option triggers a cautionary confirmation dialog."
  ],
  "recommendation": "Audit every pre-ticked checkbox before authorizing payment and verify the final line item totals."
}
```

### 2. Community Reports (`GET & POST /api/reports`)
- `GET /api/reports?category=pre-checked&search=airline&sort=popular`
- `POST /api/reports` with siteName, siteUrl, patternType, category, severityScore, description, tags.

### 3. Upvote/Downvote Report (`PATCH /api/reports/vote`)
```bash
curl -X PATCH http://localhost:3000/api/reports/vote \
  -H "Content-Type: application/json" \
  -d '{"id": "rep-1", "type": "up"}'
```

---

## 🏆 Hackathon Submission Highlights
- **100% Free Tools**: Built using standard libraries, Google AI Studio free tier, Next.js, and local JSON storage.
- **Enterprise-Grade Multimodal AI**: Inspects both visual layout screenshots and raw text/URLs.
- **Consumer Impact**: Crowdsourced index empowers consumers with awareness and actionable defense tips.

---

## 📄 License
MIT License - Free and open source for the community.
