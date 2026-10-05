import re
from typing import List, Dict, Any, Optional
from app.models import UserSkillState, SkillDepth
from app.graph import CareerGraphEngine


# Skill keyword and regex patterns for entity extraction
SKILL_PATTERNS: Dict[str, List[str]] = {
    "javascript-typescript": [
        r"\btypescript\b",
        r"\bjavascript\b",
        r"\bnode(?:\.js)?\b",
        r"\bnodejs\b",
        r"\becmascript\b",
        r"\b(?:es6|es20\d\d)\b",
        r"\bts\b",
        r"\bjs\b",
    ],
    "react-state": [
        r"\breact(?:\.js|js)?\b",
        r"\bredux\b",
        r"\bzustand\b",
        r"\bmobx\b",
        r"\bnext(?:\.js|js)?\b",
        r"\bstate\s+management\b",
        r"\breact\s+query\b",
    ],
    "rest-apis": [
        r"\brest(?:ful)?\s+apis?\b",
        r"\brestful\b",
        r"\brest\b",
        r"\bapi\s+design\b",
        r"\bopenapi\b",
        r"\bfastapi\b",
        r"\bexpress(?:\.js)?\b",
        r"\bgraphql\b",
        r"\bhttp\s+endpoints?\b",
    ],
    "distributed-caching": [
        r"\bredis\b",
        r"\bmemcached\b",
        r"\bdistributed\s+cach(?:e|ing)\b",
        r"\bcache\s+invalidation\b",
        r"\bcaching\b",
    ],
    "sql-optimization": [
        r"\bsql\b",
        r"\bpostgres(?:ql)?\b",
        r"\bmysql\b",
        r"\bsqlite\b",
        r"\bquery\s+optimization\b",
        r"\bdatabase\s+indexing\b",
        r"\bindexing\b",
        r"\bexplain\s+analyze\b",
        r"\brelational\s+databases?\b",
    ],
    "system-design": [
        r"\bsystem\s+design\b",
        r"\bscalable\s+systems?\b",
        r"\bdistributed\s+systems?\b",
        r"\bmicroservices\b",
        r"\bhigh\s+availability\b",
        r"\bscalability\b",
        r"\bload\s+balancing\b",
        r"\bsystem\s+architecture\b",
        r"\bcap\s+theorem\b",
    ],
    "docker-containers": [
        r"\bdocker\b",
        r"\bcontainer(?:s|ization)?\b",
        r"\bkubernetes\b",
        r"\bk8s\b",
        r"\bhelm\b",
    ],
    "ci-cd-pipelines": [
        r"\bci\s*/\s*cd\b",
        r"\bcicd\b",
        r"\bgithub\s+actions\b",
        r"\bgitlab\s+ci\b",
        r"\bjenkins\b",
        r"\bpipelines?\b",
        r"\bpipeline\s+automation\b",
        r"\bcontinuous\s+integration\b",
        r"\bcontinuous\s+deployment\b",
    ],
}

# Clues indicative of depth levels
ARCHITECTURAL_CLUES = [
    r"\barchitect\b",
    r"\barchitected\b",
    r"\barchitecture\b",
    r"\bstaff\b",
    r"\bprincipal\b",
    r"\blead\b",
    r"\bleading\b",
    r"\bhigh-throughput\b",
    r"\bhigh\s+throughput\b",
    r"\bdistributed\b",
    r"\bscale\b",
    r"\bat\s+scale\b",
    r"\boptimiz(?:e|ed|ation)\b",
    r"\btuning\b",
]

APPLIED_CLUES = [
    r"\bproficient\b",
    r"\bexperience\b",
    r"\bworked\s+with\b",
    r"\bdeveloped\b",
    r"\bdeveloping\b",
    r"\bimplemented\b",
    r"\bimplementing\b",
    r"\bbuilt\b",
    r"\bbuilding\b",
    r"\bhands-on\b",
    r"\bproduction\b",
    r"\bshipped\b",
]


class ResumeParser:
    """Extracts technical competency entities from resume text, assesses proficiency

    depth and confidence scores, and detects the user's best matching career role.
    """

    def __init__(self, graph_engine: Optional[CareerGraphEngine] = None):
        self.graph_engine = graph_engine or CareerGraphEngine()

    def parse(self, text: str) -> Dict[str, Any]:
        """Parses raw text and returns extracted skills and candidate role."""
        if not text or not text.strip():
            return {
                "detected_role": "mid-fullstack",
                "extracted_skills": [],
            }

        lower_text = text.lower()
        extracted_skills: List[UserSkillState] = []
        extracted_skill_ids = set()

        for skill_id, patterns in SKILL_PATTERNS.items():
            matches = []
            for pattern in patterns:
                found = list(re.finditer(pattern, lower_text, re.IGNORECASE))
                if found:
                    matches.extend(found)

            if matches:
                # Assess depth and confidence based on context around matches
                depth, conf = self._evaluate_depth_and_confidence(matches, lower_text)
                extracted_skills.append(
                    UserSkillState(
                        skill_id=skill_id,
                        current_depth=depth,
                        confidence_score=round(conf, 2),
                        verification_source="RESUME_PARSED",
                    )
                )
                extracted_skill_ids.add(skill_id)

        detected_role = self._detect_role(lower_text, extracted_skill_ids)

        return {
            "detected_role": detected_role,
            "extracted_skills": extracted_skills,
        }

    def _evaluate_depth_and_confidence(
        self, matches: List[re.Match], full_text: str
    ) -> tuple[SkillDepth, float]:
        """Evaluates whether the candidate demonstrated architectural, applied, or conceptual depth."""
        # Check context window (100 characters before and after matches)
        has_arch_clue = False
        has_applied_clue = False

        for match in matches:
            start = max(0, match.start() - 100)
            end = min(len(full_text), match.end() + 100)
            window = full_text[start:end]

            if any(re.search(pat, window, re.IGNORECASE) for pat in ARCHITECTURAL_CLUES):
                has_arch_clue = True
            if any(re.search(pat, window, re.IGNORECASE) for pat in APPLIED_CLUES):
                has_applied_clue = True

        # Check full text as fallback
        if not has_arch_clue and any(re.search(pat, full_text, re.IGNORECASE) for pat in ARCHITECTURAL_CLUES):
            has_arch_clue = True
        if not has_applied_clue and any(re.search(pat, full_text, re.IGNORECASE) for pat in APPLIED_CLUES):
            has_applied_clue = True

        if has_arch_clue:
            return SkillDepth.ARCHITECTURAL, 0.85
        elif has_applied_clue:
            return SkillDepth.APPLIED, 0.80
        else:
            return SkillDepth.CONCEPTUAL, 0.70

    def _detect_role(self, lower_text: str, extracted_skills: set[str]) -> str:
        """Determines closest career role from text seniority keywords and skill coverage."""
        # 1. Direct title clues
        if re.search(r"\b(infrastructure|devops|sre|platform engineer)\b", lower_text):
            return "devops-engineer"
        if re.search(r"\b(staff|principal|chief architect|systems architect)\b", lower_text):
            return "staff-architect"
        if re.search(r"\b(senior|lead|sr\.)\b", lower_text):
            return "senior-fullstack"
        if re.search(r"\b(intern|junior|entry|associate)\b", lower_text):
            return "junior-frontend"

        # 2. Years of experience clues
        years_match = re.search(r"(\d+)\+?\s+years?", lower_text)
        if years_match:
            try:
                years = int(years_match.group(1))
                if years >= 5:
                    return "senior-fullstack"
                elif years <= 1:
                    return "junior-frontend"
                else:
                    return "mid-fullstack"
            except ValueError:
                pass

        # 3. Match against ontology roles based on skill overlap
        best_role_id = "mid-fullstack"
        highest_overlap = -1

        for role in self.graph_engine.get_all_roles():
            req_ids = {r.skill_id for r in role.requirements}
            overlap = len(req_ids.intersection(extracted_skills))
            if overlap > highest_overlap:
                highest_overlap = overlap
                best_role_id = role.id

        return best_role_id


def parse_resume_text(
    text: str, graph_engine: Optional[CareerGraphEngine] = None
) -> Dict[str, Any]:
    """Helper function to parse resume text."""
    parser = ResumeParser(graph_engine)
    return parser.parse(text)
