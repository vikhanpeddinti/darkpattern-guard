"use client";

import React, { useState } from "react";
import { X, Flag, AlertTriangle, Check, Loader2, Link2, Building, Tag } from "lucide-react";
import { AnalysisResult, DarkPatternCategory } from "@/lib/types";

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    result?: AnalysisResult;
    siteUrl?: string;
    siteName?: string;
    screenshotUrl?: string;
  } | null;
  onSuccess: () => void;
}

const CATEGORY_OPTIONS: { id: DarkPatternCategory; label: string }[] = [
  { id: "pre-checked", label: "Pre-checked Boxes" },
  { id: "hidden-fees", label: "Hidden Fees & Drip Pricing" },
  { id: "urgency-trap", label: "Urgency Traps & Fake Countdown" },
  { id: "roach-motel", label: "Roach Motel (Cancellation Resistance)" },
  { id: "confirmshaming", label: "Confirmshaming & Guilt Buttons" },
  { id: "sneak-into-basket", label: "Sneak into Basket (Auto Add-ons)" },
  { id: "trick-questions", label: "Trick Questions & Double Negatives" },
];

export default function SubmitReportModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: SubmitReportModalProps) {
  if (!isOpen) return null;

  const [siteName, setSiteName] = useState(initialData?.siteName || "");
  const [siteUrl, setSiteUrl] = useState(initialData?.siteUrl || "");
  const [patternType, setPatternType] = useState(
    initialData?.result?.patternType || "Pre-checked Boxes & Hidden Fees"
  );
  const [category, setCategory] = useState<DarkPatternCategory>("pre-checked");
  const [severityScore, setSeverityScore] = useState<number>(
    initialData?.result?.severityScore || 80
  );
  const [description, setDescription] = useState(
    initialData?.result?.explanation?.[0] || ""
  );
  const [screenshotUrl, setScreenshotUrl] = useState(initialData?.screenshotUrl || "");
  const [tagsInput, setTagsInput] = useState("E-commerce, Deceptive UI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim() || !description.trim()) {
      setErrorMsg("Please provide a site name and deception description.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: siteName.trim(),
          siteUrl: siteUrl.trim(),
          patternType,
          category,
          severityScore,
          description: description.trim(),
          screenshotUrl: screenshotUrl || undefined,
          explanation: initialData?.result?.explanation || [description.trim()],
          recommendation:
            initialData?.result?.recommendation ||
            "Verify all line items and opt-outs before final confirmation.",
          tags: tags.length > 0 ? tags : ["Community Reported"],
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to submit report");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white glass-card hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <Flag className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Report Deceptive Site Layout
            </h3>
            <p className="text-xs text-slate-400">
              Submit to the community Wall of Shame to alert fellow consumers.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company / Website Name *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. QuickFly Airlines"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090e1b] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Website or Checkout URL
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://retailer.com/checkout"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090e1b] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pattern Classification
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DarkPatternCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#090e1b] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Severity Score: <span className="text-rose-400 font-bold">{severityScore}/100</span>
                </label>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={severityScore}
                onChange={(e) => setSeverityScore(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              What deceptive trick did they use? *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Automatically selected a $25 flight protection plan without asking, and hid the opt-out link behind low-contrast gray text."
              className="w-full p-3 rounded-xl bg-[#090e1b] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tags (Comma separated)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Airlines, Pre-checked, Hidden Fees"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090e1b] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white glass-card"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-glow-danger flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Flag className="w-3.5 h-3.5" />
                  <span>Publish Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
