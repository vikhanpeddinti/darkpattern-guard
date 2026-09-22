"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, ArrowRight, Zap, Eye, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onScanClick: () => void;
  onExploreClick: () => void;
  totalReportsCount: number;
}

export default function Hero({
  onScanClick,
  onExploreClick,
  totalReportsCount,
}: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* Glow background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-medium text-cyan-300 mb-6 shadow-glow-cyan animate-pulse-slow">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Gemini 1.5 Flash Multimodal Inspection Live</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
        Stop E-Commerce Tricks.{" "}
        <span className="bg-gradient-to-r from-red-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
          Expose Deceptive UI.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
        Subscription traps, pre-checked add-on boxes, and hidden recurring fees cost consumers billions.
        Upload any checkout screenshot or paste a suspicious link to audit deceptive patterns in seconds.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onScanClick}
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-glow-cyan flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>Launch AI Dark Pattern Scanner</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onExploreClick}
          className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-slate-200 glass-card hover:bg-slate-800/80 border border-white/10 flex items-center justify-center space-x-2 transition-all"
        >
          <Eye className="w-5 h-5 text-purple-400" />
          <span>Browse Community Wall of Shame</span>
        </button>
      </div>

      {/* Live Community Counters */}
      <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-3xl sm:text-4xl font-black text-rose-400">
            {totalReportsCount > 0 ? totalReportsCount : 142}+
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Tricks Uncovered</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-3xl sm:text-4xl font-black text-cyan-400">94.6%</div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Detection Precision</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-3xl sm:text-4xl font-black text-purple-400">7 Types</div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Patterns Audited</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-3xl sm:text-4xl font-black text-amber-400">100% Free</div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Driven</span>
          </div>
        </div>
      </div>
    </section>
  );
}
