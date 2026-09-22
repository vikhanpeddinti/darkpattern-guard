"use client";

import React, { useState } from "react";
import {
  AlertOctagon,
  ShieldCheck,
  Check,
  Copy,
  Share2,
  Lightbulb,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { AnalysisResult } from "@/lib/types";

interface AnalysisResultCardProps {
  result: AnalysisResult;
  analyzedInputLabel: string;
  screenshotPreviewUrl?: string | null;
  onPublishToCommunity: () => void;
  onReset: () => void;
}

export default function AnalysisResultCard({
  result,
  analyzedInputLabel,
  screenshotPreviewUrl,
  onPublishToCommunity,
  onReset,
}: AnalysisResultCardProps) {
  const [copied, setCopied] = useState(false);

  // Red for high (>= 70), Yellow for medium (40-69), Green for low (< 40)
  const isHighSeverity = result.severityScore >= 70;
  const isMediumSeverity = result.severityScore >= 40 && result.severityScore < 70;

  const severityBadgeClass = isHighSeverity
    ? "bg-red-500/20 text-red-400 border-red-500/40 ring-1 ring-red-500/20"
    : isMediumSeverity
    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 ring-1 ring-yellow-500/20"
    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/20";

  const severityLabel = isHighSeverity
    ? "HIGH RISK (Deceptive)"
    : isMediumSeverity
    ? "MEDIUM RISK (Questionable)"
    : "LOW RISK (Transparent)";

  const handleCopySummary = () => {
    const textToCopy = `[DarkPattern Guard AI Audit]
Pattern Badge: ${result.patternType}
Severity Rating: ${result.severityScore}/100 (${severityLabel})
Deceptive Indicators:
${result.explanation.map((e, idx) => `  • ${e}`).join("\n")}
User Safety Tip:
  ${result.recommendation}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
      {/* Ambient background glow */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isHighSeverity ? "bg-red-500/15" : isMediumSeverity ? "bg-yellow-500/15" : "bg-cyan-500/15"
        }`}
      />

      {/* Header bar: Gemini Analysis & Pattern Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-3">
            {result.darkPatternDetected ? (
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                  isHighSeverity
                    ? "bg-red-500/20 border-red-500/40 text-red-400"
                    : "bg-yellow-500/20 border-yellow-500/40 text-yellow-300"
                }`}
              >
                <AlertOctagon className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
                Google Gemini 1.5 Flash Analysis
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {result.patternType}
                </h3>
                {/* Pattern Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {result.patternType.split("&")[0].trim()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 truncate max-w-md">
            Target analyzed: <span className="text-slate-200 font-mono">{analyzedInputLabel}</span>
          </p>
        </div>

        {/* Severity Rating Box: Red for high, Yellow for medium */}
        <div className="flex items-center space-x-4 bg-[#090e1b] p-4 rounded-2xl border border-white/10">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Severity Rating
            </div>
            <div className="text-2xl font-black text-white">
              {result.severityScore}
              <span className="text-xs text-slate-500 font-normal"> / 100</span>
            </div>
            <div className={`mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${severityBadgeClass}`}>
              {severityLabel}
            </div>
          </div>

          <div className="w-16 h-16 rounded-full flex items-center justify-center relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={163.36}
                strokeDashoffset={163.36 - (163.36 * result.severityScore) / 100}
                className={
                  isHighSeverity
                    ? "text-red-500"
                    : isMediumSeverity
                    ? "text-yellow-400"
                    : "text-emerald-400"
                }
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
              {result.severityScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Bullet points & User Safety Tip */}
        <div className="lg:col-span-8 space-y-6">
          {/* Bullet Points */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              Detected Deceptive Indicators (Bullet Points):
            </h4>
            <ul className="space-y-2.5">
              {result.explanation.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs sm:text-sm text-slate-200"
                >
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center mt-0.5 ${
                      isHighSeverity
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* User Safety Tip */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/30">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs sm:text-sm font-bold mb-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>User Safety Tip:</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              {result.recommendation}
            </p>
          </div>
        </div>

        {/* Right column: Screenshot or Crowdsourced Action */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          {screenshotPreviewUrl ? (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-950 relative aspect-video flex items-center justify-center">
              <img
                src={screenshotPreviewUrl}
                alt="Audited Deceptive UI"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-cyan-300 font-semibold backdrop-blur-sm">
                Analyzed Screenshot
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Community Vigilance
              </div>
              <p>
                Publishing this finding to the Community Index alerts other consumers before they fall for these deceptive checkboxes or hidden fees.
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={onPublishToCommunity}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-glow-danger flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Publish to Community Index</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopySummary}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 glass-card hover:bg-slate-800 border border-white/10 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Audit Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Analysis</span>
                  </>
                )}
              </button>

              <button
                onClick={onReset}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white glass-card hover:bg-slate-800 border border-white/10 transition-colors cursor-pointer"
              >
                Scan Another
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
