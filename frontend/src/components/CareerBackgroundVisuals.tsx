"use client";

import React from "react";

/**
 * Hand-drawn seamless doodle wallpaper pattern inspired by Notion, Slack & Duolingo.
 * Features 25+ charming hand-drawn line illustrations of diverse careers:
 * medicine, software, rocketry, culinary, gaming, robotics, arts, and sciences.
 */
export function CareerBackgroundVisuals() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Warm Atmospheric Base Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-indigo-200/30 via-purple-200/20 to-transparent blur-3xl transform-gpu" />
      <div className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-blue-200/25 via-emerald-100/15 to-transparent blur-3xl transform-gpu" />
      <div className="absolute bottom-[-15%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-amber-200/20 via-rose-200/15 to-transparent blur-3xl transform-gpu" />

      {/* 2. Seamless Hand-Drawn Career Doodle Pattern Canvas */}
      <svg
        className="absolute inset-0 w-full h-full opacity-65 transition-opacity duration-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="notion-career-doodles"
            width="340"
            height="340"
            patternUnits="userSpaceOnUse"
          >
            {/* Global Doodle Style: stroke width 1.5, round caps and joins, soft indigo-slate tint */}
            <g
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-500/70"
            >
              {/* 1. Stethoscope (Medicine) @ (25, 25) */}
              <g transform="translate(20, 20) rotate(-8)">
                <path d="M 6 4 C 6 15 16 20 20 20 C 24 20 34 15 34 4" />
                <path d="M 6 4 L 3 4 M 34 4 L 37 4" strokeWidth="2" />
                <path d="M 20 20 L 20 28 C 20 34 26 36 26 32 C 26 28 23 27 23 25" />
                <circle cx="23" cy="23" r="3.5" fill="#f8fafc" />
              </g>

              {/* 2. Code Brackets </> (Software Engineering) @ (95, 20) */}
              <g transform="translate(90, 16) rotate(6)">
                <path d="M 8 6 L 2 12 L 8 18" />
                <path d="M 22 6 L 28 12 L 22 18" />
                <line x1="18" y1="4" x2="12" y2="20" />
              </g>

              {/* 3. Chef Toque Hat (Culinary Arts) @ (165, 18) */}
              <g transform="translate(160, 14) rotate(-4)">
                <path d="M 6 18 C 1 14 3 8 9 7 C 10 2 17 1 20 4 C 23 1 30 2 31 7 C 37 8 39 14 34 18 Z" fill="#f8fafc" />
                <path d="M 7 18 L 7 24 L 33 24 L 33 18" />
                <line x1="14" y1="21" x2="26" y2="21" strokeDasharray="1.5 2" />
              </g>

              {/* 4. Rocket Ship (Aerospace) @ (245, 15) */}
              <g transform="translate(240, 12) rotate(25)">
                <path d="M 12 2 C 12 2 20 8 20 20 L 4 20 C 4 8 12 2 12 2 Z" fill="#f8fafc" />
                <circle cx="12" cy="11" r="2.5" />
                <path d="M 4 16 L 1 21 L 5 21" />
                <path d="M 20 16 L 23 21 L 19 21" />
                <path d="M 8 20 Q 12 27 16 20" stroke="#f59e0b" />
              </g>

              {/* 5. Lightbulb / Innovation (Product / Research) @ (305, 25) */}
              <g transform="translate(300, 20) rotate(-10)">
                <path d="M 10 2 C 5 2 2 6 2 11 C 2 15 5 17 6 20 L 14 20 C 15 17 18 15 18 11 C 18 6 15 2 10 2 Z" fill="#f8fafc" />
                <line x1="6" y1="23" x2="14" y2="23" />
                <line x1="8" y1="26" x2="12" y2="26" />
                <line x1="10" y1="7" x2="10" y2="12" />
              </g>

              {/* 6. Gamepad Controller (Game Development) @ (25, 95) */}
              <g transform="translate(20, 90) rotate(8)">
                <rect x="2" y="4" width="34" height="20" rx="8" fill="#f8fafc" />
                <path d="M 10 10 L 10 18 M 6 14 L 14 14" strokeWidth="1.75" />
                <circle cx="26" cy="12" r="1.5" fill="#64748b" />
                <circle cx="30" cy="16" r="1.5" fill="#64748b" />
              </g>

              {/* 7. Microscope (BioTech / Medicine) @ (100, 95) */}
              <g transform="translate(95, 90) rotate(-6)">
                <rect x="12" y="2" width="6" height="14" rx="2" transform="rotate(25 15 9)" fill="#f8fafc" />
                <path d="M 18 16 C 24 18 24 26 18 28 L 6 28" />
                <line x1="2" y1="30" x2="22" y2="30" strokeWidth="2" />
                <circle cx="12" cy="22" r="2" />
              </g>

              {/* 8. Paper Airplane (Aviation & Ambition) @ (175, 90) */}
              <g transform="translate(170, 85) rotate(-15)">
                <path d="M 2 14 L 28 2 L 16 26 L 12 18 L 2 14 Z" fill="#f8fafc" />
                <path d="M 28 2 L 12 18" />
              </g>

              {/* 9. Graduation Cap / Mortarboard (Education / Academy) @ (250, 95) */}
              <g transform="translate(245, 90) rotate(12)">
                <path d="M 15 2 L 29 8 L 15 14 L 1 8 Z" fill="#f8fafc" />
                <path d="M 6 11 L 6 19 C 6 23 24 23 24 19 L 24 11" />
                <path d="M 25 10 L 28 18" />
                <circle cx="28" cy="19" r="1" fill="#64748b" />
              </g>

              {/* 10. Sparkle / Star Doodle @ (315, 95) */}
              <g transform="translate(310, 90)">
                <path d="M 8 0 Q 8 8 16 8 Q 8 8 8 16 Q 8 8 0 8 Q 8 8 8 0 Z" fill="#6366f1" fillOpacity="0.2" />
              </g>

              {/* 11. Artist Paint Palette (Creative Arts & UI/UX) @ (20, 175) */}
              <g transform="translate(16, 170) rotate(-12)">
                <path d="M 16 2 C 7 2 2 9 2 17 C 2 25 8 28 14 28 C 17 28 19 25 21 25 C 23 25 25 27 28 26 C 31 24 32 20 31 16 C 30 8 24 2 16 2 Z" fill="#f8fafc" />
                <circle cx="9" cy="10" r="1.5" fill="#64748b" />
                <circle cx="15" cy="7" r="1.5" fill="#64748b" />
                <circle cx="22" cy="10" r="1.5" fill="#64748b" />
                <circle cx="11" cy="18" r="2.5" />
              </g>

              {/* 12. Friendly Robot Head (AI & Robotics) @ (95, 170) */}
              <g transform="translate(90, 165) rotate(4)">
                <rect x="4" y="6" width="24" height="20" rx="4" fill="#f8fafc" />
                <line x1="16" y1="6" x2="16" y2="1" />
                <circle cx="16" cy="1" r="1.5" fill="#64748b" />
                <circle cx="10" cy="14" r="2.5" fill="#64748b" />
                <circle cx="22" cy="14" r="2.5" fill="#64748b" />
                <path d="M 10 21 Q 16 24 22 21" />
                <rect x="1" y="12" width="3" height="6" rx="1" />
                <rect x="28" y="12" width="3" height="6" rx="1" />
              </g>

              {/* 13. Professional Briefcase (Business & Finance) @ (175, 170) */}
              <g transform="translate(170, 165) rotate(-6)">
                <rect x="2" y="8" width="28" height="18" rx="3" fill="#f8fafc" />
                <path d="M 10 8 L 10 4 C 10 3 12 3 16 3 C 20 3 22 3 22 4 L 22 8" />
                <line x1="2" y1="14" x2="30" y2="14" strokeDasharray="1.5 2" />
                <rect x="14" y="13" width="4" height="4" rx="1" fill="#64748b" />
              </g>

              {/* 14. Camera with Flash (Photography & Media) @ (250, 170) */}
              <g transform="translate(245, 165) rotate(8)">
                <rect x="2" y="6" width="26" height="18" rx="3" fill="#f8fafc" />
                <path d="M 8 6 L 10 3 L 16 3 L 18 6" />
                <circle cx="15" cy="15" r="5" fill="#f8fafc" />
                <circle cx="15" cy="15" r="2" fill="#64748b" />
                <circle cx="23" cy="9" r="1" fill="#64748b" />
              </g>

              {/* 15. Planet with Orbit Ring (Astrophysics) @ (310, 175) */}
              <g transform="translate(305, 170) rotate(-20)">
                <circle cx="14" cy="14" r="8" fill="#f8fafc" />
                <ellipse cx="14" cy="14" rx="14" ry="4" strokeDasharray="20 4" />
              </g>

              {/* 16. Heartbeat Pulse Waveform (Healthcare) @ (25, 250) */}
              <g transform="translate(20, 245)">
                <path d="M 2 12 L 8 12 L 12 4 L 16 20 L 20 8 L 24 16 L 28 12 L 36 12" />
              </g>

              {/* 17. Drafting Compass & Ruler (Engineering & Architecture) @ (100, 250) */}
              <g transform="translate(95, 245) rotate(15)">
                <circle cx="14" cy="3" r="2" fill="#64748b" />
                <path d="M 13 4 L 4 25 M 15 4 L 24 25" />
                <path d="M 7 17 Q 14 19 21 17" strokeDasharray="1.5 2" />
              </g>

              {/* 18. Steaming Coffee Mug (Design & Tech Workflows) @ (175, 250) */}
              <g transform="translate(170, 245) rotate(-5)">
                <rect x="4" y="8" width="18" height="16" rx="3" fill="#f8fafc" />
                <path d="M 22 11 C 26 11 26 19 22 19" />
                <path d="M 8 4 Q 10 1 8 -2" stroke="#6366f1" />
                <path d="M 14 4 Q 16 1 14 -2" stroke="#6366f1" />
              </g>

              {/* 19. Movie Clapperboard (Film & Multimedia) @ (250, 250) */}
              <g transform="translate(245, 245) rotate(-10)">
                <rect x="2" y="8" width="26" height="18" rx="2" fill="#f8fafc" />
                <path d="M 1 8 L 27 3 L 28 8 Z" fill="#64748b" fillOpacity="0.15" />
                <line x1="8" y1="4" x2="11" y2="8" />
                <line x1="16" y1="4" x2="19" y2="8" />
                <line x1="2" y1="14" x2="28" y2="14" />
              </g>

              {/* 20. Headphones with Beats (Audio Production & Sound) @ (310, 250) */}
              <g transform="translate(305, 245) rotate(5)">
                <path d="M 4 14 C 4 6 12 2 18 2 C 24 2 32 6 32 14" />
                <rect x="2" y="14" width="5" height="9" rx="2" fill="#f8fafc" />
                <rect x="29" y="14" width="5" height="9" rx="2" fill="#f8fafc" />
              </g>

              {/* 21. Interlocking Gears (Mechanical & Hardware Engineering) @ (25, 315) */}
              <g transform="translate(20, 305) rotate(10)">
                <circle cx="12" cy="12" r="6" fill="#f8fafc" />
                <path d="M 12 3 L 12 6 M 12 18 L 12 21 M 3 12 L 6 12 M 18 12 L 21 12 M 5 5 L 8 8 M 16 16 L 19 19 M 5 19 L 8 16 M 16 8 L 19 5" strokeWidth="2" />
                <circle cx="12" cy="12" r="2" fill="#64748b" />
              </g>

              {/* 22. Chemical Test Tube with Bubbles (Chemistry & Pharmacology) @ (100, 315) */}
              <g transform="translate(95, 305) rotate(-22)">
                <path d="M 8 2 L 8 20 C 8 23 14 23 14 20 L 14 2 Z" fill="#f8fafc" />
                <line x1="6" y1="2" x2="16" y2="2" strokeWidth="2" />
                <line x1="8" y1="12" x2="14" y2="12" strokeDasharray="1.5 2" />
                <circle cx="10" cy="16" r="1" fill="#64748b" />
                <circle cx="12" cy="10" r="0.75" fill="#64748b" />
              </g>

              {/* 23. Marine Anchor & Compass (Navigation & Maritime) @ (175, 315) */}
              <g transform="translate(170, 305) rotate(8)">
                <circle cx="14" cy="5" r="2.5" fill="#f8fafc" />
                <line x1="14" y1="7" x2="14" y2="22" strokeWidth="1.75" />
                <line x1="8" y1="11" x2="20" y2="11" strokeWidth="1.75" />
                <path d="M 5 16 C 5 24 23 24 23 16" strokeWidth="1.75" />
              </g>

              {/* 24. Gold Star & Ribbon Medal (Achievement & Licensure) @ (250, 315) */}
              <g transform="translate(245, 305) rotate(-5)">
                <circle cx="13" cy="9" r="6" fill="#f8fafc" />
                <path d="M 9 14 L 6 24 L 13 21 L 20 24 L 17 14" />
                <circle cx="13" cy="9" r="2" fill="#f59e0b" />
              </g>

              {/* 25. Cyber Shield & Keyhole (Cybersecurity & Trust) @ (310, 315) */}
              <g transform="translate(305, 305) rotate(5)">
                <path d="M 4 4 L 14 1 L 24 4 C 24 14 14 20 14 20 C 14 20 4 14 4 4 Z" fill="#f8fafc" />
                <circle cx="14" cy="9" r="2" fill="#64748b" />
                <path d="M 14 11 L 14 14" strokeWidth="2" />
              </g>

              {/* Playful Floating Dots & Micro Accents across the canvas */}
              <circle cx="65" cy="55" r="1.5" fill="#cbd5e1" />
              <circle cx="140" cy="58" r="1" fill="#cbd5e1" />
              <circle cx="215" cy="48" r="1.5" fill="#cbd5e1" />
              <circle cx="280" cy="62" r="1" fill="#cbd5e1" />
              <circle cx="55" cy="135" r="1.2" fill="#cbd5e1" />
              <circle cx="145" cy="130" r="1.5" fill="#cbd5e1" />
              <circle cx="215" cy="135" r="1" fill="#cbd5e1" />
              <circle cx="285" cy="138" r="1.5" fill="#cbd5e1" />
              <circle cx="65" cy="210" r="1" fill="#cbd5e1" />
              <circle cx="135" cy="215" r="1.5" fill="#cbd5e1" />
              <circle cx="215" cy="210" r="1.2" fill="#cbd5e1" />
              <circle cx="280" cy="215" r="1" fill="#cbd5e1" />
              <circle cx="60" cy="280" r="1.5" fill="#cbd5e1" />
              <circle cx="140" cy="285" r="1" fill="#cbd5e1" />
              <circle cx="225" cy="280" r="1.5" fill="#cbd5e1" />
              <circle cx="285" cy="285" r="1" fill="#cbd5e1" />

              {/* Tiny crosshairs / plus marks */}
              <path d="M 48 42 L 54 42 M 51 39 L 51 45" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 125 115 L 131 115 M 128 112 L 128 118" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 220 188 L 226 188 M 223 185 L 223 191" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 75 260 L 81 260 M 78 257 L 78 263" stroke="#94a3b8" strokeWidth="1" />
            </g>
          </pattern>
        </defs>

        {/* Seamless Infinite Tiling Rect */}
        <rect width="100%" height="100%" fill="url(#notion-career-doodles)" />
      </svg>

      {/* 3. Soft Center Spotlight Vignette Mask (ensures 100% crisp contrast for search bar & text) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 36%, rgba(248, 250, 252, 0.96) 0%, rgba(248, 250, 252, 0.85) 45%, rgba(248, 250, 252, 0.4) 80%, rgba(248, 250, 252, 0.15) 100%)",
        }}
      />
    </div>
  );
}
