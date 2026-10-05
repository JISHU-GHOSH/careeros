import math
from typing import List, Optional, Union, Dict, Any, Sequence
from app.graph import CareerGraphEngine
from app.models import (
    DiagnosticReport,
    RoleRoiRecommendation,
    Skill,
    SkillDepth,
    UserSkillState,
)


class DiagnosticsEngine:
    """Confidence-weighted skill-gap diagnostic and reverse ROI career engine."""

    def __init__(self, graph_engine: CareerGraphEngine):
        self.graph_engine = graph_engine

    def _normalize_user_skills(
        self, user_skills: Sequence[Union[UserSkillState, str, Dict[str, Any]]]
    ) -> Dict[str, UserSkillState]:
        """Normalizes skill inputs (models, dicts, or string IDs) into a skill_id map."""
        skill_map: Dict[str, UserSkillState] = {}
        for item in user_skills:
            if isinstance(item, UserSkillState):
                state = item
            elif isinstance(item, str):
                state = UserSkillState(
                    skill_id=item,
                    current_depth=SkillDepth.APPLIED,
                    confidence_score=0.8,
                    verification_source="SELF_REPORT",
                )
            elif isinstance(item, dict):
                state = UserSkillState(**item)
            else:
                continue

            # If duplicate skills exist, keep higher proficiency
            if state.skill_id in skill_map:
                existing = skill_map[state.skill_id]
                if (state.current_depth, state.confidence_score) > (
                    existing.current_depth,
                    existing.confidence_score,
                ):
                    skill_map[state.skill_id] = state
            else:
                skill_map[state.skill_id] = state

        return skill_map

    def compute_diagnostic_report(
        self,
        current_role_id: str,
        target_role_id: str,
        user_skills: Sequence[Union[UserSkillState, str, Dict[str, Any]]],
    ) -> DiagnosticReport:
        """Computes confidence-weighted readiness percentage, categorizes missing/polish/validated skills,

        and calculates estimated timeline months for the target role.
        """
        target_role = self.graph_engine.get_role_by_id(target_role_id)
        if not target_role:
            raise ValueError(f"Target role '{target_role_id}' not found in career graph.")

        user_skill_map = self._normalize_user_skills(user_skills)

        missing_gaps: List[Skill] = []
        needs_polish: List[Skill] = []
        validated_skills: List[Skill] = []

        total_earned = 0.0
        total_weight = 0.0

        for req in target_role.requirements:
            w_s = float(req.importance.value)
            target_depth = int(req.required_depth)
            total_weight += w_s

            skill = self.graph_engine.get_skill_by_id(req.skill_id)
            if skill is None:
                skill = Skill(
                    id=req.skill_id,
                    name=req.skill_id.replace("-", " ").title(),
                    category="General",
                    market_demand_percent=70,
                )

            u_skill = user_skill_map.get(req.skill_id)
            if u_skill is None or int(u_skill.current_depth) <= 0:
                missing_gaps.append(skill)
            else:
                user_depth = int(u_skill.current_depth)
                conf = float(u_skill.confidence_score)
                ratio = min(1.0, user_depth / target_depth) if target_depth > 0 else 1.0
                total_earned += w_s * ratio * conf

                if user_depth >= target_depth and conf >= 0.7:
                    validated_skills.append(skill)
                else:
                    needs_polish.append(skill)

        if total_weight == 0:
            readiness_percentage = 100
        else:
            readiness_raw = (total_earned / total_weight) * 100.0
            readiness_percentage = max(0, min(100, int(round(readiness_raw))))

        if not missing_gaps and not needs_polish:
            estimated_timeline_months = 0
        else:
            months = int(math.ceil(len(missing_gaps) * 1.0 + len(needs_polish) * 0.5))
            estimated_timeline_months = max(1, months)

        return DiagnosticReport(
            current_role_id=current_role_id,
            target_role_id=target_role_id,
            readiness_percentage=readiness_percentage,
            missing_gaps=missing_gaps,
            needs_polish=needs_polish,
            validated_skills=validated_skills,
            estimated_timeline_months=estimated_timeline_months,
        )

    def simulate_reverse_roi(
        self,
        user_skills: Sequence[Union[UserSkillState, str, Dict[str, Any]]],
        current_role_id: Optional[str] = None,
        limit: int = 3,
    ) -> List[RoleRoiRecommendation]:
        """Scans roles in the career ontology, evaluates match percentage and demand,

        and returns top career ROI recommendations.
        """
        all_roles = self.graph_engine.get_all_roles()
        candidate_roles = [r for r in all_roles if r.id != current_role_id] if current_role_id else all_roles

        recommendations_with_meta = []
        boost_table = {1: "+15%", 2: "+25%", 3: "+38%", 4: "+55%", 5: "+75%"}

        current_role = self.graph_engine.get_role_by_id(current_role_id) if current_role_id else None

        for role in candidate_roles:
            report = self.compute_diagnostic_report(
                current_role_id=current_role_id or "",
                target_role_id=role.id,
                user_skills=user_skills,
            )

            # Determine salary boost estimate
            if current_role and role.seniority_level > current_role.seniority_level:
                diff = role.seniority_level - current_role.seniority_level
                boost_pct = min(85, diff * 20 + 10)
                salary_boost = f"+{boost_pct}%"
            else:
                salary_boost = boost_table.get(role.seniority_level, "+25%")

            # Determine top missing skills (by ID)
            missing_ids = [s.id for s in report.missing_gaps]
            polish_ids = [s.id for s in report.needs_polish]
            top_missing = (missing_ids + polish_ids)[:3]

            # Average market demand of role requirements
            valid_skills = [
                skill
                for r in role.requirements
                if (skill := self.graph_engine.get_skill_by_id(r.skill_id)) is not None
            ]
            if valid_skills:
                avg_demand = sum(s.market_demand_percent for s in valid_skills) / len(valid_skills)
            else:
                avg_demand = 50.0

            rec = RoleRoiRecommendation(
                role_id=role.id,
                title=role.title,
                match_percentage=report.readiness_percentage,
                salary_boost_estimate=salary_boost,
                top_missing_skills=top_missing,
            )
            recommendations_with_meta.append((rec, avg_demand))

        # Sort by match percentage descending, then market demand descending
        recommendations_with_meta.sort(
            key=lambda item: (item[0].match_percentage, item[1]),
            reverse=True,
        )

        return [rec for rec, _ in recommendations_with_meta[:limit]]
