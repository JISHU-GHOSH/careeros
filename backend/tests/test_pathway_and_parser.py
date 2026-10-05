import pytest
from app.graph import CareerGraphEngine
from app.pathway import PathwayGenerator, generate_milestone_pathway
from app.parser import ResumeParser, parse_resume_text
from app.models import MilestonePathway, UserSkillState, SkillDepth


def test_pathway_generation():
    generator = PathwayGenerator(CareerGraphEngine())
    pathway = generator.generate_pathway("senior-fullstack", ["distributed-caching", "sql-optimization"])
    assert len(pathway) >= 1
    assert pathway[0].focus_skill_id in ["distributed-caching", "sql-optimization"]
    assert len(pathway[0].tasks) >= 2
    assert pathway[0].recommended_mentor is not None


def test_pathway_empty_gaps():
    generator = PathwayGenerator(CareerGraphEngine())
    pathway = generator.generate_pathway("senior-fullstack", [])
    assert pathway == []


def test_pathway_sequencing_and_structure():
    generator = PathwayGenerator(CareerGraphEngine())
    gaps = ["distributed-caching", "sql-optimization", "javascript-typescript"]
    pathway = generator.generate_pathway("senior-fullstack", gaps)
    assert len(pathway) == 3

    # Check milestone indices are sequential
    for idx, milestone in enumerate(pathway, start=1):
        assert isinstance(milestone, MilestonePathway)
        assert milestone.milestone_index == idx
        assert len(milestone.tasks) >= 2
        for task in milestone.tasks:
            assert task.xp_reward > 0
            assert task.estimated_minutes > 0
            assert task.target_skill_id == milestone.focus_skill_id
            assert task.completed is False
        assert milestone.recommended_mentor is not None
        assert "name" in milestone.recommended_mentor
        assert "role" in milestone.recommended_mentor

    # Foundational skill should be sequenced before advanced system caching
    focus_order = [m.focus_skill_id for m in pathway]
    assert focus_order.index("javascript-typescript") < focus_order.index("distributed-caching")


def test_pathway_standalone_function():
    pathway = generate_milestone_pathway("senior-fullstack", ["distributed-caching"])
    assert len(pathway) == 1
    assert pathway[0].focus_skill_id == "distributed-caching"


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


def test_resume_parser_metadata_and_verification():
    parser = ResumeParser()
    sample_text = """
    Senior Infrastructure Engineer
    Architected high-throughput distributed caching with Redis and Memcached.
    Extensive background in Docker containerization and Kubernetes orchestration.
    Lead CI/CD pipeline automation with GitHub Actions.
    """
    result = parser.parse(sample_text)
    extracted = result["extracted_skills"]
    assert len(extracted) >= 3

    extracted_dict = {s.skill_id: s for s in extracted}
    assert "distributed-caching" in extracted_dict
    assert "docker-containers" in extracted_dict
    assert "ci-cd-pipelines" in extracted_dict

    for skill in extracted:
        assert isinstance(skill, UserSkillState)
        assert skill.verification_source == "RESUME_PARSED"
        assert 0.0 <= skill.confidence_score <= 1.0

    # Senior/Architect terms should promote depth to ARCHITECTURAL or APPLIED with high confidence
    caching_skill = extracted_dict["distributed-caching"]
    assert caching_skill.current_depth in (SkillDepth.APPLIED, SkillDepth.ARCHITECTURAL)
    assert caching_skill.confidence_score >= 0.7

    # Role detection
    assert result["detected_role"] in ["staff-architect", "devops-engineer", "senior-fullstack"]


def test_resume_parser_empty_and_unknown():
    parser = ResumeParser()
    result = parser.parse("")
    assert result["extracted_skills"] == []
    assert isinstance(result["detected_role"], str)

    result_unknown = parser.parse("Cook with 10 years experience in Italian cuisine.")
    assert result_unknown["extracted_skills"] == []


def test_resume_parser_standalone_function():
    result = parse_resume_text("Skilled in Python, React, and PostgreSQL.")
    assert any(s.skill_id in ["react-state", "sql-optimization"] for s in result["extracted_skills"])


def test_pathway_transitive_prerequisites():
    generator = PathwayGenerator(CareerGraphEngine())
    # rest-apis -> sql-optimization -> system-design (intermediate sql-optimization is not in gaps)
    gaps = ["system-design", "rest-apis"]
    pathway = generator.generate_pathway("staff-architect", gaps)
    assert len(pathway) == 2
    focus_order = [m.focus_skill_id for m in pathway]
    assert focus_order == ["rest-apis", "system-design"]


def test_resume_parser_local_context_isolation():
    parser = ResumeParser()
    filler = " " * 300
    sample_text = f"""
    Chief Systems Architect and Technical Lead.
    {filler}
    Additional competencies:
    Elementary familiarity with SQL databases.
    {filler}
    Docker.
    """
    result = parser.parse(sample_text)
    extracted_dict = {s.skill_id: s for s in result["extracted_skills"]}
    
    assert "sql-optimization" in extracted_dict
    sql_skill = extracted_dict["sql-optimization"]
    # Elementary clue in local window should evaluate to CONCEPTUAL, not ARCHITECTURAL
    assert sql_skill.current_depth == SkillDepth.CONCEPTUAL
    assert sql_skill.confidence_score == 0.40

    assert "docker-containers" in extracted_dict
    docker_skill = extracted_dict["docker-containers"]
    # No clues in local window should evaluate to APPLIED with 0.50 confidence
    assert docker_skill.current_depth == SkillDepth.APPLIED
    assert docker_skill.confidence_score == 0.50

