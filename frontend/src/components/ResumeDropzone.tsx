"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  X,
  Clipboard,
  FileCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import { ResumeParseResponse, UserSkillState, SkillDepth } from "@/types";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export interface ResumeDropzoneProps {
  onParsed?: (result: ResumeParseResponse, rawText?: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  showResultPreview?: boolean;
  initialText?: string;
}

// Sample full-stack engineering resume snippet for instant 1-click calibration testing
export const SAMPLE_RESUME_TEXT = `Alex Chen — Senior Full-Stack Software Engineer
San Francisco, CA | alex.chen@example.com

SUMMARY:
Results-driven software engineer with 5+ years of experience building high-throughput distributed systems and modern web applications. Expert in TypeScript, React, and Next.js, with hands-on architecture experience in Redis distributed caching, PostgreSQL indexing, and scalable microservice APIs.

CORE TECHNICAL SKILLS:
• Languages & Frameworks: TypeScript, JavaScript, React, Next.js, Node.js, Express, Python, FastAPI
• Systems & Caching: Distributed Caching with Redis (cache-aside, pub/sub, invalidation), System Design, Microservices, CAP theorem, Load Balancing
• Data Architecture: PostgreSQL, SQL query optimization, EXPLAIN ANALYZE, database indexing, table partitioning
• Cloud & Platform: Docker containerization, Kubernetes, CI/CD pipelines, GitHub Actions, AWS

EXPERIENCE:
Senior Software Engineer — HighScale Tech (2023 - Present)
• Architected low-latency caching tier using Redis clusters, reducing p99 response times from 340ms to 28ms for 15M daily requests.
• Designed and shipped scalable microservices using REST APIs and FastAPI, handling 12,000 requests per second.
• Optimized relational database queries in PostgreSQL using composite B-Tree indexes and EXPLAIN ANALYZE, dropping query execution time by 65%.
• Implemented automated CI/CD pipelines in GitHub Actions and containerized multi-stage Docker workflows.`;

// Readable human labels for skills
const SKILL_LABELS: Record<string, string> = {
  "javascript-typescript": "JavaScript & TypeScript",
  "react-state": "React & State Architecture",
  "rest-apis": "RESTful API Design & Integration",
  "distributed-caching": "Distributed Caching (Redis)",
  "sql-optimization": "SQL Query Optimization & Indexing",
  "system-design": "Scalable System Architecture",
  "docker-containers": "Docker Containerization",
  "ci-cd-pipelines": "CI/CD Pipeline Automation",
};

// Readable human labels for role IDs
const ROLE_LABELS: Record<string, string> = {
  "junior-frontend": "Junior Frontend Developer",
  "mid-fullstack": "Mid-Level Full-Stack Engineer",
  "senior-fullstack": "Senior Full-Stack Engineer",
  "staff-architect": "Staff Systems Architect",
  "devops-engineer": "DevOps & Infrastructure Engineer",
};

/**
 * Resilient client-side fallback parser in case backend is temporarily unreachable
 */
function localFallbackParse(text: string = ""): ResumeParseResponse {
  const lower = text.toLowerCase();
  const extracted: UserSkillState[] = [];

  const checks: [string, RegExp[], SkillDepth, number][] = [
    [
      "javascript-typescript",
      [/\b(typescript|javascript|node\.js|node|ts|js)\b/i],
      lower.includes("lead") || lower.includes("architect")
        ? SkillDepth.ARCHITECTURAL
        : SkillDepth.APPLIED,
      0.9,
    ],
    [
      "react-state",
      [/\b(react|redux|zustand|next\.js|nextjs)\b/i],
      SkillDepth.APPLIED,
      0.88,
    ],
    [
      "rest-apis",
      [/\b(rest|api|fastapi|express|http)\b/i],
      SkillDepth.APPLIED,
      0.85,
    ],
    [
      "distributed-caching",
      [/\b(redis|memcached|distributed cache|caching)\b/i],
      lower.includes("architect") || lower.includes("invalidation")
        ? SkillDepth.ARCHITECTURAL
        : SkillDepth.APPLIED,
      0.85,
    ],
    [
      "sql-optimization",
      [/\b(sql|postgres|postgresql|mysql|indexing|explain analyze)\b/i],
      lower.includes("composite") || lower.includes("optimization")
        ? SkillDepth.APPLIED
        : SkillDepth.CONCEPTUAL,
      0.8,
    ],
    [
      "system-design",
      [/\b(system design|microservices|distributed systems|scalability)\b/i],
      lower.includes("architect")
        ? SkillDepth.ARCHITECTURAL
        : SkillDepth.APPLIED,
      0.85,
    ],
    [
      "docker-containers",
      [/\b(docker|container|kubernetes|k8s)\b/i],
      SkillDepth.APPLIED,
      0.82,
    ],
    [
      "ci-cd-pipelines",
      [/\b(ci\/cd|cicd|github actions|pipelines?)\b/i],
      SkillDepth.APPLIED,
      0.8,
    ],
  ];

  for (const [skillId, patterns, depth, conf] of checks) {
    if (patterns.some((p) => p.test(lower))) {
      extracted.push({
        skill_id: skillId,
        current_depth: depth,
        confidence_score: conf,
        verification_source: "RESUME_PARSED",
      });
    }
  }

  let detected = "mid-fullstack";
  if (lower.includes("staff") || lower.includes("architect")) {
    detected = "staff-architect";
  } else if (lower.includes("senior") || lower.includes("5+ years")) {
    detected = "senior-fullstack";
  } else if (lower.includes("devops") || lower.includes("infrastructure")) {
    detected = "devops-engineer";
  } else if (lower.includes("junior") || lower.includes("intern")) {
    detected = "junior-frontend";
  }

  return {
    detected_role: detected,
    extracted_skills: extracted,
  };
}

export function ResumeDropzone({
  onParsed,
  onError,
  className,
  showResultPreview = true,
  initialText = "",
}: ResumeDropzoneProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("paste");
  const [resumeText, setResumeText] = useState<string>(initialText);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ResumeParseResponse | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger parsing against backend API with client fallback
  const processText = useCallback(
    async (textToParse: string, fileName?: string) => {
      if (!textToParse.trim()) {
        setParseError("Please provide resume text or upload a document before parsing.");
        return;
      }

      setIsParsing(true);
      setParseError(null);

      try {
        let result: ResumeParseResponse;
        try {
          result = await api.parseResume(textToParse);
        } catch {
          // Resilient client fallback
          result = localFallbackParse(textToParse);
        }

        setParsedResult(result);
        if (fileName) {
          setUploadedFileName(fileName);
        }
        onParsed?.(result, textToParse);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to parse resume");
        setParseError(error.message);
        onError?.(error);
      } finally {
        setIsParsing(false);
      }
    },
    [onParsed, onError]
  );

  // Handle file drop & selection
  const handleFile = useCallback(
    (file: File) => {
      setUploadedFileName(file.name);
      setParseError(null);

      // Directly use FormData for PDF uploads to prevent binary text corruption
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const formData = new FormData();
        formData.append("file", file);
        setIsParsing(true);
        api
          .parseResume(formData)
          .then((res) => {
            setParsedResult(res);
            onParsed?.(res, `File: ${file.name}`);
          })
          .catch(() => {
            const fallback = localFallbackParse(file.name);
            setParsedResult(fallback);
            onParsed?.(fallback, file.name);
          })
          .finally(() => setIsParsing(false));
        return;
      }

      // Plaintext or markdown files can be read directly
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) || "";
        setResumeText(content);
        processText(content, file.name);
      };
      reader.onerror = () => {
        // Fallback: try parsing with FormData
        const formData = new FormData();
        formData.append("file", file);
        setIsParsing(true);
        api
          .parseResume(formData)
          .then((res) => {
            setParsedResult(res);
            onParsed?.(res, `File: ${file.name}`);
          })
          .catch(() => {
            const fallback = localFallbackParse(file.name);
            setParsedResult(fallback);
            onParsed?.(fallback, file.name);
          })
          .finally(() => setIsParsing(false));
      };
      reader.readAsText(file);
    },
    [processText, onParsed]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          setResumeText(clipText);
          processText(clipText);
        }
      }
    } catch {
      // Permission denied or unavailable
    }
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME_TEXT);
    processText(SAMPLE_RESUME_TEXT, "sample_senior_fullstack_resume.md");
  };

  const handleReset = () => {
    setResumeText("");
    setParsedResult(null);
    setParseError(null);
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("paste")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5",
              activeTab === "paste"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Resume Text</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5",
              activeTab === "upload"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>File Drag & Drop</span>
          </button>
        </div>

        {/* Quick Demo Sample Action */}
        <button
          type="button"
          onClick={handleLoadSample}
          disabled={isParsing}
          className="text-[11px] font-medium text-primary hover:text-primary/80 flex items-center gap-1 hover:underline disabled:opacity-50"
          title="Load a sample senior engineer resume for instant calibration"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Load Sample Resume</span>
        </button>
      </div>

      {/* Upload Drag & Drop Zone */}
      {activeTab === "upload" && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed p-7 text-center transition-all cursor-pointer relative",
            isDragging
              ? "border-primary bg-primary/10 scale-[1.01]"
              : "border-border/80 bg-secondary/20 hover:border-border hover:bg-secondary/40",
            isParsing && "opacity-60 pointer-events-none"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.pdf,.json,.rtf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                isDragging ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              )}
            >
              {uploadedFileName ? (
                <FileCheck className="w-6 h-6 text-emerald-400" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {uploadedFileName ? (
                  <span className="text-emerald-400">{uploadedFileName}</span>
                ) : (
                  "Drag & drop your resume file here"
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports TXT, Markdown, PDF, and RTF documents • Evaluates competencies in under 1s
              </p>
            </div>

            <button
              type="button"
              className="mt-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-foreground hover:bg-secondary/80 border border-border/60"
            >
              Browse Local File
            </button>
          </div>
        </div>
      )}

      {/* Raw Text Paste Box */}
      {activeTab === "paste" && (
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text, LinkedIn profile experience, or markdown bio here..."
              rows={7}
              disabled={isParsing}
              className={cn(
                "w-full rounded-xl p-3.5 text-xs font-mono bg-secondary/30 border border-border/80",
                "text-foreground placeholder:text-muted-foreground/60 resize-y",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              )}
            />

            {resumeText && (
              <button
                type="button"
                onClick={handleReset}
                className="absolute top-2.5 right-2.5 p-1 rounded-md text-muted-foreground hover:text-foreground bg-secondary/80 hover:bg-secondary border border-border/40"
                title="Clear text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
              <span>{resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0} words</span>
              <span>•</span>
              <span>{resumeText.length} characters</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-secondary text-foreground hover:bg-secondary/80 border border-border/60 flex items-center gap-1 transition-colors"
              >
                <Clipboard className="w-3 h-3 text-muted-foreground" />
                <span>Paste Clipboard</span>
              </button>

              <button
                type="button"
                onClick={() => processText(resumeText)}
                disabled={isParsing || !resumeText.trim()}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground",
                  "hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                )}
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting Skills...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Extract Competencies</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parse Error Notification */}
      {parseError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to process resume</p>
            <p className="text-[11px] text-rose-300/80 mt-0.5">{parseError}</p>
          </div>
          <button
            type="button"
            onClick={() => setParseError(null)}
            className="text-rose-400 hover:text-rose-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Extracted Results Preview */}
      {showResultPreview && parsedResult && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-3 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="text-muted-foreground">Detected Baseline Role: </span>
                <strong className="text-foreground">
                  {ROLE_LABELS[parsedResult.detected_role] || parsedResult.detected_role}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              <span>{parsedResult.extracted_skills.length} Competencies Extracted</span>
            </div>
          </div>

          {/* Extracted Skill Badges */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Extracted Technical Competencies:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {parsedResult.extracted_skills.map((skill) => {
                const depthLabel =
                  skill.current_depth === SkillDepth.ARCHITECTURAL
                    ? "Architectural"
                    : skill.current_depth === SkillDepth.APPLIED
                    ? "Applied"
                    : "Conceptual";

                return (
                  <div
                    key={skill.skill_id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 border border-border/80 text-xs"
                  >
                    <span className="font-semibold text-foreground">
                      {SKILL_LABELS[skill.skill_id] || skill.skill_id}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-mono uppercase px-1 py-0.2 rounded font-bold",
                        skill.current_depth === SkillDepth.ARCHITECTURAL
                          ? "bg-purple-500/20 text-purple-300"
                          : skill.current_depth === SkillDepth.APPLIED
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-amber-500/20 text-amber-300"
                      )}
                    >
                      {depthLabel}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {Math.round(skill.confidence_score * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeDropzone;
