"use client";

import React from "react";

export function CareerBackgroundVisuals() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Subtle Engineering Blueprint Grid & Dot Matrix */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_85%)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="career-grid-pattern"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#6366f1"
              strokeWidth="0.5"
              strokeDasharray="2 6"
              strokeOpacity="0.25"
            />
            <circle cx="2" cy="2" r="1" fill="#4f46e5" fillOpacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#career-grid-pattern)" />
      </svg>

      {/* 2. Soft Ambient Atmospheric Color Flares */}
      <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-indigo-300/15 via-purple-300/10 to-transparent blur-3xl transform-gpu" />
      <div className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-blue-200/20 via-sky-200/10 to-transparent blur-3xl transform-gpu" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-amber-200/15 via-rose-200/10 to-transparent blur-3xl transform-gpu" />

      {/* 3. Floating Career Drawings, Sketches & Badges */}

      {/* TOP LEFT: Aviation & Aerospace (Supersonic Jet & Flight Vector) */}
      <div className="absolute top-20 left-4 sm:left-12 lg:left-20 animate-float-slow opacity-30 hover:opacity-80 transition-opacity duration-300">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none" className="stroke-indigo-600">
          {/* Supersonic Jet Blueprint Drawing */}
          <path
            d="M 50 15 L 56 38 L 88 56 L 88 62 L 56 56 L 56 76 L 68 85 L 68 89 L 50 85 L 32 89 L 32 85 L 44 76 L 44 56 L 12 62 L 12 56 L 44 38 Z"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="fill-indigo-50/40"
          />
          {/* Aerodynamic Flight Vector Lines */}
          <path d="M 50 8 L 50 2" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M 22 72 Q 10 78 4 92" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.6" />
          <path d="M 78 72 Q 90 78 96 92" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.6" />
          {/* Compass Heading Indicator */}
          <circle cx="50" cy="50" r="44" strokeWidth="0.75" strokeDasharray="3 5" strokeOpacity="0.4" />
          <text x="50" y="98" textAnchor="middle" fill="#4338ca" fontSize="6" fontFamily="monospace" fontWeight="bold">FLIGHT OPS 090°</text>
        </svg>
      </div>

      {/* TOP RIGHT: Healthcare & Surgery (Stethoscope & DNA Helix) */}
      <div className="absolute top-24 right-4 sm:right-12 lg:right-24 animate-float-reverse opacity-30 hover:opacity-80 transition-opacity duration-300">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none" className="stroke-rose-500">
          {/* Stethoscope Blueprint */}
          <path
            d="M 30 18 C 30 35 45 45 50 45 C 55 45 70 35 70 18"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path d="M 30 18 L 26 18 M 70 18 L 74 18" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 50 45 L 50 68 C 50 78 62 82 62 72 C 62 64 56 62 56 58" strokeWidth="1.75" strokeLinecap="round" />
          {/* Chestpiece Disc */}
          <circle cx="56" cy="56" r="6" strokeWidth="1.5" className="fill-rose-50/50" />
          <circle cx="56" cy="56" r="2.5" strokeWidth="1" />
          {/* ECG Pulse Line */}
          <path
            d="M 8 82 L 24 82 L 28 72 L 32 92 L 36 68 L 40 85 L 44 82 L 88 82"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.7"
          />
          <text x="50" y="96" textAnchor="middle" fill="#e11d48" fontSize="6" fontFamily="monospace" fontWeight="bold">VITAL SIGNS: NORMAL</text>
        </svg>
      </div>

      {/* MID LEFT: Computer Science & Architecture (Code, Terminal & Database) */}
      <div className="absolute top-[38%] left-2 sm:left-8 lg:left-14 animate-float-horizontal opacity-30 hover:opacity-80 transition-opacity duration-300">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none" className="stroke-indigo-600">
          {/* Terminal Window Box */}
          <rect x="10" y="15" width="80" height="55" rx="6" strokeWidth="1.5" className="fill-indigo-50/30" />
          <line x1="10" y1="26" x2="90" y2="26" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="18" cy="20.5" r="1.8" fill="#6366f1" />
          <circle cx="24" cy="20.5" r="1.8" fill="#818cf8" />
          <circle cx="30" cy="20.5" r="1.8" fill="#a5b4fc" />
          {/* Code Brackets & Prompt */}
          <path d="M 20 38 L 26 44 L 20 50" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="32" y1="50" x2="44" y2="50" strokeWidth="2" strokeLinecap="round" />
          {/* Database Cylinder */}
          <ellipse cx="68" cy="80" rx="18" ry="5.5" strokeWidth="1.25" className="fill-indigo-50/50" />
          <path d="M 50 80 L 50 92 C 50 95 86 95 86 92 L 86 80" strokeWidth="1.25" />
          <text x="50" y="7" textAnchor="middle" fill="#4f46e5" fontSize="6" fontFamily="monospace" fontWeight="bold">&lt;SYSTEM_ARCH /&gt;</text>
        </svg>
      </div>

      {/* MID RIGHT: Game Development & 3D Shaders (Arcade Gamepad & Isometric Cube) */}
      <div className="absolute top-[42%] right-2 sm:right-8 lg:right-14 animate-float-slow opacity-30 hover:opacity-80 transition-opacity duration-300">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none" className="stroke-purple-600">
          {/* Retro Gamepad Controller */}
          <path
            d="M 22 28 C 14 28 8 36 8 46 C 8 58 16 66 26 66 C 31 66 36 62 40 56 L 60 56 C 64 62 69 66 74 66 C 84 66 92 58 92 46 C 92 36 86 28 78 28 Z"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="fill-purple-50/30"
          />
          {/* D-Pad Buttons */}
          <path d="M 24 38 L 24 50 M 18 44 L 30 44" strokeWidth="2" strokeLinecap="round" />
          {/* Action Buttons */}
          <circle cx="70" cy="40" r="2.5" fill="#9333ea" />
          <circle cx="78" cy="46" r="2.5" fill="#a855f7" />
          <circle cx="70" cy="52" r="2.5" fill="#c084fc" />
          <circle cx="62" cy="46" r="2.5" fill="#e9d5ff" />
          {/* 3D Wireframe Isometric Polygon */}
          <path d="M 50 72 L 68 81 L 50 90 L 32 81 Z" strokeWidth="1.25" className="fill-purple-100/40" />
          <path d="M 32 81 L 32 94 L 50 103 L 50 90 Z" strokeWidth="1.25" />
          <path d="M 68 81 L 68 94 L 50 103 L 50 90 Z" strokeWidth="1.25" />
          <text x="50" y="20" textAnchor="middle" fill="#7e22ce" fontSize="6" fontFamily="monospace" fontWeight="bold">UNREAL_ENGINE_5</text>
        </svg>
      </div>

      {/* LOWER LEFT: Culinary Arts & Trades (Chef Toque, Crossed Knives & Gear) */}
      <div className="absolute bottom-28 left-4 sm:left-14 lg:left-24 animate-float-reverse opacity-30 hover:opacity-80 transition-opacity duration-300">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none" className="stroke-amber-600">
          {/* Chef's Toque Blanche Hat */}
          <path
            d="M 28 50 C 18 42 22 28 34 26 C 36 14 50 12 56 20 C 64 12 76 16 78 26 C 88 28 90 42 80 50 Z"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="fill-amber-50/40"
          />
          <path d="M 30 50 L 30 62 L 78 62 L 78 50" strokeWidth="1.5" />
          <line x1="30" y1="56" x2="78" y2="56" strokeWidth="1" strokeDasharray="3 3" />
          {/* Crossed Kitchen Knives */}
          <path d="M 22 72 L 76 96 M 76 72 L 22 96" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="22" cy="72" r="3" strokeWidth="1" />
          <circle cx="76" cy="72" r="3" strokeWidth="1" />
          <text x="54" y="99" textAnchor="middle" fill="#b45309" fontSize="6" fontFamily="monospace" fontWeight="bold">CULINARY &amp; GASTRONOMY</text>
        </svg>
      </div>

      {/* LOWER RIGHT: Robotics, Hardware & Electronics (Robotic Gripper & Microchip) */}
      <div className="absolute bottom-28 right-4 sm:right-14 lg:right-24 animate-float-horizontal opacity-30 hover:opacity-80 transition-opacity duration-300">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none" className="stroke-emerald-600">
          {/* Microcontroller Silicon Chip */}
          <rect x="30" y="30" width="40" height="40" rx="4" strokeWidth="1.5" className="fill-emerald-50/40" />
          {/* Chip Pins */}
          <line x1="22" y1="38" x2="30" y2="38" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="46" x2="30" y2="46" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="54" x2="30" y2="54" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="62" x2="30" y2="62" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="38" x2="78" y2="38" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="46" x2="78" y2="46" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="54" x2="78" y2="54" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="62" x2="78" y2="62" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="22" x2="38" y2="30" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="22" x2="50" y2="30" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="62" y1="22" x2="62" y2="30" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="70" x2="38" y2="78" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="70" x2="50" y2="78" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="62" y1="70" x2="62" y2="78" strokeWidth="1.5" strokeLinecap="round" />
          {/* Internal Circuit Core */}
          <rect x="42" y="42" width="16" height="16" rx="2" strokeWidth="1" className="fill-emerald-600/20" />
          {/* Mechanical Gear Cog */}
          <circle cx="50" cy="50" r="4" fill="#059669" />
          <text x="50" y="96" textAnchor="middle" fill="#047857" fontSize="6" fontFamily="monospace" fontWeight="bold">ROBOTICS &amp; IOT CORE</text>
        </svg>
      </div>

      {/* 4. Floating Career Archetype Visual Badges (Visible on larger screens) */}
      <div className="hidden xl:block">
        {/* Aerospace Tag */}
        <div className="absolute top-[18%] left-[2%] animate-float-slow">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-200/70 shadow-xs text-xs font-bold text-indigo-900">
            <span className="text-base">🚀</span>
            <span>Aerospace &amp; Avionics</span>
          </div>
        </div>

        {/* Medicine Tag */}
        <div className="absolute top-[22%] right-[3%] animate-float-reverse">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-rose-200/70 shadow-xs text-xs font-bold text-rose-900">
            <span className="text-base">🩺</span>
            <span>Clinical Medicine</span>
          </div>
        </div>

        {/* AI & Cloud Tag */}
        <div className="absolute top-[52%] left-[1.5%] animate-float-horizontal">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-blue-200/70 shadow-xs text-xs font-bold text-blue-900">
            <span className="text-base">💻</span>
            <span>Full-Stack &amp; AI Cloud</span>
          </div>
        </div>

        {/* Game Dev Tag */}
        <div className="absolute top-[55%] right-[2%] animate-float-slow">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-200/70 shadow-xs text-xs font-bold text-purple-900">
            <span className="text-base">🎮</span>
            <span>Game Dev &amp; Shaders</span>
          </div>
        </div>

        {/* Culinary Arts Tag */}
        <div className="absolute bottom-[20%] left-[3%] animate-float-reverse">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-amber-200/70 shadow-xs text-xs font-bold text-amber-900">
            <span className="text-base">🍳</span>
            <span>Culinary Master Chef</span>
          </div>
        </div>

        {/* Robotics Tag */}
        <div className="absolute bottom-[18%] right-[3%] animate-float-slow">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-emerald-200/70 shadow-xs text-xs font-bold text-emerald-900">
            <span className="text-base">🤖</span>
            <span>Robotics &amp; Mechatronics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
