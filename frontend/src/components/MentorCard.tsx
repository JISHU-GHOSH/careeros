"use client";

import React, { useState } from "react";
import {
  Calendar,
  Video,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  UserCheck,
  Send,
  Building,
  Briefcase,
  Layers,
} from "lucide-react";
import { RecommendedMentor } from "@/types";
import { cn } from "@/lib/utils";
import { useCareerSafe } from "@/context/CareerContext";

export interface MentorCardProps {
  mentor?: RecommendedMentor | Record<string, string> | null;
  matchPercentage?: number;
  focusSkill?: string;
  mutualSkills?: string[];
  onBookSync?: (mentorName: string, timeSlot: string, notes?: string) => void;
  className?: string;
}

// Resilient default mentor matching Marcus Vance
const DEFAULT_MENTOR: RecommendedMentor = {
  name: "Marcus Vance",
  role: "Principal Systems Engineer",
  company: "Cloudflare",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  bio: "12+ years optimizing high-load distributed storage, caching topology, and edge runtimes.",
  match_reason: "Distributed Caching Specialist",
};

const DEFAULT_TIME_SLOTS = [
  "Tomorrow at 2:00 PM EST",
  "Thursday at 11:30 AM EST",
  "Friday at 4:00 PM EST",
];

export function MentorCard({
  mentor: propMentor,
  matchPercentage = 94,
  focusSkill = "Distributed Caching",
  mutualSkills = ["Distributed Caching", "System Architecture", "Redis Invalidation"],
  onBookSync,
  className,
}: MentorCardProps) {
  const { bookMentorSync: contextBookSync, bookedSyncs } = useCareerSafe();

  const mentor = propMentor || DEFAULT_MENTOR;
  const mentorName = mentor.name || "Marcus Vance";
  const mentorRole = mentor.role || "Principal Systems Engineer";
  const mentorCompany = mentor.company || "Cloudflare";
  const mentorAvatar = mentor.avatar || "";
  const mentorBio =
    (mentor as Record<string, string>).bio ||
    "12+ years optimizing high-load distributed storage, caching topology, and edge runtimes.";
  const matchReason =
    (mentor as Record<string, string>).match_reason || `${focusSkill} Specialist`;

  // UI Modal & Form States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(DEFAULT_TIME_SLOTS[0]);
  const [syncNotes, setSyncNotes] = useState(
    `Discuss architecture trade-offs and project implementation for ${focusSkill}.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    slot: string;
    message: string;
  } | null>(null);

  // Check if this mentor has already been booked in context
  const existingBooking = bookedSyncs.find((b) => b.mentorName === mentorName);

  const handleOpenBooking = () => {
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onBookSync) {
        onBookSync(mentorName, selectedSlot, syncNotes);
      } else {
        await contextBookSync(mentorName, selectedSlot, syncNotes);
      }

      setConfirmedBooking({
        slot: selectedSlot,
        message: `15-minute sync booked with ${mentorName} for ${selectedSlot}. Calendar invite dispatched.`,
      });

      // Auto-close modal after brief visual confirmation
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setIsSubmitting(false);
      }, 700);
    } catch {
      setIsSubmitting(false);
    }
  };

  const displayBookedSlot = confirmedBooking?.slot || existingBooking?.timeSlot;

  return (
    <>
      <div
        className={cn(
          "rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm space-y-4 relative overflow-hidden transition-all duration-200 hover:border-border",
          className
        )}
      >
        {/* Ambient background glow */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl"
          aria-hidden="true"
        />

        {/* Header row: Mentor Avatar + Meta + Match Percentage */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Mentor Avatar with Status Indicator */}
            <div className="relative shrink-0">
              {mentorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mentorAvatar}
                  alt={mentorName}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-border/80 shadow-md"
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md ring-2 ring-border">
                  {mentorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}
              {/* Online Green Indicator Dot */}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-card"
                title="Active mentor available this week"
              />
            </div>

            {/* Mentor Name, Title, and Company */}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-bold text-sm sm:text-base text-foreground tracking-tight truncate">
                  {mentorName}
                </h4>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
                  Senior Peer
                </span>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                <Briefcase className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
                <span className="truncate">{mentorRole}</span>
              </p>

              {mentorCompany && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                  <Building className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
                  <span className="text-foreground/90 font-medium">{mentorCompany}</span>
                </p>
              )}
            </div>
          </div>

          {/* Match Percentage Badge: ● 94% Match */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 shrink-0 shadow-2xs"
            title={`${matchPercentage}% competency match based on your target role gap in ${focusSkill}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-mono">{matchPercentage}% Match</span>
          </div>
        </div>

        {/* Mentor Bio / Reason */}
        <div className="rounded-xl bg-secondary/40 border border-border/50 p-3 text-xs text-muted-foreground leading-relaxed">
          <p className="line-clamp-2">
            <span className="font-semibold text-foreground mr-1">Match Focus:</span>
            {mentorBio}
          </p>
        </div>

        {/* Mutual Skills Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Layers className="w-3 h-3 text-primary" />
            <span>Mutual Competencies:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mutualSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-secondary/80 text-foreground border border-border/60"
              >
                {skill}
              </span>
            ))}
            {matchReason && !mutualSkills.includes(matchReason) && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary border border-primary/25">
                ★ {matchReason}
              </span>
            )}
          </div>
        </div>

        {/* Action Button: Book 15-Min Sync */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-3">
          <div className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>15-min async or 1:1 call</span>
          </div>

          {displayBookedSlot ? (
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Booked: {displayBookedSlot.split(" at ")[0]}</span>
              </span>
              <button
                type="button"
                onClick={handleOpenBooking}
                className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 px-2 py-1"
              >
                Reschedule
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-all active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book 15-Min Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => !isSubmitting && setIsBookingModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Book 15-Min Sync with {mentorName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mentorRole} • {mentorCompany}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close booking modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              {/* Select Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Choose Available Slot:</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {DEFAULT_TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                            : "border-border/70 bg-secondary/40 text-foreground hover:bg-secondary"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{slot}</span>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-mono uppercase bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-semibold">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Agenda Notes Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Discussion Agenda / Question:</span>
                  <span className="text-[11px] text-muted-foreground">Optional</span>
                </label>
                <textarea
                  value={syncNotes}
                  onChange={(e) => setSyncNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-secondary/50 border border-border/70 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none"
                  placeholder="E.g. Would love your feedback on my Redis cache-aside implementation and eviction strategy..."
                />
              </div>

              {/* Confirmation Toast Preview / Notice */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  Sessions are 15-minute focused engineering reviews. You will receive a Google Meet
                  calendar invite and preparation agenda automatically.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Confirming Sync...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm 15-Min Sync</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MentorCard;
