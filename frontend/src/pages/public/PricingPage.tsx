import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const PricingPage: React.FC = () => {
  const plans = [
    {
      name: "Candidate Starter",
      price: "$0",
      period: "forever",
      desc: "Perfect for students and engineers starting interview preparation.",
      features: [
        "3 Full AI Mock Interviews / month",
        "Resume ATS Parsing & Scoring",
        "Real-Time Speaking Coach HUD (WPM, Fillers)",
        "Core Question Bank & Coding Lab",
        "Basic Career Roadmap"
      ],
      cta: "Get Started Free",
      highlight: false
    },
    {
      name: "Candidate Pro",
      price: "$29",
      period: "per month",
      desc: "For engineers targeting Tier-1 tech firms and staff-level roles.",
      features: [
        "Unlimited AI Mock Interviews",
        "Signature 4-Persona AI Panel with Cross-Exam",
        "Longitudinal Weakness Finder & History",
        "Full Video Recording & Playback with Feedback Markers",
        "Personalized Milestone Roadmap with Spaced Repetition",
        "Statistical Salary Intelligence & Negotiation Coach"
      ],
      cta: "Start 14-Day Pro Trial",
      highlight: true
    },
    {
      name: "Recruiter Organization",
      price: "$199",
      period: "per seat / mo",
      desc: "For hiring teams demanding structured, evidence-based evaluations.",
      features: [
        "Everything in Pro",
        "Multi-Tenant Organization Management",
        "Requisition & Applicant Pipeline Tracker",
        "Structured Scorecards with Rubric Standardization",
        "Authorized Candidate Report Sharing",
        "Team Role Permissions & Audit Logging"
      ],
      cta: "Contact Enterprise Sales",
      highlight: false
    }
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
          Invest in your career with clear, honest pricing
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mt-4">
          No hidden usage fees. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition ${
              p.highlight
                ? "border-blue-600 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20 relative"
                : "border-slate-200 shadow-sm"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </span>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name}</h3>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">{p.desc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">{p.price}</span>
                <span className="text-slate-500 text-sm">/{p.period}</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700 mb-8 border-t border-slate-100 pt-6">
                {p.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/register"
              className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition ${
                p.highlight
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
