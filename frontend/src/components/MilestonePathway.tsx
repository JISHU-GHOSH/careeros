"use client";

import React, { useState, useMemo } from "react";
import {
  Compass,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  Clock,
  Award,
  RefreshCw,
  Flame,
  Check,
  AlertCircle,
} from "lucide-react";
import { MilestonePathway as MilestonePathwayType, MilestoneTask } from "@/types";
import { cn } from "@/lib/utils";
import { useCareerSafe } from "@/context/CareerContext";
import { TaskCard } from "./TaskCard";
import { MentorCard } from "./MentorCard";

export interface MilestonePathwayProps {
  pathways?: MilestonePathwayType[];
  activeMilestoneIndex?: number;
  onSelectMilestone?: (index: number) => void;
  onToggleTask?: (taskId: string) => void;
  className?: string;
}

export function MilestonePathway({
  pathways: propPathways,
  activeMilestoneIndex: propActiveIndex,
  onSelectMilestone,
  onToggleTask,
  className,
}: MilestonePathwayProps) {
  const {
    pathways: contextPathways,
    toggleTask: contextToggle,
    isSyncing,
    lastSyncedAt,
    targetRoleId,
  } = useCareerSafe();

  const activePathways = propPathways || contextPathways || [];

  // Local active milestone index state (1-indexed matching milestone_index)
  const [internalActiveIndex, setInternalActiveIndex] = useState<number>(1);
  const activeIndex = propActiveIndex !== undefined ? propActiveIndex : internalActiveIndex;

  const handleSelectMilestone = (idx: number) => {
    if (onSelectMilestone) {
      onSelectMilestone(idx);
    } else {
      setInternalActiveIndex(idx);
    }
  };

  // Find currently active milestone pathway
  const currentPathway = useMemo(() => {
    if (activePathways.length === 0) return null;
    return (
      activePathways.find((p) => p.milestone_index === activeIndex) ||
      activePathways[0]
    );
  }, [activePathways, activeIndex]);

  // Aggregate completion statistics for the active milestone
  const {
    totalTasks,
    completedTasks,
    completionPercentage,
    totalXpReward,
    earnedXpReward,
    isAllCompleted,
  } = useMemo(() => {
    if (!currentPathway) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        completionPercentage: 0,
        totalXpReward: 0,
        earnedXpReward: 0,
        isAllCompleted: false,
      };
    }

    const tasks = currentPathway.tasks || [];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalXp = tasks.reduce((acc, t) => acc + (t.xp_reward || 0), 0);
    const earnedXp = tasks
      .filter((t) => t.completed)
      .reduce((acc, t) => acc + (t.xp_reward || 0), 0);

    return {
      totalTasks: total,
      completedTasks: completed,
      completionPercentage: pct,
      totalXpReward: totalXp,
      earnedXpReward: earnedXp,
      isAllCompleted: total > 0 && completed === total,
    };
  }, [currentPathway]);

  const handleTaskToggle = (taskId: string) => {
    if (onToggleTask) {
      onToggleTask(taskId);
    } else {
      contextToggle(taskId);
    }
  };

  if (!currentPathway) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-3">
        <Compass className="w-8 h-8 text-muted-foreground mx-auto" />
        <h3 className="font-semibold text-foreground">No Milestone Pathways Generated</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Complete skill gap diagnostics to generate topologically sequenced milestones.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 md:p-7 shadow-sm space-y-6 relative overflow-hidden",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute left-1/3 top-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Top Header Row: Roadmap Navigation & Sync Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
              Milestone Acceleration Pathway
            </h2>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Topologically sequenced weekly roadmap calibrated to accelerate senior role readiness.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all",
              isSyncing
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-secondary/60 text-muted-foreground border-border/60"
            )}
            title={
              isSyncing
                ? "Optimistic task checkoff syncing with backend intelligence engine..."
                : lastSyncedAt
                ? `Last synchronized: ${lastSyncedAt.toLocaleTimeString()}`
                : "Engine ready"
            }
          >
            <RefreshCw
              className={cn("w-3 h-3 text-primary", isSyncing && "animate-spin text-primary")}
            />
            <span>{isSyncing ? "Syncing..." : "0ms Optimistic Engine"}</span>
          </div>
        </div>
      </div>

      {/* Sequenced Weekly Milestone Step Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Weekly Roadmap Timeline:</span>
          <span className="font-mono text-[11px]">
            Milestone {currentPathway.milestone_index} of {activePathways.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {activePathways.map((pathway) => {
            const isSelected = pathway.milestone_index === currentPathway.milestone_index;
            const pTasks = pathway.tasks || [];
            const pCompleted = pTasks.filter((t) => t.completed).length;
            const pTotal = pTasks.length;
            const pAllDone = pTotal > 0 && pCompleted === pTotal;

            return (
              <button
                key={pathway.milestone_index}
                type="button"
                onClick={() => handleSelectMilestone(pathway.milestone_index)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all relative overflow-hidden select-none focus:outline-none",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-xs"
                    : "border-border/70 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {/* Milestone Progress accent line */}
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-1",
                    pAllDone
                      ? "bg-emerald-500"
                      : isSelected
                      ? "bg-primary"
                      : "bg-border/60"
                  )}
                />

                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
                    Week {pathway.milestone_index}
                  </span>
                  {pAllDone ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                      <Check className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {pCompleted}/{pTotal} Tasks
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-foreground truncate">
                  {pathway.title.split(": ")[1] || pathway.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Milestone Card Banner */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary text-primary-foreground">
                Active Week {currentPathway.milestone_index}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-secondary border border-border/60 text-muted-foreground uppercase">
                Focus: {currentPathway.focus_skill_id}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {currentPathway.title}
            </h3>
          </div>

          {/* XP Reward Overview */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card border border-border/80 shadow-xs shrink-0">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-foreground font-mono">
                {earnedXpReward} / {totalXpReward} XP
              </span>
              <span className="text-[9px] uppercase font-mono text-muted-foreground">
                Milestone Yield
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Completion Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">
              {completedTasks} of {totalTasks} Tasks Completed
            </span>
            <span className="font-mono font-bold text-primary">
              {completionPercentage}%
            </span>
          </div>

          <div
            className="w-full h-2.5 bg-secondary/80 rounded-full overflow-hidden border border-border/40"
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Milestone progress: ${completionPercentage}% completed`}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isAllCompleted
                  ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                  : "bg-gradient-to-r from-primary to-indigo-500"
              )}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Completed Milestone Celebration Banner */}
        {isAllCompleted && (
          <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 flex items-center justify-between gap-3 text-xs text-emerald-300 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">
                Milestone {currentPathway.milestone_index} Complete! +{totalXpReward} XP Claimed • Readiness Recalibrated
              </span>
            </div>
            {currentPathway.milestone_index < activePathways.length && (
              <button
                type="button"
                onClick={() => handleSelectMilestone(currentPathway.milestone_index + 1)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shrink-0"
              >
                <span>Next Week</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Task Checklist Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Layers className="w-4 h-4 text-primary" />
            <span>Interactive Action Items ({currentPathway.tasks.length}):</span>
          </div>
          <span className="text-muted-foreground text-[11px]">
            Check off tasks to trigger instant XP & readiness updates
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentPathway.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleTaskToggle}
            />
          ))}
        </div>
      </div>

      {/* Recommended Peer Mentor Card Section */}
      {currentPathway.recommended_mentor && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Award className="w-4 h-4 text-primary" />
              <span>Recommended Peer Mentor for Week {currentPathway.milestone_index}:</span>
            </div>
          </div>

          <MentorCard
            mentor={currentPathway.recommended_mentor}
            focusSkill={currentPathway.focus_skill_id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            matchPercentage={94}
          />
        </div>
      )}
    </div>
  );
}

export default MilestonePathway;
