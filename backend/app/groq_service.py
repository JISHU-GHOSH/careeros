"""Groq Cloud LLM Service for Dynamic Career Roadmap Generation.

Connects to Groq API using high-speed models (e.g., llama-3.3-70b-versatile)
to dynamically synthesize bespoke, industry-accurate career roadmaps for any profession.
Includes graceful fallback to curated offline archetypes when Groq is unavailable.
"""

import json
import logging
import os
import re
from typing import Optional, Dict, Any
from dotenv import load_dotenv

from app.models import RoadmapResponse, RoadmapStage, RoadmapNode

# Load .env variables if present
load_dotenv()

logger = logging.getLogger("groq_service")

# Default Groq model
PRIMARY_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
SUPPORTED_MODELS = [
    "openai/gpt-oss-120b",
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
]


def get_effective_groq_key(provided_key: Optional[str] = None) -> Optional[str]:
    """Retrieves the effective Groq API key from request, environment, or .env."""
    if provided_key and provided_key.strip():
        return provided_key.strip()
    env_key = os.getenv("GROQ_API_KEY", "").strip()
    return env_key if env_key else None


def is_groq_configured(provided_key: Optional[str] = None) -> bool:
    """Checks whether a valid Groq API key is available."""
    key = get_effective_groq_key(provided_key)
    return bool(key and len(key) > 5)


def generate_roadmap_with_groq(
    profession: str,
    experience_level: str = "beginner",
    api_key: Optional[str] = None,
) -> Optional[RoadmapResponse]:
    """Generates an authentic, structured career roadmap using the Groq API.
    
    Returns RoadmapResponse on success, or None on failure or when Groq is unconfigured.
    """
    effective_key = get_effective_groq_key(api_key)
    if not effective_key:
        logger.info("Groq API key not configured. Using offline roadmap generator.")
        return None

    try:
        from groq import Groq
    except ImportError:
        logger.warning("Groq Python package not installed.")
        return None

    client = Groq(api_key=effective_key)

    system_prompt = (
        "You are an elite, world-class career navigator and curriculum designer. "
        "Your task is to generate a comprehensive, highly realistic, step-by-step career roadmap "
        "for ANY requested profession—whether in technology, healthcare, aviation, engineering, trades, "
        "creative arts, or finance.\n\n"
        "CRITICAL QUALITY RULES:\n"
        "1. NO GENERIC PLACEHOLDERS: Do NOT use phrases like 'Domain Fundamentals', 'Industry Tools', or 'Core Tenets'.\n"
        "2. AUTHENTIC TOOLS & CONCEPTS: Always name real-world tools, programming languages, standards, instruments, "
        "board exams, or software (e.g. for Aviation: PPL, IFR, PA-44 Seminole, ATP; for Doctor: MCAT, Gross Anatomy, "
        "USMLE Step 1, Clerkship; for DevOps: Linux systemd, Docker, Kubernetes, Terraform, ArgoCD).\n"
        "3. PRACTICAL CHALLENGES: Every node must include a concrete, portfolio-worthy project challenge that proves mastery.\n"
        "4. CURATED RESOURCES: Provide 2-3 genuine, authoritative learning resources or industry handbooks per node.\n"
        "5. PROGRESSION STRUCTURE: Provide exactly 5 sequential stages (Stage 1 to Stage 5), with 7 to 9 total nodes in a coherent DAG.\n"
        "6. STRICT JSON: Respond ONLY with a valid JSON object matching the exact schema below."
    )

    user_prompt = f"""Generate a comprehensive 5-stage career roadmap for the profession: "{profession}".
Target Experience Level: "{experience_level}".

Output MUST be a valid JSON object with the following schema:
{{
  "profession": "{profession.title()}",
  "experience_level": "{experience_level}",
  "summary": "High-impact, realistic 2-sentence summary of what this role entails and the path to breaking in.",
  "salary_range": "$XX,000 - $YYY,000 / year (or accurate regional equivalent)",
  "estimated_months": 6,
  "stages": [
    {{
      "stage_index": 1,
      "title": "Stage 1: Foundational Principles & Core Prerequisites",
      "estimated_weeks": 6,
      "node_ids": ["node-1-id", "node-2-id"]
    }},
    {{
      "stage_index": 2,
      "title": "Stage 2: Core Toolchains, Technologies & Operational Methods",
      "estimated_weeks": 8,
      "node_ids": ["node-3-id", "node-4-id"]
    }},
    {{
      "stage_index": 3,
      "title": "Stage 3: Advanced Methodologies & Specializations",
      "estimated_weeks": 10,
      "node_ids": ["node-5-id", "node-6-id"]
    }},
    {{
      "stage_index": 4,
      "title": "Stage 4: Flagship Proof-of-Work Portfolio Capstone",
      "estimated_weeks": 8,
      "node_ids": ["node-7-id"]
    }},
    {{
      "stage_index": 5,
      "title": "Stage 5: Licensing, Industry Certifications & Career Launch",
      "estimated_weeks": 4,
      "node_ids": ["node-8-id"]
    }}
  ],
  "nodes": [
    {{
      "id": "node-1-id",
      "title": "Clear, specific node title",
      "stage_index": 1,
      "category": "essential",
      "description": "Specific concepts, technologies, and methods covered in this milestone.",
      "key_skills": ["Skill/Tool A", "Skill/Tool B", "Skill/Tool C"],
      "project_challenge": "Concrete, hands-on deliverable or project to build.",
      "resources": ["Authoritative Resource 1", "Authoritative Resource 2"],
      "prerequisites": []
    }}
  ]
}}
"""

    models_to_try = list(dict.fromkeys([PRIMARY_MODEL] + SUPPORTED_MODELS))
    last_error: Optional[Exception] = None

    for model_name in models_to_try:
        try:
            logger.info(f"Querying Groq model '{model_name}' for profession: {profession}")
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                model=model_name,
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=3000,
            )

            raw_content = chat_completion.choices[0].message.content
            if not raw_content:
                continue

            data = json.loads(raw_content)

            # Validate and convert into RoadmapResponse
            raw_stages = [RoadmapStage(**s) for s in data.get("stages", [])]
            raw_nodes = [RoadmapNode(**n) for n in data.get("nodes", [])]

            actual_node_ids = {n.id for n in raw_nodes}

            # Reconcile node_ids per stage to eliminate nonexistent ghost node references
            cleaned_stages: list[RoadmapStage] = []
            for stage in raw_stages:
                valid_nids = [nid for nid in stage.node_ids if nid in actual_node_ids]
                # Associate nodes that belong to this stage_index
                for n in raw_nodes:
                    if n.stage_index == stage.stage_index and n.id not in valid_nids:
                        valid_nids.append(n.id)
                stage.node_ids = valid_nids
                cleaned_stages.append(stage)

            # Reconcile prerequisites so all point to valid existing nodes
            cleaned_nodes: list[RoadmapNode] = []
            for n in raw_nodes:
                n.prerequisites = [p for p in n.prerequisites if p in actual_node_ids and p != n.id]
                cleaned_nodes.append(n)

            roadmap = RoadmapResponse(
                profession=data.get("profession", profession.title()),
                experience_level=data.get("experience_level", experience_level),
                summary=data.get("summary", f"Structured career roadmap for {profession}."),
                salary_range=data.get("salary_range", "$70,000 - $140,000 / year"),
                estimated_months=int(data.get("estimated_months", 6)),
                stages=cleaned_stages,
                nodes=cleaned_nodes,
            )

            # Ensure valid node count (at least 6 nodes, at least 4 stages)
            if len(roadmap.nodes) >= 6 and len(roadmap.stages) >= 4:
                logger.info(f"Successfully generated Groq roadmap with {len(roadmap.nodes)} nodes via {model_name}")
                return roadmap

        except Exception as e:
            logger.warning(f"Groq generation with model '{model_name}' failed: {e}")
            last_error = e

    logger.error(f"All Groq models failed. Falling back to offline generator. Last error: {last_error}")
    return None
