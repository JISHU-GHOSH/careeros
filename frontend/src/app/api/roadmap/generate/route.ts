import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { RoadmapResponse, RoadmapStage, RoadmapNode } from "@/types";
import { DEFAULT_GAME_DEV_ROADMAP } from "@/lib/defaultRoadmap";

export const maxDuration = 30; // 30 seconds max for Vercel Serverless

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profession: string = (body.profession || "").trim();
    const experienceLevel: string = body.experience_level || "beginner";
    const userApiKey: string | undefined = body.api_key?.trim();

    if (!profession) {
      return NextResponse.json(
        { error: "Profession name cannot be empty." },
        { status: 400 }
      );
    }

    const effectiveKey =
      userApiKey ||
      process.env.GROQ_API_KEY;

    // 1. Try Groq AI synthesis with built-in/effective key
    if (effectiveKey && effectiveKey.length > 5) {
      try {
        const groq = new Groq({ apiKey: effectiveKey });
        const primaryModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
        const modelsToTry = [
          primaryModel,
          "qwen/qwen3.8-27b",
          "openai/gpt-oss-120b",
          "openai/gpt-oss-20b",
        ];

        const systemPrompt = `You are an elite career navigator and curriculum architect.
Generate a comprehensive, highly realistic 5-stage career roadmap for ANY requested profession.
CRITICAL RULES:
1. NO GENERIC PLACEHOLDERS: Do NOT use phrases like "Domain Fundamentals" or "Industry Tools".
2. AUTHENTIC TOOLS & CONCEPTS: Always name real-world tools, programming languages, board exams, or software.
3. PRACTICAL CHALLENGES: Every node must include a concrete, portfolio-worthy project challenge.
4. CURATED RESOURCES: Provide 2-3 genuine authoritative resources or books per node.
5. PROGRESSION STRUCTURE: Provide exactly 5 stages, with 6 to 9 total nodes in a coherent DAG.
6. STRICT JSON: Respond ONLY with a valid JSON object matching the requested schema.`;

        const userPrompt = `Generate a 5-stage career roadmap for the profession: "${profession}".
Experience Level: "${experienceLevel}".

Output MUST be a valid JSON object with the following schema:
{
  "profession": "${profession}",
  "experience_level": "${experienceLevel}",
  "summary": "Realistic 2-sentence summary of breaking into this profession.",
  "salary_range": "$XX,000 - $YYY,000 / year",
  "estimated_months": 7,
  "stages": [
    { "stage_index": 1, "title": "Stage 1: Foundational Principles", "estimated_weeks": 6, "node_ids": ["node-1", "node-2"] },
    { "stage_index": 2, "title": "Stage 2: Core Toolchains & Software", "estimated_weeks": 8, "node_ids": ["node-3", "node-4"] },
    { "stage_index": 3, "title": "Stage 3: Advanced Methodologies", "estimated_weeks": 10, "node_ids": ["node-5", "node-6"] },
    { "stage_index": 4, "title": "Stage 4: Flagship Capstone Portfolio", "estimated_weeks": 8, "node_ids": ["node-7"] },
    { "stage_index": 5, "title": "Stage 5: Licensing, Certifications & Placement", "estimated_weeks": 4, "node_ids": ["node-8"] }
  ],
  "nodes": [
    {
      "id": "node-1",
      "title": "Specific node title",
      "stage_index": 1,
      "category": "essential",
      "description": "Specific concepts, technologies, and methods covered.",
      "key_skills": ["Skill 1", "Skill 2", "Skill 3"],
      "project_challenge": "Concrete deliverable to build.",
      "resources": ["Authoritative Resource 1", "Resource 2"],
      "prerequisites": []
    }
  ]
}`;

        for (const modelName of modelsToTry) {
          try {
            const completion = await groq.chat.completions.create({
              model: modelName,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              response_format: { type: "json_object" },
              temperature: 0.3,
              max_tokens: 3000,
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) continue;

            const parsed = JSON.parse(content);
            const rawNodes: RoadmapNode[] = parsed.nodes || [];
            const rawStages: RoadmapStage[] = parsed.stages || [];

            if (rawNodes.length >= 5 && rawStages.length >= 3) {
              const actualNodeIds = new Set(rawNodes.map((n) => n.id));

              // Clean stage node_ids to guarantee graph integrity
              const cleanedStages = rawStages.map((st) => {
                const validNids = (st.node_ids || []).filter((nid) => actualNodeIds.has(nid));
                for (const n of rawNodes) {
                  if (n.stage_index === st.stage_index && !validNids.includes(n.id)) {
                    validNids.push(n.id);
                  }
                }
                return { ...st, node_ids: validNids };
              });

              // Clean prerequisites
              const cleanedNodes = rawNodes.map((n) => ({
                ...n,
                prerequisites: (n.prerequisites || []).filter(
                  (p) => actualNodeIds.has(p) && p !== n.id
                ),
              }));

              const result: RoadmapResponse = {
                profession: parsed.profession || profession,
                experience_level: parsed.experience_level || experienceLevel,
                summary: parsed.summary || `Comprehensive career master plan for ${profession}.`,
                salary_range: parsed.salary_range || "$75,000 - $145,000 / year",
                estimated_months: Number(parsed.estimated_months) || 7,
                stages: cleanedStages,
                nodes: cleanedNodes,
                source: "groq",
              };

              return NextResponse.json(result);
            }
          } catch (modelErr) {
            console.warn(`Groq model ${modelName} error:`, modelErr);
          }
        }
      } catch (groqErr) {
        console.error("Groq generation failed:", groqErr);
      }
    }

    // 2. Curated Match Fallback for Game Dev
    const lower = profession.toLowerCase();
    if (lower.includes("game")) {
      return NextResponse.json({ ...DEFAULT_GAME_DEV_ROADMAP, source: "curated" });
    }

    // 3. Dynamic Archetype Fallback Synthesis
    const cleanSlug = profession.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const stages: RoadmapStage[] = [
      { stage_index: 1, title: `Stage 1: Core Science & Fundamentals`, estimated_weeks: 6, node_ids: [`${cleanSlug}-1`, `${cleanSlug}-2`] },
      { stage_index: 2, title: `Stage 2: Standard Toolchains & Execution`, estimated_weeks: 8, node_ids: [`${cleanSlug}-3`, `${cleanSlug}-4`] },
      { stage_index: 3, title: `Stage 3: Advanced Methodologies & Specializations`, estimated_weeks: 10, node_ids: [`${cleanSlug}-5`, `${cleanSlug}-6`] },
      { stage_index: 4, title: `Stage 4: Flagship Portfolio Proof-of-Work`, estimated_weeks: 8, node_ids: [`${cleanSlug}-7`] },
      { stage_index: 5, title: `Stage 5: Licensure, Certifications & Placement`, estimated_weeks: 4, node_ids: [`${cleanSlug}-8`] },
    ];

    const nodes: RoadmapNode[] = [
      {
        id: `${cleanSlug}-1`,
        title: `${profession} Theoretical Principles & Core Standards`,
        stage_index: 1,
        category: "essential",
        description: `Master the fundamental theoretical foundations, domain science, and regulatory compliance governing professional ${profession} practice.`,
        key_skills: [`${profession} Core Theory`, "Safety Protocols", "Analytical Problem-Solving"],
        project_challenge: `Author a comprehensive technical brief analyzing the primary engineering or operational constraints of a modern ${profession}.`,
        resources: [`Foundations of ${profession}`, "Industry Standard Handbook"],
        prerequisites: [],
      },
      {
        id: `${cleanSlug}-2`,
        title: `Primary Technical Toolchain & Software Suites`,
        stage_index: 1,
        category: "essential",
        description: `Configure and operate the specialized hardware, software, and testing instruments standard to senior ${profession}s.`,
        key_skills: ["Operational Workflows", "Diagnostic Equipment", "Technical Toolchains"],
        project_challenge: `Build and benchmark a production workspace optimized for ${profession} deliverables.`,
        resources: [`${profession} Practical Guidebook`, "Official Documentation"],
        prerequisites: [`${cleanSlug}-1`],
      },
      {
        id: `${cleanSlug}-3`,
        title: `Applied Hands-On Execution & Quality Control`,
        stage_index: 2,
        category: "essential",
        description: `Execute real-world daily deliverables and standard operating procedures expected in high-performance environments.`,
        key_skills: ["Hands-On Execution", "Standard Operating Procedures", "Quality Assurance"],
        project_challenge: `Deliver a fully verified, self-contained prototype or report meeting industry benchmarks.`,
        resources: ["Case Studies in Applied Practice", "Operational Playbook"],
        prerequisites: [`${cleanSlug}-2`],
      },
      {
        id: `${cleanSlug}-4`,
        title: `Team Workflows & Cross-Functional Coordination`,
        stage_index: 2,
        category: "recommended",
        description: `Master stakeholder alignment, regulatory audits, technical documentation, and cross-disciplinary collaboration.`,
        key_skills: ["Cross-Functional Alignment", "Technical Documentation", "Compliance Auditing"],
        project_challenge: `Draft a complete multi-team operational specification and risk assessment plan.`,
        resources: ["Agile Team Collaboration Guide", "Compliance Guidelines"],
        prerequisites: [`${cleanSlug}-3`],
      },
      {
        id: `${cleanSlug}-5`,
        title: `Advanced Edge-Case Remediation & Systems Architecture`,
        stage_index: 3,
        category: "specialization",
        description: `Handle complex failures, risk mitigation, and high-stakes problem resolution under time-critical pressure.`,
        key_skills: ["Advanced Diagnostics", "Failure Analysis", "Resilience Engineering"],
        project_challenge: `Remediate a critical simulated failure scenario and document the post-mortem root cause analysis.`,
        resources: ["Advanced Incident Response Handbook", "Architectural Best Practices"],
        prerequisites: [`${cleanSlug}-3`],
      },
      {
        id: `${cleanSlug}-6`,
        title: `Performance Optimization & Cost Efficiency`,
        stage_index: 3,
        category: "recommended",
        description: `Optimize throughput, reliability, safety compliance, and cost efficiency for enterprise-grade deliverables.`,
        key_skills: ["System Optimization", "Cost Management", "Telemetry & Metrics"],
        project_challenge: `Conduct an end-to-end performance audit and execute optimizations achieving measurable 25%+ gains.`,
        resources: ["Optimization Principles Guide", "Reliability Engineering Handbook"],
        prerequisites: [`${cleanSlug}-5`],
      },
      {
        id: `${cleanSlug}-7`,
        title: `Flagship Proof-of-Work Portfolio Capstone`,
        stage_index: 4,
        category: "essential",
        description: `Design, execute, and publish an exhaustive flagship portfolio project demonstrating your readiness to employers or clients.`,
        key_skills: ["Flagship Deliverable", "End-to-End Design", "Public Showcase", "Peer Defense"],
        project_challenge: `Publish a public, peer-reviewed flagship capstone project with comprehensive documentation and live demo.`,
        resources: [`Portfolio Guide for ${profession}s`, "Presentation Strategies"],
        prerequisites: [`${cleanSlug}-5`],
      },
      {
        id: `${cleanSlug}-8`,
        title: `Licensure, Board Accreditation & Career Launch`,
        stage_index: 5,
        category: "essential",
        description: `Pass relevant board examinations or professional certifications, master technical case interviews, and launch your career.`,
        key_skills: ["Technical Case Defense", "Board Certifications", "Contract & Salary Negotiation"],
        project_challenge: `Successfully pass a mock technical panel defense and present your capstone artifact to senior practitioners.`,
        resources: [`${profession} Certification Standards`, "Interview Masterclass"],
        prerequisites: [`${cleanSlug}-7`],
      },
    ];

    const fallbackResponse: RoadmapResponse = {
      profession: profession,
      experience_level: experienceLevel,
      summary: `Comprehensive master curriculum to break into and excel as a professional ${profession}, covering foundational principles, core toolchains, and real-world portfolio capstones.`,
      salary_range: "$70,000 - $140,000 / year",
      estimated_months: 7,
      stages,
      nodes,
      source: "archetype",
    };

    return NextResponse.json(fallbackResponse);
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error while generating roadmap." },
      { status: 500 }
    );
  }
}
