"use client";

import React, { useEffect, useState } from "react";
import { Clock, TrendingUp, Sparkles, AlertCircle, CheckCircle2, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReadinessGaugeProps {
  percentage: number;
  estimatedTimelineMonths?: number;
  targetRoleTitle?: string;
  currentRoleTitle?: string;
  className?: string;
  compact?: boolean;
  showDetails?: boolean;
  onRecalibrate?: () => void;
}

export function ReadinessGauge({
  percentage = 64,
  estimatedTimelineMonths = 4,
  targetRoleTitle = "Senior Full-Stack Engineer",
  currentRoleTitle = "Mid-Level Full-Stack Engineer",
  className,
  compact = false,
  showDetails = true,
  onRecalibrate,
}: ReadinessGaugeProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  // Normalize percentage within [0, 100]
  const safePercentage = Math.min(100, Math.max(0, isNaN(percentage) ? 0 : Math.round(percentage)));

  // Smoothly trigger bar animation on initial mount and value change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(safePercentage);
    }, 50);
    return () => clearTimeout(timer);
  }, [safePercentage]);

  // Determine stage badge & status color based on readiness
  const getReadinessTier = (pct: number) => {
    if (pct >= 80) {
      return {
        label: "Market Ready",
        badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        barGradient: "from-emerald-500 to-teal-400",
        description: "Competencies verified across core architectural domains.",
        icon: CheckCircle2,
      };
    }
    if (pct >= 60) {
      return {
        label: "Accelerating",
        badgeBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
        barGradient: "from-blue-600 via-indigo-500 to-emerald-400",
        description: "On track with primary must-have requirements in progress.",
        icon: TrendingUp,
      };
    }
    if (pct >= 40) {
      return {
        label: "Bridging Gaps",
        badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        barGradient: "from-amber-500 via-yellow-500 to-blue-500",
        description: "Foundational applied competencies acquired; deepening architectural depth.",
        icon: Sparkles,
      };
    }
    return {
      label: "Foundation Phase",
      badgeBg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      barGradient: "from-rose-500 via-amber-500 to-blue-500",
      description: "Initial calibration active. Prioritizing baseline prerequisites.",
      icon: AlertCircle,
    };
  };

  const tier = getReadinessTier(safePercentage);
  const TierIcon = tier.icon;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 w-full", className)}>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Readiness: {targetRoleTitle}
            </span>
            <span className="font-semibold text-primary">{safePercentage}%</span>
          </div>
          <div
            className="h-2 w-full bg-secondary/80 rounded-full overflow-hidden border border-border/50 relative"
            role="progressbar"
            aria-valuenow={safePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Role readiness progress: ${safePercentage}%`}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r",
                tier.barGradient
              )}
              style={{ width: `${animatedWidth}%` }}
            />
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md border border-border/40">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span>~{estimatedTimelineMonths} mo</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/80 bg-card p-5 md:p-6 shadow-sm overflow-hidden",
        "transition-colors hover:border-border",
        className
      )}
    >
      {/* Background ambient gradient glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-base tracking-tight">
              Target Role Readiness
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                tier.badgeBg
              )}
            >
              <TierIcon className="w-3 h-3" />
              {tier.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Path: <span className="text-foreground/90 font-medium">{currentRoleTitle}</span> →{" "}
            <span className="text-primary font-medium">{targetRoleTitle}</span>
          </p>
        </div>

        {/* Match Percentage Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-primary/15 text-primary border border-primary/30 shadow-xs"
            aria-label={`Career readiness match: ${safePercentage}% Match`}
          >
            <Award className="w-4 h-4 text-primary" />
            <span>{safePercentage}% Match</span>
          </div>
          {onRecalibrate && (
            <button
              onClick={onRecalibrate}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border/60 hover:bg-secondary/60 transition-colors"
              title="Recalibrate readiness assessment"
            >
              Recalibrate
            </button>
          )}
        </div>
      </div>

      {/* Main Progress Bar Area */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            Weighted Competency Coverage
          </span>
          <span className="font-mono font-semibold text-foreground">
            {safePercentage} / 100%
          </span>
        </div>

        {/* Progress Track */}
        <div
          className="relative h-3.5 w-full bg-secondary/80 rounded-full overflow-hidden p-0.5 border border-border/60"
          role="progressbar"
          aria-valuenow={safePercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Role transition readiness progress: ${safePercentage}%`}
        >
          {/* Animated fill */}
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r shadow-inner",
              tier.barGradient
            )}
            style={{ width: `${animatedWidth}%` }}
          />
        </div>

        {/* Tick milestones */}
        <div className="flex justify-between text-[10px] text-muted-foreground/70 font-mono px-0.5 pt-0.5">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Footer Metrics & Estimates */}
      {showDetails && (
        <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1.5 rounded-md bg-secondary/60 border border-border/50 text-foreground shrink-0">
              <Clock className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Time-to-Transition</span>
              <span className="font-semibold text-foreground">
                Est. ~{estimatedTimelineMonths} {estimatedTimelineMonths === 1 ? "month" : "months"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1.5 rounded-md bg-secondary/60 border border-border/50 text-foreground shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Diagnostic Calibration</span>
              <span className="text-foreground/90">
                Confidence-weighted via NetworkX
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadinessGauge;
