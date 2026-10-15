import React from "react";
import { Link } from "react-router-dom";
import {
  FileText, Users, Mic, Video, TrendingUp, DollarSign,
  Terminal, ShieldCheck, CheckCircle2, ArrowRight
} from "lucide-react";

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Signature 4-Persona AI Panel",
      description: "Experience dynamic multi-interviewer simulations featuring Priya Sharma (HR), Alex Chen (Staff Lead), Marcus Vance (VP Engineering), and Dr. Elena Rostova (Enterprise Architect). They challenge your answers from diverse stakeholder angles.",
      tag: "Signature AI"
    },
    {
      icon: Mic,
      title: "Real-Time Speaking Coach HUD",
      description: "Get real-time feedback during mock sessions: filler-word counters, words-per-minute (WPM) speedometers, pause duration metrics, and conversational cadence coaching without intrusive interruptions.",
      tag: "Live Coaching"
    },
    {
      icon: FileText,
      title: "Resume Intelligence & ATS Scorer",
      description: "Upload your PDF/DOCX resume for strict parsing, keyword density evaluation, achievement phrasing reviews, and automatic interview question generation extracted directly from your past projects.",
      tag: "Resume Tech"
    },
    {
      icon: TrendingUp,
      title: "Longitudinal Weakness Finder",
      description: "Never repeat the same interview mistake twice. Our improvement engine tracks recurring misconceptions across sessions, maps them to concrete answer excerpts, and assigns severity ratings.",
      tag: "Improvement"
    },
    {
      icon: Terminal,
      title: "Interactive Coding Lab & Question Bank",
      description: "Write code with real test cases and starter templates for Java, Python, C#, TypeScript, and SQL. Browse hundreds of vetted system design and concurrency questions with reference solutions.",
      tag: "Technical Prep"
    },
    {
      icon: DollarSign,
      title: "Statistical Salary Intelligence",
      description: "Make data-backed career decisions using verified compensation aggregates. Filter by role, seniority, and location to calculate base, bonus, and equity ranges with negotiation coaching.",
      tag: "Compensation"
    }
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Platform Capabilities
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
          Every tool you need to conquer senior technical interviews
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mt-4">
          Built as an integrated SaaS platform with real backend persistence, structured rubrics, and non-Docker deployment discipline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{f.description}</p>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 gap-1.5 mt-2"
              >
                <span>Try this feature</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="mt-20 bg-blue-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-blue-500/20">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to experience these capabilities firsthand?</h2>
        <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Join thousands of software engineers preparing for top tech companies.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold bg-white text-blue-600 hover:bg-blue-50 transition shadow-md"
        >
          Get Started Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
