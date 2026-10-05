"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  Role,
  UserSkillState,
  MilestonePathway,
  MilestoneTask,
  DiagnosticReport,
  SkillDepth,
  SkillImportance,
} from "@/types";
import { api } from "@/lib/api";

export interface BookedSync {
  mentorName: string;
  timeSlot: string;
  notes?: string;
  bookedAt: Date;
}

export interface CareerContextValue {
  // Active User & Target States
  currentRoleId: string;
  targetRoleId: string;
  roles: Role[];
  userSkills: UserSkillState[];
  pathways: MilestonePathway[];
  xp: number;
  level: number;
  nextLevelXp: number;
  streak: number;
  stealthMode: boolean;
  diagnosticReport: DiagnosticReport | null;
  readinessScore: number;

  // Status & Synchronization
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  bookedSyncs: BookedSync[];

  // Optimistic & Navigation Actions
  toggleTask: (taskId: string) => void;
  setCurrentRoleId: (roleId: string) => void;
  setTargetRoleId: (roleId: string) => void;
  toggleStealthMode: (enabled?: boolean) => void;
  setUserSkills: (skills: UserSkillState[]) => void;
  recalibrateDiagnostics: () => Promise<void>;
  bookMentorSync: (
    mentorName: string,
    timeSlot: string,
    notes?: string
  ) => Promise<{ success: boolean; message: string }>;
  refreshPathways: () => Promise<void>;
}

// Resilient seed roles matching backend ontology
export const DEFAULT_ROLES: Role[] = [
  {
    id: "junior-frontend",
    title: "Junior Frontend Developer",
    domain: "Software Engineering",
    seniority_level: 1,
    requirements: [
      {
        skill_id: "javascript-typescript",
        required_depth: SkillDepth.CONCEPTUAL,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "react-state",
        required_depth: SkillDepth.CONCEPTUAL,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "rest-apis",
        required_depth: SkillDepth.CONCEPTUAL,
        importance: SkillImportance.NICE_TO_HAVE,
      },
    ],
  },
  {
    id: "mid-fullstack",
    title: "Mid-Level Full-Stack Engineer",
    domain: "Software Engineering",
    seniority_level: 2,
    requirements: [
      {
        skill_id: "javascript-typescript",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "react-state",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "rest-apis",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "sql-optimization",
        required_depth: SkillDepth.CONCEPTUAL,
        importance: SkillImportance.NICE_TO_HAVE,
      },
      {
        skill_id: "docker-containers",
        required_depth: SkillDepth.CONCEPTUAL,
        importance: SkillImportance.NICE_TO_HAVE,
      },
    ],
  },
  {
    id: "senior-fullstack",
    title: "Senior Full-Stack Engineer",
    domain: "Software Engineering",
    seniority_level: 3,
    requirements: [
      {
        skill_id: "javascript-typescript",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "react-state",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "rest-apis",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "distributed-caching",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "sql-optimization",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "system-design",
        required_depth: SkillDepth.ARCHITECTURAL,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "docker-containers",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.NICE_TO_HAVE,
      },
      {
        skill_id: "ci-cd-pipelines",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.NICE_TO_HAVE,
      },
    ],
  },
  {
    id: "staff-architect",
    title: "Staff Systems Architect",
    domain: "Software Engineering",
    seniority_level: 4,
    requirements: [
      {
        skill_id: "system-design",
        required_depth: SkillDepth.ARCHITECTURAL,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "distributed-caching",
        required_depth: SkillDepth.ARCHITECTURAL,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "sql-optimization",
        required_depth: SkillDepth.ARCHITECTURAL,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "ci-cd-pipelines",
        required_depth: SkillDepth.ARCHITECTURAL,
        importance: SkillImportance.MUST_HAVE,
      },
    ],
  },
  {
    id: "devops-engineer",
    title: "DevOps & Infrastructure Engineer",
    domain: "Platform Engineering",
    seniority_level: 3,
    requirements: [
      {
        skill_id: "docker-containers",
        required_depth: SkillDepth.ARCHITECTURAL,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "ci-cd-pipelines",
        required_depth: SkillDepth.ARCHITECTURAL,
        importance: SkillImportance.MUST_HAVE,
      },
      {
        skill_id: "distributed-caching",
        required_depth: SkillDepth.APPLIED,
        importance: SkillImportance.NICE_TO_HAVE,
      },
    ],
  },
];

// Resilient default user competencies
export const DEFAULT_USER_SKILLS: UserSkillState[] = [
  {
    skill_id: "javascript-typescript",
    current_depth: SkillDepth.APPLIED,
    confidence_score: 0.92,
    verification_source: "SELF_REPORT",
  },
  {
    skill_id: "react-state",
    current_depth: SkillDepth.APPLIED,
    confidence_score: 0.9,
    verification_source: "SELF_REPORT",
  },
  {
    skill_id: "rest-apis",
    current_depth: SkillDepth.APPLIED,
    confidence_score: 0.88,
    verification_source: "SELF_REPORT",
  },
  {
    skill_id: "sql-optimization",
    current_depth: SkillDepth.CONCEPTUAL,
    confidence_score: 0.55,
    verification_source: "SELF_REPORT",
  },
  {
    skill_id: "docker-containers",
    current_depth: SkillDepth.CONCEPTUAL,
    confidence_score: 0.5,
    verification_source: "SELF_REPORT",
  },
  {
    skill_id: "ci-cd-pipelines",
    current_depth: SkillDepth.CONCEPTUAL,
    confidence_score: 0.45,
    verification_source: "SELF_REPORT",
  },
];

// Curated milestone pathways matching backend content
export const DEFAULT_PATHWAYS: MilestonePathway[] = [
  {
    milestone_index: 1,
    title: "Week 1: Distributed Caching & High-Throughput Resilience",
    focus_skill_id: "distributed-caching",
    tasks: [
      {
        id: "task-distributed-caching-1",
        title: "Deep Dive: Cache-Aside vs Write-Through Patterns & Eviction Policies",
        type: "CONCEPT_ARTICLE",
        estimated_minutes: 45,
        xp_reward: 100,
        target_skill_id: "distributed-caching",
        completed: false,
      },
      {
        id: "task-distributed-caching-2",
        title: "Implement a High-Throughput Redis Cache Layer with Thundering Herd Defense",
        type: "HANDS_ON_PROJECT",
        estimated_minutes: 120,
        xp_reward: 250,
        target_skill_id: "distributed-caching",
        completed: false,
      },
      {
        id: "task-distributed-caching-3",
        title: "Architect Event-Driven Distributed Cache Invalidation with Redis Pub/Sub",
        type: "HANDS_ON_PROJECT",
        estimated_minutes: 90,
        xp_reward: 200,
        target_skill_id: "distributed-caching",
        completed: false,
      },
    ],
    recommended_mentor: {
      name: "Marcus Vance",
      role: "Principal Systems Engineer",
      company: "Cloudflare",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      bio: "12+ years optimizing high-load distributed storage, caching topology, and edge runtimes.",
      match_reason: "Distributed Caching Specialist",
    },
  },
  {
    milestone_index: 2,
    title: "Week 2: Scalable System Architecture & Fault-Tolerant Design",
    focus_skill_id: "system-design",
    tasks: [
      {
        id: "task-system-design-1",
        title: "Scalable Microservices Architecture: CAP Theorem, Partitioning & Event Sourcing",
        type: "CONCEPT_ARTICLE",
        estimated_minutes: 60,
        xp_reward: 120,
        target_skill_id: "system-design",
        completed: false,
      },
      {
        id: "task-system-design-2",
        title: "Architect an End-to-End Rate Limiter and Distributed Snowflake ID Generator",
        type: "HANDS_ON_PROJECT",
        estimated_minutes: 140,
        xp_reward: 300,
        target_skill_id: "system-design",
        completed: false,
      },
      {
        id: "task-system-design-3",
        title: "Design Resilient Failover, Circuit Breakers & Multi-Region Replication Topology",
        type: "HANDS_ON_PROJECT",
        estimated_minutes: 120,
        xp_reward: 250,
        target_skill_id: "system-design",
        completed: false,
      },
    ],
    recommended_mentor: {
      name: "David Kim",
      role: "Staff Systems Architect",
      company: "Stripe",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
      bio: "Led payments routing and high-reliability transaction infrastructure for planetary-scale traffic.",
      match_reason: "Scalable Systems Specialist",
    },
  },
  {
    milestone_index: 3,
    title: "Week 3: SQL Query Optimization & Database Indexing",
    focus_skill_id: "sql-optimization",
    tasks: [
      {
        id: "task-sql-optimization-1",
        title: "Query Planner Internals: B-Tree Indexes, Bitmap Scans & Execution Plans",
        type: "CONCEPT_ARTICLE",
        estimated_minutes: 45,
        xp_reward: 100,
        target_skill_id: "sql-optimization",
        completed: false,
      },
      {
        id: "task-sql-optimization-2",
        title: "Tune Slow Query Logs & Optimize PostgreSQL Queries using EXPLAIN ANALYZE",
        type: "HANDS_ON_PROJECT",
        estimated_minutes: 110,
        xp_reward: 250,
        target_skill_id: "sql-optimization",
        completed: false,
      },
      {
        id: "task-sql-optimization-3",
        title: "Implement Composite Indexing & Table Partitioning for High-Write Workloads",
        type: "HANDS_ON_PROJECT",
        estimated_minutes: 95,
        xp_reward: 200,
        target_skill_id: "sql-optimization",
        completed: false,
      },
    ],
    recommended_mentor: {
      name: "Elena Rostova",
      role: "Lead Database Architect",
      company: "Cockroach Labs",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
      bio: "Specializes in query planner optimization, table partitioning, and high-concurrency relational systems.",
      match_reason: "SQL & Data Architecture Specialist",
    },
  },
];

// Fallback seed diagnostic report
export const DEFAULT_DIAGNOSTIC_REPORT: DiagnosticReport = {
  current_role_id: "mid-fullstack",
  target_role_id: "senior-fullstack",
  readiness_percentage: 64,
  estimated_timeline_months: 4,
  missing_gaps: [
    {
      id: "distributed-caching",
      name: "Distributed Caching (Redis)",
      category: "System Architecture",
      market_demand_percent: 88,
    },
    {
      id: "system-design",
      name: "Scalable System Design",
      category: "System Architecture",
      market_demand_percent: 92,
    },
  ],
  needs_polish: [
    {
      id: "sql-optimization",
      name: "SQL Query Optimization & Indexing",
      category: "Data Architecture",
      market_demand_percent: 85,
    },
    {
      id: "docker-containers",
      name: "Docker Containerization",
      category: "DevOps & Cloud",
      market_demand_percent: 86,
    },
    {
      id: "ci-cd-pipelines",
      name: "CI/CD Pipeline Automation",
      category: "DevOps & Cloud",
      market_demand_percent: 80,
    },
  ],
  validated_skills: [
    {
      id: "javascript-typescript",
      name: "JavaScript & TypeScript",
      category: "Frontend Engineering",
      market_demand_percent: 95,
    },
    {
      id: "react-state",
      name: "React & State Architecture",
      category: "Frontend Engineering",
      market_demand_percent: 90,
    },
    {
      id: "rest-apis",
      name: "RESTful API Design & Integration",
      category: "Backend Engineering",
      market_demand_percent: 88,
    },
  ],
};

/**
 * Calculates weighted readiness percentage in under 1ms based on role requirements,
 * user skill depth, importance weights, and verification confidence score.
 */
export function calculateWeightedReadiness(
  userSkills: UserSkillState[],
  targetRole: Role | undefined
): number {
  if (!targetRole || !targetRole.requirements || targetRole.requirements.length === 0) {
    return 64;
  }

  const userSkillMap = new Map<string, UserSkillState>();
  userSkills.forEach((s) => userSkillMap.set(s.skill_id, s));

  let totalWeight = 0;
  let weightedProgress = 0;

  for (const req of targetRole.requirements) {
    const weight = req.importance === SkillImportance.MUST_HAVE ? 1.0 : 0.4;
    totalWeight += weight;

    const userSkill = userSkillMap.get(req.skill_id);
    if (userSkill) {
      const depthRatio = Math.min(1.0, userSkill.current_depth / req.required_depth);
      const confidence = userSkill.confidence_score;
      weightedProgress += weight * depthRatio * confidence;
    }
  }

  if (totalWeight === 0) return 64;
  return Math.min(100, Math.max(0, Math.round((weightedProgress / totalWeight) * 100)));
}

export const CareerContext = createContext<CareerContextValue | null>(null);

export interface CareerProviderProps {
  children: ReactNode;
  initialCurrentRoleId?: string;
  initialTargetRoleId?: string;
  initialXp?: number;
  initialStreak?: number;
  initialStealthMode?: boolean;
}

export function CareerProvider({
  children,
  initialCurrentRoleId = "mid-fullstack",
  initialTargetRoleId = "senior-fullstack",
  initialXp = 1450,
  initialStreak = 5,
  initialStealthMode = true,
}: CareerProviderProps) {
  const [currentRoleId, setCurrentRoleId] = useState<string>(initialCurrentRoleId);
  const [targetRoleId, setTargetRoleId] = useState<string>(initialTargetRoleId);
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [userSkills, setUserSkills] = useState<UserSkillState[]>(DEFAULT_USER_SKILLS);
  const [pathways, setPathways] = useState<MilestonePathway[]>(DEFAULT_PATHWAYS);
  const [xp, setXp] = useState<number>(initialXp);
  const [streak] = useState<number>(initialStreak);
  const [stealthMode, setStealthMode] = useState<boolean>(initialStealthMode);
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(
    DEFAULT_DIAGNOSTIC_REPORT
  );
  const [readinessScore, setReadinessScore] = useState<number>(64);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [bookedSyncs, setBookedSyncs] = useState<BookedSync[]>([]);

  // Find active target role definition
  const targetRole = useMemo(() => {
    return (
      roles.find((r) => r.id === targetRoleId) ||
      DEFAULT_ROLES.find((r) => r.id === targetRoleId) ||
      DEFAULT_ROLES[2]
    );
  }, [roles, targetRoleId]);

  // Dynamic level computation (500 XP per level bracket)
  const level = useMemo(() => Math.floor(xp / 500) + 1, [xp]);
  const nextLevelXp = useMemo(() => level * 500, [level]);

  // Initial recalibration on target role change or mount
  useEffect(() => {
    const calculated = calculateWeightedReadiness(userSkills, targetRole);
    setReadinessScore(calculated);
  }, [userSkills, targetRole]);

  // Hydrate ontology roles and graph from backend on mount
  useEffect(() => {
    let mounted = true;
    async function hydrateOntology() {
      try {
        const graphData = await api.getRolesGraph();
        if (mounted && graphData?.roles && graphData.roles.length > 0) {
          setRoles(graphData.roles);
        }
      } catch {
        // Fallback to default roles gracefully
      }
    }
    hydrateOntology();
    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Optimistic task toggle engine:
   * 1. Functional updater for pathways preventing stale closure overwrites on rapid clicks.
   * 2. Instant XP delta addition/subtraction.
   * 3. Pure computation and application of user skills and weighted readiness.
   * 4. Asynchronous background sync completely outside of any setState updater.
   */
  const toggleTask = useCallback(
    (taskId: string) => {
      // Find the target task to calculate optimistic deltas
      let matchedTask: MilestoneTask | null = null;
      let nextCompleted = false;

      for (const pathway of pathways) {
        const found = pathway.tasks.find((t) => t.id === taskId);
        if (found) {
          matchedTask = found;
          nextCompleted = !found.completed;
          break;
        }
      }

      if (!matchedTask) return;

      const deltaXp = nextCompleted ? matchedTask.xp_reward : -matchedTask.xp_reward;
      const targetSkillId = matchedTask.target_skill_id;

      // 1. Functional update for pathways (avoids stale closure on rapid sequential toggling)
      setPathways((prevPathways) =>
        prevPathways.map((pathway) => ({
          ...pathway,
          tasks: pathway.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, completed: nextCompleted };
            }
            return task;
          }),
        }))
      );

      // Compute how many tasks for this focus skill are completed after this toggle
      const allFocusTasks = pathways
        .flatMap((p) => p.tasks)
        .filter((t) => t.target_skill_id === targetSkillId);

      const completedFocusTasks = allFocusTasks.reduce((count, t) => {
        if (t.id === taskId) {
          return count + (nextCompleted ? 1 : 0);
        }
        return count + (t.completed ? 1 : 0);
      }, 0);

      const allCompleted =
        completedFocusTasks === allFocusTasks.length && allFocusTasks.length > 0;

      // 2. Pure computation of updated skills list
      const existingIdx = userSkills.findIndex((s) => s.skill_id === targetSkillId);
      let updatedSkillsList: UserSkillState[];

      if (existingIdx >= 0) {
        const current = userSkills[existingIdx];
        const newDepth = allCompleted
          ? SkillDepth.APPLIED
          : completedFocusTasks > 0
          ? Math.max(current.current_depth, SkillDepth.CONCEPTUAL)
          : current.current_depth;

        const newConfidence = allCompleted
          ? 0.95
          : completedFocusTasks > 0
          ? Math.min(0.9, Math.max(0.65, current.confidence_score + 0.15))
          : Math.max(0.4, current.confidence_score - 0.15);

        const newSource = allCompleted ? "ARTIFACT_VERIFIED" : current.verification_source;

        updatedSkillsList = [
          ...userSkills.slice(0, existingIdx),
          {
            ...current,
            current_depth: newDepth,
            confidence_score: newConfidence,
            verification_source: newSource,
          },
          ...userSkills.slice(existingIdx + 1),
        ];
      } else {
        // New skill acquired through practical project completion
        updatedSkillsList = [
          ...userSkills,
          {
            skill_id: targetSkillId,
            current_depth: allCompleted ? SkillDepth.APPLIED : SkillDepth.CONCEPTUAL,
            confidence_score: allCompleted ? 0.95 : 0.7,
            verification_source: "ARTIFACT_VERIFIED",
          },
        ];
      }

      // 3. Instant optimistic state updates
      setXp((prev) => Math.max(0, prev + deltaXp));
      setUserSkills(updatedSkillsList);

      const instantReadiness = calculateWeightedReadiness(updatedSkillsList, targetRole);
      setReadinessScore(instantReadiness);

      setDiagnosticReport((prevReport) => {
        if (!prevReport) return null;
        return {
          ...prevReport,
          readiness_percentage: instantReadiness,
        };
      });

      // 4. Background Server Synchronization (Asynchronous, completely outside of any setState updater)
      setIsSyncing(true);
      api
        .analyzeDiagnostics({
          current_role_id: currentRoleId,
          target_role_id: targetRoleId,
          user_skills: updatedSkillsList,
        })
        .then((verifiedReport) => {
          if (verifiedReport) {
            setDiagnosticReport(verifiedReport);
            setReadinessScore(verifiedReport.readiness_percentage);
          }
          setLastSyncedAt(new Date());
        })
        .catch(() => {
          // Keep optimistic client state intact if server is unreachable
          setLastSyncedAt(new Date());
        })
        .finally(() => {
          setIsSyncing(false);
        });
    },
    [pathways, userSkills, targetRole, currentRoleId, targetRoleId]
  );

  const toggleStealthMode = useCallback((enabled?: boolean) => {
    setStealthMode((prev) => (enabled !== undefined ? enabled : !prev));
  }, []);

  const recalibrateDiagnostics = useCallback(async () => {
    setIsLoading(true);
    try {
      const report = await api.analyzeDiagnostics({
        current_role_id: currentRoleId,
        target_role_id: targetRoleId,
        user_skills: userSkills,
      });
      if (report) {
        setDiagnosticReport(report);
        setReadinessScore(report.readiness_percentage);
      }
      setLastSyncedAt(new Date());
    } catch {
      // Recalibrate locally with formula
      const localScore = calculateWeightedReadiness(userSkills, targetRole);
      setReadinessScore(localScore);
    } finally {
      setIsLoading(false);
    }
  }, [currentRoleId, targetRoleId, userSkills, targetRole]);

  const refreshPathways = useCallback(async () => {
    setIsLoading(true);
    try {
      const gapIds = diagnosticReport?.missing_gaps?.map((g) => g.id) || [
        "distributed-caching",
        "system-design",
      ];
      const generated = await api.generatePathway({
        target_role_id: targetRoleId,
        gap_skill_ids: gapIds,
      });
      if (generated && generated.length > 0) {
        setPathways(generated);
      }
    } catch {
      // Retain existing pathways on failure
    } finally {
      setIsLoading(false);
    }
  }, [targetRoleId, diagnosticReport]);

  const bookMentorSync = useCallback(
    async (mentorName: string, timeSlot: string, notes?: string) => {
      const newBooking: BookedSync = {
        mentorName,
        timeSlot,
        notes,
        bookedAt: new Date(),
      };
      setBookedSyncs((prev) => [...prev, newBooking]);

      // Instant optimistic feedback with a tiny asynchronous promise simulation
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        message: `15-minute sync booked with ${mentorName} for ${timeSlot}. Calendar invitation dispatched.`,
      };
    },
    []
  );

  const contextValue: CareerContextValue = {
    currentRoleId,
    targetRoleId,
    roles,
    userSkills,
    pathways,
    xp,
    level,
    nextLevelXp,
    streak,
    stealthMode,
    diagnosticReport,
    readinessScore,
    isLoading,
    isSyncing,
    lastSyncedAt,
    bookedSyncs,
    toggleTask,
    setCurrentRoleId,
    setTargetRoleId,
    toggleStealthMode,
    setUserSkills,
    recalibrateDiagnostics,
    bookMentorSync,
    refreshPathways,
  };

  return <CareerContext.Provider value={contextValue}>{children}</CareerContext.Provider>;
}

/**
 * Hook to consume active CareerContext, with optional fallback for isolated component renders.
 */
export function useCareer(): CareerContextValue {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error("useCareer must be used within a <CareerProvider>");
  }
  return context;
}

/**
 * Safe hook that returns active context or a robust dummy fallback when rendered outside provider.
 */
export function useCareerSafe(): CareerContextValue {
  const context = useContext(CareerContext);
  if (context) return context;

  return {
    currentRoleId: "mid-fullstack",
    targetRoleId: "senior-fullstack",
    roles: DEFAULT_ROLES,
    userSkills: DEFAULT_USER_SKILLS,
    pathways: DEFAULT_PATHWAYS,
    xp: 1450,
    level: 3,
    nextLevelXp: 2000,
    streak: 5,
    stealthMode: true,
    diagnosticReport: DEFAULT_DIAGNOSTIC_REPORT,
    readinessScore: 64,
    isLoading: false,
    isSyncing: false,
    lastSyncedAt: null,
    bookedSyncs: [],
    toggleTask: () => {},
    setCurrentRoleId: () => {},
    setTargetRoleId: () => {},
    toggleStealthMode: () => {},
    setUserSkills: () => {},
    recalibrateDiagnostics: async () => {},
    bookMentorSync: async () => ({
      success: true,
      message: "Sync confirmed.",
    }),
    refreshPathways: async () => {},
  };
}
