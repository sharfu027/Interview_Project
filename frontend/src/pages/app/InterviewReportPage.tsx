import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Share2,
  Download,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export const InterviewReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQId, setExpandedQId] = useState<string | null>("q-1");
  const [shared, setShared] = useState(false);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await api.interviews.getReport(id || "int-session-1");
        setReport(data);
      } catch (err) {
        console.error("Failed to load interview report", err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Synthesizing comprehensive scorecard metrics...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Scorecard not found.</p>
        <Link to="/app/interviews" className="text-xs text-blue-600 font-semibold mt-2 inline-block">
          Return to Interviews
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Official Evaluation Scorecard &middot; Session ID: {report.sessionId}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{report.title}</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shared ? "Link Shared to Recruiters!" : "Share with Recruiters"}</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Overall Score Dial */}
          <div className="text-center md:border-r md:border-slate-100 pr-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Overall Score
            </span>
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-5xl font-black text-blue-600">{report.overallScore}</span>
              <span className="text-sm font-bold text-slate-400">/ 10</span>
            </div>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              STRONG HIRE
            </div>
          </div>

          {/* Session Metadata */}
          <div className="space-y-3 md:col-span-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold uppercase">
                {report.interviewType}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold uppercase">
                {report.seniority} Level
              </span>
              <span className="text-slate-500 flex items-center font-medium">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {report.durationMinutes} Minutes Elapsed
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
              "{report.summaryFeedback}"
            </p>
          </div>
        </div>
      </div>

      {/* Competency Breakdown & Action Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Competencies Progress Bars */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Competency Evaluation Matrix
            </h3>
            <span className="text-xs text-slate-400 font-medium">Calibration / 10.0</span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(report.competencyScores || {}).map(([key, val]: [string, any]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{key}</span>
                  <span className="font-bold text-blue-600">{val} / 10.0</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(val / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Action Items */}
        <div className="space-y-6">
          {/* Key Strengths */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Demonstrated Strengths
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {report.keyStrengths?.map((str: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Next Steps */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recommended Next Actions
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {report.recommendedNextActions?.map((act: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Turn-by-Turn Question Deep-Dive */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Turn-by-Turn Question Evaluations & Ideal Responses
        </h3>

        <div className="space-y-4">
          {report.questionEvaluations?.map((q: any) => {
            const isExpanded = expandedQId === q.questionId;
            return (
              <div
                key={q.questionId}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                {/* Collapsible Question Bar */}
                <button
                  onClick={() => setExpandedQId(isExpanded ? null : q.questionId)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400">
                        Question {q.questionOrder}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-xs font-semibold text-blue-600">
                        {q.interviewerPersona}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">
                        {q.competency}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">"{q.questionText}"</h4>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Score
                      </span>
                      <span className="text-base font-extrabold text-blue-600">{q.questionScore}</span>
                      <span className="text-xs text-slate-400">/10</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-100 space-y-5 bg-slate-50/30">
                    {/* Candidate Answer */}
                    <div className="space-y-1.5">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Candidate Answer:
                      </h5>
                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 font-sans">
                        {q.answerText}
                      </p>
                    </div>

                    {/* Criterion Scores */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {q.criterionScores?.map((crit: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                            {crit.criterion.replace(/_/g, " ")}
                          </span>
                          <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                            {crit.score} <span className="text-xs text-slate-400 font-normal">/{crit.maxScore}</span>
                          </span>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {crit.notes}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Concrete Improvement */}
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <h6 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                          Concrete Polish Opportunity:
                        </h6>
                      </div>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        {q.concreteImprovement}
                      </p>
                    </div>

                    {/* Ideal Sample Response */}
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <h6 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                          Sample Exemplary Staff Response:
                        </h6>
                      </div>
                      <p className="text-xs text-blue-900 leading-relaxed font-sans">
                        {q.sampleIdealResponse}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
