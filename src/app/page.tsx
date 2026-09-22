"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AnalyzerSection from "@/components/AnalyzerSection";
import StatsBanner from "@/components/StatsBanner";
import CommunityIndex from "@/components/CommunityIndex";
import SubmitReportModal from "@/components/SubmitReportModal";
import PatternGlossaryModal from "@/components/PatternGlossaryModal";
import { AnalysisResult } from "@/lib/types";
import { ShieldAlert, Heart, Github, ExternalLink, Sparkles } from "lucide-react";

export default function HomePage() {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitModalInitialData, setSubmitModalInitialData] = useState<{
    result?: AnalysisResult;
    siteUrl?: string;
    siteName?: string;
    screenshotUrl?: string;
  } | null>(null);
  const [communityRefreshKey, setCommunityRefreshKey] = useState(0);
  const [reportsCount, setReportsCount] = useState(145);

  useEffect(() => {
    // Fetch count
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        if (data.reports) {
          setReportsCount(data.reports.length);
        }
      })
      .catch(() => {});
  }, [communityRefreshKey]);

  const handleOpenSubmitModal = (data: {
    result: AnalysisResult;
    siteUrl: string;
    siteName: string;
    screenshotUrl?: string;
  }) => {
    setSubmitModalInitialData(data);
    setIsSubmitModalOpen(true);
  };

  const handleOpenManualSubmit = () => {
    setSubmitModalInitialData(null);
    setIsSubmitModalOpen(true);
  };

  const handleReportPublished = () => {
    setCommunityRefreshKey((k) => k + 1);
  };

  const scrollToScanner = () => {
    const el = document.getElementById("scanner-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToIndex = () => {
    const el = document.getElementById("community-index");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <Navbar
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onScrollToScanner={scrollToScanner}
        onScrollToIndex={scrollToIndex}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScanClick={scrollToScanner}
          onExploreClick={scrollToIndex}
          totalReportsCount={reportsCount}
        />

        {/* AI Analyzer Scanner */}
        <AnalyzerSection
          onReportPublished={handleReportPublished}
          onOpenSubmitModal={handleOpenSubmitModal}
        />

        {/* Hackathon Architecture Banner */}
        <StatsBanner />

        {/* Community Index / Wall of Shame */}
        <CommunityIndex
          onOpenManualSubmit={handleOpenManualSubmit}
          refreshTrigger={communityRefreshKey}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 glass-panel mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="font-bold text-slate-200 text-sm">DarkPattern Guard</div>
              <p className="text-[11px] text-slate-500">
                Empowering consumers against deceptive e-commerce design patterns.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Pattern Taxonomy
            </button>
            <button
              onClick={scrollToScanner}
              className="hover:text-cyan-400 transition-colors"
            >
              AI Scanner
            </button>
            <button
              onClick={scrollToIndex}
              className="hover:text-cyan-400 transition-colors"
            >
              Wall of Shame
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500">
            Built for NextGen AI Hackathon • Powered by Google Gemini 1.5 Flash
          </div>
        </div>
      </footer>

      {/* Submit Report Modal */}
      <SubmitReportModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        initialData={submitModalInitialData}
        onSuccess={handleReportPublished}
      />

      {/* Pattern Glossary Modal */}
      <PatternGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
