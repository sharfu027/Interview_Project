import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Award } from "lucide-react";

export const ForCandidatesPage: React.FC = () => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          For Candidates
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
          Level Up From Mid-Level to Staff Engineer
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mt-4">
          Prepare with actual interview rubrics used by Tier-1 tech firms. Gain clarity on salary ceilings, identify blind spots, and eliminate communication anxiety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Targeted Career Progression</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Generate tailored roadmaps that break down high-complexity topics like distributed consensus, Java virtual threads, and cache consistency.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Measurable milestone completion metrics</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Spaced repetition for previously identified weaknesses</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Authentic Grilling Simulations</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Practice in strict mode without hints or pauses to simulate real onsite conditions. Get drilled on your resume trade-offs and edge cases.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pressure testing on technical assumptions</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-time filler-word & pace coaching HUD</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Negotiation & Compensation Power</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Know your true market worth before talking to recruiters. Model competitive equity and base salary packages with realistic benchmarks.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>2026 Verified Tech Compensation Datasets</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Interactive salary counter-offer simulator</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          Create Candidate Profile
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
