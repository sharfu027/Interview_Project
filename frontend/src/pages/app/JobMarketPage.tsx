import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  DollarSign,
  Sparkles,
  ArrowRight,
  BookmarkPlus,
  Check
} from "lucide-react";

export const JobMarketPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("ALL");
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await api.jobs.list(0, 20);
        setJobs(res.content || []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleSaveToPipeline = async (job: any) => {
    try {
      await api.jobs.createApplication({
        companyName: job.companyName,
        jobTitle: job.title,
        status: "SAVED",
        currentStage: "Saved to Target Pipeline",
        salaryOffered: job.salaryMax,
        notes: `Target role matching profile: ${job.location}`,
      });
      setSavedJobIds((prev) => [...prev, job.id]);
    } catch (err) {
      console.error("Failed to save to pipeline", err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFamily =
      selectedFamily === "ALL" || job.jobFamily === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Market & Match Intelligence</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore vetted openings with ATS compatibility scoring and launch customized interview preparation loops
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, skill, or company (e.g. Stripe, Java, Staff)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Job Families</option>
            <option value="BACKEND">Backend Engineering</option>
            <option value="FULLSTACK">Full-Stack</option>
            <option value="FRONTEND">Frontend</option>
            <option value="DEVOPS">DevOps & Cloud</option>
            <option value="QA">QA & Test Automation</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Querying live job database...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            return (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{job.companyName}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-slate-500 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                      {job.seniority}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                      92% ATS Match
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {job.description}
                  </p>

                  <div className="flex items-center space-x-4 pt-1 text-xs text-slate-600 font-medium">
                    <span className="flex items-center text-slate-800 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / year
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-slate-500 capitalize">{job.remotePolicy.toLowerCase()} Policy</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={() => handleSaveToPipeline(job)}
                    disabled={isSaved}
                    className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                      isSaved
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-default"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    <span>{isSaved ? "Saved" : "Save to Pipeline"}</span>
                  </button>

                  <Link
                    to={`/app/interviews/new?role=${encodeURIComponent(job.title)}&family=${job.jobFamily}&seniority=${job.seniority}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Practice for This Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
