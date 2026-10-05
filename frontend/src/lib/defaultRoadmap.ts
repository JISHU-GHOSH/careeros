import { RoadmapResponse } from "@/types";

export const DEFAULT_GAME_DEV_ROADMAP: RoadmapResponse = {
  profession: "Game Developer",
  experience_level: "beginner",
  summary:
    "Build immersive 2D and 3D games across indie and AAA studios, mastering game engines, physics, rendering, and gameplay programming.",
  salary_range: "$75,000 - $150,000 / year",
  estimated_months: 9,
  stages: [
    {
      stage_index: 1,
      title: "Stage 1: Programming & Math Foundations",
      estimated_weeks: 6,
      node_ids: ["game-lang", "game-math"],
    },
    {
      stage_index: 2,
      title: "Stage 2: Game Engines & 2D Architecture",
      estimated_weeks: 8,
      node_ids: ["engine-choice", "game-loop-2d"],
    },
    {
      stage_index: 3,
      title: "Stage 3: 3D Graphics, Shaders & Physics",
      estimated_weeks: 10,
      node_ids: ["physics-3d", "shaders-lighting"],
    },
    {
      stage_index: 4,
      title: "Stage 4: Audio, AI & Multiplayer Networking",
      estimated_weeks: 8,
      node_ids: ["game-ai", "multiplayer-net"],
    },
    {
      stage_index: 5,
      title: "Stage 5: Polishing, Game Jams & Shipping",
      estimated_weeks: 6,
      node_ids: ["game-jam-portfolio"],
    },
  ],
  nodes: [
    {
      id: "game-lang",
      title: "C++ or C# Core Programming",
      stage_index: 1,
      category: "essential",
      description:
        "Master memory management, pointers, object-oriented design, and data structures essential for real-time game performance.",
      key_skills: ["C++", "C#", "Data Structures", "Memory Management"],
      project_challenge:
        "Build a text-based Roguelike game with inventory management and procedural dungeon rooms in pure C++ or C#.",
      resources: [
        "LearnCpp.com",
        "C# Documentation - Microsoft Learn",
        "Game Programming Patterns by Robert Nystrom",
      ],
      prerequisites: [],
      status: "mastered",
    },
    {
      id: "game-math",
      title: "Linear Algebra & Trigonometry for Games",
      stage_index: 1,
      category: "essential",
      description:
        "Learn vectors, dot products, cross products, matrices, quaternions, and raycasting required for 2D/3D transformations.",
      key_skills: [
        "Vectors & Matrices",
        "Quaternions",
        "Trigonometry",
        "Collision Math",
      ],
      project_challenge:
        "Implement a 2D vector physics sandbox demonstrating gravity, elastic bounces, and angle reflections.",
      resources: [
        "3Blue1Brown - Essence of Linear Algebra",
        "Freya Holmér - Math for Game Devs",
      ],
      prerequisites: ["game-lang"],
      status: "mastered",
    },
    {
      id: "engine-choice",
      title: "Game Engine Fundamentals (Unity or Unreal)",
      stage_index: 2,
      category: "essential",
      description:
        "Learn component-based architecture, scene graphs, assets import, prefabs, and camera setups in Unity (C#) or Unreal Engine 5 (C++/Blueprints).",
      key_skills: [
        "Unity",
        "Unreal Engine 5",
        "Blueprints",
        "Prefab Architecture",
      ],
      project_challenge:
        "Create a fully functional 2D top-down action game with health bars, enemies, and save/load state.",
      resources: [
        "Unity Learn Pathways",
        "Epic Games Unreal Online Learning",
        "Brackeys Archive",
      ],
      prerequisites: ["game-math"],
      status: "in_progress",
    },
    {
      id: "game-loop-2d",
      title: "Game State, UI & Animation Controllers",
      stage_index: 2,
      category: "recommended",
      description:
        "Structure finite state machines for player states (Idle, Run, Jump, Attack), integrate HUD menus, and handle sprite/skeletal animations.",
      key_skills: [
        "Finite State Machines",
        "Canvas UI",
        "Animation Trees",
        "Audio Triggers",
      ],
      project_challenge:
        "Build a responsive combat system with combo strikes, hitboxes, hurtboxes, and particle impact effects.",
      resources: [
        "Game Programming Patterns - State",
        "Unity Animation Controller Docs",
      ],
      prerequisites: ["engine-choice"],
      status: "to_learn",
    },
    {
      id: "physics-3d",
      title: "3D Character Controllers & Physics Simulation",
      stage_index: 3,
      category: "essential",
      description:
        "Implement kinematic vs rigid-body 3D movement, custom gravity, slope sliding, raycast ground detection, and ragdoll physics.",
      key_skills: [
        "PhysX / Chaos Engine",
        "Character Controllers",
        "Ragdoll Physics",
        "Raycasting",
      ],
      project_challenge:
        "Build a 3D parkour platformer with wall-running, double-jumping, and ledge-grabbing mechanics.",
      resources: [
        "Catlike Coding - Movement Tutorials",
        "Unreal Character Movement Guide",
      ],
      prerequisites: ["engine-choice"],
      status: "to_learn",
    },
    {
      id: "shaders-lighting",
      title: "Shaders, Materials & Visual FX (HLSL/ShaderGraph)",
      stage_index: 3,
      category: "specialization",
      description:
        "Understand vertex and fragment shaders, PBR lighting models, post-processing volumes, particle systems (Niagara / VFX Graph), and render pipelines.",
      key_skills: [
        "Shader Graph",
        "HLSL",
        "Niagara VFX",
        "Post-Processing",
      ],
      project_challenge:
        "Write a custom water surface shader with foam ripples, depth refraction, and vertex wave displacement.",
      resources: [
        "The Book of Shaders",
        "Ben Cloward Shader Series",
        "Freya Holmér - Shaders",
      ],
      prerequisites: ["physics-3d"],
      status: "to_learn",
    },
    {
      id: "game-ai",
      title: "Gameplay AI & Pathfinding (NavMesh & Behavior Trees)",
      stage_index: 4,
      category: "recommended",
      description:
        "Design intelligent enemy encounters using NavMesh navigation, A* pathfinding, sensory perception (sight/sound), and Behavior Trees.",
      key_skills: [
        "NavMesh",
        "Behavior Trees",
        "Sensory AI",
        "A* Algorithm",
      ],
      project_challenge:
        "Build a stealth infiltration mission where guards patrol, investigate strange noises, and coordinate pursuit when alerting.",
      resources: [
        "Artificial Intelligence for Games by Ian Millington",
        "Unreal Behavior Tree Quick Start",
      ],
      prerequisites: ["physics-3d"],
      status: "to_learn",
    },
    {
      id: "multiplayer-net",
      title: "Multiplayer Game Networking",
      stage_index: 4,
      category: "specialization",
      description:
        "Master client-server architecture, tick rates, UDP packets, server reconciliation, dead reckoning, and lag compensation.",
      key_skills: [
        "Client-Side Prediction",
        "Lag Compensation",
        "Photon / FishNet",
        "UDP/WebSockets",
      ],
      project_challenge:
        "Build a 4-player online deathmatch arena with authorative server movement and smooth rollback prediction.",
      resources: [
        "Gabriel Gambetta - Fast-Paced Multiplayer Guide",
        "Mirror / Netcode for GameObjects",
      ],
      prerequisites: ["physics-3d"],
      status: "to_learn",
    },
    {
      id: "game-jam-portfolio",
      title: "Game Jam, Polish & Steam / Itch.io Release",
      stage_index: 5,
      category: "essential",
      description:
        "Participate in a 48-hour game jam, optimize framerates (profiler, draw calls, LODs), package builds, and publish on Itch.io or Steam.",
      key_skills: [
        "Profiler & Draw Call Optimization",
        "Game Packaging",
        "Steamworks SDK",
        "Player Playtesting",
      ],
      project_challenge:
        "Package and ship a complete, polished 15-minute game with audio, options menu, and controller support on Itch.io.",
      resources: [
        "Ludum Dare Community",
        "Game Maker's Toolkit (GMTK)",
        "Steamworks Documentation",
      ],
      prerequisites: ["game-ai"],
      status: "to_learn",
    },
  ],
};
