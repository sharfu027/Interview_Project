import React from "react";
import { Link } from "react-router-dom";
import { Upload, Cpu, Video, CheckCircle2, ArrowRight } from "lucide-react";

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Upload Resume & Define Goals",
      desc: "Drop your PDF or DOCX resume. InterviewOS parses your real projects, extracts your verified tech stack, and identifies key missing keywords for your target seniority.",
      icon: Upload
    },
    {
      step: "02",
      title: "Configure Mock Session",
      desc: "Select your interview discipline (System Design, Concurrency, Behavioral, or 4-Persona Panel), choose strict or practice mode, and calibrate difficulty from Medium to Expert.",
      icon: Cpu
    },
    {
      step: "03",
      title: "Live Interactive Interview",
      desc: "Engage with our AI panel via WebRTC video/audio or text. Real-time speech analytics silently tracks your pacing, words per minute, and filler word usage.",
      icon: Video
    },
    {
      step: "04",
      title: "Actionable Scorecard & Roadmap",
      desc: "Receive comprehensive scoring across Technical Correctness, Communication Structure, and Trade-off Awareness, with direct links to personalized learning milestones.",
      icon: CheckCircle2
    }
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          The Workflow
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
          How InterviewOS Accelerates Your Career
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mt-4">
          Four disciplined steps engineered to transform interview anxiety into structured, reproducible excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-extrabold text-blue-100 font-mono block mb-4">{s.step}</span>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          Start Your First Session
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
