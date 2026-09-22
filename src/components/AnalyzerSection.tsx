"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Globe,
  Sparkles,
  AlertTriangle,
  Loader2,
  X,
  Zap,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import AnalysisResultCard from "./AnalysisResultCard";

// Sample presets for quick testing
const PRESETS = [
  {
    name: "Airline Flight Insurance",
    siteUrl: "https://aerojet-flights-demo.com/checkout",
    text: "Flight Booking Summary: Subtotal $240. [x] Pre-checked: Add Comprehensive Flight Protection ($38.50) - Automatically enrolled. Uncheck to decline coverage.",
    previewUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Gym Roach Motel Cancel",
    siteUrl: "https://fitstream-fitness-demo.com/account/cancel",
    text: "Cancel Subscription: Are you sure you want to cancel your $59/mo Pro Tier? [Button: Keep My Plan & Stay Healthy] [Low contrast tiny link: Continue cancellation step 1 of 5. Note: Online cancellation is restricted; please call 1-800-GYM-TRICK between 9am-11am EST].",
    previewUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Concert Ticket Urgency Timer",
    siteUrl: "https://fastpass-events-demo.com/checkout",
    text: "URGENT: Your tickets are reserved for only 04:59 minutes! 42 other fans are viewing these seats right now. Price will increase by 25% if timer reaches zero!",
    previewUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60",
  },
];

interface AnalyzerSectionProps {
  onReportPublished: () => void;
  onOpenSubmitModal: (data: {
    result: AnalysisResult;
    siteUrl: string;
    siteName: string;
    screenshotUrl?: string;
  }) => void;
}

export default function AnalyzerSection({
  onReportPublished,
  onOpenSubmitModal,
}: AnalyzerSectionProps) {
  const [inputText, setInputText] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setErrorMessage(null);
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setUploadedImageBase64(base64);
      setImagePreviewUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setInputText(preset.text);
    setSiteUrl(preset.siteUrl);
    setImagePreviewUrl(preset.previewUrl);
    setUploadedImageBase64(null);
    setImageFileName(null);
  };

  const handleAnalyze = async () => {
    const hasImage = Boolean(uploadedImageBase64);
    const combinedText = [
      siteUrl ? `Target Site URL: ${siteUrl}` : "",
      inputText ? `Deceptive Text/Snippet: ${inputText}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    if (!hasImage && !combinedText.trim()) {
      setErrorMessage("Please upload a screenshot or enter a website URL / text snippet to analyze.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setAnalysisResult(null);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1100);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: combinedText || undefined,
          imageBase64: uploadedImageBase64 || undefined,
          mimeType: "image/png",
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || "Analysis failed");
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || "Something went wrong. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setUploadedImageBase64(null);
    setImageFileName(null);
    setImagePreviewUrl(null);
    setInputText("");
    setSiteUrl("");
    setErrorMessage(null);
  };

  return (
    <div id="scanner-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Gemini 1.5 Flash Inspector</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Audit Suspicious UI Layouts
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl mx-auto">
          Submit suspicious checkout screenshots, deceptive pre-checked boxes, or site URLs.
          Our AI scans visual hierarchy, uncovers drip pricing, and scores consumer deception risk.
        </p>
      </div>

      {analysisResult ? (
        <AnalysisResultCard
          result={analysisResult}
          analyzedInputLabel={
            imageFileName
              ? `Screenshot: ${imageFileName}`
              : siteUrl || "Custom checkout snippet"
          }
          screenshotPreviewUrl={imagePreviewUrl}
          onPublishToCommunity={() => {
            let extractedName = "Reported E-Commerce Site";
            if (siteUrl) {
              try {
                extractedName = new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).hostname;
              } catch {
                extractedName = siteUrl;
              }
            }
            onOpenSubmitModal({
              result: analysisResult,
              siteUrl: siteUrl || "https://example.com/checkout",
              siteName: extractedName,
              screenshotUrl: imagePreviewUrl || undefined,
            });
          }}
          onReset={handleReset}
        />
      ) : (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative">
          {/* Quick Presets for Instant Testing */}
          <div className="mb-6 p-4 rounded-2xl bg-[#090e1b] border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Quick Test Presets (Instant Demo for Evaluators):
              </span>
              <span className="text-[11px] text-slate-500">Click any preset to auto-fill</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-left px-3.5 py-2.5 rounded-xl text-xs bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate font-medium">{preset.name}</span>
                  <span className="text-[11px] text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    Load &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form: Unified File Upload + Site URL + Text */}
          <div className="space-y-5">
            {/* Drag & Drop Screenshot File Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                1. Upload Screenshot (Drag-and-Drop or Click)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {imagePreviewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#090d1a] p-4 flex flex-col items-center">
                  <div className="relative max-h-64 w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/50">
                    <img
                      src={imagePreviewUrl}
                      alt="Uploaded Screenshot"
                      className="max-h-64 object-contain rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between w-full text-xs text-slate-300">
                    <span className="truncate font-medium flex items-center gap-1.5 text-cyan-300">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      {imageFileName || "Screenshot Ready for Inspection"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImageBase64(null);
                        setImagePreviewUrl(null);
                        setImageFileName(null);
                      }}
                      className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-white/15 hover:border-cyan-500/40 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-white text-sm">
                    Drop suspicious checkout screenshot here, or <span className="text-cyan-400 underline">browse file</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports PNG, JPG, or WEBP (e.g. pre-checked checkboxes, drip pricing steps, cancellation forms)
                  </p>
                </div>
              )}
            </div>

            {/* Site URL Text Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  2. Site URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    placeholder="https://deceptive-store.com/checkout"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1b] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              {/* Optional Text Snippet / Fine Print */}
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  3. Button Copy or Fine Print (Optional)
                </label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. 'I agree to $29.99/mo renewal', pre-ticked add-on text..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090e1b] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action: 'Analyze Layout' Button with Active Loading Spinner */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Powered by Google Gemini 1.5 Flash • Strict JSON Audit</span>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleAnalyze}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-glow-cyan flex items-center justify-center space-x-2 disabled:opacity-60 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>
                    {loadingStep === 1
                      ? "Preprocessing Layout..."
                      : loadingStep === 2
                      ? "Gemini 1.5 Flash Analyzing..."
                      : "Evaluating Severity Score..."}
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Analyze Layout</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
