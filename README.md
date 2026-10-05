# CareerOS Platform

> **Intelligent Career Mapping, Skill-Gap Diagnostic Matrix, and Career Progression Acceleration Engine**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![NetworkX](https://img.shields.io/badge/NetworkX-3.2-orange.svg)](https://networkx.org/)
[![uv](https://img.shields.io/badge/uv-fast_packaging-purple.svg)](https://docs.astral.sh/uv/)
[![Tests](https://img.shields.io/badge/tests-39%20passed-brightgreen.svg)](#verification--testing)

---

## 1. System Overview & Architecture

CareerOS replaces static course catalogs and static questionnaires with a dynamic, graph-based competency model, interactive career path visualization, and artifact-verified learning pathways.

The platform is designed around a **Two-Tier Decoupled Architecture**:

```
+--------------------------------------------------------------------------+
|                       FRONTEND TIER (Next.js 14)                         |
|  - Interactive Trajectory Node Canvas (SVG / Responsive SVG Canvas)      |
|  - Dynamic Skill-Gap Diagnostic Matrix with Multi-Category Filters       |
|  - Milestone Pathway & Optimistic Task Progression Engine (<16ms updates)|
|  - 60-Second Onboarding Wizard & Drag-and-Drop Resume Ingestion          |
|  - Stealth Mode Privacy Masking for Workplace Confidentiality            |
+------------------------------------+-------------------------------------+
                                     |
                          HTTP / REST (JSON API)
                                     |
+------------------------------------v-------------------------------------+
|                     INTELLIGENCE TIER (Python FastAPI)                   |
|  - NetworkX Directed Acyclic Graph (Roles, Seniority, Pivots, Dag Trees) |
|  - Confidence-Weighted Gap & Readiness Diagnostics Formula               |
|  - Topological Milestone Pathway Generator with Mentor Matching          |
|  - Regular Expression & Heuristic Resume Entity Extraction Engine        |
|  - Reverse Trajectory Simulation (Skill ROI Calculator)                  |
+--------------------------------------------------------------------------+
```

### Technology Stack
* **Frontend Tier (`/frontend`)**:
  * **Framework**: Next.js 14 (App Router), React 18, TypeScript 5.
  * **Styling**: Tailwind CSS with custom glassmorphism styling, Lucide React icons.
  * **State Architecture**: `CareerContext` providing optimistic state updates (sub-16ms perceptual latency) and out-of-band server synchronization.
* **Backend Tier (`/backend`)**:
  * **Framework**: Python FastAPI with Pydantic v2 strict contract validation.
  * **Graph Intelligence**: `NetworkX` directed graph representing ontology roles, progression paths, and prerequisite skill DAGs.
  * **Package & Runtime Manager**: `uv` for sub-second virtualenv provisioning and test execution.

---

## 2. Quickstart Guide

### Prerequisites
Make sure the following tools are installed on your workstation:
* **Node.js**: v18.0 or higher ([Download Node.js](https://nodejs.org/))
* **Python**: v3.10 or higher ([Download Python](https://www.python.org/downloads/))
* **uv**: Astral's ultra-fast Python package manager ([Install uv](https://docs.astral.sh/uv/getting-started/installation/)):
  ```powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```

---

### Option A: 1-Command Startup (Recommended)

Launch both the FastAPI intelligence backend and Next.js frontend concurrently with a single command:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/dev.ps1
```

The script verifies all prerequisites, checks port availability (8000 and 3000), starts both services concurrently, displays live endpoints, and ensures clean process termination upon pressing `Ctrl+C`.

**Optional Flags**:
* `-SeparateWindows`: Launches backend and frontend in dedicated, titled console windows.
* `-BackendPort <port>`: Overrides FastAPI port (default: `8000`).
* `-FrontendPort <port>`: Overrides Next.js port (default: `3000`).

---

### Option B: Manual Startup

#### 1. Backend Service
```bash
cd backend
uv sync
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend will be live at: `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`)

#### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Frontend dashboard will be live at: `http://localhost:3000`

---

## 3. Core Features & Capabilities

### 1. Interactive Trajectory Map (`TrajectoryMap.tsx`)
* Visualizes career progression across seniority levels: **Junior** (L1) ➔ **Mid** (L2) ➔ **Target Senior** (L3) ➔ **Staff Architect** (L4).
* Renders lateral pivots (e.g., pivot to DevOps / Platform Engineering).
* Integrates a radial **Readiness Gauge** displaying real-time target fit percentage.

### 2. Skill-Gap Diagnostic Matrix (`SkillMatrix.tsx` & `SkillItem.tsx`)
* Evaluates competencies against market role requirements.
* 4-way category filtering: `All`, `Missing Gaps`, `Needs Polish`, and `Validated`.
* Depth badges indicating depth level: `Conceptual`, `Applied`, and `Architectural`.
* Confidence scoring reflecting source verification (Self-Report: 40%, Resume Parsed: 80%, Artifact-Verified: 95%).

### 3. Actionable Milestone Pathway (`MilestonePathway.tsx` & `TaskCard.tsx`)
* Week-by-week sequenced curriculum generated via NetworkX topological sorting.
* Interactive task checkoffs with immediate XP reward animations.
* Mentor matching cards with 1-on-1 consultation booking triggers.

### 4. 0ms Optimistic UI Engine (`CareerContext.tsx`)
* Eliminates perceived latency: checking off milestones updates local state, XP, and readiness gauge synchronously (<16ms) while syncing with the server out-of-band.
* Resilient offline fallbacks ensure the dashboard remains fully functional even during temporary backend service disconnects.

### 5. 60-Second Onboarding & Resume Dropzone (`OnboardingModal.tsx` & `ResumeDropzone.tsx`)
* Drag-and-drop resume parser supporting `.txt`, `.md`, `.pdf`, `.json`, and `.rtf`.
* Instant 1-click sample resume demo for immediate testing.
* 3-step rapid calibration wizard evaluating target role, transition mode (Fast-Track vs Lateral Pivot), and key competency depth.

### 6. Stealth Mode Privacy Masking (`Header.tsx`)
* Instant toggle to disguise current/target job titles with discreet placeholders (e.g., `Engineering Track L3` / `CONFIDENTIAL`) for privacy in open office environments.

---

## 4. Backend Intelligence API Reference

FastAPI exposes OpenAPI Swagger documentation at: `http://127.0.0.1:8000/docs`.

### 1. Service Health Check
* **`GET /api/health`**
* **Response**:
  ```json
  {
    "status": "ok",
    "service": "careeros-backend"
  }
  ```

---

### 2. Role Ontology Graph
* **`GET /api/graph/roles`**
* **Description**: Returns all role nodes, seniority levels, required competencies, and promotion/pivot edges.
* **Response**:
  ```json
  {
    "roles": [
      {
        "id": "mid-fullstack",
        "title": "Mid Full-Stack Engineer",
        "domain": "Software Engineering",
        "seniority_level": 2,
        "requirements": [...]
      },
      {
        "id": "senior-fullstack",
        "title": "Senior Full-Stack Engineer",
        "domain": "Software Engineering",
        "seniority_level": 3,
        "requirements": [...]
      }
    ],
    "edges": [
      { "from_role": "junior-frontend", "to_role": "mid-fullstack", "edge_type": "PROMOTION" },
      { "from_role": "mid-fullstack", "to_role": "senior-fullstack", "edge_type": "PROMOTION" },
      { "from_role": "senior-fullstack", "to_role": "staff-architect", "edge_type": "PROMOTION" },
      { "from_role": "senior-fullstack", "to_role": "devops-engineer", "edge_type": "PIVOT" }
    ]
  }
  ```

---

### 3. Skill-Gap & Readiness Diagnostics
* **`POST /api/diagnostics/analyze`**
* **Payload**:
  ```json
  {
    "current_role_id": "mid-fullstack",
    "target_role_id": "senior-fullstack",
    "user_skills": [
      {
        "skill_id": "react-nextjs",
        "current_depth": 3,
        "confidence_score": 0.9,
        "verification_source": "RESUME_PARSED"
      },
      {
        "skill_id": "sql-optimization",
        "current_depth": 1,
        "confidence_score": 0.6,
        "verification_source": "SELF_REPORT"
      }
    ]
  }
  ```
* **Readiness Algorithm**:
  $$\text{Readiness Score} = \left( \frac{\sum_{s \in S_{\text{role}}} w_s \cdot \min\left(1.0, \frac{P_{\text{user}}(s)}{P_{\text{target}}(s)}\right) \cdot C_{\text{user}}(s)}{\sum_{s \in S_{\text{role}}} w_s} \right) \times 100\%$$
* **Response**:
  ```json
  {
    "current_role_id": "mid-fullstack",
    "target_role_id": "senior-fullstack",
    "readiness_percentage": 52,
    "missing_gaps": [
      { "id": "distributed-caching", "name": "Distributed Caching (Redis)", "category": "System Architecture", "market_demand_percent": 90 }
    ],
    "needs_polish": [
      { "id": "sql-optimization", "name": "SQL Optimization & Indexing", "category": "Database Engineering", "market_demand_percent": 88 }
    ],
    "validated_skills": [
      { "id": "react-nextjs", "name": "React & Next.js Architecture", "category": "Frontend Architecture", "market_demand_percent": 94 }
    ],
    "estimated_timeline_months": 4
  }
  ```

---

### 4. Milestone Pathway Generation
* **`POST /api/pathway/generate`**
* **Payload**:
  ```json
  {
    "target_role_id": "senior-fullstack",
    "gap_skill_ids": ["distributed-caching", "system-design"]
  }
  ```
* **Description**: Orders milestones topologically so foundational prerequisite skills precede complex distributed systems competencies.
* **Response**:
  ```json
  [
    {
      "milestone_index": 1,
      "title": "Foundational Prerequisite: SQL Optimization",
      "focus_skill_id": "sql-optimization",
      "tasks": [
        {
          "id": "task-sql-1",
          "title": "Master Query Execution Plans and B-Tree Indexes",
          "type": "CONCEPT_ARTICLE",
          "estimated_minutes": 45,
          "xp_reward": 50,
          "target_skill_id": "sql-optimization"
        }
      ],
      "recommended_mentor": {
        "name": "Sarah Lin",
        "title": "Staff Database Architect",
        "company": "Stripe"
      }
    }
  ]
  ```

---

### 5. Reverse Career Exploration ("Skill ROI")
* **`POST /api/trajectory/simulate-roi`**
* **Payload**:
  ```json
  {
    "current_skill_ids": ["react-nextjs", "typescript-adv", "docker-k8s"],
    "current_role_id": "mid-fullstack",
    "limit": 3
  }
  ```
* **Description**: Computes high-leverage target career paths with the lowest skill-gap cost and highest market demand.
* **Response**:
  ```json
  [
    {
      "target_role_id": "senior-fullstack",
      "role_title": "Senior Full-Stack Engineer",
      "readiness_score": 68,
      "gap_skills_count": 2,
      "estimated_weeks": 8,
      "market_demand_percent": 92
    }
  ]
  ```

---

### 6. Resume Ingestion & Skill Extraction
* **`POST /api/resume/parse`**
* **Description**: Supports JSON payload (`{ "resume_text": "..." }`) or multipart file upload (`file: binary`).
* **Response**:
  ```json
  {
    "detected_role": "Senior Full-Stack Engineer",
    "extracted_skills": [
      {
        "skill_id": "react-nextjs",
        "current_depth": 2,
        "confidence_score": 0.85,
        "verification_source": "RESUME_PARSED"
      }
    ]
  }
  ```

---

## 5. Verification & Testing

CareerOS includes an automated verification runner executing both the Python backend test suite and the Next.js production build:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/test_all.ps1
```

### Verification Output:
```text
=================================================================
           CAREEROS PLATFORM - VERIFICATION RUNNER               
=================================================================
[1/2] Running Backend Pytest Suite...
======================== 39 passed, 1 warning in 0.80s ========================
[PASS] Backend test suite passed (1.57 s)

[2/2] Running Frontend Next.js Production Build & Typecheck...
 ✓ Compiled successfully
   Linting and checking validity of types ...
 ✓ Generating static pages (4/4)
[PASS] Frontend build and typecheck passed (14.79 s)

=================================================================
                  VERIFICATION SUMMARY REPORT                    
=================================================================
  Suite                               | Status   | Duration
  ---------------------------------------------------------------
  Backend (pytest / 39 tests)         | [PASS]   |     1.57s
  Frontend (Next.js build & types)    | [PASS]   |    14.79s
  ---------------------------------------------------------------
  Total Execution Time: 16.44s

=================================================================
 [SUCCESS] ALL 11 CAREEROS SUBSYSTEMS VERIFIED & OPERATIONAL!    
=================================================================
```

### Running Subsystem Tests Individually:
* **Backend Pytest Only**:
  ```bash
  cd backend
  uv run pytest -v
  ```
* **Frontend Production Build Only**:
  ```bash
  cd frontend
  npm run build
  ```

---

## 6. Directory Structure

```
careeros-platform/
├── backend/                             # Intelligence Tier (FastAPI)
│   ├── app/
│   │   ├── main.py                      # FastAPI application & REST endpoints
│   │   ├── models.py                    # Domain Pydantic models & schemas
│   │   ├── graph.py                     # NetworkX Career Graph ontology engine
│   │   ├── diagnostics.py               # Weighted gap & readiness calculator
│   │   ├── pathway.py                   # Topological milestone sequencing
│   │   └── parser.py                    # Resume regex & heuristic parser
│   ├── tests/                           # Pytest test suite (39 tests)
│   │   ├── test_api.py                  # HTTP API endpoint tests
│   │   ├── test_diagnostics.py          # Mathematical formula & edge cases
│   │   ├── test_graph.py                # DAG validation & traversal tests
│   │   ├── test_models.py               # Schema serialization tests
│   │   └── test_pathway_and_parser.py   # Topological sequence & resume parsing
│   ├── pyproject.toml                   # uv project definition & dependencies
│   └── uv.lock                          # Deterministic dependency lockfile
├── frontend/                            # Presentation Tier (Next.js 14)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root layout & typography
│   │   │   ├── page.tsx                 # Full CareerOS Interactive Dashboard
│   │   │   └── globals.css              # Custom Tailwind & theme rules
│   │   ├── components/
│   │   │   ├── Header.tsx               # Global nav, XP counter, Stealth mode
│   │   │   ├── TrajectoryMap.tsx        # Career progression node canvas
│   │   │   ├── ReadinessGauge.tsx       # SVG radial target fit indicator
│   │   │   ├── SkillMatrix.tsx          # Filterable skill-gap matrix
│   │   │   ├── SkillItem.tsx            # Individual skill card & depth badges
│   │   │   ├── MilestonePathway.tsx     # Sequenced action roadmap
│   │   │   ├── TaskCard.tsx             # 0ms optimistic task completion card
│   │   │   ├── MentorCard.tsx           # Mentor consultation booking card
│   │   │   ├── OnboardingModal.tsx      # 60-second multi-step wizard
│   │   │   ├── ResumeDropzone.tsx       # Drag-and-drop resume upload / paste
│   │   │   └── index.ts                 # Component barrel export
│   │   ├── context/
│   │   │   └── CareerContext.tsx        # Global optimistic state provider
│   │   ├── lib/
│   │   │   └── api.ts                   # Type-safe backend client
│   │   └── types/
│   │       └── index.ts                 # TypeScript domain interfaces
│   ├── package.json                     # Next.js dependencies & scripts
│   ├── tailwind.config.ts               # Tailwind design tokens & plugins
│   └── tsconfig.json                    # Strict TypeScript configuration
├── scripts/                             # Orchestration & Automation
│   ├── dev.ps1                          # Concurrent local dev orchestrator
│   └── test_all.ps1                     # Full-stack end-to-end verification runner
├── docs/                                # Project Specifications & Plans
└── README.md                            # Comprehensive platform documentation
```

---

## 7. Troubleshooting & FAQ

### Port Already In Use
* **Symptoms**: `[WARNING] Port 8000 is already in use!` or `Port 3000 is already in use!`.
* **Resolution**: Free the port using PowerShell or pass custom ports:
  ```powershell
  # Free port 8000 or 3000
  Get-NetTCPConnection -LocalPort 8000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  
  # Or start on alternative ports
  powershell -ExecutionPolicy Bypass -File scripts/dev.ps1 -BackendPort 8080 -FrontendPort 3001
  ```

### Backend Disconnected / Offline Mode
* CareerOS is designed with offline resilience. If the backend is stopped or unreachable, the frontend dashboard uses built-in heuristic parsers and client-side readiness calculators, displaying a subtle notice without crashing.

### Resetting Virtual Environment
* If Python dependencies need a fresh sync:
  ```powershell
  cd backend
  Remove-Item -Recurse -Force .venv
  uv sync
  ```
