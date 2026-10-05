# Technical Design Specification: CareerOS Platform

**Date**: 2026-10-05  
**Status**: Approved  
**Path**: `docs/superpowers/specs/2026-10-05-careeros-platform-design.md`

---

## 1. System Overview & Architecture

CareerOS is an intelligent career mapping, skill-gap diagnostic, and professional development accelerator. The system replaces static course catalogs and generic questionnaires with a dynamic, graph-based competency model, live career path visualization, and artifact-verified learning pathways.

The system uses a **Decoupled Modern Architecture**:
1. **Frontend Tier (`/frontend`)**: Next.js 14 (App Router) + TypeScript + Tailwind CSS for responsive desktop and mobile interaction, client-side optimistic state, and an interactive trajectory canvas.
2. **Intelligence Tier (`/backend`)**: Python FastAPI service utilizing `NetworkX` for graph pathfinding, Pydantic for strict schema contracts, an entity-extraction engine for resume ingestion, and `uv` for sub-second dependency management.

```
+-------------------------------------------------------------+
| Frontend Tier: Next.js 14 + TypeScript + Tailwind           |
| - Interactive Trajectory Node Canvas                        |
| - Dynamic Skill-Gap Calibration Matrix                      |
| - Milestone Pathway & Action Checklist                      |
| - Optimistic State Manager (0ms perceptual latency)         |
+------------------------------+------------------------------+
                               |
                   HTTP / REST (JSON API)
                               |
+------------------------------v------------------------------+
| Intelligence Tier: Python FastAPI Service                   |
| - NetworkX Career Graph (Nodes, Edges, Topological Sort)    |
| - Confidence-Weighted Gap & Readiness Diagnostics           |
| - Dynamic Resume & Skill Entity Ingestion                   |
| - Reverse Trajectory Simulation (Skill ROI Calculator)      |
+-------------------------------------------------------------+
```

---

## 2. Domain Data Models & Schemas

### 2.1 Backend Pydantic Schemas (`backend/app/models.py`)

* **`SkillDepth`**: Enum `[CONCEPTUAL = 1, APPLIED = 2, ARCHITECTURAL = 3]`.
* **`SkillImportance`**: Enum `[MUST_HAVE = 1.0, NICE_TO_HAVE = 0.4]`.
* **`Skill`**:
  * `id`: `str` (e.g. `"distributed-caching"`)
  * `name`: `str` (e.g. `"Distributed Caching (Redis)"`)
  * `category`: `str` (e.g. `"System Architecture"`)
  * `market_demand_percent`: `int` (e.g. `88`)
* **`RoleSkillRequirement`**:
  * `skill_id`: `str`
  * `required_depth`: `SkillDepth`
  * `importance`: `SkillImportance`
* **`Role`**:
  * `id`: `str` (e.g. `"senior-fullstack"`)
  * `title`: `str` (e.g. `"Senior Full-Stack Engineer"`)
  * `domain`: `str` (e.g. `"Software Engineering"`)
  * `seniority_level`: `int` (1 = Junior, 2 = Mid, 3 = Senior, 4 = Staff)
  * `requirements`: `List[RoleSkillRequirement]`
* **`UserSkillState`**:
  * `skill_id`: `str`
  * `current_depth`: `SkillDepth`
  * `confidence_score`: `float` (0.0 to 1.0, calibrated by source)
  * `verification_source`: `str` (`"SELF_REPORT"`, `"RESUME_PARSED"`, `"ARTIFACT_VERIFIED"`)
* **`DiagnosticReport`**:
  * `current_role_id`: `str`
  * `target_role_id`: `str`
  * `readiness_percentage`: `int` (0 to 100)
  * `missing_gaps`: `List[Skill]`
  * `needs_polish`: `List[Skill]`
  * `validated_skills`: `List[Skill]`
  * `estimated_timeline_months`: `int`
* **`MilestoneTask`**:
  * `id`: `str`
  * `title`: `str`
  * `type`: `str` (`"CONCEPT_ARTICLE"`, `"HANDS_ON_PROJECT"`)
  * `estimated_minutes`: `int`
  * `xp_reward`: `int`
  * `target_skill_id`: `str`
* **`MilestonePathway`**:
  * `milestone_index`: `int`
  * `title`: `str`
  * `focus_skill_id`: `str`
  * `tasks`: `List[MilestoneTask]`
  * `recommended_mentor`: `Optional[Dict[str, str]]`

---

## 3. Core Algorithms & Logic

### 3.1 Weighted Readiness Calculation
Readiness is computed by evaluating the ratio between user proficiency and target requirements, weighted by skill importance:

$$\text{Readiness Score} = \left( \frac{\sum_{s \in S_{\text{role}}} w_s \cdot \min\left(1.0, \frac{P_{\text{user}}(s)}{P_{\text{target}}(s)}\right) \cdot C_{\text{user}}(s)}{\sum_{s \in S_{\text{role}}} w_s} \right) \times 100\%$$

* $w_s$: Skill importance weight ($1.0$ for `MUST_HAVE`, $0.4$ for `NICE_TO_HAVE`).
* $P(s)$: Skill depth level (1, 2, or 3).
* $C_{\text{user}}(s)$: Confidence score ($0.4$ for self-reported, $0.95$ for artifact-verified).

### 3.2 Topological Pathway Sequencing
Using `networkx.DiGraph`, the engine enforces that prerequisite foundation skills (e.g. *SQL Basics*) are scheduled in earlier milestones before advanced competencies (e.g. *Distributed Cache Invalidation*).

### 3.3 Reverse Career Exploration ("Skill ROI")
Given a set of user skills, the graph engine scans adjacent target roles, calculates the minimal gap cost, and returns the top 3 roles with the highest transition feasibility and market demand.

---

## 4. API Endpoints Contract (FastAPI)

* `GET /api/graph/roles`: Returns all role nodes, seniority levels, and connecting promotion/pivot edges for visualization.
* `POST /api/diagnostics/analyze`:
  * Request: `{ "current_role_id": str, "target_role_id": str, "user_skills": List[UserSkillState] }`
  * Response: `DiagnosticReport`
* `POST /api/pathway/generate`:
  * Request: `{ "target_role_id": str, "gap_skill_ids": List[str] }`
  * Response: `List[MilestonePathway]`
* `POST /api/trajectory/simulate-roi`:
  * Request: `{ "current_skill_ids": List[str] }`
  * Response: `List[RoleRoiRecommendation]`
* `POST /api/resume/parse`:
  * Request: `{ "resume_text": str }`
  * Response: `{ "detected_role": str, "extracted_skills": List[UserSkillState] }`

---

## 5. Frontend UI/UX Architecture

* **Framework**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React icons.
* **Layout**:
  * **Header**: User trajectory target pill, XP/Level tracker, Stealth Mode privacy badge.
  * **Top Canvas**: Interactive node-based trajectory map (Junior ➔ Mid ➔ Target Senior ➔ Horizon Staff).
  * **Left Column**: Diagnostic matrix with interactive category filters (`All`, `Gaps`, `Validated`).
  * **Right Column**: Actionable milestone pathway with interactive task checkoffs and mentor matching cards.
* **Optimistic UI Engine**: Checking a milestone immediately animates the XP counter and updates the readiness bar at 60 FPS, with out-of-band server synchronization.

---

## 6. Resilience & Testing Strategy

* **Backend Testing**:
  * Pytest suite covering graph integrity (no cycles in prerequisite trees), diagnostic score boundary conditions (0% to 100%), and resume keyword parser accuracy.
* **Frontend Verification**:
  * TypeScript strict compilation without errors.
  * Responsive layout validation across mobile and desktop breakpoints.
* **Offline / Error Gracefulness**:
  * If the Python backend is unavailable, the frontend displays clear retry prompts while retaining current client-side state without crashing.
