import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Hero3DScene } from "../../components/3d/Hero3DScene";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Mic,
  Video,
  FileText,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  Award,
  Terminal,
  Compass,
  DollarSign,
  Building2,
  ChevronRight,
  Play
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState("BACKEND");

  const roles = [
    { id: "BACKEND", label: "Java & Backend", stack: "Java 21, Spring Boot, PostgreSQL, Kafka, Concurrency" },
    { id: "FULLSTACK", label: "Full-Stack Web", stack: "React 19, TypeScript, Node.js, Next.js, System Design" },
    { id: "DOTNET", label: ".NET & C#", stack: "C# 13, ASP.NET Core, EF Core, Microservices, Azure" },
    { id: "FRONTEND", label: "Frontend Architecture", stack: "React, Web Performance, State Machines, Accessibility" },
    { id: "QA", label: "QA & Automation", stack: "Playwright, Test Automation Architecture, CI/CD, API Testing" },
  ];

  return (
    <div className="bg-[#F8FAFC]">
      {/* 1. Hero Section with Interactive 3D */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Career Intelligence &middot; 2026 Edition</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Master Tech Interviews with an <span className="text-blue-600">AI Panel</span> & Live Speech Coaching.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                The unified platform that extracts questions directly from your resume, runs multi-role interview panels, analyzes speech pacing in real-time, and builds measurable roadmaps to your dream offer.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 active:scale-[0.98]"
                >
                  Start Preparing Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/features"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition shadow-sm"
                >
                  <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                  Explore AI Capabilities
                </Link>
              </div>

              {/* Trust & Accreditations */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  No Docker required
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Light theme optimized
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Evidence-based scoring
                </span>
              </div>
            </div>

            {/* Right: 3D Dimensional Scene */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full max-w-md lg:max-w-none bg-gradient-to-b from-blue-50/50 to-white/80 rounded-3xl p-4 border border-blue-100 shadow-xl shadow-blue-500/5">
                <Hero3DScene />
                <div className="bg-white/95 rounded-2xl p-4 border border-slate-200 shadow-sm mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Live Intelligence Engine</span>
                    <span className="text-sm font-bold text-slate-800">4 Personas &middot; Real-time Rubrics &middot; WPM HUD</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Role Architecture Showcase */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs uppercase font-bold tracking-wider text-blue-600 mb-2">Multi-Family Engineering Intelligence</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Tailored to your exact job discipline</h3>
            <p className="text-slate-600 text-sm mt-2">
              Select your domain to see the competencies, question categories, and deep technical rubrics evaluated by our AI engines.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  selectedRole === r.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Target Stack</span>
                <p className="text-sm font-semibold text-slate-800">{roles.find((r) => r.id === selectedRole)?.stack}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Evaluation Focus</span>
                <p className="text-sm font-semibold text-slate-800">Concurrency, memory models, latency SLAs, architectural fault tolerance</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">AI Panel Persona</span>
                <p className="text-sm font-semibold text-slate-800">Dr. Elena Rostova & Alex Chen (Principal Staff Engineer)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Three Pillars of InterviewOS */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            End-To-End Career Loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Prepare &middot; Practise &middot; Improve
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            A cohesive platform designed to replace disjointed preparation notes with structured, measurable skill development.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pillar 1: Prepare */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Pillar 1</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">Prepare with Resume & Company Intelligence</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Upload your PDF/DOCX resume for deep ATS scoring, keyword coverage, and automated question generation anchored directly in your real projects.
            </p>
            <ul className="space-y-2.5 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Resume ATS rubric analysis & bullet refinement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Company-specific interview round guides</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Job description parser & gap matrix</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Practise */}
          <div className="bg-white rounded-3xl p-8 border border-blue-200 shadow-sm hover:shadow-md transition ring-2 ring-blue-500/10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 border border-indigo-100">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Pillar 2</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">Practise with Multi-Persona AI Panels</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Step into an interview with 4 distinct personas—HR Director, Staff Engineer, VP of Engineering, and Chief Architect—with real-time cross-examination.
            </p>
            <ul className="space-y-2.5 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dynamic cross-interviewer challenges</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real-time speech coach HUD (WPM, filler counter)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WebRTC camera/mic preview & private recordings</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Improve */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pillar 3</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">Improve with Weakness Finder & Roadmaps</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Track recurring misconceptions across sessions. Generate milestone-driven learning roadmaps and benchmark compensation with verifiable salary models.
            </p>
            <ul className="space-y-2.5 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Longitudinal weakness tracking linked to answers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Personalized milestone roadmaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Statistical compensation estimates & negotiation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Signature 4-Persona Panel Showcase */}
      <section className="py-20 bg-slate-900 text-white rounded-3xl max-w-7xl mx-auto px-6 lg:px-12 mb-20 shadow-2xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-700">
            Signature Feature
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            The 4-Persona AI Interview Panel
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Ordinary tools simulate one generic chatbot. InterviewOS coordinates four senior perspectives that challenge each other’s observations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg mb-4">
              PS
            </div>
            <h4 className="font-bold text-white text-base">Priya Sharma</h4>
            <span className="text-xs text-purple-400 font-semibold block mb-2">Director of Talent</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Examines job motivation, STAR examples, team conflict resolution, and authentic culture fit.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-lg mb-4">
              AC
            </div>
            <h4 className="font-bold text-white text-base">Alex Chen</h4>
            <span className="text-xs text-blue-400 font-semibold block mb-2">Principal Staff Engineer</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Drills into concurrency, memory safety, algorithm soundness, query plans, and clean code mechanics.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg mb-4">
              MV
            </div>
            <h4 className="font-bold text-white text-base">Marcus Vance</h4>
            <span className="text-xs text-emerald-400 font-semibold block mb-2">VP of Engineering</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluates ownership under pressure, technical debt vs. delivery prioritization, and business impact.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-lg mb-4">
              ER
            </div>
            <h4 className="font-bold text-white text-base">Dr. Elena Rostova</h4>
            <span className="text-xs text-amber-400 font-semibold block mb-2">Chief Enterprise Architect</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Challenges high-scale fault tolerance, distributed consensus, CAP limits, and disaster recovery modes.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Recruiter Solution Teaser */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                For Organizations & Recruiters
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Structured Hiring Workflows with Objective Competency Rubrics
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Publish tenant-scoped requisitions, manage candidate pipelines, review structured scorecards with evidence links, and eliminate subjective interview bias.
              </p>
            </div>
            <Link
              to="/for-recruiters"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-md shrink-0"
            >
              Explore Recruiter Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="py-20 lg:py-24 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ready to experience the future of interview preparation?
        </h2>
        <p className="text-slate-600 text-base sm:text-lg mt-3 mb-8 max-w-xl mx-auto">
          Create your account in seconds. Test drive the mock interview runner, speaking coach, and career roadmap.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 active:scale-95"
        >
          Create Free Account
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
};
