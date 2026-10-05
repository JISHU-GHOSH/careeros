import {
  HealthResponse,
  GraphRolesResponse,
  DiagnosticsAnalyzeRequest,
  DiagnosticReport,
  PathwayGenerateRequest,
  MilestonePathway,
  TrajectorySimulateRoiRequest,
  RoleRoiRecommendation,
  ResumeParseRequest,
  ResumeParseResponse,
  RoadmapResponse,
  RoadmapGenerateRequest,
  RoadmapStatusResponse,
} from "@/types";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const getBaseUrl = (): string => {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return "http://127.0.0.1:8000";
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getBaseUrl()}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorDetail = response.statusText;
      let errorData: unknown;
      try {
        errorData = await response.json();
        if (typeof errorData === "object" && errorData !== null && "detail" in errorData) {
          errorDetail = String((errorData as { detail: unknown }).detail);
        } else {
          errorDetail = JSON.stringify(errorData);
        }
      } catch {
        // Fall back to statusText
      }
      throw new ApiError(`API request failed [${response.status}]: ${errorDetail}`, response.status, errorData);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown network error";
    throw new ApiError(`Network request failed: ${message}`, 0);
  }
}

/**
 * Health check endpoint verifying backend intelligence service status
 */
export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/api/health", { method: "GET" });
}

/**
 * Retrieves all ontology role nodes and transition edges for trajectory visualization
 */
export async function getRolesGraph(): Promise<GraphRolesResponse> {
  return request<GraphRolesResponse>("/api/graph/roles", { method: "GET" });
}

/**
 * Computes confidence-weighted skill gaps, readiness score, and estimated timeline
 */
export async function analyzeDiagnostics(
  payload: DiagnosticsAnalyzeRequest
): Promise<DiagnosticReport> {
  return request<DiagnosticReport>("/api/diagnostics/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Generates topologically sequenced milestone pathways and mentor pairings for skill gaps
 */
export async function generatePathway(
  payload: PathwayGenerateRequest
): Promise<MilestonePathway[]> {
  return request<MilestonePathway[]>("/api/pathway/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Calculates reverse career recommendations based on user competencies and market demand
 */
export async function simulateRoi(
  payload: TrajectorySimulateRoiRequest
): Promise<RoleRoiRecommendation[]> {
  return request<RoleRoiRecommendation[]>("/api/trajectory/simulate-roi", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Extracts technical competencies and assesses candidate role from resume text or upload
 */
export async function parseResume(
  input: ResumeParseRequest | FormData | string
): Promise<ResumeParseResponse> {
  if (typeof input === "string") {
    return request<ResumeParseResponse>("/api/resume/parse", {
      method: "POST",
      body: JSON.stringify({ resume_text: input }),
    });
  }

  if (input instanceof FormData) {
    return request<ResumeParseResponse>("/api/resume/parse", {
      method: "POST",
      body: input,
    });
  }

  return request<ResumeParseResponse>("/api/resume/parse", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * Generates an end-to-end, visual flow-tree roadmap for any requested profession
 */
export async function generateRoadmap(
  payload: RoadmapGenerateRequest
): Promise<RoadmapResponse> {
  return request<RoadmapResponse>("/api/roadmap/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Returns popular profession suggestions for instant inspiration
 */
export async function getSuggestions(): Promise<string[]> {
  return request<string[]>("/api/roadmap/suggestions", { method: "GET" });
}

/**
 * Returns AI status and Groq configuration state
 */
export async function getRoadmapStatus(): Promise<RoadmapStatusResponse> {
  return request<RoadmapStatusResponse>("/api/roadmap/status", { method: "GET" });
}

export const api = {
  getHealth,
  getRolesGraph,
  analyzeDiagnostics,
  generatePathway,
  simulateRoi,
  parseResume,
  generateRoadmap,
  getSuggestions,
  getRoadmapStatus,
};

export default api;
