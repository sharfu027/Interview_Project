import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Video,
  FileCode,
  Users2,
  MessageSquare,
  ShieldAlert,
  Sliders
} from "lucide-react";

export const NewInterviewWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState(
    searchParams.get("role") || "Senior Distributed Systems & Concurrency Interview"
  );
  const [jobFamily, setJobFamily] = useState(searchParams.get("family") || "BACKEND");
  const [seniority, setSeniority] = useState(searchParams.get("seniority") || "SENIOR");
  const [interviewType, setInterviewType] = useState("TECHNICAL");
  const [difficulty, setDifficulty] = useState("HARD");
  const [mode, setMode] = useState("AUDIO_VIDEO");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [totalQuestions, setTotalQuestions] = useState(4);
  const [focusAreas, setFocusAreas] = useState<string[]>([
    "Concurrency & Multithreading",
    "Distributed Consensus (Raft/Paxos)",
    "PostgreSQL Indexing & MVCC",
  ]);

  const toggleFocusArea = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const payload = {
        title,
        jobFamily,
        seniority,
        interviewType,
        difficulty,
        mode,
        durationMinutes,
        totalQuestions,
      };
      const created = await api.interviews.create(payload);
      navigate(`/app/interviews/${created.id}`);
    } catch (err) {
      console.error("Failed to launch interview session", err);
      alert("Failed to initialize session. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configure Mock Interview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tailor interview question calibration, persona rigor, and evaluation rubrics
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        {[
          { num: 1, label: "Role & Seniority" },
          { num: 2, label: "Format & Focus" },
          { num: 3, label: "Environment & Launch" },
        ].map((s) => (
          <div key={s.num} className="flex items-center space-x-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num
                  ? "bg-blue-600 text-white"
                  : step > s.num
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Role & Seniority */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">Step 1: Role Calibration</h2>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Interview Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Job Family:
              </label>
              <select
                value={jobFamily}
                onChange={(e) => setJobFamily(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="BACKEND">Backend Engineering</option>
                <option value="FULLSTACK">Full-Stack</option>
                <option value="FRONTEND">Frontend Engineering</option>
                <option value="DEVOPS">DevOps & Cloud Infrastructure</option>
                <option value="QA">QA & Test Automation</option>
                <option value="DATA">Data Engineering</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Target Seniority:
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="JUNIOR">Junior (0-2 years)</option>
                <option value="MID">Mid-Level (3-5 years)</option>
                <option value="SENIOR">Senior (5-8 years)</option>
                <option value="STAFF">Staff / Principal (8+ years)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Next: Format & Focus</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Format & Focus */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">Step 2: Interview Format & Competencies</h2>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Interview Type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: "TECHNICAL", title: "Technical Deep-Dive", icon: FileCode, desc: "Architecture, frameworks, concurrency" },
                { type: "SYSTEM_DESIGN", title: "System Design", icon: Sliders, desc: "Scale, caching, consensus, partition tolerance" },
                { type: "BEHAVIORAL", title: "Behavioral STAR", icon: MessageSquare, desc: "Leadership, conflict resolution, ownership" },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = interviewType === fmt.type;
                return (
                  <button
                    key={fmt.type}
                    type="button"
                    onClick={() => setInterviewType(fmt.type)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/10"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                    <h3 className="text-xs font-bold text-slate-900">{fmt.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{fmt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Difficulty Grilling Intensity:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "MEDIUM", label: "Medium", desc: "Standard Tech Screens" },
                { id: "HARD", label: "Hard", desc: "Tier 1 Senior Bar" },
                { id: "EXPERT", label: "Expert / Staff", desc: "Deep Internal Edge Cases" },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    difficulty === diff.id
                      ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <span className="text-xs block">{diff.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{diff.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Target Competencies to Probe:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Concurrency & Multithreading",
                "Distributed Consensus (Raft/Paxos)",
                "PostgreSQL Indexing & MVCC",
                "Idempotency & Double-Entry Ledgers",
                "Event-Driven Architecture (Kafka)",
                "Java Memory Model (Volatile/CAS)",
                "Spring Security & JWT Stateless Auth",
              ].map((comp) => {
                const isSelected = focusAreas.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleFocusArea(comp)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {comp}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Next: Environment & Launch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Environment & Launch */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">Step 3: Environment & Real-Time Coaching</h2>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Simulation Mode:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("AUDIO_VIDEO")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  mode === "AUDIO_VIDEO"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/10"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Camera + Speaking Coach HUD</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Real-time filler-word tracking, speaking pace (WPM), and facial composure feedback.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("TEXT_ONLY")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  mode === "TEXT_ONLY"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/10"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">Text-Only Focused</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Ideal for quiet environments or focusing purely on technical reasoning text.
                </p>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Configuration Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div><strong className="text-slate-800">Target Role:</strong> {title}</div>
              <div><strong className="text-slate-800">Seniority:</strong> {seniority}</div>
              <div><strong className="text-slate-800">Interview Type:</strong> {interviewType}</div>
              <div><strong className="text-slate-800">Difficulty:</strong> {difficulty}</div>
              <div><strong className="text-slate-800">Total Questions:</strong> {totalQuestions} Questions</div>
              <div><strong className="text-slate-800">Duration Target:</strong> {durationMinutes} Minutes</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleLaunch}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Generating Questions..." : "Generate & Launch Session"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
