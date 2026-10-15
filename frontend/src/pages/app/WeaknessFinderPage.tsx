import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Check
} from "lucide-react";

export const WeaknessFinderPage: React.FC = () => {
  const [weaknesses, setWeaknesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await api.learning.listWeaknesses();
        setWeaknesses(list);
      } catch (err) {
        console.error("Failed to load weaknesses", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await api.learning.resolveWeakness(id);
      setWeaknesses((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: "RESOLVED" } : w))
      );
    } catch (err) {
      console.error("Failed to resolve weakness", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Aggregating longitudinal interview signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Longitudinal Weakness Detector</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Identifies systematic knowledge gaps, hedging habits, and architectural blind spots across your practice history
        </p>
      </div>

      {/* Weakness Cards Grid */}
      <div className="space-y-4">
        {weaknesses.map((w) => {
          const isResolved = w.status === "RESOLVED";
          return (
            <div
              key={w.id}
              className={`p-6 rounded-2xl border transition-all ${
                isResolved
                  ? "bg-slate-50/50 border-slate-200 opacity-70"
                  : "bg-white border-slate-200 shadow-xs hover:border-amber-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        w.severity === "HIGH"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {w.severity} Severity
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs font-semibold text-slate-700">{w.competency}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-slate-400">Confidence: {Math.round(w.confidenceLevel * 100)}%</span>
                  </div>

                  <h3 className={`text-base font-bold ${isResolved ? "line-through text-slate-500" : "text-slate-900"}`}>
                    {w.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {w.explanation}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <Link
                    to="/app/roadmap"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleResolve(w.id)}
                    disabled={isResolved}
                    className={`inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isResolved
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    }`}
                  >
                    {isResolved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </>
                    ) : (
                      <span>Mark Resolved</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
