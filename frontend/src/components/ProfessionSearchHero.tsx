"use client";

import React, { useState } from "react";
import {
  Search,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), experienceLevel);
    }
  };

  const handlePillClick = (profession: string) => {
    setQuery(profession);
    onSearch(profession, experienceLevel);
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl border border-indigo-100/80 bg-white/85 backdrop-blur-xl p-6 sm:p-12 shadow-xl shadow-indigo-100/50 overflow-hidden transition-all",
        className
      )}
    >
      {/* Ambient background decoration */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float-reverse"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-7">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            What do you want to <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">become</span>?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Type <strong className="font-semibold text-slate-900">any profession on earth</strong>—from Game Developer to Neurosurgeon—and get an instant, milestone DAG roadmap with real tools and project challenges.
          </p>
        </div>

        {/* Main Search Bar Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center shadow-lg shadow-indigo-200/50 rounded-2xl bg-white border-2 border-indigo-200/90 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 transition-all p-1.5">
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all shrink-0 active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
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
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
            <span className="text-slate-500 font-semibold mr-1">Starting Point:</span>
            {[
              { id: "beginner", label: "🌱 Beginner (From Zero)" },
              { id: "intermediate", label: "⚡ Upskilling (Have Basics)" },
              { id: "career_switcher", label: "🔄 Career Switcher" },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setExperienceLevel(lvl.id as any)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all",
                  experienceLevel === lvl.id
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                    : "bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300"
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
            Or click a popular profession to explore instantly:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {INSPIRATION_PILLS.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => handlePillClick(pill)}
                className="px-3 py-1 rounded-full bg-white/90 hover:bg-indigo-50 border border-slate-200/90 hover:border-indigo-300 text-xs font-medium text-slate-700 hover:text-indigo-700 shadow-2xs transition-all active:scale-95"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
