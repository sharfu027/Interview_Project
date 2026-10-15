import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Video,
  PlusCircle,
  Clock,
  Award,
  ChevronRight,
  Filter,
  CheckCircle2,
  Play,
  RotateCcw
} from "lucide-react";

export const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadInterviews() {
      try {
        const list = await api.interviews.list();
        setInterviews(list);
      } catch (err) {
        console.error("Failed to load interviews", err);
      } finally {
        setLoading(false);
      }
    }
    loadInterviews();
  }, []);

  const filteredInterviews = interviews.filter((i) => {
    if (statusFilter === "ALL") return true;
    return i.status === statusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mock Interview Sessions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Simulate realistic FAANG and enterprise interview loops with multi-rubric evaluation and speech analytics
          </p>
        </div>
        <Link
          to="/app/interviews/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Mock Interview</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        {["ALL", "COMPLETED", "IN_PROGRESS", "READY"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === status
                ? "bg-blue-50 text-blue-700"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {status === "ALL" ? "All Sessions" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Interviews Table / Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Retrieving interview records...</p>
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
          <Video className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No interview sessions found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Launch your first simulation to benchmark your answers.</p>
          <Link
            to="/app/interviews/new"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Launch Mock Interview</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
          {filteredInterviews.map((session) => (
            <div
              key={session.id}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      session.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : session.status === "IN_PROGRESS"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {session.status}
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs font-semibold text-slate-700">{session.interviewType}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs text-slate-500">{session.jobFamily} ({session.seniority})</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-400" />
                    {session.durationMinutes} minutes
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {session.title}
                </h3>

                {session.summaryFeedback && (
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {session.summaryFeedback}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-6 shrink-0">
                {session.overallScore !== null && (
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Score
                    </span>
                    <div className="flex items-baseline space-x-0.5">
                      <span className="text-2xl font-extrabold text-blue-600">{session.overallScore}</span>
                      <span className="text-xs text-slate-400 font-semibold">/10</span>
                    </div>
                  </div>
                )}

                <div>
                  {session.status === "COMPLETED" ? (
                    <Link
                      to={`/app/interviews/${session.id}/report`}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Scorecard</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      to={`/app/interviews/${session.id}`}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Continue Interview</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
