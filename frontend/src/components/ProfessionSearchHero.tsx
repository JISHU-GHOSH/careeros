"use client";

import React, { useState } from "react";
import { Search, Sparkles, Compass, ArrowRight, Sliders, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfessionSearchHeroProps {
  onSearch: (profession: string, experienceLevel: "beginner" | "intermediate" | "career_switcher") => void;
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
  "Robotics Engineer",
  "UI/UX Product Designer",
  "DevOps Specialist",
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
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Universal Career Roadmap Generator</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            What do you want to become?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Type <strong className="font-semibold text-slate-800">any profession on earth</strong>—from Game Developer to Commercial Pilot—and get an instant, connected roadmap with real projects and tools.
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
              placeholder="e.g. Game Developer, Commercial Pilot, AI Engineer, Ethical Hacker..."
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
    </div>
  );
}
