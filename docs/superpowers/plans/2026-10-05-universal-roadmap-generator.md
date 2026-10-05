# Universal Profession Roadmap Generator Implementation Plan

Transform the platform into an open, prompt-driven career roadmap generator where any user can type in ANY profession (from "Game Developer" to "Commercial Pilot") and receive an instant, interactive, visually connected flow-tree roadmap.

## Proposed Changes

### Backend (Python FastAPI)

#### [NEW] `backend/app/roadmap_generator.py`
- Implements `UniversalRoadmapGenerator`.
- Domain knowledge synthesizer supporting tech, engineering, healthcare, creative arts, trades, finance, and science.
- Dynamic fallback generator extracting domain primitives, foundation skills, core tools, and capstone proof-of-work challenges for arbitrary profession strings.
- Constructs topologically valid node graphs with `prerequisites`, `category` (essential, recommended, elective), `projects`, `resources`, and `estimated_weeks`.

#### `backend/app/models.py`
- Add Pydantic v2 schemas:
  - `RoadmapNodeType`: Enum (`foundation`, `core`, `specialization`, `capstone`)
  - `RoadmapNode`: Model with `id`, `title`, `stage_index`, `category`, `description`, `key_skills`, `project_challenge`, `resources`, `prerequisites`
  - `RoadmapStage`: Model with `stage_index`, `title`, `estimated_weeks`, `node_ids`
  - `RoadmapResponse`: Model with `profession`, `experience_level`, `summary`, `salary_range`, `estimated_months`, `stages`, `nodes`
  - `RoadmapGenerateRequest`: Model with `profession`, `experience_level`

#### `backend/app/main.py`
- Expose `POST /api/roadmap/generate`
- Expose `GET /api/roadmap/suggestions`

#### `backend/tests/test_roadmap_generator.py`
- Unit tests covering known domains, novel custom professions, graph consistency (no dangling prerequisites), and empty/edge-case handling.

---

### Frontend (Next.js 14 + Tailwind CSS + TypeScript)

#### `frontend/src/types/index.ts`
- Add TypeScript interfaces matching the new backend schema (`RoadmapNode`, `RoadmapStage`, `RoadmapResponse`, `RoadmapGenerateRequest`).

#### `frontend/src/lib/api.ts`
- Add `api.generateRoadmap(request: RoadmapGenerateRequest): Promise<RoadmapResponse>`
- Add `api.getSuggestions(): Promise<string[]>`

#### [NEW] `frontend/src/components/ProfessionSearchHero.tsx`
- Search bar with quick-pick inspiration chips ("Game Developer", "Ethical Hacker", "AI Engineer", "Robotics Engineer", "Sound Designer").
- Experience filter buttons (Beginner / Intermediate / Career Switcher).

#### [NEW] `frontend/src/components/RoadmapFlowTree.tsx`
- Visual interactive node graph connecting stages and branches with SVG bezier lines.
- Node cards with status badges (To Learn, In Progress, Mastered).
- Stage containers grouping sequential phases.

#### [NEW] `frontend/src/components/RoadmapNodeDetail.tsx`
- Slide-over drawer / modal showing full deep-dive for any clicked node:
  - Plain-English explanation
  - Essential tools & frameworks
  - Hands-on Capstone Project
  - Recommended free guides and docs
  - Toggle node status (Done / In Progress)

#### `frontend/src/app/page.tsx`
- Refactor the home page to mount the new search hero, dynamic roadmap flow tree, node detail drawer, and export controls.

---

## Verification Plan

### Automated Tests
1. Backend pytest suite: `uv run pytest backend/tests`
2. Frontend Next.js build & typecheck: `cd frontend && npm run build`
3. End-to-end test script: `powershell -ExecutionPolicy Bypass -File scripts/test_all.ps1`

### Manual End-to-End Verification
1. Test generating a roadmap for standard tech career: "Game Developer"
2. Test generating a roadmap for non-standard / niche career: "Robotics Engineer", "Ethical Hacker"
3. Test clicking nodes to inspect details, projects, and resources.
4. Test marking nodes as complete and watching progress updates.
