"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Sparkles,
  Search,
  ArrowRight,
  Shield,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  Sliders,
  RefreshCw,
} from "lucide-react";
import {
  ProfessionSearchHero,
  RoadmapFlowTree,
  CareerBackgroundVisuals,
} from "@/components";
import { RoadmapResponse } from "@/types";
import { api } from "@/lib/api";
import { DEFAULT_GAME_DEV_ROADMAP } from "@/lib/defaultRoadmap";

export default function HomePage() {
  const [currentRoadmap, setCurrentRoadmap] = useState<RoadmapResponse>(DEFAULT_GAME_DEV_ROADMAP);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("Game Developer");

  const handleSearch = async (
    profession: string,
    experienceLevel: "beginner" | "intermediate" | "career_switcher"
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      setSearchQuery(profession);
      const data = await api.generateRoadmap({
        profession,
        experience_level: experienceLevel,
      });
      setCurrentRoadmap(data);
    } catch (err: any) {
      console.error("Failed to generate roadmap:", err);
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/70 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Background Career Drawings, Logos & Blueprint Mesh */}
      <CareerBackgroundVisuals />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-slate-900">CareerOS</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                  ROADMAPS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Universal Career Navigation</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-500 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Free & Open-Access</span>
            </span>
            <a
              href="#search-hero"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-xs"
            >
              Search Any Career
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Search Hero Section */}
        <section id="search-hero">
          <ProfessionSearchHero
            onSearch={handleSearch}
            isLoading={isLoading}
            initialQuery={searchQuery}
          />
        </section>

        {/* Error Feedback */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Loading Synthesizer State */}
        {isLoading && (
          <div className="rounded-3xl border border-indigo-200 bg-white/90 backdrop-blur-md p-8 sm:p-12 shadow-xl shadow-indigo-100/50 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: "3s" }} />
              <div className="absolute -inset-1 rounded-2xl bg-indigo-400/30 blur-md animate-pulse -z-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Architecting Career Curriculum...
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Synthesizing authentic 5-stage milestones, core toolchains, and flagship capstones for{" "}
                <strong className="text-indigo-600 font-semibold">{searchQuery || "your profession"}</strong>.
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-2">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Using built-in Groq AI engine • ~2-4s response
              </p>
            </div>
          </div>
        )}

        {/* Loaded Roadmap Tree View */}
        {currentRoadmap && (
          <section className="transition-opacity duration-300">
            <RoadmapFlowTree roadmap={currentRoadmap} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/90 bg-white/80 backdrop-blur-md py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            CareerOS — The Universal Profession Roadmap Generator
          </p>
          <p>
            Generate step-by-step career path trees for software engineering, aviation, healthcare, trades, creative arts, and finance.
          </p>
        </div>
      </footer>
    </div>
  );
}
