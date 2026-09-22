"use client";

import React from "react";
import { ShieldAlert, BookOpen, Search, Flag, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenGlossary: () => void;
  onScrollToScanner: () => void;
  onScrollToIndex: () => void;
}

export default function Navbar({
  onOpenGlossary,
  onScrollToScanner,
  onScrollToIndex,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] flex items-center justify-center shadow-glow-cyan">
            <div className="w-full h-full bg-[#090d1a] rounded-[11px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                DarkPattern<span className="text-cyan-400">Guard</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                AI 1.5 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Consumer Deception Defense</p>
          </div>
        </div>

        {/* Action Links */}
        <nav className="flex items-center space-x-1 sm:space-x-3">
          <button
            onClick={onScrollToScanner}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">AI Scanner</span>
          </button>

          <button
            onClick={onScrollToIndex}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Search className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Wall of Shame</span>
          </button>

          <button
            onClick={onOpenGlossary}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Glossary</span>
          </button>

          <button
            onClick={onScrollToScanner}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-glow-danger transition-all duration-200 ml-2"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Scan & Report</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
