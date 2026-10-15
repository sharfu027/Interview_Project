import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Kanban,
  PlusCircle,
  Building2,
  Calendar,
  DollarSign,
  User,
  Mail,
  ArrowRight,
  CheckCircle2,
  Trash2,
  X
} from "lucide-react";

export const ApplicationTrackerPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // New application form
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [salaryOffered, setSalaryOffered] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadApps() {
      try {
        const list = await api.jobs.listApplications();
        setApplications(list);
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, []);

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.jobs.createApplication({
        companyName,
        jobTitle,
        status,
        salaryOffered: salaryOffered ? Number(salaryOffered) : null,
        notes,
      });
      setApplications((prev) => [...prev, created]);
      setModalOpen(false);
      setCompanyName("");
      setJobTitle("");
      setSalaryOffered("");
      setNotes("");
    } catch (err) {
      console.error("Failed to create application", err);
    }
  };

  const stages = [
    { id: "SAVED", label: "Saved / Wishlist" },
    { id: "APPLIED", label: "Applied" },
    { id: "SCREENING", label: "Recruiter Screen" },
    { id: "INTERVIEWING", label: "Interviewing" },
    { id: "OFFER", label: "Offer Extended" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading career application pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Kanban className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Pipeline Tracker</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Organize recruitment funnels, stage transitions, recruiter contacts, and interview debrief notes
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageApps = applications.filter((a) => a.status === stage.id);
          return (
            <div key={stage.id} className="bg-slate-100/60 rounded-xl p-3 space-y-3 min-w-[220px]">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {stage.label}
                </span>
                <span className="w-5 h-5 rounded-full bg-white text-slate-600 text-[10px] font-bold flex items-center justify-center border border-slate-200">
                  {stageApps.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {stageApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2 hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide block">
                        {app.companyName}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {app.jobTitle}
                      </h4>
                    </div>

                    {app.currentStage && (
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-50 text-[10px] font-medium text-slate-600 border border-slate-100">
                        {app.currentStage}
                      </span>
                    )}

                    {app.notes && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {app.notes}
                      </p>
                    )}

                    {app.salaryOffered && (
                      <div className="text-[11px] font-bold text-emerald-700 flex items-center pt-1 border-t border-slate-100">
                        <DollarSign className="w-3 h-3 mr-0.5" />
                        ${(app.salaryOffered / 1000).toFixed(0)}k Offer
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Track New Application</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, Datadog"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pipeline Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="SAVED">Saved</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEWING">Interviewing</option>
                    <option value="OFFER">Offer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Offered Salary ($)</label>
                  <input
                    type="number"
                    value={salaryOffered}
                    onChange={(e) => setSalaryOffered(e.target.value)}
                    placeholder="e.g. 210000"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes & Next Steps</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Technical onsite round covers Kafka outbox pattern and PostgreSQL indexes."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
