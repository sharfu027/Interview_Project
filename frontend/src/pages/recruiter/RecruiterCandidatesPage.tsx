import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Award,
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";

export const RecruiterCandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const list = await api.recruiter.listCandidates();
        setCandidates(list);
      } catch (err) {
        console.error("Failed to load candidates", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((c) =>
    c.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Candidate Roster</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Review talent profiles, ATS compatibility scores, and verified mock interview scorecards
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates by name, email, or applied position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Candidate List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Retrieving candidate profiles...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
          {filteredCandidates.map((cand) => (
            <div
              key={cand.linkId}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-200">
                    {cand.candidateName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{cand.candidateName}</h3>
                    <p className="text-xs text-slate-500">{cand.candidateEmail}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="font-semibold text-slate-700">Applied for: {cand.jobTitle}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Consented Candidate
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-500">Applied 3 days ago</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Readiness Rating
                  </span>
                  <div className="flex items-center space-x-1 justify-end">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-lg font-bold text-slate-900">{cand.rating}</span>
                    <span className="text-xs text-slate-400">/ 5.0</span>
                  </div>
                </div>

                <Link
                  to={`/recruiter/scorecards?candidateId=${cand.linkId}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Review Scorecard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
