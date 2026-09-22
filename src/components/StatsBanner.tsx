"use client";

import React from "react";
import { ShieldCheck, Cpu, Database, Award, ArrowUpRight } from "lucide-react";

export default function StatsBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>NextGen AI Hackathon Architecture</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              100% Free Stack. Enterprise-Grade AI Protection.
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Engineered specifically for consumer transparency without expensive infrastructure.
              Combining Google AI Studio's Gemini 1.5 Flash multimodal intelligence with zero-cost
              decentralized JSON persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
            <div className="p-4 rounded-2xl bg-[#090d1a] border border-white/10 flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Model</div>
                <div className="text-sm font-bold text-white">Gemini 1.5 Flash</div>
                <div className="text-[10px] text-cyan-400">@google/genai SDK</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090d1a] border border-white/10 flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Database</div>
                <div className="text-sm font-bold text-white">JSON In-Memory</div>
                <div className="text-[10px] text-purple-400">Zero-cost local</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090d1a] border border-white/10 flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Security</div>
                <div className="text-sm font-bold text-white">Unexposed Keys</div>
                <div className="text-[10px] text-emerald-400">Protected in .env</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
