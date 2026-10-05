/**
 * CareerOS Core TypeScript Interfaces and Types
 * Mirroring backend Pydantic models from backend/app/models.py and backend/app/main.py
 */

export enum SkillDepth {
  CONCEPTUAL = 1,
  APPLIED = 2,
  ARCHITECTURAL = 3,
}

export enum SkillImportance {
  MUST_HAVE = 1.0,
  NICE_TO_HAVE = 0.4,
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  market_demand_percent: number;
}

export interface RoleSkillRequirement {
  skill_id: string;
  required_depth: SkillDepth;
  importance: SkillImportance;
}

export interface Role {
  id: string;
  title: string;
  domain: string;
  seniority_level: number;
  description?: string;
  requirements: RoleSkillRequirement[];
}

export type VerificationSource =
  | "SELF_REPORT"
  | "RESUME_PARSED"
  | "ARTIFACT_VERIFIED"
  | string;

export interface UserSkillState {
  skill_id: string;
  current_depth: SkillDepth;
  confidence_score: number;
  verification_source?: VerificationSource;
}

export interface DiagnosticReport {
  current_role_id: string;
  target_role_id: string;
  readiness_percentage: number;
  missing_gaps: Skill[];
  needs_polish: Skill[];
  validated_skills: Skill[];
  estimated_timeline_months: number;
}

export type MilestoneTaskType = "CONCEPT_ARTICLE" | "HANDS_ON_PROJECT" | string;

export interface MilestoneTask {
  id: string;
  title: string;
  type: MilestoneTaskType;
  estimated_minutes: number;
  xp_reward: number;
  target_skill_id: string;
  completed: boolean;
}

export interface RecommendedMentor {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  [key: string]: string | undefined;
}

export interface MilestonePathway {
  milestone_index: number;
  title: string;
  focus_skill_id: string;
  tasks: MilestoneTask[];
  recommended_mentor?: Record<string, string> | RecommendedMentor | null;
}

export interface RoleRoiRecommendation {
  role_id: string;
  title: string;
  match_percentage: number;
  salary_boost_estimate: string;
  top_missing_skills: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  [key: string]: string;
}

export interface GraphRolesResponse {
  roles: Role[];
  edges: GraphEdge[];
}

export interface HealthResponse {
  status: string;
  service: string;
}

export interface DiagnosticsAnalyzeRequest {
  current_role_id: string;
  target_role_id: string;
  user_skills: (UserSkillState | string | Record<string, unknown>)[];
}

export interface PathwayGenerateRequest {
  target_role_id: string;
  gap_skill_ids: string[];
}

export interface TrajectorySimulateRoiRequest {
  current_skill_ids?: string[];
  user_skills?: (UserSkillState | string | Record<string, unknown>)[];
  current_role_id?: string;
  limit?: number;
}

export interface ResumeParseRequest {
  resume_text: string;
}

export interface ResumeParseResponse {
  detected_role: string;
  extracted_skills: UserSkillState[];
}
