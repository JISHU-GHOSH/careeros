"use client";

import React, { useState, useMemo } from "react";
import {
  Compass,
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  HeartHandshake,
  Flame,
  ChevronRight,
  Smile,
} from "lucide-react";
import { CareerProvider, useCareerSafe } from "@/context/CareerContext";
import {
  Header,
  TrajectoryMap,
  SkillMatrix,
  MilestonePathway,
  OnboardingModal,
} from "@/components";
import { cn } from "@/lib/utils";

function DashboardView() {
  const {
    currentRoleId,
    targetRoleId,
    roles,
    xp,
    level,
    nextLevelXp,
    streak,
    stealthMode,
    toggleStealthMode,
    setCurrentRoleId,
    setTargetRoleId,
    diagnosticReport,
    readinessScore,
    pathways,
    recalibrateDiagnostics,
    isSyncing,
  } = useCareerSafe();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Look up human-readable role titles
  const currentRole = useMemo(() => {
    return (
      roles.find((r) => r.id === currentRoleId) ||
      roles.find((r) => r.id === "mid-fullstack") ||
      roles[1]
    );
  }, [roles, currentRoleId]);

  const targetRole = useMemo(() => {
    return (
      roles.find((r) => r.id === targetRoleId) ||
      roles.find((r) => r.id === "senior-fullstack") ||
      roles[2]
    );
  }, [roles, targetRoleId]);

  // Aggregate roadmap task completion across all milestones
  const allTasks = useMemo(() => {
    return (pathways || []).flatMap((p) => p.tasks || []);
  }, [pathways]);

  const completedTasksCount = useMemo(() => {
    return allTasks.filter((t) => t.completed).length;
  }, [allTasks]);

  const missingGapsCount = diagnosticReport?.missing_gaps?.length || 2;
  const needsPolishCount = diagnosticReport?.needs_polish?.length || 3;
  const estimatedTimeline = diagnosticReport?.estimated_timeline_months || 4;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* 1. Global Navigation Header */}
      <Header
        currentRoleTitle={currentRole?.title || "Mid-Level Full-Stack"}
        targetRoleTitle={targetRole?.title || "Senior Full-Stack Engineer"}
        xp={xp}
        level={level}
        nextLevelXp={nextLevelXp}
        stealthMode={stealthMode}
        onToggleStealthMode={toggleStealthMode}
        availableRoles={roles.map((r) => ({ id: r.id, title: r.title }))}
        onSelectTargetRole={setTargetRoleId}
        userName="Alex Chen"
        userEmail="alex.chen@example.com"
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* 2. Inspiring, Welcoming Hero Banner */}
        <div className="relative rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/30 p-6 sm:p-9 shadow-sm shadow-indigo-100/50 overflow-hidden">
          {/* Soft ambient background orbs */}
          <div
            className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3.5 max-w-2xl">
              {/* Friendly pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200/80 bg-white/80 shadow-xs text-indigo-700 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>Your Career GPS is Active</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Welcome back, Alex! 👋
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
                  You are making great progress towards becoming a{" "}
                  <span className="font-semibold text-indigo-600 px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                    {targetRole?.title}
                  </span>
                  . Here is your customized growth plan for this week.
                </p>
              </div>

              {/* Trajectory Step Pills */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 shadow-2xs font-medium">
                  <span className="text-slate-400">Current:</span>
                  <span>{currentRole?.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-xs">
                  <span>Target:</span>
                  <span>{targetRole?.title}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Est. ~{estimatedTimeline} Months to Goal</span>
                </div>
              </div>
            </div>

            {/* Inspiring Action Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className={cn(
                  "px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all duration-200",
                  "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:shadow-indigo-200 hover:-translate-y-0.5 text-white",
                  "flex items-center justify-center gap-2.5 group active:scale-98"
                )}
              >
                <Sliders className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
                <span>Personalize My Plan (60s)</span>
              </button>

              <button
                type="button"
                onClick={() => recalibrateDiagnostics()}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isSyncing ? "Updating..." : "Refresh Skill Matches"}</span>
              </button>
            </div>
          </div>

          {/* Encouraging Milestone Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-6 mt-6 border-t border-slate-200/60">
            {/* Card 1: Readiness */}
            <div className="p-4 rounded-2xl bg-white/90 border border-indigo-100/80 shadow-xs space-y-1 hover:border-indigo-200 transition-colors">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center justify-between">
                <span>Role Match</span>
                <Target className="w-4 h-4 text-indigo-500" />
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
                {readinessScore}%
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                🎯 Over half-way to Senior ready!
              </p>
            </div>

            {/* Card 2: Priority Skills */}
            <div className="p-4 rounded-2xl bg-white/90 border border-rose-100/80 shadow-xs space-y-1 hover:border-rose-200 transition-colors">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center justify-between">
                <span>Skills to Unlock</span>
                <Flame className="w-4 h-4 text-rose-500" />
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-600">
                {missingGapsCount} Key Gaps
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                🚀 Just 2 high-impact skills left
              </p>
            </div>

            {/* Card 3: Completed Steps */}
            <div className="p-4 rounded-2xl bg-white/90 border border-emerald-100/80 shadow-xs space-y-1 hover:border-emerald-200 transition-colors">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center justify-between">
                <span>Tasks Done</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {completedTasksCount} / {allTasks.length || 2}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                ⚡ Instant XP on completion
              </p>
            </div>

            {/* Card 4: Streak & XP */}
            <div className="p-4 rounded-2xl bg-white/90 border border-amber-100/80 shadow-xs space-y-1 hover:border-amber-200 transition-colors">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center justify-between">
                <span>Momentum</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                {xp.toLocaleString()} XP
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                🔥 {streak} Day Streak • Level {level}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Trajectory Map Component (Interactive Career Roadmap) */}
        <section aria-labelledby="trajectory-section-title">
          <TrajectoryMap
            roles={roles}
            activeRoleId={currentRoleId}
            targetRoleId={targetRoleId}
            readinessPercentage={readinessScore}
            estimatedTimelineMonths={estimatedTimeline}
            onSelectActiveRole={setCurrentRoleId}
            onSelectTargetRole={setTargetRoleId}
            showReadinessGauge={true}
          />
        </section>

        {/* 4. Two-Column Layout: Skill Checklist + Active Weekly Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Skill Matrix (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <SkillMatrix
              report={diagnosticReport}
              onRecalibrate={() => setIsOnboardingOpen(true)}
            />
          </div>

          {/* Right Column: Milestone Pathway & Action Checklist (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <MilestonePathway
              pathways={pathways}
              targetRoleTitle={targetRole?.title}
              onCompleteMilestone={() => {
                recalibrateDiagnostics();
              }}
            />
          </div>
        </div>

        {/* 5. Encouraging Community & Privacy Footer Banner */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
              🛡️
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                100% Private & Stealth-Protected
              </p>
              <p className="text-slate-500">
                Your current employer cannot see your learning progress or career trajectory exploration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
            >
              Update Career Goal
            </button>
            <span className="text-slate-300">•</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
              Stealth Mode Active
            </span>
          </div>
        </div>
      </main>

      {/* 6. 60-Second Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialCurrentRoleId={currentRoleId}
        initialTargetRoleId={targetRoleId}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <CareerProvider>
      <DashboardView />
    </CareerProvider>
  );
}
