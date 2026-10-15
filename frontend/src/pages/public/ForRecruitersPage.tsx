import React from "react";
import { Link } from "react-router-dom";
import { Building2, Users, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export const ForRecruitersPage: React.FC = () => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Recruitment Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
          Evidence-Linked Technical Hiring for Organizations
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mt-4">
          Replace gut-feeling hiring with standardized, tenant-scoped interview scorecards, authorized candidate reports, and structured competency evaluations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Structured Rubrics</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Score candidates across standardized criteria: Technical Correctness, Problem-Solving, Communication, and Trade-off Awareness.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Multi-interviewer score calibration</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Evidence quotes tied directly to answers</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Candidate Privacy & Consent</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Candidates maintain strict control over what is shared. Personal practice sessions remain private unless explicitly authorized.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Explicit consent sharing protocols</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full compliance with privacy mandates</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Multi-Stage Pipeline Management</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Track applicants from screening through technical rounds to executive debriefs with integrated team notes and final recommendations.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Stage definitions per requisition</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Role-based access control (RBAC)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          Set Up Recruiter Workspace
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
