import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Briefcase,
  Users,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export const RecruiterDashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobList, candList] = await Promise.all([
          api.recruiter.listJobs(),
          api.recruiter.listCandidates(),
        ]);
        setJobs(jobList);
        setCandidates(candList);
      } catch (err) {
        console.error("Failed to load recruiter data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading recruiter intelligence dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl p-6 md:p-8 text-white shadow-sm">
        <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
          Enterprise Talent Cockpit
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome to Recruiter Intelligence
        </h1>
        <p className="mt-2 text-emerald-100 text-sm max-w-2xl leading-relaxed">
          Screen pre-assessed candidates with verified AI interview rubrics, technical scorecards, and objective competency percentiles.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Openings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{jobs.length}</div>
          <p className="mt-1 text-xs text-slate-500">Published across engineering departments</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pre-Assessed Candidates</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{candidates.length}</div>
          <p className="mt-1 text-xs text-emerald-600 font-medium">100% Consented to Scorecard Share</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Assessment Score</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">8.8 / 10</div>
          <p className="mt-1 text-xs text-slate-500">Tier-1 Senior Candidate Calibration</p>
        </div>
      </div>

      {/* Candidate Pool Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Qualified Candidate Talent Pool</h2>
            <p className="text-xs text-slate-500">Candidates with verified AI interview evaluations ready for technical debrief</p>
          </div>
          <Link
            to="/recruiter/candidates"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View all candidates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
          {candidates.map((cand) => (
            <div
              key={cand.linkId}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900">{cand.candidateName}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-xs text-slate-500">{cand.candidateEmail}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Consented Share
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Applied for: {cand.jobTitle}
                </p>
              </div>

              <div className="flex items-center space-x-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Rating
                  </span>
                  <span className="text-base font-extrabold text-emerald-600">{cand.rating} / 5.0</span>
                </div>

                <Link
                  to={`/recruiter/scorecards?candidateId=${cand.linkId}`}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Evaluate Scorecard
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
