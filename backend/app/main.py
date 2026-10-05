import os
from typing import List, Optional, Dict, Any, Union
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Load environment configuration (.env)
load_dotenv()

from app.graph import CareerGraphEngine
from app.diagnostics import DiagnosticsEngine
from app.pathway import PathwayGenerator
from app.parser import ResumeParser
from app.models import (
    Role,
    UserSkillState,
    DiagnosticReport,
    MilestonePathway,
    RoleRoiRecommendation,
    RoadmapResponse,
    RoadmapGenerateRequest,
)
from app.roadmap_generator import roadmap_generator
from app.groq_service import is_groq_configured

# Initialize FastAPI application
app = FastAPI(
    title="CareerOS Intelligence API",
    description="Career trajectory mapping, skill-gap diagnostics, and pathway acceleration backend.",
    version="0.1.0",
)

# Configure Cross-Origin Resource Sharing (CORS)
cors_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize core intelligence engines
graph_engine = CareerGraphEngine()
diagnostics_engine = DiagnosticsEngine(graph_engine)
pathway_generator = PathwayGenerator(graph_engine)
resume_parser = ResumeParser(graph_engine)


# Request and Response schemas
class HealthResponse(BaseModel):
    status: str
    service: str


class GraphRolesResponse(BaseModel):
    roles: List[Role]
    edges: List[Dict[str, str]]


class DiagnosticsAnalyzeRequest(BaseModel):
    current_role_id: str
    target_role_id: str
    user_skills: List[Union[UserSkillState, str, Dict[str, Any]]] = Field(default_factory=list)


class PathwayGenerateRequest(BaseModel):
    target_role_id: str
    gap_skill_ids: List[str] = Field(default_factory=list)


class TrajectorySimulateRoiRequest(BaseModel):
    current_skill_ids: Optional[List[str]] = None
    user_skills: Optional[List[Union[UserSkillState, str, Dict[str, Any]]]] = None
    current_role_id: Optional[str] = None
    limit: int = 3


class ResumeParseRequest(BaseModel):
    resume_text: str = ""


class ResumeParseResponse(BaseModel):
    detected_role: str
    extracted_skills: List[UserSkillState]


@app.get("/api/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Service health check endpoint."""
    return HealthResponse(status="ok", service="careeros-backend")


@app.get("/api/graph/roles", response_model=GraphRolesResponse)
def get_roles_graph() -> GraphRolesResponse:
    """Retrieves all ontology role nodes and transition edges for trajectory visualization."""
    return GraphRolesResponse(
        roles=graph_engine.get_all_roles(),
        edges=graph_engine.get_all_edges(),
    )


@app.post("/api/diagnostics/analyze", response_model=DiagnosticReport)
def analyze_diagnostics(payload: DiagnosticsAnalyzeRequest) -> DiagnosticReport:
    """Computes confidence-weighted skill gaps, readiness score, and estimated timeline."""
    try:
        return diagnostics_engine.compute_diagnostic_report(
            current_role_id=payload.current_role_id,
            target_role_id=payload.target_role_id,
            user_skills=payload.user_skills,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/api/pathway/generate", response_model=List[MilestonePathway])
def generate_pathway(payload: PathwayGenerateRequest) -> List[MilestonePathway]:
    """Generates topologically sequenced milestone pathways and mentor pairings for skill gaps."""
    return pathway_generator.generate_pathway(
        target_role_id=payload.target_role_id,
        gap_skill_ids=payload.gap_skill_ids,
    )


@app.post("/api/trajectory/simulate-roi", response_model=List[RoleRoiRecommendation])
def simulate_roi(payload: TrajectorySimulateRoiRequest) -> List[RoleRoiRecommendation]:
    """Calculates reverse career recommendations based on user competencies and market demand."""
    skills = payload.user_skills if payload.user_skills is not None else (payload.current_skill_ids or [])
    return diagnostics_engine.simulate_reverse_roi(
        user_skills=skills,
        current_role_id=payload.current_role_id,
        limit=payload.limit,
    )


@app.post(
    "/api/resume/parse",
    response_model=ResumeParseResponse,
    openapi_extra={
        "requestBody": {
            "content": {
                "application/json": {
                    "schema": ResumeParseRequest.model_json_schema()
                }
            }
        }
    },
)
async def parse_resume(request: Request) -> ResumeParseResponse:
    """Extracts technical competencies and assesses candidate role from resume text or upload."""
    content_type = request.headers.get("content-type", "")
    text = ""
    if "multipart/form-data" in content_type:
        form = await request.form()
        uploaded_file = form.get("file")
        if uploaded_file and hasattr(uploaded_file, "read"):
            content = await uploaded_file.read()
            if isinstance(content, bytes):
                text = content.decode("utf-8", errors="ignore")
            else:
                text = str(content)
        elif "resume_text" in form:
            text = str(form.get("resume_text", ""))
    else:
        try:
            body = await request.json()
            if isinstance(body, dict):
                text = str(body.get("resume_text", ""))
        except Exception:
            text = ""

    result = resume_parser.parse(text)
    return ResumeParseResponse(
        detected_role=result["detected_role"],
        extracted_skills=result["extracted_skills"],
    )


@app.post("/api/roadmap/generate", response_model=RoadmapResponse)
def generate_profession_roadmap(payload: RoadmapGenerateRequest) -> RoadmapResponse:
    """Generates an end-to-end, visual flow-tree roadmap for any requested profession."""
    if not payload.profession or not payload.profession.strip():
        raise HTTPException(status_code=400, detail="Profession name cannot be empty.")
    return roadmap_generator.generate_dynamic_roadmap(
        profession=payload.profession.strip(),
        experience_level=payload.experience_level,
        api_key=payload.api_key,
    )


@app.get("/api/roadmap/suggestions", response_model=List[str])
def get_roadmap_suggestions() -> List[str]:
    """Returns curated popular professions for instant inspiration."""
    return roadmap_generator.get_suggestions()


class RoadmapStatusResponse(BaseModel):
    groq_configured: bool
    model: str
    supported_models: List[str]


@app.get("/api/roadmap/status", response_model=RoadmapStatusResponse)
def get_roadmap_status() -> RoadmapStatusResponse:
    """Returns AI status and Groq configuration state."""
    from app.groq_service import PRIMARY_MODEL, SUPPORTED_MODELS
    return RoadmapStatusResponse(
        groq_configured=is_groq_configured(),
        model=PRIMARY_MODEL,
        supported_models=SUPPORTED_MODELS,
    )

