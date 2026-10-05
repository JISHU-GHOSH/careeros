"use client";

import React from "react";
import {
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  ExternalLink,
  Layers,
  ArrowRight,
  Code2,
} from "lucide-react";
import { RoadmapNode, RoadmapNodeStatus } from "@/types";
import { cn } from "@/lib/utils";

export interface RoadmapNodeDetailProps {
  node: RoadmapNode | null;
  onClose: () => void;
  onStatusChange?: (nodeId: string, status: RoadmapNodeStatus) => void;
  isOpen: boolean;
}

export function RoadmapNodeDetail({
  node,
  onClose,
  onStatusChange,
  isOpen,
}: RoadmapNodeDetailProps) {
  if (!isOpen || !node) return null;

  const currentStatus = node.status || "to_learn";

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "essential":
        return { label: "Essential Must-Have", class: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "specialization":
        return { label: "High-Leverage Specialization", class: "bg-amber-50 text-amber-800 border-amber-200" };
      default:
        return { label: "Recommended Core", class: "bg-indigo-50 text-indigo-800 border-indigo-200" };
    }
  };

  const badge = getCategoryBadge(node.category);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                badge.class
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {node.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Switcher */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              My Learning Status
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "to_learn", label: "To Learn", color: "hover:bg-slate-200" },
                { id: "in_progress", label: "Learning ⏳", color: "bg-indigo-600 text-white font-bold" },
                { id: "mastered", label: "Mastered ✓", color: "bg-emerald-600 text-white font-bold" },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onStatusChange && onStatusChange(node.id, st.id as RoadmapNodeStatus)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center",
                    currentStatus === st.id
                      ? st.id === "mastered"
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                        : st.id === "in_progress"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "bg-white border-slate-300 text-slate-900 shadow-2xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description / Why it matters */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overview & Significance
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
              {node.description}
            </p>
          </div>

          {/* Key Tools & Technologies */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Key Tools & Competencies</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {node.key_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-xs font-semibold text-indigo-900"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Hands-on Project Challenge */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Proof-of-Work Project Challenge</span>
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                {node.project_challenge}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold pt-1">
                <span>💡 Tip:</span>
                <span>Adding this project to your GitHub or portfolio satisfies senior interview criteria.</span>
              </div>
            </div>
          </div>

          {/* Curated Resources */}
          {node.resources && node.resources.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Recommended Guides & Documentation</span>
              </h3>
              <div className="space-y-2">
                {node.resources.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 text-xs text-slate-800 flex items-center justify-between gap-2 shadow-2xs transition-colors"
                  >
                    <span className="font-medium truncate">{res}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
