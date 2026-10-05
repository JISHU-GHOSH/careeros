"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  Compass,
  ArrowRight,
  Sliders,
  Briefcase,
  Key,
  Check,
  CheckCircle2,
  X,
  ExternalLink,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export interface ProfessionSearchHeroProps {
  onSearch: (
    profession: string,
    experienceLevel: "beginner" | "intermediate" | "career_switcher",
    apiKey?: string
  ) => void;
  isLoading?: boolean;
  initialQuery?: string;
  className?: string;
}

const INSPIRATION_PILLS = [
  "Game Developer",
  "Cybersecurity Analyst",
  "Artificial Intelligence Engineer",
  "Commercial Airline Pilot",
  "Full-Stack Web Developer",
  "Medical Doctor",
  "Robotics Engineer",
  "Executive Chef",
];

export function ProfessionSearchHero({
  onSearch,
  isLoading = false,
  initialQuery = "",
  className,
}: ProfessionSearchHeroProps) {
  const [query, setQuery] = useState(initialQuery);
  const [experienceLevel, setExperienceLevel] = useState<
    "beginner" | "intermediate" | "career_switcher"
  >("beginner");

  // Groq API Key & Status State
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savedKey, setSavedKey] = useState<string>("");
  const [backendGroqConfigured, setBackendGroqConfigured] = useState(false);
  const [groqModel, setGroqModel] = useState("llama-3.3-70b-versatile");

  useEffect(() => {
    // Check local storage for saved key
    const localKey = localStorage.getItem("groq_api_key") || "";
    setSavedKey(localKey);
    setApiKeyInput(localKey);

    // Check backend status
    api
      .getRoadmapStatus()
      .then((status) => {
        setBackendGroqConfigured(status.groq_configured);
        if (status.model) setGroqModel(status.model);
      })
      .catch((err) => {
        console.warn("Failed to check roadmap status:", err);
      });
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKeyInput.trim();
    if (cleanKey) {
      localStorage.setItem("groq_api_key", cleanKey);
      setSavedKey(cleanKey);
    } else {
      localStorage.removeItem("groq_api_key");
      setSavedKey("");
    }
    setIsKeyModalOpen(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem("groq_api_key");
    setSavedKey("");
    setApiKeyInput("");
    setIsKeyModalOpen(false);
  };

  const isGroqActive = backendGroqConfigured || Boolean(savedKey && savedKey.length > 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), experienceLevel, savedKey || undefined);
    }
  };

  const handlePillClick = (profession: string) => {
    setQuery(profession);
    onSearch(profession, experienceLevel, savedKey || undefined);
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 p-6 sm:p-10 shadow-xs overflow-hidden",
        className
      )}
    >
      {/* Ambient background decoration */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Universal Career Roadmap Generator</span>
          </div>

          {/* Groq AI Status Pill */}
          <button
            type="button"
            onClick={() => setIsKeyModalOpen(true)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition-all hover:scale-105 active:scale-95",
              isGroqActive
                ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-300"
            )}
            title="Configure Groq API Key for live AI generation"
          >
            <Zap className={cn("w-3.5 h-3.5", isGroqActive ? "text-emerald-600 fill-emerald-500" : "text-amber-500")} />
            <span>
              {isGroqActive ? "Groq Llama 3.3 Active" : "Connect Groq API (Optional)"}
            </span>
            <span className="text-[10px] bg-white/80 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 font-mono">
              ⚙️
            </span>
          </button>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            What do you want to become?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Type <strong className="font-semibold text-slate-800">any profession on earth</strong>—from Game Developer to Doctor—and get an instant, connected roadmap with real projects and tools.
          </p>
        </div>

        {/* Main Search Bar Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center shadow-md shadow-indigo-100/60 rounded-2xl bg-white border-2 border-indigo-200 focus-within:border-indigo-600 transition-all p-1.5">
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-indigo-600" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Game Developer, Commercial Pilot, AI Engineer, Neurologist, Chef..."
              className="w-full bg-transparent px-2 py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-xs transition-all shrink-0 active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Experience Level Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium mr-1">Experience:</span>
            {[
              { id: "beginner", label: "🌱 Beginner (From Scratch)" },
              { id: "intermediate", label: "⚡ Upskilling (Have Basics)" },
              { id: "career_switcher", label: "🔄 Career Switcher" },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setExperienceLevel(lvl.id as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border font-medium transition-all",
                  experienceLevel === lvl.id
                    ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-2xs"
                    : "bg-white/80 border-slate-200 text-slate-600 hover:bg-white"
                )}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </form>

        {/* Quick Inspiration Chips */}
        <div className="pt-2">
          <p className="text-xs text-slate-400 font-medium mb-2.5">
            Or pick a popular profession to explore instantly:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {INSPIRATION_PILLS.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => handlePillClick(pill)}
                className="px-3 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 text-xs font-medium text-slate-700 hover:text-indigo-700 shadow-2xs transition-all active:scale-95"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Groq API Key Modal / Drawer */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-left relative">
            <button
              type="button"
              onClick={() => setIsKeyModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-600">
                <Key className="w-5 h-5" />
                <h3 className="font-extrabold text-lg text-slate-900">Groq API Integration</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect your free Groq API key to dynamically synthesize custom, real-world roadmaps for any career using <strong>{groqModel}</strong> at 500+ tokens/sec.
              </p>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Groq API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none text-sm font-mono text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition-all"
                />
                <p className="text-[11px] text-slate-400">
                  Your key is stored locally in your browser and used only to request roadmap curriculums directly.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  Don't have a key? Get one in seconds for free at{" "}
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline inline-flex items-center gap-0.5 text-indigo-700 hover:text-indigo-900"
                  >
                    console.groq.com/keys
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedKey ? (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                  >
                    Remove Key
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsKeyModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    Save & Activate
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
