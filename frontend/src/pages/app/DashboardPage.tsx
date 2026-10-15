import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Video,
  FileText,
  Users2,
  TrendingUp,
  Award,
  AlertTriangle,
  Compass,
  ArrowRight,
  Clock,
  Play,
  Sparkles,
  ExternalLink
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [weaknesses, setWeaknesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profData, intData, roadData, weakData] = await Promise.all([
          api.user.getProfile(),
          api.interviews.list(),
          api.learning.listRoadmaps(),
          api.learning.listWeaknesses(),
        ]);
        setProfile(profData);
        setInterviews(intData);
        setRoadmaps(roadData);
        setWeaknesses(weakData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">Loading interview intelligence cockpit...</p>
        </div>
      </div>
    );
  }

  const latestRoadmap = roadmaps[0];
  const activeRoadmapProgress = latestRoadmap ? latestRoadmap.progressPercentage : 45;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700/50 text-blue-200 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Target Role: {profile?.targetRole || "Senior Distributed Systems Engineer"}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {profile?.firstName || "Candidate"}
          </h1>
          <p className="mt-2 text-blue-200 text-sm leading-relaxed">
            Your technical readiness is currently ranked in the top 8% of Senior candidates. Continue your preparation with AI mock sessions or target specific weakness gaps.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/app/interviews/new"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start New Mock Interview</span>
            </Link>
            <Link
              to="/app/panel"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-xs transition-colors"
            >
              <Users2 className="w-4 h-4" />
              <span>4-Persona AI Panel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Interview Score</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">8.8</span>
            <span className="text-sm font-medium text-slate-400">/ 10</span>
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +0.6 improvement over last 3 sessions
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ATS Resume Match</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">88%</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Staff Backend Role alignment
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Identified Gaps</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{weaknesses.length}</span>
            <span className="text-sm font-medium text-amber-600">to resolve</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Concurrency & Idempotency key TTLs
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Roadmap Progress</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeRoadmapProgress}%</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${activeRoadmapProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Interviews & Active Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Interview Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Interview Sessions</h2>
              <p className="text-xs text-slate-500">Comprehensive transcripts, video playback, and multi-rubric scores</p>
            </div>
            <Link
              to="/app/interviews"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {interviews.map((session) => (
              <div key={session.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase ${
                      session.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {session.status}
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs font-medium text-slate-600">{session.interviewType}</span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {session.durationMinutes}m
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                    <Link to={session.status === "COMPLETED" ? `/app/interviews/${session.id}/report` : `/app/interviews/${session.id}`}>
                      {session.title}
                    </Link>
                  </h3>
                  {session.summaryFeedback && (
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {session.summaryFeedback}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  {session.overallScore && (
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block uppercase font-semibold">Score</span>
                      <span className="text-lg font-bold text-slate-900">{session.overallScore}</span>
                      <span className="text-xs text-slate-400">/10</span>
                    </div>
                  )}
                  {session.status === "COMPLETED" ? (
                    <Link
                      to={`/app/interviews/${session.id}/report`}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      Scorecard
                    </Link>
                  ) : (
                    <Link
                      to={`/app/interviews/${session.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                    >
                      Resume
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Pillars Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Link
              to="/app/resumes"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex items-start space-x-3"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">ATS Optimizer</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Parse resume against senior job postings</p>
              </div>
            </Link>

            <Link
              to="/app/panel"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex items-start space-x-3"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Users2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">4-Persona Panel</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Multi-turn cross-examination simulation</p>
              </div>
            </Link>

            <Link
              to="/app/salary"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex items-start space-x-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Salary Insights</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Verified SEC and tech benchmark bands</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Col: Active Roadmap & Weakness Alerts */}
        <div className="space-y-6">
          {/* Active Roadmap Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Active Career Roadmap</h3>
              </div>
              <Link to="/app/roadmap" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Expand
              </Link>
            </div>
            {latestRoadmap ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-xs text-slate-800">{latestRoadmap.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Target: {latestRoadmap.targetSeniority} &middot; {latestRoadmap.weeklyStudyHours}h / week</p>
                </div>
                <div className="space-y-2.5">
                  {latestRoadmap.milestones?.map((m: any) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
                        m.isCompleted
                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={m.isCompleted}
                        readOnly
                        className="rounded border-slate-300 text-emerald-600 mt-0.5 pointer-events-none"
                      />
                      <div>
                        <span className={`font-semibold block ${m.isCompleted ? "line-through text-slate-400" : "text-slate-900"}`}>
                          {m.title}
                        </span>
                        <span className="text-[11px] text-slate-500">{m.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active roadmap. Visit Career Roadmap to generate one.</p>
            )}
          </div>

          {/* Identified Weakness Callout */}
          <div className="bg-amber-50/60 rounded-xl border border-amber-200 p-5">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-amber-950 text-sm">High-Priority Gap Detected</h3>
            </div>
            {weaknesses[0] ? (
              <div className="space-y-2">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 text-amber-900 uppercase">
                  {weaknesses[0].severity} Severity
                </span>
                <h4 className="font-semibold text-xs text-amber-900">
                  {weaknesses[0].title}
                </h4>
                <p className="text-xs text-amber-800/90 leading-relaxed">
                  {weaknesses[0].explanation}
                </p>
                <div className="pt-2">
                  <Link
                    to="/app/weaknesses"
                    className="inline-flex items-center text-xs font-semibold text-amber-900 hover:text-amber-950 underline"
                  >
                    <span>View all detected gaps</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-800">No open weaknesses flagged!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
