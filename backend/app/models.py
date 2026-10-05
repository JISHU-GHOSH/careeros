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


# ==========================================
# Universal Profession Roadmap Schemas
# ==========================================

class RoadmapNode(BaseModel):
    id: str
    title: str
    stage_index: int
    category: str = "essential"  # essential, recommended, specialization
    description: str
    key_skills: List[str]
    project_challenge: str
    resources: List[str] = []
    prerequisites: List[str] = []


class RoadmapStage(BaseModel):
    stage_index: int
    title: str
    estimated_weeks: int
    node_ids: List[str]


class RoadmapResponse(BaseModel):
    profession: str
    experience_level: str
    summary: str
    salary_range: str
    estimated_months: int
    stages: List[RoadmapStage]
    nodes: List[RoadmapNode]


class RoadmapGenerateRequest(BaseModel):
    profession: str
    experience_level: str = "beginner"  # beginner, intermediate, career_switcher
