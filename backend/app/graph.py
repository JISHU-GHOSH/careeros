from typing import List, Optional, Dict, Tuple
import networkx as nx
from app.models import Role, Skill
from app.seed_data import SEED_ROLES, SEED_SKILLS, SEED_EDGES

class CareerGraphEngine:
    def __init__(
        self,
        roles: Optional[List[Role]] = None,
        skills: Optional[List[Skill]] = None,
        edges: Optional[List[Tuple[str, str]]] = None,
    ):
        self.roles: List[Role] = roles if roles is not None else list(SEED_ROLES)
        self.skills: List[Skill] = skills if skills is not None else list(SEED_SKILLS)
        self.edges: List[Tuple[str, str]] = edges if edges is not None else list(SEED_EDGES)

        self._roles_by_id: Dict[str, Role] = {r.id: r for r in self.roles}
        self._skills_by_id: Dict[str, Skill] = {s.id: s for s in self.skills}

        self.graph = nx.DiGraph()
        for role in self.roles:
            self.graph.add_node(
                role.id,
                role=role,
                title=role.title,
                domain=role.domain,
                seniority_level=role.seniority_level,
            )

        for source, target in self.edges:
            self.graph.add_edge(source, target)

    def get_all_roles(self) -> List[Role]:
        return list(self.roles)

    def get_role_by_id(self, role_id: str) -> Optional[Role]:
        return self._roles_by_id.get(role_id)

    def get_all_skills(self) -> List[Skill]:
        return list(self.skills)

    def get_skill_by_id(self, skill_id: str) -> Optional[Skill]:
        return self._skills_by_id.get(skill_id)

    def get_all_edges(self) -> List[Dict[str, str]]:
        return [{"source": source, "target": target} for source, target in self.edges]

    def get_adjacent_roles(self, role_id: str) -> List[Role]:
        if role_id not in self.graph:
            return []
        return [
            self._roles_by_id[successor]
            for successor in self.graph.successors(role_id)
            if successor in self._roles_by_id
        ]

    def get_trajectory_path(self, source_role_id: str, target_role_id: str) -> List[str]:
        if source_role_id not in self.graph or target_role_id not in self.graph:
            return []
        if source_role_id == target_role_id:
            return [source_role_id]
        try:
            return nx.shortest_path(self.graph, source=source_role_id, target=target_role_id)
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return []
