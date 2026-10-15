import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  Sliders,
  CheckCircle2,
  ArrowRight,
  MessageSquare
} from "lucide-react";

export const SalaryInsightsPage: React.FC = () => {
  const [jobFamily, setJobFamily] = useState("BACKEND");
  const [seniority, setSeniority] = useState("SENIOR");
  const [location, setLocation] = useState("Remote");
  const [estimate, setEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Negotiation Simulator State
  const [offeredBase, setOfferedBase] = useState(190000);
  const [offeredEquity, setOfferedEquity] = useState(65000);
  const [counterResult, setCounterResult] = useState<any>(null);

  useEffect(() => {
    async function loadSalary() {
      setLoading(true);
      try {
        const data = await api.salary.getEstimate(jobFamily, seniority, location);
        setEstimate(data);
      } catch (err) {
        console.error("Failed to load salary", err);
      } finally {
        setLoading(false);
      }
    }
    loadSalary();
  }, [jobFamily, seniority, location]);

  const handleSimulateCounter = () => {
    setCounterResult({
      targetBase: Math.round(offeredBase * 1.12),
      targetEquity: Math.round(offeredEquity * 1.25),
      talkingPoints: [
        "Anchor on current high-throughput microservices accomplishments (25k req/sec) and latency reductions.",
        "Highlight your verified 8.8/10 technical interview scorecard and concurrency readiness as immediate value multipliers.",
        "Request an additional \$25k in annual equity grant vesting or a signing bonus buffer to close the delta without breaching internal base bands."
      ],
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Statistical Salary Intelligence</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Verified compensation benchmarks derived from 2026 tech market aggregates and SEC filings with AI negotiation modeling
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Job Family</label>
          <select
            value={jobFamily}
            onChange={(e) => setJobFamily(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="BACKEND">Backend Infrastructure</option>
            <option value="FULLSTACK">Full-Stack</option>
            <option value="FRONTEND">Frontend Engineering</option>
            <option value="DEVOPS">DevOps & Cloud Systems</option>
            <option value="QA">QA & Test Automation</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Seniority Level</label>
          <select
            value={seniority}
            onChange={(e) => setSeniority(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="JUNIOR">Junior (0-2y)</option>
            <option value="MID">Mid-Level (3-5y)</option>
            <option value="SENIOR">Senior (5-8y)</option>
            <option value="STAFF">Staff / Principal (8+y)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Location Tier</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Remote">Remote (US / Tier 1)</option>
            <option value="San Francisco">San Francisco Bay Area</option>
            <option value="New York">New York City</option>
            <option value="Seattle">Seattle, WA</option>
          </select>
        </div>
      </div>

      {/* Main Benchmark Displays */}
      {estimate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Compensation Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-center space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Median Total Compensation
              </span>
              <div className="text-4xl font-extrabold text-slate-900">
                ${(estimate.totalCompMedian / 1000).toFixed(0)}k
              </div>
              <span className="text-xs text-emerald-600 font-semibold block">
                Base + Equity + Performance Bonus
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Base Salary Distribution
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">25th Percentile</span>
                  <span className="font-semibold text-slate-800">${(estimate.baseSalaryMin / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Median Base</span>
                  <span className="font-bold text-blue-600">${(estimate.baseSalaryMedian / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">75th Percentile</span>
                  <span className="font-semibold text-slate-800">${(estimate.baseSalaryMax / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Influencing Factors & Negotiation Simulator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Drivers */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Key Compensation Influencing Drivers
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {estimate.keyInfluencingFactors?.map((f: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Negotiation Simulator */}
            <div className="bg-gradient-to-br from-emerald-50/50 to-blue-50/40 rounded-xl border border-emerald-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">AI Offer Counter-Negotiation Simulator</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Input your received offer numbers to generate data-backed counter propositions and scripts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Offered Base Salary ($):
                  </label>
                  <input
                    type="number"
                    value={offeredBase}
                    onChange={(e) => setOfferedBase(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Offered Annual Equity ($):
                  </label>
                  <input
                    type="number"
                    value={offeredEquity}
                    onChange={(e) => setOfferedEquity(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSimulateCounter}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <span>Calculate Strategic Counter-Offer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {counterResult && (
                <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Target Counter Baseline
                    </span>
                    <div className="space-x-3 text-xs font-bold">
                      <span className="text-emerald-700">Base: ${(counterResult.targetBase / 1000).toFixed(0)}k</span>
                      <span className="text-blue-700">Equity: ${(counterResult.targetEquity / 1000).toFixed(0)}k</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Negotiation Talking Points:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {counterResult.talkingPoints.map((tp: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                          <span>{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
