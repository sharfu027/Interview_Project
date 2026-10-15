import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Users2,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Volume2,
  RefreshCw,
  Clock
} from "lucide-react";

export const AIPanelPage: React.FC = () => {
  const [panelSession, setPanelSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPanel() {
      try {
        const data = await api.panel.getSession("panel-session-1");
        setPanelSession(data);
      } catch (err) {
        console.error("Failed to load panel session", err);
      } finally {
        setLoading(false);
      }
    }
    loadPanel();
  }, []);

  const handleSendTurn = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const updated = await api.panel.submitTurn(panelSession.id, replyText);
      setPanelSession(updated);
      setReplyText("");
    } catch (err) {
      console.error("Failed to submit turn", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Convening 4-Persona Executive AI Panel...</p>
        </div>
      </div>
    );
  }

  const activePersonaId = panelSession?.activePersonaId || "HR";

  const personas = [
    {
      id: "HR",
      name: "Priya Sharma",
      role: "Director of Talent & Culture",
      focus: "Values, Leadership & Conflict Resolution",
      avatarInitials: "PS",
      color: "border-pink-500 text-pink-600 bg-pink-50",
    },
    {
      id: "TECH_LEAD",
      name: "Alex Chen",
      role: "Principal Staff Engineer",
      focus: "Concurrency, Memory Model & Clean Architecture",
      avatarInitials: "AC",
      color: "border-blue-500 text-blue-600 bg-blue-50",
    },
    {
      id: "ARCHITECT",
      name: "Dr. Elena Rostova",
      role: "Chief Enterprise Architect",
      focus: "Distributed Consensus, Scale & Fault Tolerance",
      avatarInitials: "ER",
      color: "border-purple-500 text-purple-600 bg-purple-50",
    },
    {
      id: "HIRING_MGR",
      name: "Marcus Vance",
      role: "VP of Engineering",
      focus: "Business Impact, Pragmatic Trade-Offs & Delivery",
      avatarInitials: "MV",
      color: "border-emerald-500 text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Users2 className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">4-Persona AI Panel Simulator</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Simulate a high-stakes multi-interviewer loop where each persona cross-examines your answers from their distinct organizational vantage point
        </p>
      </div>

      {/* 4 Persona Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {personas.map((p) => {
          const isActive = activePersonaId === p.id;
          return (
            <div
              key={p.id}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                  : "bg-white border-slate-200 opacity-80"
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${p.color}`}
                >
                  {p.avatarInitials}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">{p.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{p.role}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                {p.focus}
              </p>
              {isActive && (
                <div className="mt-3 flex items-center space-x-1.5 text-[11px] font-bold text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  <span>Has the Floor</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Conversation Thread */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
        {/* Thread History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {panelSession?.turns?.map((turn: any) => {
            const isCandidate = turn.actionType === "ANSWER";
            return (
              <div
                key={turn.id}
                className={`flex items-start space-x-3 ${isCandidate ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {!isCandidate && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200 shrink-0">
                    {turn.personaName?.[0] || "P"}
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isCandidate
                      ? "bg-blue-600 text-white rounded-tr-xs"
                      : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 gap-4">
                    <span
                      className={`font-bold text-[11px] ${
                        isCandidate ? "text-blue-100" : "text-blue-600"
                      }`}
                    >
                      {turn.personaName} {turn.personaRole ? `(${turn.personaRole})` : ""}
                    </span>
                    <span className={`text-[10px] ${isCandidate ? "text-blue-200" : "text-slate-400"}`}>
                      Turn #{turn.turnNumber}
                    </span>
                  </div>
                  <p className="font-sans leading-relaxed">{turn.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
          <div className="flex items-center space-x-3">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Address the panel's question directly with technical depth..."
              className="flex-1 text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendTurn();
                }
              }}
            />
            <button
              onClick={handleSendTurn}
              disabled={submitting || !replyText.trim()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 flex items-center space-x-2 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Analyzing..." : "Reply"}</span>
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
            <span>Press Enter to send reply</span>
            <span>AI personas will dynamically react and follow up based on your answers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
