import React from "react";
import { Compass, Sparkles, Target, Layers } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <div className="max-w-3xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> CareerOS Intelligence Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Intelligent Career Trajectory & Skill-Gap Engine
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Navigate your engineering career path with confidence-weighted competency diagnostics,
          reverse ROI simulation, and topological milestone pathways.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
          <div className="p-5 rounded-lg border border-border bg-card/50">
            <Compass className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-semibold text-foreground">Ontology Mapping</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Live NetworkX graph pathfinding across engineering seniority levels.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card/50">
            <Target className="w-6 h-6 text-success mb-2" />
            <h3 className="font-semibold text-foreground">Skill Diagnostics</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Confidence-calibrated readiness scores and actionable missing gap matrix.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card/50">
            <Layers className="w-6 h-6 text-accent mb-2" />
            <h3 className="font-semibold text-foreground">Milestone Acceleration</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Topologically sequenced hands-on projects with instant XP progression.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
