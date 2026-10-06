"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowDown,
  Layers,
  ChevronRight,
  ExternalLink,
  Award,
  BookOpen,
  Share2,
  Printer,
  Compass,
} from "lucide-react";
import { RoadmapResponse, RoadmapNode, RoadmapNodeStatus } from "@/types";
import { RoadmapNodeDetail } from "./RoadmapNodeDetail";
import { cn } from "@/lib/utils";

export interface RoadmapFlowTreeProps {
  roadmap: RoadmapResponse;
  onNodeStatusChange?: (nodeId: string, status: RoadmapNodeStatus) => void;
  className?: string;
}

export function RoadmapFlowTree({
  roadmap,
  onNodeStatusChange,
  className,
}: RoadmapFlowTreeProps) {
  // Local state for user status overrides per node
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, RoadmapNodeStatus>>({});
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleStatusChange = (nodeId: string, status: RoadmapNodeStatus) => {
    setNodeStatuses((prev) => ({ ...prev, [nodeId]: status }));
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({ ...selectedNode, status });
    }
    if (onNodeStatusChange) {
      onNodeStatusChange(nodeId, status);
    }
  };

  const handleNodeClick = (node: RoadmapNode) => {
    const currentStatus = nodeStatuses[node.id] || node.status || "to_learn";
    setSelectedNode({ ...node, status: currentStatus });
    setIsDetailOpen(true);
  };

  // Calculate overall progress across nodes
  const stats = useMemo(() => {
    const total = roadmap.nodes.length;
    let completed = 0;
    let inProgress = 0;

    roadmap.nodes.forEach((n) => {
      const st = nodeStatuses[n.id] || n.status || "to_learn";
      if (st === "mastered") completed++;
      if (st === "in_progress") inProgress++;
    });

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, percent };
  }, [roadmap.nodes, nodeStatuses]);

  // Group nodes by stage index
  const stagesWithNodes = useMemo(() => {
    return roadmap.stages.map((stage) => {
      const stageNodes = roadmap.nodes.filter(
        (n) => n.stage_index === stage.stage_index || stage.node_ids.includes(n.id)
      );
      return {
        ...stage,
        nodes: stageNodes,
      };
    });
  }, [roadmap]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Roadmap Overview Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Career Roadmap</span>
              </div>
              {roadmap.source === "groq" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-700 text-xs font-bold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Synthesized via Built-in Groq AI</span>
                </div>
              )}
              {roadmap.source === "curated" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Curated Master Curriculum</span>
                </div>
              )}
              {roadmap.source === "archetype" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Domain Specialized Curriculum</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {roadmap.profession}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {roadmap.summary}
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left min-w-[130px]">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Timeline</span>
              </span>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">
                ~{roadmap.estimated_months} Months
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-left min-w-[140px]">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-600" />
                <span>Est. Salary</span>
              </span>
              <p className="text-sm sm:text-base font-extrabold text-emerald-950 mt-0.5 truncate">
                {roadmap.salary_range}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShare}
                className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 transition-colors shadow-2xs text-xs font-semibold flex items-center gap-1.5"
                title="Copy share link"
              >
                <Share2 className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">{copiedLink ? "Copied!" : "Share"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 transition-colors shadow-2xs text-xs font-semibold flex items-center gap-1.5"
                title="Print or export roadmap"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Your Milestone Mastery:</span>
              <strong className="text-indigo-600 font-bold">{stats.percent}%</strong>
              <span className="text-slate-400">({stats.completed} of {stats.total} mastered)</span>
            </span>
            <span className="text-slate-500 font-medium">
              Click any milestone node below to view guides & projects
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, stats.percent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sequential Flow Stages Tree */}
      <div className="relative space-y-12">
        {stagesWithNodes.map((stage, sIdx) => {
          return (
            <div key={stage.stage_index} className="space-y-5">
              {/* Stage Header Pill */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                  {stage.stage_index}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {stage.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Estimated duration: ~{stage.estimated_weeks} weeks
                  </p>
                </div>
              </div>

              {/* Connected Stage Nodes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 sm:pl-11">
                {stage.nodes.map((node) => {
                  const nodeStatus = nodeStatuses[node.id] || node.status || "to_learn";
                  const isMastered = nodeStatus === "mastered";
                  const isInProgress = nodeStatus === "in_progress";

                  return (
                    <div
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      className={cn(
                        "group relative rounded-2xl p-5 border-2 text-left cursor-pointer transition-all duration-200 select-none space-y-3.5",
                        isMastered
                          ? "bg-emerald-50/40 border-emerald-300 hover:border-emerald-400 shadow-xs"
                          : isInProgress
                          ? "bg-indigo-50/30 border-indigo-400 shadow-xs ring-2 ring-indigo-200"
                          : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                      )}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                            node.category === "essential"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : node.category === "specialization"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-indigo-50 text-indigo-800 border-indigo-200"
                          )}
                        >
                          {node.category}
                        </span>

                        {/* Status Chip */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            const next = isMastered ? "to_learn" : isInProgress ? "mastered" : "in_progress";
                            handleStatusChange(node.id, next);
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-transform active:scale-90",
                            isMastered
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : isInProgress
                              ? "bg-indigo-600 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {isMastered ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mastered</span>
                            </>
                          ) : isInProgress ? (
                            <span>Learning...</span>
                          ) : (
                            <span>To Learn</span>
                          )}
                        </div>
                      </div>

                      {/* Node Title & Description */}
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {node.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {node.description}
                        </p>
                      </div>

                      {/* Key Skills Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {node.key_skills.slice(0, 3).map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                        {node.key_skills.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{node.key_skills.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Project Challenge Preview Tag */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 truncate max-w-[85%]">
                          <Award className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                          <span className="truncate">{node.project_challenge}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stage Transition Arrow */}
              {sIdx < stagesWithNodes.length - 1 && (
                <div className="flex justify-center sm:justify-start sm:pl-14 py-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center shadow-2xs">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Node Detail Slide-over Drawer */}
      <RoadmapNodeDetail
        node={selectedNode}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
