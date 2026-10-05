import pytest
from pydantic import ValidationError
from app.models import (
    Skill, SkillDepth, SkillImportance, RoleSkillRequirement,
    Role, UserSkillState, DiagnosticReport, MilestoneTask,
    MilestonePathway, RoleRoiRecommendation
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


def test_user_skill_state_and_validation():
    user_skill = UserSkillState(
        skill_id="distributed-caching",
        current_depth=SkillDepth.APPLIED,
        confidence_score=0.8,
        verification_source="RESUME_PARSED"
    )
    assert user_skill.confidence_score == 0.8
    assert user_skill.verification_source == "RESUME_PARSED"

    with pytest.raises(ValidationError):
        UserSkillState(
            skill_id="test",
            current_depth=SkillDepth.CONCEPTUAL,
            confidence_score=1.5  # must be <= 1.0
        )


def test_diagnostic_report_and_milestones():
    skill = Skill(
        id="distributed-caching",
        name="Distributed Caching (Redis)",
        category="System Architecture",
        market_demand_percent=88
    )
    report = DiagnosticReport(
        current_role_id="mid-backend",
        target_role_id="senior-fullstack",
        readiness_percentage=75,
        missing_gaps=[],
        needs_polish=[skill],
        validated_skills=[skill],
        estimated_timeline_months=3
    )
    assert report.readiness_percentage == 75

    task = MilestoneTask(
        id="task-1",
        title="Implement Redis caching layer",
        type="HANDS_ON_PROJECT",
        estimated_minutes=120,
        xp_reward=150,
        target_skill_id="distributed-caching"
    )
    assert task.completed is False

    pathway = MilestonePathway(
        milestone_index=1,
        title="Distributed Caching Mastery",
        focus_skill_id="distributed-caching",
        tasks=[task],
        recommended_mentor={"name": "Alice Senior", "role": "Staff Engineer"}
    )
    assert len(pathway.tasks) == 1
    assert pathway.recommended_mentor["name"] == "Alice Senior"


def test_role_roi_recommendation():
    roi = RoleRoiRecommendation(
        role_id="staff-engineer",
        title="Staff Engineer",
        match_percentage=85,
        salary_boost_estimate="+35%",
        top_missing_skills=["system-design-at-scale", "consensus-protocols"]
    )
    assert roi.match_percentage == 85
    assert len(roi.top_missing_skills) == 2
