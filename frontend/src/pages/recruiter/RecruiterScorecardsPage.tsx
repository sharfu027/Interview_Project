import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  Send,
  User,
  ShieldCheck,
  Star
} from "lucide-react";

export const RecruiterScorecardsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const candidateLinkId = searchParams.get("candidateId") || "cand-link-1";

  const [scorecards, setScorecards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // New scorecard form state
  const [recommendation, setRecommendation] = useState("STRONG_HIRE");
  const [overallScore, setOverallScore] = useState(9.2);
  const [technicalScore, setTechnicalScore] = useState(9.5);
  const [communicationScore, setCommunicationScore] = useState(8.8);
  const [problemSolvingScore, setProblemSolvingScore] = useState(9.0);
  const [notes, setNotes] = useState(
    "Candidate exhibited exceptional depth in distributed transactions, explaining the exact Saga rollback failure states and Kafka outbox idempotency with high precision."
  );

  useEffect(() => {
    async function loadScorecards() {
      try {
        const list = await api.recruiter.listScorecards(candidateLinkId);
        setScorecards(list);
      } catch (err) {
        console.error("Failed to load scorecards", err);
      } finally {
        setLoading(false);
      }
    }
    loadScorecards();
  }, [candidateLinkId]);

  const handleSubmitScorecard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.recruiter.submitScorecard(candidateLinkId, {
        candidateName: "David Candidate",
        interviewerName: "Sarah Recruiter",
        recommendation,
        overallScore,
        generalNotes: notes,
      });
      setScorecards((prev) => [created, ...prev]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to submit scorecard", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading structured scorecards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Structured Evaluation Scorecards</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Objective evaluation rubric, standardized interview signals, and hire/no-hire decision logging
        </p>
      </div>

      {/* Main Grid: Form vs History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Evaluation Form */}
        <div className="lg:col-span-7 space-y-4">
          <form
            onSubmit={handleSubmitScorecard}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Candidate: David Candidate
                </h2>
                <span className="text-xs text-slate-500">Target: Senior Distributed Systems Engineer</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Candidate
              </span>
            </div>

            {/* Rubric Sliders */}
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Technical Competence & Architecture</span>
                  <span className="text-emerald-700 font-bold">{technicalScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={technicalScore}
                  onChange={(e) => setTechnicalScore(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Communication Clarity & Synthesis</span>
                  <span className="text-emerald-700 font-bold">{communicationScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={communicationScore}
                  onChange={(e) => setCommunicationScore(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Problem Solving & Trade-off Navigating</span>
                  <span className="text-emerald-700 font-bold">{problemSolvingScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={problemSolvingScore}
                  onChange={(e) => setProblemSolvingScore(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Final Recommendation */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Hiring Recommendation:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "STRONG_HIRE", label: "Strong Hire", color: "text-emerald-700 border-emerald-300 bg-emerald-50" },
                  { id: "HIRE", label: "Hire", color: "text-blue-700 border-blue-300 bg-blue-50" },
                  { id: "LEANING_HIRE", label: "Leaning", color: "text-amber-700 border-amber-300 bg-amber-50" },
                  { id: "NO_HIRE", label: "No Hire", color: "text-red-700 border-red-300 bg-red-50" },
                ].map((rec) => (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => setRecommendation(rec.id)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      recommendation === rec.id
                        ? `${rec.color} ring-2 ring-emerald-500/20`
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {rec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Detailed Evaluation Debrief Notes:
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {success && (
                <div className="flex items-center space-x-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Scorecard logged successfully!</span>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="ml-auto inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{submitting ? "Logging..." : "Submit Formal Scorecard"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 Cols: Historical Logged Scorecards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Submitted Scorecard Records ({scorecards.length})
            </h3>

            <div className="space-y-3">
              {scorecards.map((sc) => (
                <div
                  key={sc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{sc.interviewerName}</span>
                    <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] uppercase">
                      {sc.recommendation.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="font-bold text-slate-700">Overall Calibration:</span>
                    <span className="text-base font-extrabold text-emerald-700">{sc.overallScore}</span>
                    <span className="text-slate-400">/ 10.0</span>
                  </div>

                  <p className="text-slate-600 leading-relaxed font-sans">
                    "{sc.generalNotes}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
