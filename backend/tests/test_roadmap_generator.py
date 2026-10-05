import pytest
from app.roadmap_generator import roadmap_generator, UniversalRoadmapGenerator
from app.models import RoadmapResponse

def test_curated_game_developer_roadmap():
    resp = roadmap_generator.generate_dynamic_roadmap("Game Developer", "beginner")
    assert isinstance(resp, RoadmapResponse)
    assert resp.profession == "Game Developer"
    assert len(resp.stages) >= 4
    assert len(resp.nodes) >= 6
    assert any("C++" in n.title or "C#" in n.title for n in resp.nodes)
    assert resp.estimated_months > 0

    # Verify prerequisite integrity
    node_ids = {n.id for n in resp.nodes}
    for n in resp.nodes:
        for prereq in n.prerequisites:
            assert prereq in node_ids, f"Prerequisite {prereq} not found in node IDs"

def test_curated_cybersecurity_roadmap():
    resp = roadmap_generator.generate_dynamic_roadmap("Cybersecurity Specialist", "intermediate")
    assert isinstance(resp, RoadmapResponse)
    assert "Cybersecurity" in resp.profession
    assert any("OWASP" in n.title or "Burp" in str(n.key_skills) for n in resp.nodes)

def test_curated_ai_engineer_roadmap():
    resp = roadmap_generator.generate_dynamic_roadmap("Machine Learning & AI", "beginner")
    assert isinstance(resp, RoadmapResponse)
    assert any("PyTorch" in n.title or "Transformers" in n.title for n in resp.nodes)

def test_curated_pilot_roadmap():
    resp = roadmap_generator.generate_dynamic_roadmap("Commercial Airline Pilot", "beginner")
    assert isinstance(resp, RoadmapResponse)
    assert any("PPL" in n.title or "Solo" in n.title for n in resp.nodes)

def test_dynamic_arbitrary_profession_synthesis():
    resp = roadmap_generator.generate_dynamic_roadmap("Quantum Cryptography Specialist", "beginner")
    assert isinstance(resp, RoadmapResponse)
    assert resp.profession == "Quantum Cryptography Specialist"
    assert len(resp.stages) == 5
    assert len(resp.nodes) >= 6

    # Verify all stage node_ids exist
    node_ids = {n.id for n in resp.nodes}
    for stage in resp.stages:
        for nid in stage.node_ids:
            assert nid in node_ids, f"Stage node {nid} missing from nodes list"

    # Verify graph prerequisites exist
    for n in resp.nodes:
        for prereq in n.prerequisites:
            assert prereq in node_ids, f"Prerequisite {prereq} not in node list"

def test_get_suggestions():
    suggestions = roadmap_generator.get_suggestions()
    assert len(suggestions) >= 10
    assert "Game Developer" in suggestions
    assert "Cybersecurity Analyst" in suggestions
