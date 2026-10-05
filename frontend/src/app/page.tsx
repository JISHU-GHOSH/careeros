"use client";

import React, { useState, useMemo } from "react";
import {
  Compass,
  Sparkles,
  Target,
  Layers,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  FileText,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
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
        {/* 2. Welcome & Trajectory Acceleration Hero Banner */}
        <div className="relative rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 sm:p-8 shadow-sm overflow-hidden">
          {/* Subtle background ambient light */}
          <div
            className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Autonomous Trajectory Engine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Welcome back, Alex Chen
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Navigating from{" "}
                  <strong className="text-foreground">{currentRole?.title}</strong> to{" "}
                  <strong className="text-primary">{targetRole?.title}</strong> with confidence-weighted competency diagnostics.
                </p>
              </div>

              {/* Active Trajectory Path Strip */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/80 border border-border/80">
                  <span className="text-muted-foreground">Current:</span>
                  <span className="font-semibold text-foreground">{currentRole?.title}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/30 text-primary font-semibold">
                  <span>Target:</span>
                  <span>{targetRole?.title}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-secondary/60 border border-border/60 text-muted-foreground text-[11px] font-mono">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>~{estimatedTimeline} Months Window</span>
                </div>
              </div>
            </div>

            {/* Quick Action: 60-Second Onboarding & Recalibration Trigger */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className={cn(
                  "px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all duration-200",
                  "bg-gradient-to-r from-primary via-indigo-600 to-primary hover:opacity-95 text-primary-foreground",
                  "flex items-center justify-center gap-2.5 group active:scale-95 ring-1 ring-primary/40"
                )}
              >
                <Sliders className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
                <span>60-Sec Onboarding Wizard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  recalibrateDiagnostics();
                }}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary/80 hover:bg-secondary text-foreground border border-border/80 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Recalibrate Diagnostics</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-border/40">
            {/* Readiness */}
            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/60 space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center justify-between">
                <span>Readiness</span>
                <Target className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-foreground">
                {readinessScore}%
              </p>
              <p className="text-[10px] text-muted-foreground">
                Weighted against target requirements
              </p>
            </div>

            {/* Missing Gaps */}
            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/60 space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center justify-between">
                <span>Priority Gaps</span>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-rose-400">
                {missingGapsCount} Core
              </p>
              <p className="text-[10px] text-muted-foreground">
                +{needsPolishCount} competencies needing polish
              </p>
            </div>

            {/* Milestone Progress */}
            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/60 space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center justify-between">
                <span>Milestone Tasks</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">
                {completedTasksCount} / {allTasks.length} Done
              </p>
              <p className="text-[10px] text-muted-foreground">
                0ms optimistic XP checkoff
              </p>
            </div>

            {/* Trajectory Velocity */}
            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/60 space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center justify-between">
                <span>Experience & Streak</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-amber-400">
                {xp.toLocaleString()} XP
              </p>
              <p className="text-[10px] text-muted-foreground">
                Level {level} • {streak} Day Streak
              </p>
            </div>
          </div>
        </div>

        {/* 3. Trajectory Map Component (NetworkX Live Graph Visualization) */}
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

        {/* 4. Two-Column Intelligence Grid: Skill Matrix + Milestone Acceleration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Skill Matrix (7 Cols on desktop) */}
          <section
            className="lg:col-span-7 space-y-6"
            aria-labelledby="skill-matrix-section-title"
          >
            <SkillMatrix
              report={diagnosticReport}
              onRecalibrate={recalibrateDiagnostics}
            />
          </section>

          {/* Right Column: Milestone Pathway & Peer Mentor (5 Cols on desktop) */}
          <section
            className="lg:col-span-5 space-y-6"
            aria-labelledby="milestone-pathway-section-title"
          >
            <MilestonePathway
              pathways={pathways}
            />
          </section>
        </div>
      </main>

      {/* 5. Footer */}
      <footer className="mt-16 border-t border-border/60 bg-secondary/20 py-8 px-4 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">CareerOS Platform</span>
            <span>•</span>
            <span>Graph-Based Engineering Trajectory & Skill Diagnostics</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              0ms Optimistic Engine Active
            </span>
            <span>•</span>
            <span className="font-mono">
              Privacy: {stealthMode ? "Stealth Mode Protected" : "Public"}
            </span>
          </div>
        </div>
      </footer>

      {/* 6. Progressive 60-Second Onboarding & Resume Upload Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => {
          setIsOnboardingOpen(false);
        }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <CareerProvider
      initialCurrentRoleId="mid-fullstack"
      initialTargetRoleId="senior-fullstack"
      initialXp={1450}
      initialStreak={5}
      initialStealthMode={true}
    >
      <DashboardView />
    </CareerProvider>
  );
}
