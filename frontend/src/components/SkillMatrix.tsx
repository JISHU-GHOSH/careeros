"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  RefreshCw,
  Layers,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Flame,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { DiagnosticReport, Skill } from "@/types";
import { SkillItem, normalizeSkillStatus } from "./SkillItem";
import { cn } from "@/lib/utils";

export type SkillFilterStatus = "all" | "gaps" | "needs_polish" | "validated";

export interface SkillMatrixProps {
  report?: DiagnosticReport | null;
  isLoading?: boolean;
  isRecalibrating?: boolean;
  onRecalibrate?: () => void;
  onSkillAction?: (action: string, skill: Skill) => void;
  className?: string;
  initialFilter?: SkillFilterStatus;
  initialCategory?: string;
  defaultGroupByCategory?: boolean;
}

// Fallback seed report matching ontology data for resilient initial state
const DEFAULT_DIAGNOSTIC_REPORT: DiagnosticReport = {
  current_role_id: "mid-fullstack",
  target_role_id: "senior-fullstack",
  readiness_percentage: 64,
  estimated_timeline_months: 4,
  missing_gaps: [
    {
      id: "distributed-caching",
      name: "Distributed Caching (Redis)",
      category: "System Architecture",
      market_demand_percent: 82,
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

interface MatrixSkillEntry {
  skill: Skill;
  status: "missing" | "needs_polish" | "validated";
  currentDepth: number;
  requiredDepth: number;
  confidenceScore: number;
}

export function SkillMatrix({
  report: propReport,
  isLoading = false,
  isRecalibrating = false,
  onRecalibrate,
  onSkillAction,
  className,
  initialFilter = "all",
  initialCategory = "all",
  defaultGroupByCategory = true,
}: SkillMatrixProps) {
  const activeReport = propReport || DEFAULT_DIAGNOSTIC_REPORT;

  // Filter and view states
  const [statusFilter, setStatusFilter] = useState<SkillFilterStatus>(initialFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [groupByCategory, setGroupByCategory] = useState<boolean>(defaultGroupByCategory);
  const [sortBy, setSortBy] = useState<"priority" | "demand" | "alphabetical">("priority");
  const [internalRecalibrating, setInternalRecalibrating] = useState<boolean>(false);

  // Set of expanded skill cards
  const [expandedSkillIds, setExpandedSkillIds] = useState<Set<string>>(new Set());

  // Aggregate all skills with their diagnostic classification
  const allSkillEntries: MatrixSkillEntry[] = useMemo(() => {
    const list: MatrixSkillEntry[] = [];

    (activeReport.missing_gaps || []).forEach((skill) => {
      list.push({
        skill,
        status: "missing",
        currentDepth: 0,
        requiredDepth: skill.category === "System Architecture" ? 3 : 2,
        confidenceScore: 0.1,
      });
    });

    (activeReport.needs_polish || []).forEach((skill) => {
      list.push({
        skill,
        status: "needs_polish",
        currentDepth: 1,
        requiredDepth: skill.category === "System Architecture" ? 3 : 2,
        confidenceScore: 0.55,
      });
    });

    (activeReport.validated_skills || []).forEach((skill) => {
      list.push({
        skill,
        status: "validated",
        currentDepth: skill.category === "System Architecture" ? 3 : 2,
        requiredDepth: skill.category === "System Architecture" ? 3 : 2,
        confidenceScore: 0.92,
      });
    });

    return list;
  }, [activeReport]);

  // Extract unique categories across all skills
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allSkillEntries.forEach((entry) => cats.add(entry.skill.category));
    return Array.from(cats).sort();
  }, [allSkillEntries]);

  // Status counts for filter pills
  const counts = useMemo(() => {
    return {
      all: allSkillEntries.length,
      gaps: allSkillEntries.filter((s) => s.status === "missing").length,
      needs_polish: allSkillEntries.filter((s) => s.status === "needs_polish").length,
      validated: allSkillEntries.filter((s) => s.status === "validated").length,
    };
  }, [allSkillEntries]);

  // Filter skills based on status, category, and search query
  const filteredSkills = useMemo(() => {
    let result = allSkillEntries.filter((entry) => {
      // 1. Status Filter
      if (statusFilter === "gaps" && entry.status !== "missing") return false;
      if (statusFilter === "needs_polish" && entry.status !== "needs_polish") return false;
      if (statusFilter === "validated" && entry.status !== "validated") return false;

      // 2. Category Filter
      if (selectedCategory !== "all" && entry.skill.category !== selectedCategory) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = entry.skill.name.toLowerCase().includes(query);
        const matchesCat = entry.skill.category.toLowerCase().includes(query);
        const matchesId = entry.skill.id.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesId) return false;
      }

      return true;
    });

    // Sort skills
    result.sort((a, b) => {
      if (sortBy === "priority") {
        // Missing gaps first, then needs polish, then validated
        const priorityOrder = { missing: 1, needs_polish: 2, validated: 3 };
        const diff = priorityOrder[a.status] - priorityOrder[b.status];
        if (diff !== 0) return diff;
        return b.skill.market_demand_percent - a.skill.market_demand_percent;
      }
      if (sortBy === "demand") {
        return b.skill.market_demand_percent - a.skill.market_demand_percent;
      }
      // Alphabetical
      return a.skill.name.localeCompare(b.skill.name);
    });

    return result;
  }, [allSkillEntries, statusFilter, selectedCategory, searchQuery, sortBy]);

  // Group filtered skills by category
  const groupedSkills = useMemo(() => {
    const map = new Map<string, MatrixSkillEntry[]>();
    filteredSkills.forEach((entry) => {
      const cat = entry.skill.category;
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(entry);
    });
    return map;
  }, [filteredSkills]);

  // Toggle card expansion
  const toggleSkillExpansion = (skillId: string) => {
    setExpandedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  };

  // Expand or collapse all visible skills
  const toggleAllVisible = () => {
    if (expandedSkillIds.size >= filteredSkills.length && filteredSkills.length > 0) {
      setExpandedSkillIds(new Set());
    } else {
      setExpandedSkillIds(new Set(filteredSkills.map((s) => s.skill.id)));
    }
  };

  const handleRecalibrate = () => {
    if (onRecalibrate) {
      onRecalibrate();
    } else {
      setInternalRecalibrating(true);
      setTimeout(() => {
        setInternalRecalibrating(false);
      }, 700);
    }
  };

  const recalibratingActive = isRecalibrating || internalRecalibrating;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 md:p-7 shadow-sm space-y-6 relative overflow-hidden",
        className
      )}
    >
      {/* Background ambient gradient glow */}
      <div
        className="pointer-events-none absolute right-1/4 top-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Header section with diagnostic summary & Recalibrate action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
              Your Skills Checklist
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            See your validated skills, areas to polish, and the next key competencies to learn.
          </p>
        </div>

        {/* Recalibrate Skills Action Trigger */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRecalibrate}
            disabled={recalibratingActive || isLoading}
            className={cn(
              "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold",
              "bg-secondary hover:bg-secondary/80 text-foreground border border-border/70",
              "shadow-xs transition-all duration-200 active:scale-95 disabled:opacity-50",
              recalibratingActive && "cursor-wait opacity-80"
            )}
            title="Recalibrate skill gaps against latest career ontology"
          >
            <RefreshCw
              className={cn(
                "w-3.5 h-3.5 text-primary",
                recalibratingActive && "animate-spin text-primary"
              )}
            />
            <span>{recalibratingActive ? "Recalibrating..." : "Recalibrate Skills"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="space-y-3">
        {/* Row 1: Interactive Status Filter Pills & Search Input */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Filter Pills */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none"
            role="tablist"
            aria-label="Skill status filters"
          >
            {/* Filter: All */}
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border",
                statusFilter === "all"
                  ? "bg-foreground text-background border-foreground shadow-xs"
                  : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border-border/60"
              )}
            >
              <span>All Competencies</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  statusFilter === "all"
                    ? "bg-background/20 text-background font-bold"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {counts.all}
              </span>
            </button>

            {/* Filter: Missing Gaps */}
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === "gaps"}
              onClick={() => setStatusFilter("gaps")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border",
                statusFilter === "gaps"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-xs"
                  : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-rose-400 border-border/60"
              )}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Missing Gaps</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300">
                {counts.gaps}
              </span>
            </button>

            {/* Filter: Needs Polish */}
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === "needs_polish"}
              onClick={() => setStatusFilter("needs_polish")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border",
                statusFilter === "needs_polish"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs"
                  : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-amber-400 border-border/60"
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Needs Polish</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300">
                {counts.needs_polish}
              </span>
            </button>

            {/* Filter: Validated */}
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === "validated"}
              onClick={() => setStatusFilter("validated")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border",
                statusFilter === "validated"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-xs"
                  : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-emerald-400 border-border/60"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Validated</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                {counts.validated}
              </span>
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative min-w-[240px] lg:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competencies (e.g. Redis, SQL)..."
              className={cn(
                "w-full pl-9 pr-8 py-1.5 rounded-xl text-xs bg-secondary/50 border border-border/70",
                "text-foreground placeholder:text-muted-foreground/70",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              )}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Category Filter Chips & View Mode Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/30 text-xs">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
            <span className="text-[11px] font-medium text-muted-foreground mr-1 hidden sm:inline">
              Category:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap border",
                selectedCategory === "all"
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-secondary/40 text-muted-foreground hover:text-foreground border-border/40"
              )}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const inCatCount = allSkillEntries.filter(
                (e) => e.skill.category === cat
              ).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap border flex items-center gap-1",
                    selectedCategory === cat
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-secondary/40 text-muted-foreground hover:text-foreground border-border/40"
                  )}
                >
                  <span>{cat}</span>
                  <span className="text-[9px] font-mono text-muted-foreground/80">
                    ({inCatCount})
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode & Sorting Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-secondary/40 px-2 py-1 rounded-md border border-border/40">
              <ArrowUpDown className="w-3 h-3" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "priority" | "demand" | "alphabetical")
                }
                className="bg-transparent text-foreground text-[11px] font-medium focus:outline-none cursor-pointer"
                aria-label="Sort skills by"
              >
                <option value="priority">Priority Gap</option>
                <option value="demand">Market Demand</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            {/* Group By Category Toggle */}
            <button
              type="button"
              onClick={() => setGroupByCategory((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors",
                groupByCategory
                  ? "bg-secondary text-foreground border-border/70"
                  : "bg-secondary/40 text-muted-foreground hover:text-foreground border-border/40"
              )}
              title={groupByCategory ? "Switch to Flat List" : "Switch to Category Grouping"}
            >
              {groupByCategory ? (
                <>
                  <LayoutGrid className="w-3 h-3 text-primary" />
                  <span>Grouped</span>
                </>
              ) : (
                <>
                  <List className="w-3 h-3 text-muted-foreground" />
                  <span>Flat List</span>
                </>
              )}
            </button>

            {/* Expand / Collapse All Trigger */}
            {filteredSkills.length > 0 && (
              <button
                type="button"
                onClick={toggleAllVisible}
                className="text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-secondary/60 transition-colors"
              >
                {expandedSkillIds.size >= filteredSkills.length
                  ? "Collapse All"
                  : "Expand All"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>
          Showing <strong className="text-foreground">{filteredSkills.length}</strong> of{" "}
          <strong className="text-foreground">{allSkillEntries.length}</strong> competencies
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
        </span>

        {/* Quick legend on desktop */}
        <div className="hidden md:flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Gap (Missing)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Needs Polish
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Validated
          </span>
        </div>
      </div>

      {/* Skill Cards Display Area */}
      {filteredSkills.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center mx-auto text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">
              No matching competencies found
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              Adjust your search keywords or filter criteria to view your full diagnostic matrix.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border/60 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : groupByCategory ? (
        /* Grouped by Category View */
        <div className="space-y-6">
          {Array.from(groupedSkills.entries()).map(([categoryName, entries]) => (
            <div key={categoryName} className="space-y-3">
              {/* Category Header */}
              <div className="flex items-center justify-between pb-1 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    {categoryName}
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/50">
                    {entries.length} {entries.length === 1 ? "skill" : "skills"}
                  </span>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 gap-2.5">
                {entries.map(({ skill, status, currentDepth, requiredDepth, confidenceScore }) => (
                  <SkillItem
                    key={skill.id}
                    skill={skill}
                    status={status}
                    currentDepth={currentDepth}
                    requiredDepth={requiredDepth}
                    confidenceScore={confidenceScore}
                    expanded={expandedSkillIds.has(skill.id)}
                    onToggleExpand={() => toggleSkillExpansion(skill.id)}
                    onSelectAction={onSkillAction}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Flat List View */
        <div className="grid grid-cols-1 gap-2.5">
          {filteredSkills.map(({ skill, status, currentDepth, requiredDepth, confidenceScore }) => (
            <SkillItem
              key={skill.id}
              skill={skill}
              status={status}
              currentDepth={currentDepth}
              requiredDepth={requiredDepth}
              confidenceScore={confidenceScore}
              expanded={expandedSkillIds.has(skill.id)}
              onToggleExpand={() => toggleSkillExpansion(skill.id)}
              onSelectAction={onSkillAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillMatrix;
