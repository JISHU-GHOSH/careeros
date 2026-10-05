"use client";

import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  Zap,
  Shield,
  ShieldAlert,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowRight,
  User,
  Settings,
  FileText,
  LogOut,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  currentRoleTitle?: string;
  targetRoleTitle?: string;
  xp?: number;
  level?: number;
  nextLevelXp?: number;
  stealthMode?: boolean;
  onToggleStealthMode?: (enabled: boolean) => void;
  availableRoles?: Array<{ id: string; title: string }>;
  onSelectTargetRole?: (roleId: string) => void;
  userName?: string;
  userEmail?: string;
  className?: string;
}

export function Header({
  currentRoleTitle = "Mid-Level Full-Stack",
  targetRoleTitle = "Senior Full-Stack Engineer",
  xp = 1450,
  level = 3,
  nextLevelXp = 2000,
  stealthMode: controlledStealthMode,
  onToggleStealthMode,
  availableRoles = [
    { id: "junior-frontend", title: "Junior Frontend Developer" },
    { id: "mid-fullstack", title: "Mid-Level Full-Stack Engineer" },
    { id: "senior-fullstack", title: "Senior Full-Stack Engineer" },
    { id: "staff-architect", title: "Staff Systems Architect" },
    { id: "devops-engineer", title: "DevOps & Infrastructure Engineer" },
  ],
  onSelectTargetRole,
  userName = "Alex Chen",
  userEmail = "alex.chen@example.com",
  className,
}: HeaderProps) {
  // Local state for stealth mode if not controlled
  const [internalStealth, setInternalStealth] = useState(true);
  const isStealthActive = controlledStealthMode !== undefined ? controlledStealthMode : internalStealth;

  // UI state for dropdown menus
  const [isTrajectoryOpen, setIsTrajectoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleStealthToggle = () => {
    const nextVal = !isStealthActive;
    if (onToggleStealthMode) {
      onToggleStealthMode(nextVal);
    } else {
      setInternalStealth(nextVal);
    }
  };

  const handleSelectTarget = (roleId: string) => {
    onSelectTargetRole?.(roleId);
    setIsTrajectoryOpen(false);
  };

  // XP progression calculation
  const currentLevelBaseXp = (level - 1) * 500;
  const levelProgressPercent = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100))
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Platform Title */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            className="flex items-center gap-2.5 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-foreground flex items-center gap-1.5">
                CareerOS
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-primary/10 text-primary border border-primary/20 font-semibold">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block -mt-1 font-medium">
                Autonomous Trajectory Engine
              </span>
            </div>
          </a>
        </div>

        {/* Center: Active Trajectory Goal Pill & Selector */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setIsTrajectoryOpen((prev) => !prev)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all shadow-xs",
              isTrajectoryOpen
                ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20"
                : "border-border/80 bg-secondary/60 hover:bg-secondary text-foreground hover:border-border"
            )}
            aria-expanded={isTrajectoryOpen}
            aria-haspopup="true"
          >
            <span className="text-muted-foreground truncate max-w-[120px]">
              {currentRoleTitle}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-semibold text-primary truncate max-w-[150px]">
              {targetRoleTitle}
            </span>
            <ChevronDown
              className={cn(
                "w-3 h-3 text-muted-foreground transition-transform duration-200 shrink-0",
                isTrajectoryOpen && "rotate-180"
              )}
            />
          </button>

          {/* Trajectory Dropdown Popover */}
          {isTrajectoryOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsTrajectoryOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-xl border border-border/80 bg-popover p-2 shadow-xl z-50 space-y-1">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40 flex items-center justify-between">
                  <span>Switch Target Role</span>
                  <Target className="w-3.5 h-3.5 text-primary" />
                </div>
                {availableRoles.map((role) => {
                  const isCurrentTarget = role.title.toLowerCase().includes(targetRoleTitle.toLowerCase());
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleSelectTarget(role.id)}
                      className={cn(
                        "w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between",
                        isCurrentTarget
                          ? "bg-primary/15 text-primary font-semibold"
                          : "text-foreground hover:bg-secondary"
                      )}
                    >
                      <span className="truncate">{role.title}</span>
                      {isCurrentTarget && (
                        <span className="text-[10px] uppercase font-mono px-1 rounded bg-primary/20">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right Section: XP Tracker + Stealth Toggle + User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* XP & Level Tracker */}
          <div
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-border/70 bg-secondary/50 text-xs"
            title={`Level ${level} • ${xp.toLocaleString()} XP (${levelProgressPercent}% to Level ${level + 1})`}
          >
            <div className="flex items-center gap-1 font-bold text-amber-400">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Lvl {level}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 border-l border-border/60 pl-2">
              <span className="font-mono font-semibold text-foreground text-[11px]">
                {xp.toLocaleString()} XP
              </span>
              <div
                className="w-12 h-1.5 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={levelProgressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`XP progress toward Level ${level + 1}`}
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-primary rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stealth Mode Privacy Badge & Toggle */}
          <button
            type="button"
            onClick={handleStealthToggle}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all shadow-2xs",
              isStealthActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15"
                : "bg-secondary/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary"
            )}
            title={
              isStealthActive
                ? "Stealth Mode is ACTIVE. Employer tracking disabled and profile is anonymous."
                : "Stealth Mode is OFF. Public visibility enabled."
            }
            aria-pressed={isStealthActive}
            aria-label="Toggle Stealth Mode privacy"
          >
            {isStealthActive ? (
              <>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Stealth Mode</span>
                <span className="sm:hidden">Stealth</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">Public Mode</span>
                <span className="sm:hidden">Public</span>
              </>
            )}
          </button>

          {/* User Profile Avatar with Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-border transition-all focus:outline-hidden"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
              aria-label="User account menu"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-border relative">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/80 bg-popover p-2 shadow-xl z-50 space-y-1">
                  <div className="px-3 py-2 border-b border-border/40">
                    <p className="font-semibold text-xs text-foreground truncate">{userName}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-secondary text-primary font-medium">
                      {currentRoleTitle}
                    </span>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Profile & Competencies</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Resume Ingestion</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Settings & Privacy</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Trajectory Pill Bar (Visible only on small viewports) */}
      <div className="md:hidden border-t border-border/40 bg-secondary/30 px-4 py-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground truncate max-w-[130px]">
          {currentRoleTitle}
        </span>
        <ArrowRight className="w-3 h-3 text-primary shrink-0" />
        <span className="font-semibold text-primary truncate max-w-[150px]">
          {targetRoleTitle}
        </span>
      </div>
    </header>
  );
}

export default Header;
