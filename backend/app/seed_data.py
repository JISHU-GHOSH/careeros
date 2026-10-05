from typing import List, Tuple
from app.models import Skill, Role, RoleSkillRequirement, SkillDepth, SkillImportance

SEED_SKILLS: List[Skill] = [
    Skill(
        id="javascript-typescript",
        name="JavaScript & TypeScript",
        category="Frontend Engineering",
        market_demand_percent=95,
    ),
    Skill(
        id="react-state",
        name="React & State Architecture",
        category="Frontend Engineering",
        market_demand_percent=90,
    ),
    Skill(
        id="rest-apis",
        name="RESTful API Design & Integration",
        category="Backend Engineering",
        market_demand_percent=88,
    ),
    Skill(
        id="distributed-caching",
        name="Distributed Caching (Redis)",
        category="System Architecture",
        market_demand_percent=82,
    ),
    Skill(
        id="sql-optimization",
        name="SQL Query Optimization & Indexing",
        category="Data Architecture",
        market_demand_percent=85,
    ),
    Skill(
        id="system-design",
        name="Scalable System Design",
        category="System Architecture",
        market_demand_percent=92,
    ),
    Skill(
        id="docker-containers",
        name="Docker Containerization",
        category="DevOps & Cloud",
        market_demand_percent=86,
    ),
    Skill(
        id="ci-cd-pipelines",
        name="CI/CD Pipeline Automation",
        category="DevOps & Cloud",
        market_demand_percent=80,
    ),
]

SEED_ROLES: List[Role] = [
    Role(
        id="junior-frontend",
        title="Junior Frontend Developer",
        domain="Frontend Engineering",
        seniority_level=1,
        description="Builds responsive user interfaces, modular web components, and integrates client-side state.",
        requirements=[
            RoleSkillRequirement(
                skill_id="javascript-typescript",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="react-state",
                required_depth=SkillDepth.CONCEPTUAL,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="rest-apis",
                required_depth=SkillDepth.CONCEPTUAL,
                importance=SkillImportance.NICE_TO_HAVE,
            ),
        ],
    ),
    Role(
        id="mid-fullstack",
        title="Mid-Level Full-Stack Engineer",
        domain="Full-Stack Engineering",
        seniority_level=2,
        description="Delivers full-stack web applications, REST APIs, relational database integrations, and containerized services.",
        requirements=[
            RoleSkillRequirement(
                skill_id="javascript-typescript",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="react-state",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="rest-apis",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="sql-optimization",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="docker-containers",
                required_depth=SkillDepth.CONCEPTUAL,
                importance=SkillImportance.NICE_TO_HAVE,
            ),
        ],
    ),
    Role(
        id="senior-fullstack",
        title="Senior Full-Stack Engineer",
        domain="Full-Stack Engineering",
        seniority_level=3,
        description="Leads technical architecture, high-throughput backend services, resilient distributed caching, and scalable state machines.",
        requirements=[
            RoleSkillRequirement(
                skill_id="javascript-typescript",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="react-state",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="rest-apis",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="distributed-caching",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="sql-optimization",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="system-design",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
        ],
    ),
    Role(
        id="staff-architect",
        title="Staff Systems Architect",
        domain="System Architecture",
        seniority_level=4,
        description="Sets architectural guidelines across domains, designs resilient distributed systems, and oversees mission-critical infrastructure.",
        requirements=[
            RoleSkillRequirement(
                skill_id="system-design",
                required_depth=SkillDepth.ARCHITECTURAL,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="distributed-caching",
                required_depth=SkillDepth.ARCHITECTURAL,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="sql-optimization",
                required_depth=SkillDepth.ARCHITECTURAL,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="rest-apis",
                required_depth=SkillDepth.ARCHITECTURAL,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="docker-containers",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.NICE_TO_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="ci-cd-pipelines",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.NICE_TO_HAVE,
            ),
        ],
    ),
    Role(
        id="devops-engineer",
        title="DevOps & Infrastructure Engineer",
        domain="DevOps & Cloud",
        seniority_level=3,
        description="Automates continuous delivery, container orchestration, cluster monitoring, and production infrastructure.",
        requirements=[
            RoleSkillRequirement(
                skill_id="docker-containers",
                required_depth=SkillDepth.ARCHITECTURAL,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="ci-cd-pipelines",
                required_depth=SkillDepth.ARCHITECTURAL,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="rest-apis",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.MUST_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="distributed-caching",
                required_depth=SkillDepth.CONCEPTUAL,
                importance=SkillImportance.NICE_TO_HAVE,
            ),
            RoleSkillRequirement(
                skill_id="system-design",
                required_depth=SkillDepth.APPLIED,
                importance=SkillImportance.NICE_TO_HAVE,
            ),
        ],
    ),
]

SEED_EDGES: List[Tuple[str, str]] = [
    ("junior-frontend", "mid-fullstack"),
    ("mid-fullstack", "senior-fullstack"),
    ("senior-fullstack", "staff-architect"),
    ("mid-fullstack", "devops-engineer"),
]
