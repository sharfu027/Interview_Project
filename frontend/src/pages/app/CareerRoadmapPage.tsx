import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Compass,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Layers
} from "lucide-react";

export const CareerRoadmapPage: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const list = await api.learning.listRoadmaps();
        setRoadmaps(list);
      } catch (err) {
        console.error("Failed to load roadmaps", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmaps();
  }, []);

  const handleToggleMilestone = async (roadmapId: string, milestoneId: string) => {
    try {
      await api.learning.completeMilestone(roadmapId, milestoneId);
      setRoadmaps((prev) =>
        prev.map((rm) => {
          if (rm.id !== roadmapId) return rm;
          const updatedMilestones = rm.milestones.map((m: any) =>
            m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
          );
          const completedCount = updatedMilestones.filter((m: any) => m.isCompleted).length;
          const progressPercentage = Math.round((completedCount / updatedMilestones.length) * 100);
          return { ...rm, milestones: updatedMilestones, progressPercentage };
        })
      );
    } catch (err) {
      console.error("Failed to update milestone", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Formulating personalized career curriculum...</p>
        </div>
      </div>
    );
  }

  const activeRoadmap = roadmaps[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personalized Career Roadmap</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Measurable, milestone-driven curriculum mapped to Staff and Senior tech competency rubrics
        </p>
      </div>

      {activeRoadmap && (
        <div className="space-y-6">
          {/* Roadmap Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Target: {activeRoadmap.targetSeniority} &middot; {activeRoadmap.weeklyStudyHours} hrs/week
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{activeRoadmap.title}</h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-slate-900">{activeRoadmap.progressPercentage}%</span>
                <span className="text-xs text-slate-400 font-semibold block">Completed</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${activeRoadmap.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Sequential Milestones List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Curriculum Milestones
            </h3>

            <div className="space-y-3">
              {activeRoadmap.milestones?.map((m: any, idx: number) => (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(activeRoadmap.id, m.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex items-start space-x-4 ${
                    m.isCompleted
                      ? "bg-emerald-50/40 border-emerald-200"
                      : "bg-white border-slate-200 shadow-xs hover:border-blue-300"
                  }`}
                >
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={m.isCompleted}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400">
                        Milestone {idx + 1}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                        {m.skillCategory}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        {m.estimatedHours} hours
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold ${m.isCompleted ? "line-through text-slate-500" : "text-slate-900"}`}>
                      {m.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
