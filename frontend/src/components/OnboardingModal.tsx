"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  Sliders,
  FileText,
  UserCheck,
  TrendingUp,
  GitBranch,
  Layers,
  ChevronRight,
  Clock,
  Shield,
  Check,
} from "lucide-react";
import {
  Role,
  UserSkillState,
  SkillDepth,
  ResumeParseResponse,
  SkillImportance,
} from "@/types";
import { useCareerSafe, calculateWeightedReadiness } from "@/context/CareerContext";
import { ResumeDropzone } from "./ResumeDropzone";
import { cn } from "@/lib/utils";

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  className?: string;
  defaultStep?: number;
}

export type TransitionMode = "fast_track" | "lateral_pivot";

interface CalibrationOption {
  depth: SkillDepth;
  label: string;
  sublabel: string;
  confidence: number;
}

interface CalibrationQuestion {
  skillId: string;
  title: string;
  description: string;
  options: CalibrationOption[];
}

const CALIBRATION_QUESTIONS: CalibrationQuestion[] = [
  {
    skillId: "distributed-caching",
    title: "1. Distributed Caching & Invalidation (Redis)",
    description:
      "What is your hands-on experience implementing cache layers, TTL invalidation, and race condition defenses?",
    options: [
      {
        depth: SkillDepth.CONCEPTUAL,
        label: "Foundational Concepts",
        sublabel: "Understand cache-aside, TTL expiry, eviction policies (LRU), and basic GET/SET.",
        confidence: 0.4,
      },
      {
        depth: SkillDepth.APPLIED,
        label: "Applied / Production Code",
        sublabel: "Built Redis clusters, cache-aside layers, and pub/sub cache invalidation in production.",
        confidence: 0.8,
      },
      {
        depth: SkillDepth.ARCHITECTURAL,
        label: "Architectural & Optimization",
        sublabel: "Designed planetary-scale multi-tier caching, thundering herd defense, & edge resilience.",
        confidence: 0.95,
      },
    ],
  },
  {
    skillId: "system-design",
    title: "2. Scalable System Architecture & Microservices",
    description:
      "How confident are you architecting distributed services, load balancers, and resilient state machines?",
    options: [
      {
        depth: SkillDepth.CONCEPTUAL,
        label: "Foundational Concepts",
        sublabel: "Know monolith vs microservices, CAP theorem, and basic load balancing trade-offs.",
        confidence: 0.4,
      },
      {
        depth: SkillDepth.APPLIED,
        label: "Applied / Production Code",
        sublabel: "Architected production microservices, async message queues, and resilient API gateways.",
        confidence: 0.8,
      },
      {
        depth: SkillDepth.ARCHITECTURAL,
        label: "Architectural & Optimization",
        sublabel: "Designed distributed multi-region topologies, consensus protocols, and fault isolation.",
        confidence: 0.95,
      },
    ],
  },
  {
    skillId: "sql-optimization",
    title: "3. SQL Optimization & Database Indexing",
    description:
      "What is your proficiency analyzing slow queries, query execution plans, and table indexes?",
    options: [
      {
        depth: SkillDepth.CONCEPTUAL,
        label: "Foundational Concepts",
        sublabel: "Proficient in relational schemas, JOINs, B-Tree indexes, and ACID transaction semantics.",
        confidence: 0.4,
      },
      {
        depth: SkillDepth.APPLIED,
        label: "Applied / Production Code",
        sublabel: "Tuned slow production queries using EXPLAIN ANALYZE, composite indexes, and connection pools.",
        confidence: 0.8,
      },
      {
        depth: SkillDepth.ARCHITECTURAL,
        label: "Architectural & Optimization",
        sublabel: "Engineered table partitioning, read-replica routing, sharding, and high-concurrency writes.",
        confidence: 0.95,
      },
    ],
  },
];

const SENIORITY_LEVELS = [
  { id: "junior", label: "< 1 year", sublabel: "Associate / Entry" },
  { id: "mid", label: "1 - 3 years", sublabel: "Mid-level" },
  { id: "senior", label: "3 - 5 years", sublabel: "Senior" },
  { id: "lead", label: "5+ years", sublabel: "Lead / Staff" },
];

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
  className,
  defaultStep = 1,
}: OnboardingModalProps) {
  const {
    roles,
    currentRoleId: contextCurrentRole,
    targetRoleId: contextTargetRole,
    userSkills: contextUserSkills,
    setCurrentRoleId,
    setTargetRoleId,
    setUserSkills,
    recalibrateDiagnostics,
    refreshPathways,
    applyOnboardingProfile,
  } = useCareerSafe();

  // Wizard Step (1: Starting Point, 2: Destination, 3: Skill Calibration, 4: Calibrated Success)
  const [currentStep, setCurrentStep] = useState<number>(defaultStep);

  // Step 1 State: Starting Role & Resume Parsing
  const [startIntakeMode, setStartIntakeMode] = useState<"resume" | "manual">("resume");
  const [selectedCurrentRole, setSelectedCurrentRole] = useState<string>(
    contextCurrentRole || "mid-fullstack"
  );
  const [selectedExperience, setSelectedExperience] = useState<string>("mid");
  const [resumeParsedData, setResumeParsedData] = useState<ResumeParseResponse | null>(null);

  // Step 2 State: Target Role & Transition Mode
  const [selectedTargetRole, setSelectedTargetRole] = useState<string>(
    contextTargetRole || "senior-fullstack"
  );
  const [transitionMode, setTransitionMode] = useState<TransitionMode>("fast_track");
  const [targetVelocity, setTargetVelocity] = useState<"sprint" | "balanced" | "part_time">(
    "sprint"
  );

  // Step 3 State: 3-Question Calibrated Skills
  const [calibratedDepths, setCalibratedDepths] = useState<Record<string, SkillDepth>>({
    "distributed-caching": SkillDepth.APPLIED,
    "system-design": SkillDepth.CONCEPTUAL,
    "sql-optimization": SkillDepth.APPLIED,
  });

  // UI state for submission loading
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccessComplete, setIsSuccessComplete] = useState<boolean>(false);

  // Synchronize initial role defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(defaultStep);
      setIsSuccessComplete(false);
      setSelectedCurrentRole(contextCurrentRole || "mid-fullstack");
      setSelectedTargetRole(contextTargetRole || "senior-fullstack");
    }
  }, [isOpen, defaultStep, contextCurrentRole, contextTargetRole]);

  // Keyboard navigation & scroll-locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Current target role definition object
  const activeTargetRole = useMemo(() => {
    return (
      roles.find((r) => r.id === selectedTargetRole) ||
      roles.find((r) => r.id === "senior-fullstack") ||
      roles[2]
    );
  }, [roles, selectedTargetRole]);

  // Handle resume parse output in Step 1
  const handleResumeParsed = useCallback((result: ResumeParseResponse) => {
    setResumeParsedData(result);
    if (result.detected_role) {
      setSelectedCurrentRole(result.detected_role);
    }
    // Pre-populate question depths if skills were found in resume
    setCalibratedDepths((prev) => {
      const next = { ...prev };
      result.extracted_skills.forEach((s) => {
        if (s.skill_id in next) {
          next[s.skill_id] = s.current_depth;
        }
      });
      return next;
    });
  }, []);

  // Compute live estimated starting readiness score dynamically in Step 3
  const dynamicReadinessScore = useMemo(() => {
    const depthConfidenceMap: Record<SkillDepth, number> = {
      [SkillDepth.CONCEPTUAL]: 0.4,
      [SkillDepth.APPLIED]: 0.8,
      [SkillDepth.ARCHITECTURAL]: 0.95,
    };

    // Build temporary user skill state incorporating calibrated answers
    const tempSkills: UserSkillState[] = [
      ...contextUserSkills.filter(
        (s) =>
          s.skill_id !== "distributed-caching" &&
          s.skill_id !== "system-design" &&
          s.skill_id !== "sql-optimization"
      ),
      {
        skill_id: "distributed-caching",
        current_depth: calibratedDepths["distributed-caching"] || SkillDepth.APPLIED,
        confidence_score:
          depthConfidenceMap[calibratedDepths["distributed-caching"] || SkillDepth.APPLIED],
        verification_source: "SELF_REPORT",
      },
      {
        skill_id: "system-design",
        current_depth: calibratedDepths["system-design"] || SkillDepth.CONCEPTUAL,
        confidence_score:
          depthConfidenceMap[calibratedDepths["system-design"] || SkillDepth.CONCEPTUAL],
        verification_source: "SELF_REPORT",
      },
      {
        skill_id: "sql-optimization",
        current_depth: calibratedDepths["sql-optimization"] || SkillDepth.APPLIED,
        confidence_score:
          depthConfidenceMap[calibratedDepths["sql-optimization"] || SkillDepth.APPLIED],
        verification_source: "SELF_REPORT",
      },
    ];

    return calculateWeightedReadiness(tempSkills, activeTargetRole);
  }, [contextUserSkills, calibratedDepths, activeTargetRole]);

  // Step 3 Depth Selection Handler
  const handleSelectDepth = (skillId: string, depth: SkillDepth) => {
    setCalibratedDepths((prev) => ({
      ...prev,
      [skillId]: depth,
    }));
  };

  // Complete onboarding and hydrate dashboard
  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      // 1. Compile final skills list from resume + calibrated questions
      const skillsMap = new Map<string, UserSkillState>();

      // Base context skills
      contextUserSkills.forEach((s) => skillsMap.set(s.skill_id, s));

      // Overwrite with resume-parsed skills if available
      if (resumeParsedData?.extracted_skills) {
        resumeParsedData.extracted_skills.forEach((s) => skillsMap.set(s.skill_id, s));
      }

      // Apply calibrated questionnaire depths with distinct confidence scores
      const depthConfidenceMap: Record<SkillDepth, number> = {
        [SkillDepth.CONCEPTUAL]: 0.4,
        [SkillDepth.APPLIED]: 0.8,
        [SkillDepth.ARCHITECTURAL]: 0.95,
      };

      Object.entries(calibratedDepths).forEach(([skillId, depth]) => {
        const existing = skillsMap.get(skillId);
        const calibratedConf = depthConfidenceMap[depth] || 0.8;
        skillsMap.set(skillId, {
          skill_id: skillId,
          current_depth: depth,
          confidence_score: existing
            ? Math.max(existing.confidence_score, calibratedConf)
            : calibratedConf,
          verification_source: existing?.verification_source || "SELF_REPORT",
        });
      });

      const finalSkillsList = Array.from(skillsMap.values());

      // 2. Hydrate CareerContext directly using applyOnboardingProfile (eliminates stale closures)
      await applyOnboardingProfile(selectedCurrentRole, selectedTargetRole, finalSkillsList);

      setIsSuccessComplete(true);
      setCurrentStep(4);

      setTimeout(() => {
        onComplete?.();
        onClose();
      }, 1600);
    } catch {
      // Graceful completion even if API fails
      setIsSuccessComplete(true);
      setCurrentStep(4);
      setTimeout(() => {
        onComplete?.();
        onClose();
      }, 1600);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          "relative z-10 w-full max-w-2xl bg-card border border-border/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]",
          className
        )}
      >
        {/* Top Header Row with Title, Step Indicator & Close */}
        <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between gap-3 bg-secondary/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="onboarding-modal-title"
                className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2"
              >
                <span>60-Second Onboarding & Calibration</span>
                <span className="text-[10px] font-mono font-bold bg-primary/20 text-primary px-1.5 py-0.2 rounded border border-primary/30 uppercase">
                  Step {Math.min(currentStep, 3)} of 3
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Set your baseline, select your career destination, and calibrate readiness.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close onboarding modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Step Progress Bar */}
        <div className="w-full bg-secondary/60 h-1 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-300"
            style={{
              width: `${
                currentStep === 1
                  ? "33%"
                  : currentStep === 2
                  ? "66%"
                  : currentStep >= 3
                  ? "100%"
                  : "0%"
              }`,
            }}
          />
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* ================= STEP 1: STARTING POINT ================= */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span>Step 1: Where are you starting from?</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload your resume for instant skill extraction, or manually select your current engineering role.
                </p>
              </div>

              {/* Intake Mode Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-secondary/40 p-1 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => setStartIntakeMode("resume")}
                  className={cn(
                    "py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                    startIntakeMode === "resume"
                      ? "bg-card text-foreground shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Resume Upload / Paste</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStartIntakeMode("manual")}
                  className={cn(
                    "py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                    startIntakeMode === "manual"
                      ? "bg-card text-foreground shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Compass className="w-3.5 h-3.5 text-accent" />
                  <span>Select Role Manually</span>
                </button>
              </div>

              {/* Mode A: Resume Upload & Extraction */}
              {startIntakeMode === "resume" && (
                <div className="space-y-4">
                  <ResumeDropzone
                    onParsed={handleResumeParsed}
                    showResultPreview={true}
                  />

                  {resumeParsedData && (
                    <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-primary flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>
                          Role detected as{" "}
                          <strong>
                            {roles.find((r) => r.id === selectedCurrentRole)?.title ||
                              selectedCurrentRole}
                          </strong>
                          . Ready to proceed to target selection.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                      >
                        Next Step →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mode B: Manual Role Selection */}
              {startIntakeMode === "manual" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                      Current Seniority & Title:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {roles.map((role) => {
                        const isSelected = role.id === selectedCurrentRole;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedCurrentRole(role.id)}
                            className={cn(
                              "p-3 rounded-xl border text-left transition-all relative",
                              isSelected
                                ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary shadow-xs"
                                : "border-border/70 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-mono uppercase bg-secondary px-1.5 py-0.2 rounded border border-border/40">
                                Level {role.seniority_level}
                              </span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-primary" />
                              )}
                            </div>
                            <p className="text-xs font-bold text-foreground line-clamp-1">
                              {role.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                              {role.domain}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                      Years in Current Capacity:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SENIORITY_LEVELS.map((level) => {
                        const isSelected = level.id === selectedExperience;
                        return (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => setSelectedExperience(level.id)}
                            className={cn(
                              "p-2.5 rounded-xl border text-center transition-all",
                              isSelected
                                ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary"
                                : "border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <span className="text-xs font-bold block">{level.label}</span>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                              {level.sublabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: WHERE DO YOU WANT TO GO? ================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Step 2: Where do you want to go?</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select your target role and choose your transition progression mode.
                </p>
              </div>

              {/* Target Role Options */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Target Destination Role:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {roles.map((role) => {
                    const isSelected = role.id === selectedTargetRole;
                    const isCurrent = role.id === selectedCurrentRole;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedTargetRole(role.id)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all relative",
                          isSelected
                            ? "border-amber-500/80 bg-amber-950/20 text-foreground ring-1 ring-amber-500 shadow-xs"
                            : "border-border/70 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-mono uppercase bg-secondary px-1.5 py-0.2 rounded border border-border/40">
                            Level {role.seniority_level}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-blue-400 font-medium">
                              (Starting Point)
                            </span>
                          )}
                          {isSelected && (
                            <Target className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-foreground line-clamp-1">
                          {role.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {role.requirements?.length || 5} core required competencies
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Transition Goal Mode Selector (Fast-track vs Lateral Pivot) */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Transition Goal Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Fast-Track Promotion */}
                  <button
                    type="button"
                    onClick={() => setTransitionMode("fast_track")}
                    className={cn(
                      "p-3.5 rounded-xl border text-left transition-all relative space-y-1.5",
                      transitionMode === "fast_track"
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-xs"
                        : "border-border/70 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                        <TrendingUp className="w-4 h-4" />
                        <span>Fast-Track Promotion</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/20 text-primary">
                        Vertical
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Vertical advancement along your core engineering stack. Focuses on deep architectural mastery and leadership.
                    </p>
                    <div className="text-[10px] font-mono text-muted-foreground pt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      <span>Target Window: 3 – 5 Months</span>
                    </div>
                  </button>

                  {/* Lateral Pivot */}
                  <button
                    type="button"
                    onClick={() => setTransitionMode("lateral_pivot")}
                    className={cn(
                      "p-3.5 rounded-xl border text-left transition-all relative space-y-1.5",
                      transitionMode === "lateral_pivot"
                        ? "border-accent bg-accent/10 text-foreground ring-1 ring-accent shadow-xs"
                        : "border-border/70 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-accent font-bold text-xs">
                        <GitBranch className="w-4 h-4" />
                        <span>Lateral Specialization Pivot</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent/20 text-accent">
                        Cross-Domain
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Cross-disciplinary pivot into adjacent domains (e.g. Infrastructure, Systems Architecture, Platform).
                    </p>
                    <div className="text-[10px] font-mono text-muted-foreground pt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-accent" />
                      <span>Target Window: 4 – 7 Months</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Target Velocity Preference */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Velocity & Weekly Time Commitment:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "sprint", label: "Intensive Sprint", time: "8-12 hrs/wk", icon: Zap },
                    { id: "balanced", label: "Balanced Track", time: "5-8 hrs/wk", icon: Compass },
                    { id: "part_time", label: "Steady Pace", time: "2-4 hrs/wk", icon: Shield },
                  ].map((v) => {
                    const isSelected = targetVelocity === v.id;
                    const IconComp = v.icon;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() =>
                          setTargetVelocity(v.id as "sprint" | "balanced" | "part_time")
                        }
                        className={cn(
                          "p-2.5 rounded-xl border text-center transition-all",
                          isSelected
                            ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary"
                            : "border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <IconComp className="w-3.5 h-3.5 mx-auto mb-1 text-primary" />
                        <span className="text-xs font-bold block">{v.label}</span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          {v.time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: QUICK 3-QUESTION SKILL CALIBRATION ================= */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    <span>Step 3: Quick 3-Question Skill Calibration</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Calibrate baseline competency depths. Readiness score recalibrates in real-time.
                  </p>
                </div>

                {/* Instant Dynamic Readiness Score Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/80 border border-border shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-foreground">
                      {dynamicReadinessScore}% Readiness
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground block -mt-0.5">
                      Target Role Calibrated
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Calibration Questions */}
              <div className="space-y-4">
                {CALIBRATION_QUESTIONS.map((question) => {
                  const currentDepth =
                    calibratedDepths[question.skillId] || SkillDepth.CONCEPTUAL;

                  return (
                    <div
                      key={question.skillId}
                      className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-foreground flex items-center justify-between">
                          <span>{question.title}</span>
                          <span
                            className={cn(
                              "text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold",
                              currentDepth === SkillDepth.ARCHITECTURAL
                                ? "bg-purple-500/20 text-purple-300"
                                : currentDepth === SkillDepth.APPLIED
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-amber-500/20 text-amber-300"
                            )}
                          >
                            {currentDepth === SkillDepth.ARCHITECTURAL
                              ? "Architectural (L3)"
                              : currentDepth === SkillDepth.APPLIED
                              ? "Applied (L2)"
                              : "Conceptual (L1)"}
                          </span>
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {question.description}
                        </p>
                      </div>

                      {/* 3-Stop Depth Segmented Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {question.options.map((opt) => {
                          const isSelected = currentDepth === opt.depth;

                          return (
                            <button
                              key={opt.depth}
                              type="button"
                              onClick={() => handleSelectDepth(question.skillId, opt.depth)}
                              className={cn(
                                "p-3 rounded-xl border text-left transition-all",
                                isSelected
                                  ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary shadow-xs"
                                  : "border-border/50 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                              )}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[11px] font-bold block">{opt.label}</span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                                {opt.sublabel}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 4: CELEBRATION & READY STATE ================= */}
          {currentStep === 4 && (
            <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                  Trajectory Calibrated & Dashboard Hydrated!
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Your personalized skill gap diagnostics and topologically sequenced milestones are ready.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/80 border border-border">
                <div className="text-center">
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {dynamicReadinessScore}%
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Starting Readiness
                  </span>
                </div>
                <div className="h-6 w-px bg-border/60" />
                <div className="text-center">
                  <span className="text-lg font-bold font-mono text-primary">
                    {activeTargetRole.title.split(" ")[0]}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Target Role
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Footer */}
        {currentStep <= 3 && (
          <div className="p-4 sm:p-5 border-t border-border/60 bg-secondary/30 flex items-center justify-between gap-3 shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border/70 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip For Now
              </button>
            )}

            <div className="flex items-center gap-2">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md flex items-center gap-2 transition-all",
                    isSubmitting && "opacity-80 cursor-wait"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Calibrating Dashboard...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Finish & Hydrate Dashboard</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingModal;
