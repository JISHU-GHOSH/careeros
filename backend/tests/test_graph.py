import pytest
from app.graph import CareerGraphEngine
from app.models import Role, Skill

def test_career_graph_initialization():
    engine = CareerGraphEngine()
    roles = engine.get_all_roles()
    assert len(roles) >= 4
    role_ids = [r.id for r in roles]
    assert "junior-frontend" in role_ids
    assert "mid-fullstack" in role_ids
    assert "senior-fullstack" in role_ids
    assert "staff-architect" in role_ids
    assert "devops-engineer" in role_ids


def test_trajectory_path_computation():
    engine = CareerGraphEngine()
    path = engine.get_trajectory_path("junior-frontend", "senior-fullstack")
    assert path == ["junior-frontend", "mid-fullstack", "senior-fullstack"]


def test_trajectory_path_edge_cases():
    engine = CareerGraphEngine()
    # Same role trajectory
    assert engine.get_trajectory_path("mid-fullstack", "mid-fullstack") == ["mid-fullstack"]

    # Trajectory to architect
    arch_path = engine.get_trajectory_path("junior-frontend", "staff-architect")
    assert arch_path == ["junior-frontend", "mid-fullstack", "senior-fullstack", "staff-architect"]

    # Trajectory to devops
    devops_path = engine.get_trajectory_path("junior-frontend", "devops-engineer")
    assert devops_path == ["junior-frontend", "mid-fullstack", "devops-engineer"]

    # Reverse or disconnected path (no path backwards in directed graph)
    assert engine.get_trajectory_path("senior-fullstack", "junior-frontend") == []

    # Non-existent roles
    assert engine.get_trajectory_path("non-existent-role", "senior-fullstack") == []
    assert engine.get_trajectory_path("junior-frontend", "unknown-role") == []


def test_get_role_by_id():
    engine = CareerGraphEngine()
    role = engine.get_role_by_id("senior-fullstack")
    assert role is not None
    assert isinstance(role, Role)
    assert role.id == "senior-fullstack"
    assert role.seniority_level == 3
    assert len(role.requirements) > 0

    missing = engine.get_role_by_id("non-existent")
    assert missing is None


def test_get_all_skills_and_lookup():
    engine = CareerGraphEngine()
    skills = engine.get_all_skills()
    assert len(skills) >= 8
    skill_ids = [s.id for s in skills]
    assert "javascript-typescript" in skill_ids
    assert "react-state" in skill_ids
    assert "rest-apis" in skill_ids
    assert "distributed-caching" in skill_ids
    assert "sql-optimization" in skill_ids
    assert "system-design" in skill_ids
    assert "docker-containers" in skill_ids
    assert "ci-cd-pipelines" in skill_ids

    skill = engine.get_skill_by_id("distributed-caching")
    assert skill is not None
    assert isinstance(skill, Skill)
    assert skill.id == "distributed-caching"

    assert engine.get_skill_by_id("missing-skill") is None


def test_graph_edges_and_adjacent_roles():
    engine = CareerGraphEngine()
    edges = engine.get_all_edges()
    assert len(edges) >= 4
    edge_pairs = [(e["source"], e["target"]) for e in edges]
    assert ("junior-frontend", "mid-fullstack") in edge_pairs
    assert ("mid-fullstack", "senior-fullstack") in edge_pairs
    assert ("senior-fullstack", "staff-architect") in edge_pairs
    assert ("mid-fullstack", "devops-engineer") in edge_pairs

    mid_adj = [r.id for r in engine.get_adjacent_roles("mid-fullstack")]
    assert "senior-fullstack" in mid_adj
    assert "devops-engineer" in mid_adj


def test_graph_is_dag():
    engine = CareerGraphEngine()
    import networkx as nx
    assert nx.is_directed_acyclic_graph(engine.graph)
