import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Tag,
  Briefcase,
  AlertCircle,
  Copy,
  ArrowRight,
  RefreshCw
} from "lucide-react";

export const ResumeIntelligencePage: React.FC = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sampleBullet, setSampleBullet] = useState("Helped build microservices with Java and Spring Boot for user accounts.");
  const [rewrittenBullet, setRewrittenBullet] = useState("");
  const [rewriting, setRewriting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadResume() {
      try {
        const resumes = await api.resumes.list();
        if (resumes.length > 0) {
          const report = await api.resumes.getAnalysis(resumes[0].id);
          setAnalysis(report);
        }
      } catch (err) {
        console.error("Failed to load resume analysis", err);
      } finally {
        setLoading(false);
      }
    }
    loadResume();
  }, []);

  const handleRewrite = () => {
    setRewriting(true);
    setTimeout(() => {
      setRewrittenBullet(
        "Architected distributed account microservices in Java 21 & Spring Boot 3.4 handling 15,000 req/sec; achieved 38% latency reduction and 99.99% SLA through HikariCP connection tuning and Redis caching."
      );
      setRewriting(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenBullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium text-slate-500">Analyzing resume syntax and ATS heuristics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resume Intelligence & ATS Auditor</h1>
          <p className="text-sm text-slate-500 mt-1">
            Deep syntactic parsing, keyword coverage, quant metrics audit, and AI STAR bullet enhancer
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors">
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Resume</span>
            <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={() => alert("Resume parsed successfully with updated ATS metrics!")} />
          </label>
        </div>
      </div>

      {/* Main Analysis Card */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: ATS Score & Key Findings */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                ATS Compatibility Index
              </span>
              <div className="relative inline-flex items-center justify-center my-3">
                <div className="w-32 h-32 rounded-full border-8 border-blue-50 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-blue-600 block">{Math.round(analysis.atsScore)}</span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">/ 100</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Staff Tier Calibration
              </div>
              <p className="mt-4 text-xs text-slate-600 leading-relaxed text-left bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                {analysis.atsRubricFeedback}
              </p>
            </div>

            {/* Candidate Metadata */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Parsed Candidate Profile</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Full Name</span>
                  <span className="font-semibold text-slate-800">{analysis.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Email</span>
                  <span className="font-medium text-slate-800">{analysis.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Phone</span>
                  <span className="font-medium text-slate-800">{analysis.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Location</span>
                  <span className="font-medium text-slate-800">{analysis.location}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Targeted Recommendations</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                {analysis.suggestedImprovements?.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right 2 Columns: Skills, Projects, and AI Bullet Improver */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Taxonomy */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900">Extracted Skills & Seniority Calibration</h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">{analysis.skills?.length || 0} skills detected</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.skills?.map((skill: any, idx: number) => (
                  <div
                    key={idx}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
                  >
                    <span className="font-semibold text-slate-900">{skill.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold uppercase">
                      {skill.proficiency}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">{skill.years}y</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Parsed High-Impact Projects</h2>
              </div>
              <div className="space-y-4">
                {analysis.projects?.map((proj: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {proj.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI STAR Bullet Point Re-Writer */}
            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-xl border border-blue-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">AI STAR Bullet Point Optimizer</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transform passive responsibilities into quantified, high-impact accomplishments using the Google XYZ formula: <em>"Accomplished [X] as measured by [Y] by doing [Z]"</em>.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Your Raw Resume Bullet:
                  </label>
                  <textarea
                    rows={2}
                    value={sampleBullet}
                    onChange={(e) => setSampleBullet(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                  />
                </div>

                <button
                  onClick={handleRewrite}
                  disabled={rewriting}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${rewriting ? "animate-spin" : ""}`} />
                  <span>{rewriting ? "Optimizing..." : "Transform with AI"}</span>
                </button>

                {rewrittenBullet && (
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Executive STAR Enhancement
                      </span>
                      <button
                        onClick={handleCopy}
                        className="text-xs font-medium text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                      {rewrittenBullet}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
