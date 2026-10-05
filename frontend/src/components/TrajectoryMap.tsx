"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Compass,
  CheckCircle2,
  Target,
  Sparkles,
  Milestone,
  ArrowRight,
  GitBranch,
  Info,
  ChevronRight,
  Layers,
  Radio,
  Zap,
} from "lucide-react";
import { Role, GraphEdge } from "@/types";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ReadinessGauge } from "./ReadinessGauge";

export interface TrajectoryMapProps {
  roles?: Role[];
  edges?: GraphEdge[];
  activeRoleId?: string;
  targetRoleId?: string;
  readinessPercentage?: number;
  estimatedTimelineMonths?: number;
  onSelectActiveRole?: (roleId: string) => void;
  onSelectTargetRole?: (roleId: string) => void;
  onRoleClick?: (role: Role) => void;
  className?: string;
  showReadinessGauge?: boolean;
}

// Fallback seed roles to ensure instant resilient rendering even if backend is offline
const DEFAULT_ROLES: Role[] = [
  {
    id: "junior-frontend",
    title: "Junior Frontend Developer",
    domain: "Frontend Engineering",
    seniority_level: 1,
    description: "Builds responsive user interfaces, modular web components, and integrates client-side state.",
    requirements: [
      { skill_id: "javascript-typescript", required_depth: 2, importance: 1.0 },
      { skill_id: "react-state", required_depth: 1, importance: 1.0 },
      { skill_id: "rest-apis", required_depth: 1, importance: 0.4 },
    ],
  },
  {
    id: "mid-fullstack",
    title: "Mid-Level Full-Stack Engineer",
    domain: "Full-Stack Engineering",
    seniority_level: 2,
    description: "Delivers full-stack web applications, REST APIs, relational database integrations, and containerized services.",
    requirements: [
      { skill_id: "javascript-typescript", required_depth: 2, importance: 1.0 },
      { skill_id: "react-state", required_depth: 2, importance: 1.0 },
      { skill_id: "rest-apis", required_depth: 2, importance: 1.0 },
      { skill_id: "sql-optimization", required_depth: 2, importance: 1.0 },
      { skill_id: "docker-containers", required_depth: 1, importance: 0.4 },
    ],
  },
  {
    id: "senior-fullstack",
    title: "Senior Full-Stack Engineer",
    domain: "Full-Stack Engineering",
    seniority_level: 3,
    description: "Leads technical architecture, high-throughput backend services, resilient distributed caching, and scalable state machines.",
    requirements: [
      { skill_id: "javascript-typescript", required_depth: 2, importance: 1.0 },
      { skill_id: "react-state", required_depth: 2, importance: 1.0 },
      { skill_id: "rest-apis", required_depth: 2, importance: 1.0 },
      { skill_id: "distributed-caching", required_depth: 2, importance: 1.0 },
      { skill_id: "sql-optimization", required_depth: 2, importance: 1.0 },
      { skill_id: "system-design", required_depth: 2, importance: 1.0 },
    ],
  },
  {
    id: "staff-architect",
    title: "Staff Systems Architect",
    domain: "System Architecture",
    seniority_level: 4,
    description: "Sets architectural guidelines across domains, designs resilient distributed systems, and oversees mission-critical infrastructure.",
    requirements: [
      { skill_id: "system-design", required_depth: 3, importance: 1.0 },
      { skill_id: "distributed-caching", required_depth: 3, importance: 1.0 },
      { skill_id: "sql-optimization", required_depth: 3, importance: 1.0 },
      { skill_id: "rest-apis", required_depth: 3, importance: 1.0 },
      { skill_id: "docker-containers", required_depth: 2, importance: 0.4 },
      { skill_id: "ci-cd-pipelines", required_depth: 2, importance: 0.4 },
    ],
  },
  {
    id: "devops-engineer",
    title: "DevOps & Infrastructure Engineer",
    domain: "DevOps & Cloud",
    seniority_level: 3,
    description: "Automates continuous delivery, container orchestration, cluster monitoring, and production infrastructure.",
    requirements: [
      { skill_id: "docker-containers", required_depth: 3, importance: 1.0 },
      { skill_id: "ci-cd-pipelines", required_depth: 3, importance: 1.0 },
      { skill_id: "rest-apis", required_depth: 2, importance: 1.0 },
      { skill_id: "distributed-caching", required_depth: 1, importance: 0.4 },
      { skill_id: "system-design", required_depth: 2, importance: 0.4 },
    ],
  },
];

const DEFAULT_EDGES: GraphEdge[] = [
  { source: "junior-frontend", target: "mid-fullstack" },
  { source: "mid-fullstack", target: "senior-fullstack" },
  { source: "senior-fullstack", target: "staff-architect" },
  { source: "mid-fullstack", target: "devops-engineer" },
];

export type RoleNodeState = "completed" | "active" | "target" | "horizon" | "lateral";

export function TrajectoryMap({
  roles: propRoles,
  edges: propEdges,
  activeRoleId: controlledActiveId,
  targetRoleId: controlledTargetId,
  readinessPercentage = 64,
  estimatedTimelineMonths = 4,
  onSelectActiveRole,
  onSelectTargetRole,
  onRoleClick,
  className,
  showReadinessGauge = true,
}: TrajectoryMapProps) {
  // Local state for roles & edges if not provided via props
  const [roles, setRoles] = useState<Role[]>(propRoles || DEFAULT_ROLES);
  const [edges, setEdges] = useState<GraphEdge[]>(propEdges || DEFAULT_EDGES);

  // Uncontrolled state fallbacks
  const [internalActiveId, setInternalActiveId] = useState<string>("mid-fullstack");
  const [internalTargetId, setInternalTargetId] = useState<string>("senior-fullstack");

  // Selected role for detail inspection drawer
  const [inspectedRoleId, setInspectedRoleId] = useState<string>("senior-fullstack");

  const currentActiveId = controlledActiveId ?? internalActiveId;
  const currentTargetId = controlledTargetId ?? internalTargetId;

  // Sync prop roles if changed
  useEffect(() => {
    if (propRoles && propRoles.length > 0) {
      setRoles(propRoles);
    }
  }, [propRoles]);

  useEffect(() => {
    if (propEdges && propEdges.length > 0) {
      setEdges(propEdges);
    }
  }, [propEdges]);

  // Fetch live role ontology graph if not supplied in props
  useEffect(() => {
    if (!propRoles || propRoles.length === 0) {
      api
        .getRolesGraph()
        .then((res) => {
          if (res?.roles?.length) {
            setRoles(res.roles);
          }
          if (res?.edges?.length) {
            setEdges(res.edges);
          }
        })
        .catch(() => {
          // Gracefully fallback to DEFAULT_ROLES without throwing
        });
    }
  }, [propRoles]);

  // Role map for quick lookup
  const roleMap = useMemo(() => {
    const map = new Map<string, Role>();
    roles.forEach((r) => map.set(r.id, r));
    return map;
  }, [roles]);

  const activeRole = roleMap.get(currentActiveId) || roles[1] || roles[0];
  const targetRole = roleMap.get(currentTargetId) || roles[2] || roles[0];
  const inspectedRole = roleMap.get(inspectedRoleId) || targetRole;

  // Determine state of a role relative to active & target roles
  const getNodeState = (role: Role): RoleNodeState => {
    if (role.id === currentActiveId) return "active";
    if (role.id === currentTargetId) return "target";

    const activeLevel = activeRole?.seniority_level ?? 2;
    const targetLevel = targetRole?.seniority_level ?? 3;

    if (role.seniority_level < activeLevel) {
      return "completed";
    }

    if (role.seniority_level > targetLevel) {
      return "horizon";
    }

    // Check if lateral branch (e.g. devops at level 3 when target is senior fullstack)
    if (role.seniority_level >= activeLevel && role.id !== currentTargetId) {
      return "lateral";
    }

    return "lateral";
  };

  const handleNodeClick = (role: Role) => {
    setInspectedRoleId(role.id);
    onRoleClick?.(role);
  };

  const handleSetActive = (roleId: string) => {
    if (onSelectActiveRole) {
      onSelectActiveRole(roleId);
    } else {
      setInternalActiveId(roleId);
    }
  };

  const handleSetTarget = (roleId: string) => {
    if (onSelectTargetRole) {
      onSelectTargetRole(roleId);
    } else {
      setInternalTargetId(roleId);
    }
  };

  // Group roles in primary sequential trajectory vs lateral pivot branches
  // Seed path: junior-frontend (L1) -> mid-fullstack (L2) -> senior-fullstack (L3) -> staff-architect (L4)
  const sortedPrimaryPath = useMemo(() => {
    const mainChain = ["junior-frontend", "mid-fullstack", "senior-fullstack", "staff-architect"];
    return mainChain
      .map((id) => roleMap.get(id))
      .filter((r): r is Role => Boolean(r));
  }, [roleMap]);

  const lateralRoles = useMemo(() => {
    const mainChainIds = new Set(["junior-frontend", "mid-fullstack", "senior-fullstack", "staff-architect"]);
    return roles.filter((r) => !mainChainIds.has(r.id));
  }, [roles, roleMap]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 md:p-7 shadow-sm space-y-6 relative overflow-hidden",
        className
      )}
    >
      {/* Background radial gradient accent */}
      <div
        className="pointer-events-none absolute left-1/3 top-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Top Header Row with title & trajectory mode summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
              Career Trajectory Map
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium border border-border/60 hidden sm:inline-flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              NetworkX DAG
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Interactive node-based progression engine. Click any role node to inspect requirements or switch target.
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Radio className="w-3 h-3 animate-pulse" /> Active Role
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Target className="w-3 h-3" /> Target Role
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/60">
            <Sparkles className="w-3 h-3" /> Horizon
          </span>
        </div>
      </div>

      {/* Trajectory Graph Visualizer (Responsive Node Map) */}
      <div className="relative py-4">
        {/* Main Progression Line */}
        <div className="space-y-6">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" /> Primary Career Pathway
          </div>

          {/* Desktop/Tablet Horizontal Node Chain */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {sortedPrimaryPath.map((role, index) => {
              const state = getNodeState(role);
              const isInspected = role.id === inspectedRoleId;

              return (
                <div key={role.id} className="relative group">
                  {/* Connecting edge to next item (Desktop) */}
                  {index < sortedPrimaryPath.length - 1 && (
                    <div
                      className={cn(
                        "hidden md:block absolute top-7 left-full w-4 h-0.5 -translate-y-1/2 z-0",
                        state === "completed"
                          ? "bg-emerald-500/60"
                          : role.id === currentActiveId
                          ? "bg-gradient-to-r from-blue-500 to-amber-500 animate-pulse"
                          : "bg-border/60"
                      )}
                      aria-hidden="true"
                    />
                  )}

                  {/* Node Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleNodeClick(role)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNodeClick(role);
                      }
                    }}
                    className={cn(
                      "relative z-10 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      // State-specific borders & styling
                      state === "completed" && [
                        "border-emerald-500/40 bg-emerald-950/10 hover:border-emerald-500/60",
                        "hover:bg-emerald-950/20",
                      ],
                      state === "active" && [
                        "border-blue-500/80 bg-blue-950/20 shadow-md shadow-blue-500/10",
                        "hover:border-blue-400 hover:bg-blue-950/30",
                      ],
                      state === "target" && [
                        "border-amber-500/80 bg-amber-950/20 shadow-md shadow-amber-500/10",
                        "hover:border-amber-400 hover:bg-amber-950/30",
                      ],
                      state === "horizon" && [
                        "border-border/60 border-dashed bg-secondary/30 hover:border-border hover:bg-secondary/50",
                      ],
                      state === "lateral" && [
                        "border-border bg-card hover:border-primary/50",
                      ],
                      isInspected && "ring-2 ring-primary/80 ring-offset-2 ring-offset-background"
                    )}
                  >
                    {/* Active pulse effect indicator for current active role */}
                    {state === "active" && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500" />
                      </span>
                    )}

                    {/* Node status badge & seniority */}
                    <div className="flex items-center justify-between gap-1.5 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded border border-border/40">
                        Level {role.seniority_level}
                      </span>

                      {state === "completed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      )}
                      {state === "active" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 animate-pulse">
                          <Radio className="w-3.5 h-3.5" /> Current
                        </span>
                      )}
                      {state === "target" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <Target className="w-3.5 h-3.5" /> Target
                        </span>
                      )}
                      {state === "horizon" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Sparkles className="w-3.5 h-3.5 text-muted-foreground" /> Horizon
                        </span>
                      )}
                    </div>

                    {/* Role Title */}
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {role.domain}
                    </p>

                    {/* Requirements count pill */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/30 pt-2">
                      <span>{role.requirements.length} Core Skills</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lateral Pivot Roles (if any) */}
          {lateralRoles.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <GitBranch className="w-3.5 h-3.5 text-accent" /> Lateral Pivots & Adjacent Specializations
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lateralRoles.map((role) => {
                  const state = getNodeState(role);
                  const isInspected = role.id === inspectedRoleId;

                  return (
                    <div
                      key={role.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleNodeClick(role)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleNodeClick(role);
                        }
                      }}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer relative",
                        state === "target"
                          ? "border-amber-500/80 bg-amber-950/20 shadow-md shadow-amber-500/10"
                          : "border-border/70 bg-card/60 hover:border-primary/50 hover:bg-card",
                        isInspected && "ring-2 ring-primary/80 ring-offset-2 ring-offset-background"
                      )}
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded border border-border/40">
                          Level {role.seniority_level} • Lateral
                        </span>
                        {state === "target" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                            <Target className="w-3.5 h-3.5" /> Target
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <GitBranch className="w-3 h-3" /> Pivot
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                        {role.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {role.domain}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/30 pt-2">
                        <span>{role.requirements.length} Core Skills</span>
                        <span className="text-primary font-medium hover:underline">Inspect</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Role Action Drawer / Inspection Panel */}
      {inspectedRole && (
        <div className="rounded-xl border border-border/80 bg-secondary/40 p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Selected Node
              </span>
              <h4 className="font-bold text-base text-foreground">
                {inspectedRole.title}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl">
              {inspectedRole.description ||
                "Requires mastering applied and architectural competencies defined in the ontology graph."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            {inspectedRole.id !== currentActiveId && (
              <button
                type="button"
                onClick={() => handleSetActive(inspectedRole.id)}
                className="flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground border border-border/70 transition-colors flex items-center justify-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5 text-blue-400" />
                Set as Current Role
              </button>
            )}

            {inspectedRole.id !== currentTargetId && (
              <button
                type="button"
                onClick={() => handleSetTarget(inspectedRole.id)}
                className="flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                Set as Target Goal
              </button>
            )}

            {inspectedRole.id === currentTargetId && (
              <div className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Active Target Goal
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded Live Readiness Gauge */}
      {showReadinessGauge && (
        <div className="pt-2">
          <ReadinessGauge
            percentage={readinessPercentage}
            estimatedTimelineMonths={estimatedTimelineMonths}
            targetRoleTitle={targetRole?.title || "Senior Full-Stack Engineer"}
            currentRoleTitle={activeRole?.title || "Mid-Level Full-Stack Engineer"}
          />
        </div>
      )}
    </div>
  );
}

export default TrajectoryMap;
