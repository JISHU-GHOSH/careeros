"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Flame,
  Layers,
  Sparkles,
  Code2,
  ShieldCheck,
  ExternalLink,
  Info,
} from "lucide-react";
import { Skill, SkillDepth } from "@/types";
import { cn } from "@/lib/utils";

export type SkillStatus =
  | "missing"
  | "missing_gap"
  | "gaps"
  | "needs_polish"
  | "polish"
  | "validated";

export interface SkillItemProps {
  skill: Skill;
  status: SkillStatus;
  currentDepth?: SkillDepth | number;
  requiredDepth?: SkillDepth | number;
  confidenceScore?: number;
  verificationSource?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onSelectAction?: (action: string, skill: Skill) => void;
  className?: string;
}

export function normalizeSkillStatus(
  status: SkillStatus
): "missing" | "needs_polish" | "validated" {
  if (status === "missing" || status === "missing_gap" || status === "gaps") {
    return "missing";
  }
  if (status === "needs_polish" || status === "polish") {
    return "needs_polish";
  }
  return "validated";
}

export function getDepthLabel(level: number): string {
  switch (level) {
    case 1:
      return "Conceptual";
    case 2:
      return "Applied";
    case 3:
      return "Architectural";
    default:
      return level > 3 ? "Architectural" : "Unassessed";
  }
}

export function getDepthDescription(level: number): string {
  switch (level) {
    case 1:
      return "Understands theoretical principles, design paradigms, and terminology.";
    case 2:
      return "Builds, debugs, and integrates production features independently.";
    case 3:
      return "Architects high-scale resilient systems, evaluates trade-offs, and sets standards.";
    default:
      return "No validated competency recorded for this role requirement.";
  }
}

export function SkillItem({
  skill,
  status: rawStatus,
  currentDepth: propCurrentDepth,
  requiredDepth: propRequiredDepth,
  confidenceScore,
  verificationSource,
  expanded: controlledExpanded,
  onToggleExpand,
  onSelectAction,
  className,
}: SkillItemProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const status = normalizeSkillStatus(rawStatus);

  // Default depth calibrations based on status if not passed explicitly
  const requiredDepth = propRequiredDepth ?? (skill.category === "System Architecture" ? 3 : 2);
  const currentDepth =
    propCurrentDepth !== undefined
      ? propCurrentDepth
      : status === "validated"
      ? requiredDepth
      : status === "needs_polish"
      ? Math.max(1, requiredDepth - 1)
      : 0;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const statusConfig = {
    missing: {
      label: "Missing Gap",
      badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      border: "border-rose-500/30 hover:border-rose-500/60 focus-within:border-rose-500/70",
      cardBg: "bg-card/80 hover:bg-card",
      accent: "text-rose-400",
      dotActive: "bg-rose-500",
      dotTarget: "border-2 border-rose-400/80 bg-rose-500/20 animate-pulse",
      icon: AlertCircle,
      description: "Critical competency missing from active profile. Prioritize in milestone pathway.",
    },
    needs_polish: {
      label: "Needs Polish",
      badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      border: "border-amber-500/30 hover:border-amber-500/60 focus-within:border-amber-500/70",
      cardBg: "bg-card/80 hover:bg-card",
      accent: "text-amber-400",
      dotActive: "bg-amber-500",
      dotTarget: "border-2 border-amber-400/80 bg-amber-500/20",
      icon: AlertTriangle,
      description: "Applied foundation established. Requires architectural polish or project artifacts.",
    },
    validated: {
      label: "Validated",
      badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      border: "border-emerald-500/30 hover:border-emerald-500/60 focus-within:border-emerald-500/70",
      cardBg: "bg-card/80 hover:bg-card",
      accent: "text-emerald-400",
      dotActive: "bg-emerald-500",
      dotTarget: "border-2 border-emerald-400/80 bg-emerald-500/20",
      icon: CheckCircle2,
      description: "Validated at target depth and confidence threshold required for senior transition.",
    },
  }[status];

  const StatusIcon = statusConfig.icon;
  const isHighDemand = skill.market_demand_percent >= 85;

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200 overflow-hidden shadow-xs",
        statusConfig.border,
        statusConfig.cardBg,
        isExpanded && "ring-1 ring-primary/40 shadow-sm",
        className
      )}
    >
      {/* Primary Row / Card Header */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none focus:outline-none"
      >
        {/* Left: Status Icon, Title, and Category */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={cn(
              "p-2 rounded-lg shrink-0 mt-0.5 sm:mt-0 border",
              statusConfig.badge
            )}
            title={`Status: ${statusConfig.label}`}
          >
            <StatusIcon className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-sm sm:text-base text-foreground tracking-tight truncate">
                {skill.name}
              </h4>

              {/* Status Badge */}
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border shrink-0",
                  statusConfig.badge
                )}
              >
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Layers className="w-3 h-3 shrink-0 text-muted-foreground/70" />
              <span>{skill.category}</span>
            </p>
          </div>
        </div>

        {/* Right: Depth Indicator (1-3 dots), Market Demand, Expand Trigger */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
          {/* Depth Indicator (1-3 dots) */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/60 border border-border/50"
            title={`Current Depth: Level ${currentDepth}/3 (${getDepthLabel(
              currentDepth
            )}) • Target Requirement: Level ${requiredDepth}/3 (${getDepthLabel(
              requiredDepth
            )})`}
            aria-label={`Depth: Level ${currentDepth} of 3, target Level ${requiredDepth}`}
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hidden md:inline">
              Depth
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((lvl) => {
                const isAcquired = currentDepth >= lvl;
                const isRequired = requiredDepth >= lvl;

                return (
                  <span
                    key={lvl}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all duration-300",
                      isAcquired
                        ? statusConfig.dotActive
                        : isRequired
                        ? statusConfig.dotTarget
                        : "bg-muted-foreground/20 border border-border/40"
                    )}
                    title={`Level ${lvl}: ${getDepthLabel(lvl)} ${
                      isAcquired
                        ? "(Achieved)"
                        : isRequired
                        ? "(Required for Target Role)"
                        : "(Optional)"
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[11px] font-mono font-medium text-foreground ml-0.5">
              L{currentDepth}/{requiredDepth}
            </span>
          </div>

          {/* Market Demand Percentage */}
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border",
              isHighDemand
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-secondary/60 text-foreground border-border/50"
            )}
            title={`Market Demand: ${skill.market_demand_percent}% of relevant engineering roles require this competency.`}
          >
            <Flame
              className={cn(
                "w-3.5 h-3.5 shrink-0",
                isHighDemand ? "text-amber-400 animate-pulse" : "text-primary"
              )}
            />
            <span className="font-mono">{skill.market_demand_percent}%</span>
            <span className="text-[10px] text-muted-foreground uppercase font-sans hidden lg:inline">
              Demand
            </span>
          </div>

          {/* Detail Expansion Chevron */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            aria-label={isExpanded ? `Collapse details for ${skill.name}` : `Expand details for ${skill.name}`}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Expanded Details Panel */}
      {isExpanded && (
        <div className="border-t border-border/40 bg-secondary/30 p-4 sm:p-5 space-y-4 text-xs">
          {/* Status description alert */}
          <div className="flex items-start gap-2.5 text-muted-foreground">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-foreground">{statusConfig.description}</span>
            </p>
          </div>

          {/* 3-Tier Depth Breakdown Comparison */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-muted-foreground font-medium">
              <span>Competency Depth Breakdown</span>
              <span className="font-mono text-[11px]">
                Current: {getDepthLabel(currentDepth)} (L{currentDepth}) • Target:{" "}
                {getDepthLabel(requiredDepth)} (L{requiredDepth})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { lvl: 1, title: "Level 1: Conceptual", desc: getDepthDescription(1) },
                { lvl: 2, title: "Level 2: Applied", desc: getDepthDescription(2) },
                { lvl: 3, title: "Level 3: Architectural", desc: getDepthDescription(3) },
              ].map(({ lvl, title, desc }) => {
                const isAcquired = currentDepth >= lvl;
                const isTarget = requiredDepth >= lvl;

                return (
                  <div
                    key={lvl}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-colors",
                      isAcquired
                        ? "border-emerald-500/30 bg-emerald-950/15 text-foreground"
                        : isTarget
                        ? "border-primary/40 bg-primary/5 text-foreground"
                        : "border-border/40 bg-secondary/20 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-[11px]">{title}</span>
                      {isAcquired ? (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Met
                        </span>
                      ) : isTarget ? (
                        <span className="text-[10px] text-primary font-semibold">
                          Target
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Optional</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metadata & Confidence Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/30 text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3">
              {confidenceScore !== undefined && (
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>
                    Confidence Score:{" "}
                    <strong className="text-foreground font-mono">
                      {Math.round(confidenceScore * 100)}%
                    </strong>
                  </span>
                </div>
              )}

              {verificationSource && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/60">•</span>
                  <span>
                    Source:{" "}
                    <strong className="text-foreground uppercase font-mono text-[10px]">
                      {verificationSource.replace(/_/g, " ")}
                    </strong>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground/60">•</span>
                <span>
                  Hiring Demand:{" "}
                  <strong className="text-foreground font-mono">
                    {skill.market_demand_percent}% Index
                  </strong>
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
              {status !== "validated" && (
                <button
                  type="button"
                  onClick={() => onSelectAction?.("add_to_pathway", skill)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Add to Pathway
                </button>
              )}

              <button
                type="button"
                onClick={() => onSelectAction?.("practice_project", skill)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground border border-border/60 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-primary" />
                Practice Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillItem;
