"use client";

import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Tag,
} from "lucide-react";
import { CommunityReport } from "@/lib/types";

interface ReportCardProps {
  report: CommunityReport;
  onVote: (id: string, type: "up" | "down") => void;
}

export default function ReportCard({ report, onVote }: ReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const netVotes = report.upvotes - report.downvotes;
  const isCritical = report.severityScore >= 75;
  const isModerate = report.severityScore >= 40 && report.severityScore < 75;

  const handleVoteClick = (type: "up" | "down") => {
    if (userVote === type) return; // already voted
    setUserVote(type);
    onVote(report.id, type);
  };

  const formattedDate = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between transition-all duration-200 hover:border-cyan-500/40 group">
      {/* Top Header: Site and Severity */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-bold text-white tracking-tight truncate group-hover:text-cyan-300 transition-colors">
                {report.siteName}
              </h4>
              {report.status === "verified" && (
                <span className="flex-shrink-0" title="Community Verified Pattern">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </span>
              )}
            </div>

            {report.siteUrl && (
              <a
                href={report.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 mt-0.5 truncate transition-colors"
              >
                <span>{report.siteUrl.replace(/^https?:\/\//, "")}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            )}
          </div>

          {/* Severity Score Tag */}
          <div
            className={`flex-shrink-0 px-2.5 py-1 rounded-xl text-xs font-black border flex items-center gap-1.5 ${
              isCritical
                ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                : isModerate
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{report.severityScore} / 100</span>
          </div>
        </div>

        {/* Pattern Classification Badge */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            {report.patternType}
          </span>
          {report.tags?.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] text-slate-400 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Screenshot preview if available */}
        {report.screenshotUrl && (
          <div className="mt-3.5 rounded-xl overflow-hidden border border-white/10 aspect-video relative bg-slate-950">
            <img
              src={report.screenshotUrl}
              alt={`${report.siteName} deceptive pattern`}
              className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          </div>
        )}

        {/* Description */}
        <p className="mt-3 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {report.description}
        </p>
      </div>

      {/* Expanded Details Drawer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fadeIn">
          {report.explanation && report.explanation.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Why this is deceptive:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {report.explanation.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.recommendation && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{report.recommendation}</span>
            </div>
          )}

          <div className="flex items-center text-[10px] text-slate-500 gap-1 pt-1">
            <Calendar className="w-3 h-3" />
            <span>Reported on {formattedDate}</span>
          </div>
        </div>
      )}

      {/* Footer bar: Voting and Toggle Details */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        {/* Upvote / Downvote Counter */}
        <div className="flex items-center space-x-1 bg-[#0a0f1e] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => handleVoteClick("up")}
            aria-label="Upvote report"
            className={`p-1.5 rounded-lg transition-colors ${
              userVote === "up"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-400 hover:text-cyan-400 hover:bg-white/5"
            }`}
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <span
            className={`text-xs font-bold px-1.5 min-w-[24px] text-center ${
              netVotes > 0
                ? "text-cyan-300"
                : netVotes < 0
                ? "text-rose-400"
                : "text-slate-400"
            }`}
          >
            {netVotes}
          </span>

          <button
            onClick={() => handleVoteClick("down")}
            aria-label="Downvote report"
            className={`p-1.5 rounded-lg transition-colors ${
              userVote === "down"
                ? "bg-rose-500/20 text-rose-400"
                : "text-slate-400 hover:text-rose-400 hover:bg-white/5"
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <span>{isExpanded ? "Hide Details" : "View Breakdown"}</span>
          <ChevronRight
            className={`w-3.5 h-3.5 transform transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
