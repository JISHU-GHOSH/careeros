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
  BookOpen,
  Code2,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronUp,
  Flame,
  Check,
  UserCheck,
  ExternalLink,
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

// Friendly explanations for technical skills in plain English
const SKILL_EXPLANATIONS: Record<
  string,
  { why: string; whatYoullDo: string }
> = {
  "distributed-caching": {
    why: "High-traffic websites use Redis caching so databases don't slow down under peak load.",
    whatYoullDo: "Build a high-speed Redis cache layer for an API to handle thousands of requests per second.",
  },
  "system-design": {
    why: "Senior engineers know how to design reliable systems that don't crash when traffic surges.",
    whatYoullDo: "Design a fault-tolerant microservice architecture with load balancing and failovers.",
  },
  "sql-optimization": {
    why: "Fast database queries make apps feel instant and save thousands in cloud hosting costs.",
    whatYoullDo: "Use indexes and query analysis (EXPLAIN ANALYZE) to speed up slow queries by 5x.",
  },
  "docker-containers": {
    why: "Containers make code run identically on your laptop, your team's machines, and the cloud.",
    whatYoullDo: "Package backend and frontend services into lightweight production Docker images.",
  },
  "ci-cd-pipelines": {
    why: "Automated pipelines test and deploy your code automatically whenever you push to GitHub.",
    whatYoullDo: "Create an automated GitHub Actions pipeline with tests and preview deployments.",
  },
};

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
    toggleTask,
    recalibrateDiagnostics,
    isSyncing,
  } = useCareerSafe();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [showValidatedSkills, setShowValidatedSkills] = useState<boolean>(false);
  const [showAdvancedMode, setShowAdvancedMode] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

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

  const missingGaps = diagnosticReport?.missing_gaps || [];
  const needsPolish = diagnosticReport?.needs_polish || [];
  const validatedSkills = diagnosticReport?.validated_skills || [];
  const estimatedTimeline = diagnosticReport?.estimated_timeline_months || 4;

  // Active weekly milestone tasks
  const activeMilestone = pathways?.[0] || null;
  const currentTasks = activeMilestone?.tasks || [];

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. Global Clean Navigation Header */}
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

      {/* Main Simplified 3-Step Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        
        {/* Simple Page Header with Overall Progress */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Your Simple 3-Step Career Plan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Road to {targetRole?.title} 🚀
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                You are currently a <span className="font-semibold text-slate-800">{currentRole?.title}</span>. Here is the easiest path to get promoted.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Goal or Experience</span>
            </button>
          </div>

          {/* Simple Clean Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Overall Readiness:</span>
                <span className="text-indigo-600 font-bold">{readinessScore}%</span>
              </span>
              <span className="text-slate-500">
                {missingGaps.length === 0
                  ? "🎉 You have all required skills!"
                  : `Only ${missingGaps.length} skill${missingGaps.length > 1 ? "s" : ""} left to learn • ~${estimatedTimeline} months`}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, Math.max(10, readinessScore))}%` }}
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: Your Career Goal                                                  */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                1
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Where You Are ➔ Where You Are Going
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Your current level and your next milestone role.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
            >
              Switch Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Role Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Starting Point (Current Role)
              </span>
              <p className="text-base sm:text-lg font-bold text-slate-800">
                {currentRole?.title}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {currentRole?.description || "You have mastered the core frontend and backend development fundamentals."}
              </p>
            </div>

            {/* Target Role Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 border border-indigo-200/80 space-y-2 relative overflow-hidden">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center justify-between">
                <span>Target Promotion</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-semibold">
                  Goal
                </span>
              </span>
              <p className="text-base sm:text-lg font-bold text-indigo-950">
                {targetRole?.title}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {targetRole?.description || "Responsible for architecture, scalable distributed systems, and technical leadership."}
              </p>
            </div>
          </div>

          {/* Quick Stat Pill */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              You already meet <strong className="font-bold">{validatedSkills.length} of {missingGaps.length + needsPolish.length + validatedSkills.length}</strong> requirements for this role.
            </span>
            <span className="font-semibold text-slate-600 hidden sm:inline">
              Est. ~{estimatedTimeline} months to promotion
            </span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 2: The Missing Skills                                               */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
              2
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                What You Need to Learn
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Here are the specific skills separating you from a {targetRole?.title}.
              </p>
            </div>
          </div>

          {/* Missing Skills Cards (Plain English) */}
          <div className="space-y-4">
            {missingGaps.map((skill) => {
              const explanation = SKILL_EXPLANATIONS[skill.id] || {
                why: "Essential for building production-grade software at high scale.",
                whatYoullDo: `Master ${skill.name} through hands-on practice.`,
              };

              return (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl border-2 border-rose-100 bg-rose-50/30 hover:bg-rose-50/50 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <h3 className="font-bold text-base text-slate-900">
                        {skill.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-semibold">
                        Must-Learn
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Category: {skill.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 font-semibold">Why this matters: </strong>
                    {explanation.why}
                  </p>

                  <div className="p-3 rounded-xl bg-white border border-rose-200/70 text-xs text-slate-800 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      <strong className="font-semibold">Goal: </strong>
                      {explanation.whatYoullDo}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Skills Needing Polish (if any) */}
            {needsPolish.map((skill) => (
              <div
                key={skill.id}
                className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="font-bold text-base text-slate-900">
                    {skill.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-semibold">
                    Needs Polish
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  You already know the basics! Level up to architectural depth by designing higher-throughput solutions.
                </p>
              </div>
            ))}
          </div>

          {/* Collapsible Section for Already Validated Skills */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowValidatedSkills(!showValidatedSkills)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors"
            >
              <span className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>See the {validatedSkills.length} skills you already have</span>
              </span>
              {showValidatedSkills ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showValidatedSkills && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                {validatedSkills.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 text-xs text-slate-700 py-1"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">{s.name}</span>
                    <span className="text-[10px] text-slate-400">({s.category})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 3: What to Do This Week                                              */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                3
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Your Plan for This Week
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Focus on one skill at a time. Complete these 3 simple tasks to make progress.
                </p>
              </div>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{streak} Day Streak • {xp} XP</span>
            </div>
          </div>

          {/* Active Milestone Title */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                Current Focus
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {activeMilestone?.title || "Distributed Caching & High-Throughput Resilience"}
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-white px-3 py-1 rounded-lg border border-indigo-200/60 shadow-2xs self-start sm:self-auto">
              Week 1 of {pathways?.length || 4}
            </span>
          </div>

          {/* Simple Interactive Task Checklist */}
          <div className="space-y-3">
            {currentTasks.map((task, index) => {
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none",
                    task.completed
                      ? "bg-slate-50/80 border-slate-200 text-slate-400"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs text-slate-800"
                  )}
                >
                  {/* Big Friendly Checkbox */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors border",
                      task.completed
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 bg-white hover:border-indigo-500"
                    )}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          task.completed && "line-through text-slate-400"
                        )}
                      >
                        {task.title}
                      </p>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200/80 shrink-0">
                        +{task.xp_reward || 100} XP
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>~{task.estimated_minutes || 30} mins</span>
                      </span>
                      <span>•</span>
                      <span className="text-indigo-600 font-medium">
                        {task.type === "HANDS_ON_PROJECT"
                          ? "🛠️ Practical Mini-Project"
                          : "📖 Guided Reading"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Friendly Mentor Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-purple-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs shrink-0">
                MV
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">Marcus Vance</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    Peer Mentor
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Staff Systems Engineer at Cloudflare • 94% Match
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Available to review your caching project or share interview tips.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setBookingSuccess(true);
                setTimeout(() => setBookingSuccess(false), 4000);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all shrink-0 active:scale-95"
            >
              {bookingSuccess ? "✓ Booked for Thursday!" : "Book Free 15-Min Chat"}
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* Optional Advanced View Toggle (For Power Users)                          */}
        {/* ========================================================================= */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => setShowAdvancedMode(!showAdvancedMode)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {showAdvancedMode
                ? "Hide Advanced Diagnostics & Roadmap"
                : "Looking for details? Show Full Skill Matrix & Graph"}
            </span>
          </button>
        </div>

        {/* Advanced Section (Only shown when requested) */}
        {showAdvancedMode && (
          <div className="space-y-8 pt-4 border-t border-slate-200">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Advanced Career Analytics & Graph Explorer
              </h3>
              <p className="text-xs text-slate-500">
                Detailed role ontology, market demand metrics, and complete topological milestones.
              </p>
            </div>

            {/* Trajectory Map */}
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

            {/* Full Skill Matrix & Pathway */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 w-full">
                <SkillMatrix
                  report={diagnosticReport}
                  onRecalibrate={() => setIsOnboardingOpen(true)}
                />
              </div>

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
          </div>
        )}

        {/* Friendly Privacy Notice */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>100% Private:</strong> Your current employer cannot see your learning progress or career exploration.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-100">
            Stealth Active
          </span>
        </div>
      </main>

      {/* 60-Second Role Calibration Wizard Modal */}
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

