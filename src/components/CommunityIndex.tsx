"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Flame,
  AlertOctagon,
  Clock,
  PlusCircle,
  ShieldX,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { CommunityReport, DarkPatternCategory } from "@/lib/types";
import ReportCard from "./ReportCard";

interface CommunityIndexProps {
  onOpenManualSubmit: () => void;
  refreshTrigger: number;
}

const CATEGORIES: { id: DarkPatternCategory; label: string }[] = [
  { id: "all", label: "All Patterns" },
  { id: "pre-checked", label: "Pre-checked Boxes" },
  { id: "hidden-fees", label: "Hidden Fees & Drip" },
  { id: "urgency-trap", label: "Urgency Traps" },
  { id: "roach-motel", label: "Roach Motel" },
  { id: "sneak-into-basket", label: "Sneak into Basket" },
  { id: "confirmshaming", label: "Confirmshaming" },
];

export default function CommunityIndex({
  onOpenManualSubmit,
  refreshTrigger,
}: CommunityIndexProps) {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<DarkPatternCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "severity" | "recent">("popular");

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("sort", sortBy);

      const res = await fetch(`/api/reports?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Failed to load community reports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [activeCategory, sortBy, refreshTrigger]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchReports();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleVote = async (id: string, type: "up" | "down") => {
    // Optimistic UI update
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            upvotes: type === "up" ? r.upvotes + 1 : r.upvotes,
            downvotes: type === "down" ? r.downvotes + 1 : r.downvotes,
          };
        }
        return r;
      })
    );

    try {
      await fetch("/api/reports/vote", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  return (
    <section id="community-index" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Title & Submit Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold mb-2.5">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>Community Voted Database</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Wall of Shame: Unethical Layouts
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-xl">
            Crowdsourced directory of sneaky interfaces, stealth fees, and deceptive subscription traps.
            Vote on reports to warn other online shoppers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchReports}
            title="Refresh Community Index"
            className="p-3 rounded-xl glass-card hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={onOpenManualSubmit}
            className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-glow-danger flex items-center space-x-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report a Deceptive Site</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 mb-8 space-y-4">
        {/* Search and Sort row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Domain search: enter domain (e.g. airline.com), retailer, or pattern tag..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#090e1b] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
            <span className="text-xs text-slate-400 hidden sm:block">Sort by:</span>

            <div className="flex items-center bg-[#090e1b] p-1 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setSortBy("popular")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  sortBy === "popular"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Most Upvoted</span>
              </button>

              <button
                onClick={() => setSortBy("severity")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  sortBy === "severity"
                    ? "bg-rose-500/20 text-rose-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Highest Severity</span>
              </button>

              <button
                onClick={() => setSortBy("recent")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                  sortBy === "recent"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Newest</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-white/5">
          <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan"
                  : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 border border-white/5 h-64 animate-shimmer"
            />
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onVote={handleVote} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-panel rounded-3xl border border-white/10">
          <ShieldX className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No reports match your filters</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or category selection to view reported layouts.
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
}
