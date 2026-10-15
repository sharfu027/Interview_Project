import React from "react";
import { ShieldCheck, Lock, EyeOff, Server, FileCheck, CheckCircle2 } from "lucide-react";

export const SecurityPrivacyPage: React.FC = () => {
  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Trust & Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
          Security, Privacy & Data Ethics
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mt-4">
          How InterviewOS protects your private recordings, resume data, and interview evaluations with enterprise-grade safeguards.
        </p>
      </div>

      <div className="space-y-8">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Zero-Trust Authentication & RBAC</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              All client access is governed by cryptographically signed JWT tokens with short TTLs and secure refresh rotation. Backend endpoints enforce explicit role-based access control (RBAC) at the service and query layers.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">BCrypt Password Hashing</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Tenant Isolation</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Audit Logging</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Private Recordings & Explicit Consent</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Your mock interview recordings and speech transcripts are private by default. They are never shared with recruiters or third parties without your explicit, opt-in consent. Private object storage access uses short-lived signed URLs.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Configurable Retention (30 Days)</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">One-Click Media Deletion</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">No Facial Emotion Scoring</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Data Governance & Prompt Defense</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              All uploaded resumes, job descriptions, and user transcripts are treated as untrusted data. We sanitize prompt inputs to prevent indirect prompt injection. External AI providers operate under zero-data-retention enterprise agreements.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">PII Minimization</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Zero Model Retraining on User Data</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">OpenAPI Request Validation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
