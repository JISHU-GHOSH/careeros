import pytest
from app.graph import CareerGraphEngine
from app.diagnostics import DiagnosticsEngine
from app.models import (
    UserSkillState,
    SkillDepth,
    RoleRoiRecommendation,
    DiagnosticReport,
    Role,
    RoleSkillRequirement,
    SkillImportance,
)


def test_compute_diagnostic_report():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    user_skills = [
        UserSkillState(skill_id="javascript-typescript", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
        UserSkillState(skill_id="react-state", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
        UserSkillState(skill_id="rest-apis", current_depth=SkillDepth.APPLIED, confidence_score=0.8),
    ]
    report = diag.compute_diagnostic_report("mid-fullstack", "senior-fullstack", user_skills)
    assert isinstance(report, DiagnosticReport)
    assert 40 <= report.readiness_percentage <= 75
    gap_ids = [s.id for s in report.missing_gaps]
    assert "distributed-caching" in gap_ids or "system-design" in gap_ids
    assert len(report.validated_skills) == 3
    validated_ids = [s.id for s in report.validated_skills]
    assert "javascript-typescript" in validated_ids
    assert "react-state" in validated_ids
    assert "rest-apis" in validated_ids
    assert report.estimated_timeline_months >= 1


def test_simulate_reverse_roi():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    user_skills = [
        UserSkillState(skill_id="javascript-typescript", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
        UserSkillState(skill_id="react-state", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
    ]
    recommendations = diag.simulate_reverse_roi(user_skills)
    assert len(recommendations) >= 2
    for rec in recommendations:
        assert isinstance(rec, RoleRoiRecommendation)
        assert 0 <= rec.match_percentage <= 100
        assert rec.salary_boost_estimate.startswith("+")
        assert rec.salary_boost_estimate.endswith("%")
        assert isinstance(rec.top_missing_skills, list)


def test_diagnostic_report_needs_polish():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    # Required for senior-fullstack: APPLIED (2)
    # Give user CONCEPTUAL (1) for distributed-caching, and low confidence (0.4) for rest-apis
    user_skills = [
        UserSkillState(skill_id="javascript-typescript", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
        UserSkillState(skill_id="react-state", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
        UserSkillState(skill_id="rest-apis", current_depth=SkillDepth.APPLIED, confidence_score=0.4),  # low confidence
        UserSkillState(skill_id="distributed-caching", current_depth=SkillDepth.CONCEPTUAL, confidence_score=0.8),  # lower depth
    ]
    report = diag.compute_diagnostic_report("mid-fullstack", "senior-fullstack", user_skills)
    polish_ids = [s.id for s in report.needs_polish]
    assert "rest-apis" in polish_ids
    assert "distributed-caching" in polish_ids
    validated_ids = [s.id for s in report.validated_skills]
    assert "javascript-typescript" in validated_ids
    assert "react-state" in validated_ids


def test_diagnostic_report_perfect_match():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    # senior-fullstack requires 6 skills all at APPLIED depth
    senior_role = graph_engine.get_role_by_id("senior-fullstack")
    assert senior_role is not None
    user_skills = [
        UserSkillState(
            skill_id=req.skill_id,
            current_depth=req.required_depth,
            confidence_score=1.0,
        )
        for req in senior_role.requirements
    ]
    report = diag.compute_diagnostic_report("senior-fullstack", "senior-fullstack", user_skills)
    assert report.readiness_percentage == 100
    assert len(report.missing_gaps) == 0
    assert len(report.needs_polish) == 0
    assert len(report.validated_skills) == len(senior_role.requirements)
    assert report.estimated_timeline_months == 0


def test_diagnostic_report_zero_skills():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    report = diag.compute_diagnostic_report("junior-frontend", "senior-fullstack", [])
    assert report.readiness_percentage == 0
    assert len(report.missing_gaps) == 6
    assert len(report.needs_polish) == 0
    assert len(report.validated_skills) == 0
    assert report.estimated_timeline_months >= 1


def test_diagnostic_report_unknown_role():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    with pytest.raises(ValueError, match="Target role 'non-existent' not found"):
        diag.compute_diagnostic_report("mid-fullstack", "non-existent", [])


def test_simulate_reverse_roi_with_string_inputs():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    skill_strings = ["javascript-typescript", "react-state"]
    recommendations = diag.simulate_reverse_roi(skill_strings)
    assert len(recommendations) >= 2
    top_role_ids = [r.role_id for r in recommendations]
    assert "junior-frontend" in top_role_ids or "mid-fullstack" in top_role_ids


def test_simulate_reverse_roi_excludes_current_role():
    graph_engine = CareerGraphEngine()
    diag = DiagnosticsEngine(graph_engine)
    user_skills = [
        UserSkillState(skill_id="javascript-typescript", current_depth=SkillDepth.APPLIED, confidence_score=0.9),
    ]
    recommendations = diag.simulate_reverse_roi(user_skills, current_role_id="junior-frontend")
    rec_role_ids = [r.role_id for r in recommendations]
    assert "junior-frontend" not in rec_role_ids


def test_simulate_reverse_roi_with_absent_skill_in_role():
    from app.seed_data import SEED_ROLES
    custom_role = Role(
        id="custom-role",
        title="Custom Test Role",
        domain="Engineering",
        seniority_level=1,
        requirements=[
            RoleSkillRequirement(skill_id="javascript-typescript", required_depth=SkillDepth.APPLIED, importance=SkillImportance.MUST_HAVE),
            RoleSkillRequirement(skill_id="non-existent-skill-id", required_depth=SkillDepth.APPLIED, importance=SkillImportance.NICE_TO_HAVE),
        ],
    )
    graph_engine = CareerGraphEngine(roles=list(SEED_ROLES) + [custom_role])
    diag = DiagnosticsEngine(graph_engine)
    recs = diag.simulate_reverse_roi(["javascript-typescript"])
    custom_rec = next((r for r in recs if r.role_id == "custom-role"), None)
    assert custom_rec is not None


