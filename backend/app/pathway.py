import networkx as nx
from typing import List, Optional, Dict, Any, Sequence
from app.models import MilestonePathway, MilestoneTask, Skill
from app.graph import CareerGraphEngine


# Curated catalog of milestone learning tasks and expert mentors per skill
SKILL_LEARNING_CONTENT: Dict[str, Dict[str, Any]] = {
    "distributed-caching": {
        "title": "Distributed Caching & High-Throughput Resilience",
        "tasks": [
            {
                "title": "Deep Dive: Cache-Aside vs Write-Through Patterns & Eviction Policies",
                "type": "CONCEPT_ARTICLE",
                "estimated_minutes": 45,
                "xp_reward": 100,
            },
            {
                "title": "Implement a High-Throughput Redis Cache Layer with Thundering Herd Defense",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 120,
                "xp_reward": 250,
            },
            {
                "title": "Architect Event-Driven Distributed Cache Invalidation with Redis Pub/Sub",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 90,
                "xp_reward": 200,
            },
        ],
        "mentor": {
            "name": "Marcus Vance",
            "role": "Principal Systems Engineer",
            "company": "Cloudflare",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            "bio": "12+ years optimizing high-load distributed storage, caching topology, and edge runtimes.",
            "match_reason": "Distributed Caching Specialist",
        },
    },
    "sql-optimization": {
        "title": "SQL Query Optimization & Database Indexing",
        "tasks": [
            {
                "title": "Query Planner Internals: B-Tree Indexes, Bitmap Scans & Execution Plans",
                "type": "CONCEPT_ARTICLE",
                "estimated_minutes": 45,
                "xp_reward": 100,
            },
            {
                "title": "Tune Slow Query Logs & Optimize PostgreSQL Queries using EXPLAIN ANALYZE",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 110,
                "xp_reward": 250,
            },
            {
                "title": "Implement Composite Indexing & Table Partitioning for High-Write Workloads",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 95,
                "xp_reward": 200,
            },
        ],
        "mentor": {
            "name": "Elena Rostova",
            "role": "Lead Database Architect",
            "company": "Cockroach Labs",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
            "bio": "Specializes in query planner optimization, table partitioning, and high-concurrency relational systems.",
            "match_reason": "SQL & Data Architecture Specialist",
        },
    },
    "system-design": {
        "title": "Scalable System Architecture & Fault-Tolerant Design",
        "tasks": [
            {
                "title": "Scalable Microservices Architecture: CAP Theorem, Partitioning & Event Sourcing",
                "type": "CONCEPT_ARTICLE",
                "estimated_minutes": 60,
                "xp_reward": 120,
            },
            {
                "title": "Architect an End-to-End Rate Limiter and Distributed Snowflake ID Generator",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 140,
                "xp_reward": 300,
            },
            {
                "title": "Design Resilient Failover, Circuit Breakers & Multi-Region Replication Topology",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 120,
                "xp_reward": 250,
            },
        ],
        "mentor": {
            "name": "David Kim",
            "role": "Staff Systems Architect",
            "company": "Stripe",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
            "bio": "Led payments routing and high-reliability transaction infrastructure for planetary-scale traffic.",
            "match_reason": "Scalable Systems Specialist",
        },
    },
    "javascript-typescript": {
        "title": "Modern JavaScript & Advanced TypeScript Architecture",
        "tasks": [
            {
                "title": "Advanced TypeScript: Conditional Types, Template Literals & Invariance",
                "type": "CONCEPT_ARTICLE",
                "estimated_minutes": 40,
                "xp_reward": 100,
            },
            {
                "title": "Refactor Dynamic API Schemas to Strictly Validated End-to-End Types",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 90,
                "xp_reward": 220,
            },
            {
                "title": "Build a Custom AST Transformation or ESLint Plugin for Architectural Constraints",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 80,
                "xp_reward": 180,
            },
        ],
        "mentor": {
            "name": "Sophia Zhang",
            "role": "Frontend Platform Lead",
            "company": "Vercel",
            "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256",
            "bio": "TypeScript core ecosystem contributor and compiler enthusiast.",
            "match_reason": "TypeScript & Web Performance Expert",
        },
    },
    "react-state": {
        "title": "React Architecture & Optimistic State Management",
        "tasks": [
            {
                "title": "React Concurrent Mode, Suspense Boundaries & Server Components Internals",
                "type": "CONCEPT_ARTICLE",
                "estimated_minutes": 45,
                "xp_reward": 100,
            },
            {
                "title": "Build a Low-Latency Optimistic State Store with Undo/Redo & Background Sync",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 110,
                "xp_reward": 240,
            },
            {
                "title": "Architect Component Profiling & Zero-Layout-Shift Performance Audit",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 75,
                "xp_reward": 180,
            },
        ],
        "mentor": {
            "name": "Liam O'Connor",
            "role": "Principal UI Engineer",
            "company": "Shopify",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
            "bio": "Creator of responsive, high-performance UI components and state machines.",
            "match_reason": "React State Architecture Expert",
        },
    },
    "rest-apis": {
        "title": "Production-Grade RESTful API Design & Integration",
        "tasks": [
            {
                "title": "RESTful API Standards: Idempotency, RFC 7807 Problem Details & Versioning",
                "type": "CONCEPT_ARTICLE",
                "estimated_minutes": 40,
                "xp_reward": 100,
            },
            {
                "title": "Design & Deploy a Production OpenAPI 3.1 Service with Automated Contract Testing",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 95,
                "xp_reward": 220,
            },
            {
                "title": "Implement Middleware for Structured Request Logging, Distributed Tracing & Limits",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 85,
                "xp_reward": 200,
            },
        ],
        "mentor": {
            "name": "Amara Patel",
            "role": "Senior Backend Engineer",
            "company": "Twilio",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
            "bio": "API gateway architect focused on reliability and developer ergonomics.",
            "match_reason": "RESTful Architecture Specialist",
        },
    },
    "docker-containers": {
        "title": "Docker Containerization & Image Optimization",
        "tasks": [
            {
                "title": "Container Internals: Linux Namespaces, cgroups & Multi-Stage Distroless Builds",
                "type": "CONCEPT_ARTICLE",
                "estimated_minutes": 45,
                "xp_reward": 100,
            },
            {
                "title": "Dockerize a Multi-Service Full-Stack Application with Slim Production Images",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 100,
                "xp_reward": 230,
            },
            {
                "title": "Configure Compose Development-to-Production Parity with Healthchecks & Volumes",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 80,
                "xp_reward": 190,
            },
        ],
        "mentor": {
            "name": "Alex Chen",
            "role": "DevOps Tech Lead",
            "company": "Docker",
            "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256",
            "bio": "Container security and lightweight image optimization veteran.",
            "match_reason": "Containerization Specialist",
        },
    },
    "ci-cd-pipelines": {
        "title": "CI/CD Pipeline Automation & Automated Deployment",
        "tasks": [
            {
                "title": "Continuous Delivery: Zero-Downtime Blue/Green, Canary & Rollback Strategies",
                "type": "CONCEPT_ARTICLE",
                "estimated_minutes": 45,
                "xp_reward": 100,
            },
            {
                "title": "Build an Automated Multi-Stage GitHub Actions Pipeline with Caching & Matrix Tests",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 105,
                "xp_reward": 240,
            },
            {
                "title": "Automate Security Vulnerability Scanning & Semantic Release Tagging",
                "type": "HANDS_ON_PROJECT",
                "estimated_minutes": 85,
                "xp_reward": 200,
            },
        ],
        "mentor": {
            "name": "Rachel Adams",
            "role": "Cloud Infrastructure Architect",
            "company": "Datadog",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
            "bio": "CI/CD automation expert building resilient deployment pipelines at scale.",
            "match_reason": "CI/CD & Release Engineering Specialist",
        },
    },
}

# Explicit prerequisite edges defining foundations -> advanced competencies
SKILL_PREREQUISITES = [
    ("javascript-typescript", "react-state"),
    ("rest-apis", "sql-optimization"),
    ("sql-optimization", "distributed-caching"),
    ("rest-apis", "distributed-caching"),
    ("docker-containers", "ci-cd-pipelines"),
    ("distributed-caching", "system-design"),
    ("sql-optimization", "system-design"),
]


class PathwayGenerator:
    """Sequences actionable milestones for skill gaps, topologically ordering

    foundations before advanced competencies and pairing each with mentor recommendations.
    """

    def __init__(self, graph_engine: Optional[CareerGraphEngine] = None):
        self.graph_engine = graph_engine or CareerGraphEngine()
        self._prereq_graph = nx.DiGraph()
        for src, dst in SKILL_PREREQUISITES:
            self._prereq_graph.add_edge(src, dst)

    def _sequence_skills(self, gap_skill_ids: Sequence[str]) -> List[str]:
        """Topologically orders gap skill IDs so prerequisite foundations come first,
        accounting for transitive reachability across intermediate skills in the DAG.
        """
        unique_gaps = list(dict.fromkeys(gap_skill_ids))
        if not unique_gaps:
            return []

        # Subgraph of requested skills with transitive reachability edges
        subgraph = nx.DiGraph()
        for skill in unique_gaps:
            subgraph.add_node(skill)

        for u in unique_gaps:
            for v in unique_gaps:
                if u != v:
                    if (
                        self._prereq_graph.has_node(u)
                        and self._prereq_graph.has_node(v)
                        and nx.has_path(self._prereq_graph, u, v)
                    ):
                        subgraph.add_edge(u, v)

        # Topological sort if DAG, fallback to original order on cycle
        try:
            ordered = list(nx.topological_sort(subgraph))
            return ordered
        except nx.NetworkXUnfeasible:
            return unique_gaps

    def generate_pathway(
        self, target_role_id: str, gap_skill_ids: Sequence[str]
    ) -> List[MilestonePathway]:
        """Assembles sequenced MilestonePathway objects for each gap skill."""
        ordered_skills = self._sequence_skills(gap_skill_ids)
        pathways: List[MilestonePathway] = []

        for idx, skill_id in enumerate(ordered_skills, start=1):
            skill_obj = self.graph_engine.get_skill_by_id(skill_id)
            skill_name = (
                skill_obj.name
                if skill_obj
                else skill_id.replace("-", " ").title()
            )

            content = SKILL_LEARNING_CONTENT.get(skill_id)
            if content:
                title = f"Milestone {idx}: {content['title']}"
                raw_tasks = content["tasks"]
                mentor = content["mentor"]
            else:
                title = f"Milestone {idx}: {skill_name} Mastery"
                raw_tasks = [
                    {
                        "title": f"Theory & Architecture: {skill_name} Core Principles",
                        "type": "CONCEPT_ARTICLE",
                        "estimated_minutes": 45,
                        "xp_reward": 100,
                    },
                    {
                        "title": f"Hands-on Lab: Implement & Benchmark {skill_name}",
                        "type": "HANDS_ON_PROJECT",
                        "estimated_minutes": 120,
                        "xp_reward": 250,
                    },
                ]
                mentor = {
                    "name": "Jordan Taylor",
                    "role": f"Staff Specialist ({skill_name})",
                    "company": "Tech Mentor Guild",
                    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256",
                    "bio": f"10+ years mentoring engineers in {skill_name} and modern engineering workflows.",
                    "match_reason": f"Peer Guide in {skill_name}",
                }

            tasks: List[MilestoneTask] = []
            for t_idx, t in enumerate(raw_tasks, start=1):
                tasks.append(
                    MilestoneTask(
                        id=f"task-{skill_id}-{t_idx}",
                        title=t["title"],
                        type=t["type"],
                        estimated_minutes=t["estimated_minutes"],
                        xp_reward=t["xp_reward"],
                        target_skill_id=skill_id,
                        completed=False,
                    )
                )

            pathways.append(
                MilestonePathway(
                    milestone_index=idx,
                    title=title,
                    focus_skill_id=skill_id,
                    tasks=tasks,
                    recommended_mentor=mentor,
                )
            )

        return pathways

    def generate_milestone_pathway(
        self, target_role_id: str, gap_skill_ids: Sequence[str]
    ) -> List[MilestonePathway]:
        return self.generate_pathway(target_role_id, gap_skill_ids)


def generate_milestone_pathway(
    target_role_id: str,
    gap_skill_ids: Sequence[str],
    graph_engine: Optional[CareerGraphEngine] = None,
) -> List[MilestonePathway]:
    """Helper function to generate milestone pathways."""
    generator = PathwayGenerator(graph_engine)
    return generator.generate_pathway(target_role_id, gap_skill_ids)
