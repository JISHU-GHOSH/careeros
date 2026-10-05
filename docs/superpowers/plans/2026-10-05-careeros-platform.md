# CareerOS Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch CareerOS — an intelligent career mapping, confidence-weighted skill-gap diagnostic, and interactive milestone accelerator.

**Architecture:** Decoupled modern two-tier architecture consisting of a Python FastAPI intelligence backend using NetworkX for graph algorithms and Pydantic for validation, paired with a Next.js 14 (App Router) TypeScript frontend with Tailwind CSS and an optimistic UI engine.

**Tech Stack:** Next.js 14, React 18/19, TypeScript, Tailwind CSS, Lucide React, Python 3.10+, FastAPI, Uvicorn, NetworkX, Pydantic v2, Pytest, UV.

**Spec:** [`docs/superpowers/specs/2026-10-05-careeros-platform-design.md`](file:///c:/Users/jishu/Documents/antigravity/magical-babbage/docs/superpowers/specs/2026-10-05-careeros-platform-design.md)

## Global Constraints
- Backend must run under Python 3.10+ using `uv` for dependency management.
- Backend API must serve on `http://127.0.0.1:8000` with CORS enabled for `http://localhost:3000`.
- All backend responses must strictly validate against Pydantic models with type annotations.
- Frontend must use Next.js 14 App Router with TypeScript strict mode.
- Perceptual client-side update latency must be under 16ms (optimistic state).
- All tests must pass cleanly before any task commit.

---

### Task 1: Backend Scaffolding & Pydantic Data Models

**Files:**
- Create: `backend/pyproject.toml`
- Create: `backend/app/__init__.py`
- Create: `backend/app/models.py`
- Create: `backend/tests/__init__.py`
- Create: `backend/tests/test_models.py`

**Interfaces:**
- Produces: `SkillDepth`, `SkillImportance`, `Skill`, `RoleSkillRequirement`, `Role`, `UserSkillState`, `DiagnosticReport`, `MilestoneTask`, `MilestonePathway`, `RoleRoiRecommendation` models in `backend/app/models.py`.

- [ ] **Step 1: Create `backend/pyproject.toml`**

```toml
[project]
name = "careeros-backend"
version = "0.1.0"
description = "FastAPI backend intelligence engine for CareerOS"
readme = "README.md"
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.110.0",
    "uvicorn>=0.28.0",
    "pydantic>=2.6.0",
    "networkx>=3.2.1",
    "python-multipart>=0.0.9"
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "httpx>=0.27.0"
]
```

- [ ] **Step 2: Write failing model tests in `backend/tests/test_models.py`**

```python
import pytest
from app.models import (
    Skill, SkillDepth, SkillImportance, RoleSkillRequirement,
    Role, UserSkillState, DiagnosticReport, MilestoneTask, MilestonePathway
)

def test_models_instantiation():
    skill = Skill(
        id="distributed-caching",
        name="Distributed Caching (Redis)",
        category="System Architecture",
        market_demand_percent=88
    )
    assert skill.id == "distributed-caching"
    assert skill.market_demand_percent == 88

    req = RoleSkillRequirement(
        skill_id="distributed-caching",
        required_depth=SkillDepth.APPLIED,
        importance=SkillImportance.MUST_HAVE
    )
    assert req.required_depth == SkillDepth.APPLIED
    assert req.importance == SkillImportance.MUST_HAVE

    role = Role(
        id="senior-fullstack",
        title="Senior Full-Stack Engineer",
        domain="Software Engineering",
        seniority_level=3,
        requirements=[req]
    )
    assert role.seniority_level == 3
```

- [ ] **Step 3: Run test to verify failure**

Run: `uv run pytest backend/tests/test_models.py`
Expected: FAIL (ModuleNotFoundError: No module named 'app.models')

- [ ] **Step 4: Implement `backend/app/models.py`**

```python
from enum import Enum, IntEnum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SkillDepth(IntEnum):
    CONCEPTUAL = 1
    APPLIED = 2
    ARCHITECTURAL = 3

class SkillImportance(float, Enum):
    MUST_HAVE = 1.0
    NICE_TO_HAVE = 0.4

class Skill(BaseModel):
    id: str
    name: str
    category: str
    market_demand_percent: int = Field(ge=0, le=100)

class RoleSkillRequirement(BaseModel):
    skill_id: str
    required_depth: SkillDepth = SkillDepth.APPLIED
    importance: SkillImportance = SkillImportance.MUST_HAVE

class Role(BaseModel):
    id: str
    title: str
    domain: str
    seniority_level: int = Field(ge=1, le=5)
    description: str = ""
    requirements: List[RoleSkillRequirement]

class UserSkillState(BaseModel):
    skill_id: str
    current_depth: SkillDepth
    confidence_score: float = Field(default=0.4, ge=0.0, le=1.0)
    verification_source: str = "SELF_REPORT"  # SELF_REPORT, RESUME_PARSED, ARTIFACT_VERIFIED

class DiagnosticReport(BaseModel):
    current_role_id: str
    target_role_id: str
    readiness_percentage: int = Field(ge=0, le=100)
    missing_gaps: List[Skill]
    needs_polish: List[Skill]
    validated_skills: List[Skill]
    estimated_timeline_months: int

class MilestoneTask(BaseModel):
    id: str
    title: str
    type: str  # CONCEPT_ARTICLE, HANDS_ON_PROJECT
    estimated_minutes: int
    xp_reward: int
    target_skill_id: str
    completed: bool = False

class MilestonePathway(BaseModel):
    milestone_index: int
    title: str
    focus_skill_id: str
    tasks: List[MilestoneTask]
    recommended_mentor: Optional[Dict[str, str]] = None

class RoleRoiRecommendation(BaseModel):
    role_id: str
    title: str
    match_percentage: int
    salary_boost_estimate: str
    top_missing_skills: List[str]
```

- [ ] **Step 5: Run tests and verify PASS**

Run: `uv run pytest backend/tests/test_models.py`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add backend/
git commit -m "feat(backend): scaffold backend and define core Pydantic domain models"
```

---

### Task 2: Career Graph & Seed Ontology Engine

**Files:**
- Create: `backend/app/seed_data.py`
- Create: `backend/app/graph.py`
- Create: `backend/tests/test_graph.py`

**Interfaces:**
- Consumes: Models from `backend/app/models.py`.
- Produces: `CareerGraphEngine` in `backend/app/graph.py` with methods `get_all_roles()`, `get_role_by_id()`, `get_all_skills()`, `get_trajectory_path()`.

- [ ] **Step 1: Write failing graph tests in `backend/tests/test_graph.py`**

```python
import pytest
from app.graph import CareerGraphEngine

def test_career_graph_initialization():
    engine = CareerGraphEngine()
    roles = engine.get_all_roles()
    assert len(roles) >= 4
    role_ids = [r.id for r in roles]
    assert "junior-frontend" in role_ids
    assert "mid-fullstack" in role_ids
    assert "senior-fullstack" in role_ids

def test_trajectory_path_computation():
    engine = CareerGraphEngine()
    path = engine.get_trajectory_path("junior-frontend", "senior-fullstack")
    assert path == ["junior-frontend", "mid-fullstack", "senior-fullstack"]
```

- [ ] **Step 2: Run test to verify failure**

Run: `uv run pytest backend/tests/test_graph.py`
Expected: FAIL (ModuleNotFoundError: No module named 'app.graph')

- [ ] **Step 3: Implement `backend/app/seed_data.py` and `backend/app/graph.py`**

`seed_data.py` populates:
- Skills: `javascript-typescript`, `react-state`, `rest-apis`, `distributed-caching`, `sql-optimization`, `system-design`, `docker-containers`, `ci-cd-pipelines`.
- Roles: `junior-frontend`, `mid-fullstack`, `senior-fullstack`, `staff-architect`, `devops-engineer`.
- Edges: `junior-frontend -> mid-fullstack`, `mid-fullstack -> senior-fullstack`, `senior-fullstack -> staff-architect`, `mid-fullstack -> devops-engineer`.

`graph.py` builds `networkx.DiGraph` from the seed data and exposes pathfinding methods.

- [ ] **Step 4: Run tests and verify PASS**

Run: `uv run pytest backend/tests/test_graph.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/seed_data.py backend/app/graph.py backend/tests/test_graph.py
git commit -m "feat(backend): implement NetworkX career ontology graph and pathfinding"
```

---

### Task 3: Skill-Gap Diagnostic & Reverse ROI Engine

**Files:**
- Create: `backend/app/diagnostics.py`
- Create: `backend/tests/test_diagnostics.py`

**Interfaces:**
- Consumes: `CareerGraphEngine` and Models.
- Produces: `compute_diagnostic_report(current_role_id, target_role_id, user_skills)` and `simulate_reverse_roi(user_skills)`.

- [ ] **Step 1: Write failing diagnostic tests in `backend/tests/test_diagnostics.py`**

```python
import pytest
from app.graph import CareerGraphEngine
from app.diagnostics import DiagnosticsEngine
from app.models import UserSkillState, SkillDepth

def test_compute_diagnostic_report():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    user_skills = [
        UserSkillState(skill_id="javascript-typescript", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
        UserSkillState(skill_id="react-state", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
        UserSkillState(skill_id="rest-apis", current_depth=SkillDepth.APPLIED, confidence_score=0.8),
    ]
    report = diag.compute_diagnostic_report("mid-fullstack", "senior-fullstack", user_skills)
    assert 40 <= report.readiness_percentage <= 75
    gap_ids = [s.id for s in report.missing_gaps]
    assert "distributed-caching" in gap_ids or "system-design" in gap_ids

def test_simulate_reverse_roi():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    user_skills = [
        UserSkillState(skill_id="javascript-typescript", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
        UserSkillState(skill_id="react-state", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
    ]
    recommendations = diag.simulate_reverse_roi(user_skills)
    assert len(recommendations) >= 2
```

- [ ] **Step 2: Run test to verify failure**

Run: `uv run pytest backend/tests/test_diagnostics.py`
Expected: FAIL

- [ ] **Step 3: Implement `backend/app/diagnostics.py`**

Implements the weighted readiness equation, categorizes skills into `missing_gaps`, `needs_polish`, and `validated_skills`, and calculates ROI recommendations.

- [ ] **Step 4: Run tests and verify PASS**

Run: `uv run pytest backend/tests/test_diagnostics.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/diagnostics.py backend/tests/test_diagnostics.py
git commit -m "feat(backend): implement confidence-weighted skill-gap diagnostics and ROI simulator"
```

---

### Task 4: Pathway Sequencing & Resume Parsing Engine

**Files:**
- Create: `backend/app/pathway.py`
- Create: `backend/app/parser.py`
- Create: `backend/tests/test_pathway_and_parser.py`

**Interfaces:**
- Consumes: Models and `CareerGraphEngine`.
- Produces: `generate_milestone_pathway(target_role_id, gap_skill_ids)` and `parse_resume_text(text)`.

- [ ] **Step 1: Write failing tests in `backend/tests/test_pathway_and_parser.py`**

```python
import pytest
from app.graph import CareerGraphEngine
from app.pathway import PathwayGenerator
from app.parser import ResumeParser

def test_pathway_generation():
    generator = PathwayGenerator(CareerGraphEngine())
    pathway = generator.generate_pathway("senior-fullstack", ["distributed-caching", "sql-optimization"])
    assert len(pathway) >= 1
    assert pathway[0].focus_skill_id in ["distributed-caching", "sql-optimization"]
    assert len(pathway[0].tasks) >= 2
    assert pathway[0].recommended_mentor is not None

def test_resume_parser():
    parser = ResumeParser()
    sample_text = """
    Software Developer with 3 years experience.
    Proficient in TypeScript, React, Node.js, and building RESTful APIs.
    Worked with SQL databases and Git.
    """
    result = parser.parse(sample_text)
    assert len(result["extracted_skills"]) >= 2
    skill_ids = [s.skill_id for s in result["extracted_skills"]]
    assert "javascript-typescript" in skill_ids
```

- [ ] **Step 2: Run test to verify failure**

Run: `uv run pytest backend/tests/test_pathway_and_parser.py`
Expected: FAIL

- [ ] **Step 3: Implement `backend/app/pathway.py` and `backend/app/parser.py`**

- [ ] **Step 4: Run tests and verify PASS**

Run: `uv run pytest backend/tests/test_pathway_and_parser.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/pathway.py backend/app/parser.py backend/tests/test_pathway_and_parser.py
git commit -m "feat(backend): implement milestone pathway generator and resume parser"
```

---

### Task 5: FastAPI Application Endpoints & CORS Integration

**Files:**
- Create: `backend/app/main.py`
- Create: `backend/tests/test_api.py`

**Interfaces:**
- Exposes:
  - `GET /api/health`
  - `GET /api/graph/roles`
  - `POST /api/diagnostics/analyze`
  - `POST /api/pathway/generate`
  - `POST /api/trajectory/simulate-roi`
  - `POST /api/resume/parse`

- [ ] **Step 1: Write failing API route tests in `backend/tests/test_api.py`**

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok", "service": "careeros-backend"}

def test_get_roles():
    res = client.get("/api/graph/roles")
    assert res.status_code == 200
    data = res.json()
    assert "roles" in data
    assert "edges" in data

def test_analyze_diagnostics_endpoint():
    payload = {
        "current_role_id": "mid-fullstack",
        "target_role_id": "senior-fullstack",
        "user_skills": [
            {"skill_id": "javascript-typescript", "current_depth": 2, "confidence_score": 0.9, "verification_source": "SELF_REPORT"}
        ]
    }
    res = client.post("/api/diagnostics/analyze", json=payload)
    assert res.status_code == 200
    assert "readiness_percentage" in res.json()
```

- [ ] **Step 2: Run test to verify failure**

Run: `uv run pytest backend/tests/test_api.py`
Expected: FAIL

- [ ] **Step 3: Implement `backend/app/main.py` with FastAPI & CORS**

- [ ] **Step 4: Run tests and verify PASS**

Run: `uv run pytest backend/tests/test_api.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/main.py backend/tests/test_api.py
git commit -m "feat(backend): integrate FastAPI REST endpoints with CORS and routing"
```

---

### Task 6: Frontend Project Setup & Design System Tokens

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/next.config.mjs`
- Create: `frontend/src/app/globals.css`
- Create: `frontend/src/app/layout.tsx`
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/lib/api.ts`

**Interfaces:**
- Produces: API client `api.ts` mapping all FastAPI endpoints with typed client methods, TypeScript interfaces in `types/index.ts`, and theme styling in `globals.css`.

- [ ] **Step 1: Create `frontend/package.json` with dependencies**
- [ ] **Step 2: Setup Tailwind, TypeScript configs, and theme tokens in `globals.css`**
- [ ] **Step 3: Implement `frontend/src/types/index.ts` mirroring backend Pydantic models**
- [ ] **Step 4: Implement `frontend/src/lib/api.ts` with typed fetch wrappers**
- [ ] **Step 5: Verify frontend builds without type errors**

Run: `cd frontend && npm install && npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): scaffold Next.js App Router project with Tailwind and typed API client"
```

---

### Task 7: Interactive Trajectory Map & Header Components

**Files:**
- Create: `frontend/src/components/Header.tsx`
- Create: `frontend/src/components/TrajectoryMap.tsx`
- Create: `frontend/src/components/ReadinessGauge.tsx`

**Interfaces:**
- Consumes: Role nodes and transition edges from `api.getRolesGraph()`.
- Produces: Interactive trajectory map with clickable role nodes, animated path edges, and live readiness gauge.

- [ ] **Step 1: Implement `ReadinessGauge.tsx` with smooth animated progress bar and match badge**
- [ ] **Step 2: Implement `TrajectoryMap.tsx` with visual node progression and target role switching**
- [ ] **Step 3: Implement `Header.tsx` with trajectory selector, stealth mode toggle, and XP counter**
- [ ] **Step 4: Verify component rendering and responsive styling**
- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/
git commit -m "feat(frontend): build interactive trajectory map and header navigation components"
```

---

### Task 8: Skill-Gap Diagnostic Matrix & Filter Controls

**Files:**
- Create: `frontend/src/components/SkillMatrix.tsx`
- Create: `frontend/src/components/SkillItem.tsx`

**Interfaces:**
- Consumes: `DiagnosticReport` from backend.
- Produces: Interactive filterable skill matrix (`All`, `Missing Gaps`, `Needs Polish`, `Validated`) with market demand indicators and depth tooltips.

- [ ] **Step 1: Implement `SkillItem.tsx` with color-coded status badges and confidence indicators**
- [ ] **Step 2: Implement `SkillMatrix.tsx` with category filters and recalibration trigger**
- [ ] **Step 3: Verify filter state transitions and responsive mobile layout**
- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/SkillMatrix.tsx frontend/src/components/SkillItem.tsx
git commit -m "feat(frontend): implement skill-gap diagnostic matrix with interactive filters"
```

---

### Task 9: Actionable Milestone Pathway & Optimistic Progression Engine

**Files:**
- Create: `frontend/src/components/MilestonePathway.tsx`
- Create: `frontend/src/components/TaskCard.tsx`
- Create: `frontend/src/components/MentorCard.tsx`
- Create: `frontend/src/context/CareerContext.tsx`

**Interfaces:**
- Consumes: `MilestonePathway` data.
- Produces: Optimistic task checkoff engine updating XP and readiness in under 16ms with background sync.

- [ ] **Step 1: Implement `CareerContext.tsx` providing optimistic state management and sync**
- [ ] **Step 2: Implement `TaskCard.tsx` with instant checkoff animations, XP rewards, and artifact tags**
- [ ] **Step 3: Implement `MentorCard.tsx` with 1-on-1 booking trigger**
- [ ] **Step 4: Implement `MilestonePathway.tsx` assembling sequenced weekly milestones**
- [ ] **Step 5: Verify task checkoff triggers 0ms optimistic UI updates**
- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/MilestonePathway.tsx frontend/src/components/TaskCard.tsx frontend/src/components/MentorCard.tsx frontend/src/context/
git commit -m "feat(frontend): implement optimistic milestone pathway and task checkoff engine"
```

---

### Task 10: Interactive 60-Second Onboarding & Resume Upload

**Files:**
- Create: `frontend/src/components/OnboardingModal.tsx`
- Create: `frontend/src/components/ResumeDropzone.tsx`
- Modify: `frontend/src/app/page.tsx`

**Interfaces:**
- Consumes: `POST /api/resume/parse` and `POST /api/diagnostics/analyze`.
- Produces: Seamless 60-second onboarding wizard allowing resume paste/drop, target role selection, and instant dashboard hydration.

- [ ] **Step 1: Implement `ResumeDropzone.tsx` with text paste and file upload parsing**
- [ ] **Step 2: Implement `OnboardingModal.tsx` guiding user through 3 quick calibration steps**
- [ ] **Step 3: Wire `app/page.tsx` to automatically hydrate with personalized diagnostics**
- [ ] **Step 4: Verify end-to-end onboarding flow**
- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/OnboardingModal.tsx frontend/src/components/ResumeDropzone.tsx frontend/src/app/page.tsx
git commit -m "feat(frontend): build 60-second onboarding flow and resume extraction ingestion"
```

---

### Task 11: End-to-End Verification & Orchestration Scripts

**Files:**
- Create: `scripts/dev.ps1`
- Create: `scripts/test_all.ps1`
- Create: `README.md`

**Interfaces:**
- Provides: One-click local startup script running both FastAPI and Next.js concurrently, full test runner, and documentation.

- [ ] **Step 1: Create `scripts/test_all.ps1` running both backend pytest and frontend build verification**
- [ ] **Step 2: Create `scripts/dev.ps1` launching backend and frontend side-by-side**
- [ ] **Step 3: Document complete setup, API reference, and architecture in `README.md`**
- [ ] **Step 4: Run full end-to-end verification and confirm all tests pass**
- [ ] **Step 5: Commit**

```bash
git add scripts/ README.md
git commit -m "chore: add dev automation scripts and comprehensive README documentation"
```
