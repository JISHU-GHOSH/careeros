"use client";

import React, { useState } from "react";
import {
  Check,
  Zap,
  Clock,
  BookOpen,
  Code2,
  ExternalLink,
  Sparkles,
  Award,
  ChevronRight,
  X,
  FileCode2,
  Terminal,
} from "lucide-react";
import { MilestoneTask } from "@/types";
import { cn } from "@/lib/utils";
import { useCareerSafe } from "@/context/CareerContext";

export interface TaskCardProps {
  task: MilestoneTask;
  onToggle?: (taskId: string) => void;
  onActionClick?: (task: MilestoneTask) => void;
  className?: string;
  isCompact?: boolean;
}

export function TaskCard({
  task,
  onToggle,
  onActionClick,
  className,
  isCompact = false,
}: TaskCardProps) {
  const { toggleTask: contextToggle } = useCareerSafe();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle(task.id);
    } else {
      contextToggle(task.id);
    }
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick(task);
    } else {
      setIsModalOpen(true);
    }
  };

  const isHandsOn = task.type === "HANDS_ON_PROJECT";

  // Proof tag label & icon
  const proofTag = isHandsOn ? {
    label: "🏅 Practical Project",
    badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    icon: Award,
  } : {
    label: "📖 Concept Deep-Dive",
    badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: BookOpen,
  };

  const ProofIcon = proofTag.icon;

  return (
    <>
      <div
        className={cn(
          "group relative rounded-xl border transition-all duration-200 select-none overflow-hidden",
          task.completed
            ? "bg-emerald-950/15 border-emerald-500/30 shadow-xs"
            : "bg-card/70 hover:bg-card border-border/80 hover:border-border shadow-xs hover:shadow-sm",
          className
        )}
      >
        {/* Subtle left border accent indicating completion state */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 transition-colors duration-200",
            task.completed ? "bg-emerald-500" : "bg-primary/20 group-hover:bg-primary/60"
          )}
          aria-hidden="true"
        />

        <div className={cn("p-3.5 sm:p-4 pl-4 sm:pl-5 flex items-start gap-3.5", isCompact && "p-2.5 pl-3.5")}>
          {/* Instant Checkbox Trigger */}
          <button
            type="button"
            role="checkbox"
            aria-checked={task.completed}
            aria-label={`Mark task as ${task.completed ? "incomplete" : "complete"}: ${task.title}`}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggle(e);
              }
            }}
            className={cn(
              "shrink-0 mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
              task.completed
                ? "bg-emerald-500 border-emerald-500 text-white shadow-xs shadow-emerald-500/30 scale-100"
                : "border-border/80 bg-secondary/60 hover:bg-secondary hover:border-primary/60 text-transparent active:scale-90"
            )}
          >
            <Check
              className={cn(
                "w-3.5 h-3.5 stroke-[3] transition-transform duration-150",
                task.completed ? "scale-100" : "scale-0"
              )}
            />
          </button>

          {/* Task Core Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title & XP Reward Chip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4
                className={cn(
                  "text-sm font-semibold tracking-tight transition-all duration-200 line-clamp-2",
                  task.completed
                    ? "line-through text-muted-foreground/75"
                    : "text-foreground group-hover:text-primary transition-colors"
                )}
                title={task.title}
              >
                {task.title}
              </h4>

              {/* XP Reward Chip */}
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border shrink-0 transition-all",
                  task.completed
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/15 text-amber-300 border-amber-500/35 group-hover:bg-amber-500/25"
                )}
                title={`Completing this task awards ${task.xp_reward} Career XP`}
              >
                {task.completed ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>+{task.xp_reward} XP Claimed</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>+{task.xp_reward} XP</span>
                  </>
                )}
              </div>
            </div>

            {/* Tags & Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* Artifact Proof Tag */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border",
                    proofTag.badgeClass
                  )}
                >
                  <ProofIcon className="w-3 h-3" />
                  <span>{proofTag.label}</span>
                </span>

                {/* Time Estimate Badge */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono text-muted-foreground bg-secondary/50 border border-border/50">
                  <Clock className="w-3 h-3 text-muted-foreground/80" />
                  <span>{task.estimated_minutes} min</span>
                </span>
              </div>

              {/* External Guide / Project Action Button */}
              <button
                type="button"
                onClick={handleAction}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border shadow-2xs focus:outline-hidden",
                  isHandsOn
                    ? "bg-secondary hover:bg-secondary/80 text-foreground border-border/70 hover:border-primary/50"
                    : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border-border/60"
                )}
                title={
                  isHandsOn
                    ? "Launch interactive project sandbox and architecture template"
                    : "Open guided technical documentation and architectural reference"
                }
              >
                {isHandsOn ? (
                  <>
                    <Code2 className="w-3.5 h-3.5 text-primary" />
                    <span>Launch Lab</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/70" />
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span>Read Guide</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/70" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Guide / Project Lab Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-card p-6 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border",
                      proofTag.badgeClass
                    )}
                  >
                    <ProofIcon className="w-3 h-3" />
                    {proofTag.label}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    ⏱ {task.estimated_minutes} min • +{task.xp_reward} XP
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground leading-snug">
                  {task.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Practical Project Lab or Guide */}
            <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              {isHandsOn ? (
                <>
                  <p>
                    This hands-on milestone project is designed to build production-grade architectural
                    mastery. Completing this artifact validates your competency at the Senior level.
                  </p>
                  <div className="rounded-xl border border-border/70 bg-secondary/40 p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                      <Terminal className="w-4 h-4 text-primary" />
                      <span>Deliverables & Verification Criteria:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                      <li>Implement production Redis cache-aside client with connection pooling.</li>
                      <li>Incorporate distributed mutex locks or probabilistic early expiration.</li>
                      <li>Benchmark throughput resilience under simulated 10k QPS thundering herd load.</li>
                      <li>Export metrics and submit commit link or benchmark test transcript.</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-secondary/20 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground text-xs">Repository Starter Template</p>
                        <p className="text-[11px] text-muted-foreground font-mono">github.com/careeros/starter-{task.target_skill_id}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-semibold">
                      v1.4.0
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Deep dive into architectural trade-offs, cache invalidation theorems, eviction policies
                    (LRU, LFU, ARC), and latency profiles across distributed memory architectures.
                  </p>
                  <div className="rounded-xl border border-border/70 bg-secondary/40 p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>Key Conceptual Takeaways:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                      <li>Cache stampede and thundering herd mitigations in distributed clusters.</li>
                      <li>Write-around vs Write-back vs Cache-aside consistency guarantees.</li>
                      <li>Sizing Redis memory limits, maxmemory policies, and replication topologies.</li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={handleToggle}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border",
                  task.completed
                    ? "bg-secondary text-muted-foreground border-border/60 hover:text-foreground"
                    : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25"
                )}
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{task.completed ? "Mark as Incomplete" : "Mark Task Complete (+XP)"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;
