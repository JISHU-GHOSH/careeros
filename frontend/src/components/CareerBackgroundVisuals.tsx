"use client";

import React from "react";

interface CareerPhotoCard {
  id: string;
  title: string;
  domain: string;
  emoji: string;
  imageUrl: string;
  positionClasses: string;
  animationClass: string;
  rotateClass: string;
}

const CAREER_PHOTOS: CareerPhotoCard[] = [
  // 1. Aviation / Commercial Pilot
  {
    id: "pilot",
    title: "Commercial Airline Pilot",
    domain: "Aviation & Flight Ops",
    emoji: "✈️",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    positionClasses: "top-[4%] left-[-2%] sm:left-[2%] lg:left-[4%] w-64 sm:w-72 lg:w-80",
    animationClass: "animate-float-slow",
    rotateClass: "-rotate-2",
  },
  // 2. Medicine & Surgery
  {
    id: "doctor",
    title: "Clinical Surgery & Medicine",
    domain: "Healthcare Sciences",
    emoji: "🩺",
    imageUrl:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    positionClasses: "top-[6%] right-[-2%] sm:right-[2%] lg:right-[4%] w-64 sm:w-72 lg:w-80",
    animationClass: "animate-float-reverse",
    rotateClass: "rotate-2",
  },
  // 3. Software Engineer / Cloud Architecture
  {
    id: "developer",
    title: "Full-Stack & Cloud Engineer",
    domain: "Software & Distributed Systems",
    emoji: "💻",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    positionClasses: "top-[32%] left-[-4%] sm:left-[1%] lg:left-[3%] w-60 sm:w-68 lg:w-76",
    animationClass: "animate-float-horizontal",
    rotateClass: "rotate-1",
  },
  // 4. Game Developer & 3D Shaders
  {
    id: "gamedev",
    title: "AAA Game Development & Unreal",
    domain: "Real-time Graphics & 3D",
    emoji: "🎮",
    imageUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    positionClasses: "top-[34%] right-[-4%] sm:right-[1%] lg:right-[3%] w-60 sm:w-68 lg:w-76",
    animationClass: "animate-float-slow",
    rotateClass: "-rotate-1",
  },
  // 5. Aerospace & Astrophysics
  {
    id: "aerospace",
    title: "Aerospace Propulsion & Rocketry",
    domain: "Space Exploration",
    emoji: "🚀",
    imageUrl:
      "https://images.unsplash.com/photo-1517976487588-34839cf1f40f?auto=format&fit=crop&w=800&q=80",
    positionClasses: "top-[58%] left-[-3%] sm:left-[2%] lg:left-[5%] w-64 sm:w-72 lg:w-80",
    animationClass: "animate-float-reverse",
    rotateClass: "-rotate-2",
  },
  // 6. Culinary Master Chef
  {
    id: "chef",
    title: "Executive Master Chef",
    domain: "Haute Cuisine & Gastronomy",
    emoji: "🍳",
    imageUrl:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
    positionClasses: "top-[60%] right-[-3%] sm:right-[2%] lg:right-[5%] w-64 sm:w-72 lg:w-80",
    animationClass: "animate-float-horizontal",
    rotateClass: "rotate-2",
  },
  // 7. Robotics & Autonomous Mechatronics
  {
    id: "robotics",
    title: "Robotics & Autonomous Systems",
    domain: "Hardware & AI Control",
    emoji: "🤖",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    positionClasses: "bottom-[5%] left-[-2%] sm:left-[3%] lg:left-[6%] w-64 sm:w-72 lg:w-80",
    animationClass: "animate-float-slow",
    rotateClass: "rotate-1",
  },
  // 8. Cybersecurity Analyst
  {
    id: "cybersecurity",
    title: "Offensive Cyber & SOC Analyst",
    domain: "Information Security",
    emoji: "🔒",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    positionClasses: "bottom-[4%] right-[-2%] sm:right-[3%] lg:right-[6%] w-64 sm:w-72 lg:w-80",
    animationClass: "animate-float-reverse",
    rotateClass: "-rotate-1",
  },
];

export function CareerBackgroundVisuals() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Underlying Atmospheric Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-200/25 via-purple-200/20 to-transparent blur-3xl transform-gpu" />
      <div className="absolute top-[35%] -right-32 w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-blue-200/25 via-teal-200/15 to-transparent blur-3xl transform-gpu" />
      <div className="absolute -bottom-32 left-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-amber-200/20 via-rose-200/15 to-transparent blur-3xl transform-gpu" />

      {/* 2. Full-Bleed Aesthetic Photography Wallpaper Collage */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {CAREER_PHOTOS.map((card) => (
          <div
            key={card.id}
            className={`absolute ${card.positionClasses} ${card.animationClass} transition-transform duration-500`}
          >
            <div
              className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-2 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:shadow-indigo-500/20 ${card.rotateClass}`}
            >
              {/* Photo Image Frame */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center filter saturate-[1.15] contrast-[1.05] transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle dark gradient overlay inside card */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Bottom Overlay Pill with Career Metadata */}
                <div className="absolute bottom-2 left-2 right-2 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm shrink-0 drop-shadow-md">{card.emoji}</span>
                    <span className="text-[11px] font-black tracking-tight text-white drop-shadow-md truncate">
                      {card.title}
                    </span>
                  </div>
                  <p className="text-[9px] font-semibold text-slate-200/90 tracking-wide uppercase truncate pl-5">
                    {card.domain}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Soft Blueprint Grid Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.25] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_85%)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="career-blueprint-dots"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#4f46e5" fillOpacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#career-blueprint-dots)" />
      </svg>

      {/* 4. Center Spotlight Mask to ensure 100% crystal-clear readability for search and content */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 38%, rgba(248, 250, 252, 0.95) 0%, rgba(248, 250, 252, 0.88) 45%, rgba(248, 250, 252, 0.55) 75%, rgba(248, 250, 252, 0.25) 100%)",
        }}
      />
    </div>
  );
}
