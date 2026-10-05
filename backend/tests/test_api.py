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
    assert len(data["roles"]) >= 5
    assert len(data["edges"]) >= 4


def test_analyze_diagnostics_endpoint():
    payload = {
        "current_role_id": "mid-fullstack",
        "target_role_id": "senior-fullstack",
        "user_skills": [
            {
                "skill_id": "javascript-typescript",
                "current_depth": 2,
                "confidence_score": 0.9,
                "verification_source": "SELF_REPORT",
            }
        ],
    }
    res = client.post("/api/diagnostics/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "readiness_percentage" in data
    assert "missing_gaps" in data
    assert "needs_polish" in data
    assert "validated_skills" in data
    assert "estimated_timeline_months" in data


def test_analyze_diagnostics_not_found():
    payload = {
        "current_role_id": "mid-fullstack",
        "target_role_id": "unknown-role-id",
        "user_skills": [],
    }
    res = client.post("/api/diagnostics/analyze", json=payload)
    assert res.status_code == 404
    assert "not found" in res.json().get("detail", "").lower()


def test_pathway_generate_endpoint():
    payload = {
        "target_role_id": "senior-fullstack",
        "gap_skill_ids": ["distributed-caching", "sql-optimization"],
    }
    res = client.post("/api/pathway/generate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["milestone_index"] == 1
    assert "tasks" in data[0]
    assert len(data[0]["tasks"]) >= 2
    assert "recommended_mentor" in data[0]


def test_pathway_generate_empty_gaps():
    payload = {
        "target_role_id": "senior-fullstack",
        "gap_skill_ids": [],
    }
    res = client.post("/api/pathway/generate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data == []


def test_trajectory_simulate_roi_endpoint():
    payload = {
        "current_skill_ids": ["javascript-typescript", "react-state"],
    }
    res = client.post("/api/trajectory/simulate-roi", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    rec = data[0]
    assert "role_id" in rec
    assert "title" in rec
    assert "match_percentage" in rec
    assert "salary_boost_estimate" in rec
    assert "top_missing_skills" in rec


def test_resume_parse_endpoint():
    payload = {
        "resume_text": "Experienced software developer with 4 years building apps in TypeScript, React, and RESTful APIs with Docker.",
    }
    res = client.post("/api/resume/parse", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "detected_role" in data
    assert "extracted_skills" in data
    extracted_ids = [s["skill_id"] for s in data["extracted_skills"]]
    assert "javascript-typescript" in extracted_ids
    assert "react-state" in extracted_ids


def test_resume_parse_file_upload():
    file_bytes = b"Lead Systems Architect with deep background in high-throughput distributed caching, Redis, and system design."
    files = {"file": ("resume.txt", file_bytes, "text/plain")}
    res = client.post("/api/resume/parse", files=files)
    assert res.status_code == 200
    data = res.json()
    assert "detected_role" in data
    assert "extracted_skills" in data
    extracted_ids = [s["skill_id"] for s in data["extracted_skills"]]
    assert "distributed-caching" in extracted_ids


def test_cors_headers_allowed():
    res = client.options(
        "/api/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_generate_roadmap_endpoint():
    payload = {"profession": "Robotics Engineer", "experience_level": "beginner"}
    res = client.post("/api/roadmap/generate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["profession"] == "Robotics Engineer"
    assert len(data["stages"]) >= 4
    assert len(data["nodes"]) >= 6
    assert "salary_range" in data


def test_generate_roadmap_empty_error():
    res = client.post("/api/roadmap/generate", json={"profession": ""})
    assert res.status_code == 400


def test_roadmap_suggestions_endpoint():
    res = client.get("/api/roadmap/suggestions")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    assert "Game Developer" in data
