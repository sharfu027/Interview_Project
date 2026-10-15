import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Briefcase,
  PlusCircle,
  MapPin,
  Clock,
  CheckCircle2,
  X
} from "lucide-react";

export const RecruiterJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // New job state
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Core Infrastructure");
  const [jobFamily, setJobFamily] = useState("BACKEND");
  const [seniority, setSeniority] = useState("SENIOR");
  const [location, setLocation] = useState("Remote / Hybrid");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const list = await api.recruiter.listJobs();
        setJobs(list);
      } catch (err) {
        console.error("Failed to load recruiter jobs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.recruiter.createJob({
        title,
        department,
        jobFamily,
        seniority,
        location,
      });
      setJobs((prev) => [...prev, created]);
      setModalOpen(false);
      setTitle("");
    } catch (err) {
      console.error("Failed to create job", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Querying active openings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Job Openings</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage organization requisition pipelines and configured interview evaluation rubrics
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Position</span>
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  {job.department}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs text-slate-500 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.location}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  {job.status}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span>Family: {job.jobFamily}</span>
                <span>&bull;</span>
                <span>Level: {job.seniority}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-semibold text-slate-500">1 Qualified Applicant</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Position</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Distributed Systems Engineer"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Job Family</label>
                  <select
                    value={jobFamily}
                    onChange={(e) => setJobFamily(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="BACKEND">Backend</option>
                    <option value="FULLSTACK">Full-Stack</option>
                    <option value="FRONTEND">Frontend</option>
                    <option value="DEVOPS">DevOps</option>
                    <option value="QA">QA</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Seniority</label>
                  <select
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="JUNIOR">Junior</option>
                    <option value="MID">Mid-Level</option>
                    <option value="SENIOR">Senior</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  Publish Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
