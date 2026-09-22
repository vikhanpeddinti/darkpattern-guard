"use client";

import React, { useState } from "react";
import { X, BookOpen, AlertTriangle, ShieldCheck, HelpCircle, Eye, Search } from "lucide-react";
import { DARK_PATTERN_CATALOG } from "@/lib/glossary";

interface PatternGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatternGlossaryModal({
  isOpen,
  onClose,
}: PatternGlossaryModalProps) {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPattern, setSelectedPattern] = useState(DARK_PATTERN_CATALOG[0]);

  const filtered = DARK_PATTERN_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl my-8 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white glass-card hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Dark Pattern Field Guide & Taxonomy
            </h3>
            <p className="text-xs text-slate-400">
              Learn how manipulative UX patterns extract extra money and how to defend against them.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pattern types, deceptive tactics..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#090e1b] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Split view: List & Detail */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden flex-1 min-h-0">
          {/* Left: Pattern selection pills */}
          <div className="md:col-span-5 overflow-y-auto space-y-2 pr-1">
            {filtered.map((pattern) => {
              const isSelected = selectedPattern.id === pattern.id;
              return (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-500/40 text-white shadow-glow-cyan"
                      : "bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-sm truncate">{pattern.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        pattern.severity === "critical"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : pattern.severity === "high"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      }`}
                    >
                      {pattern.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {pattern.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Selected pattern detail */}
          <div className="md:col-span-7 overflow-y-auto bg-[#080d19] p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-white tracking-tight">
                {selectedPattern.name}
              </h4>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                  selectedPattern.severity === "critical"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {selectedPattern.severity} Risk
              </span>
            </div>

            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400 mb-1">
                Definition
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedPattern.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[11px] uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Where it strikes:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedPattern.typicalOccurrence}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="text-[11px] uppercase font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                How to Spot:
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
                {selectedPattern.howToSpot}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="text-[11px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Consumer Defense Tip:
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                {selectedPattern.countermeasure}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
