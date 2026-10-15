import React, { useState } from "react";
import {
  Film,
  Play,
  Trash2,
  Download,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export const RecordingsPage: React.FC = () => {
  const [recordings, setRecordings] = useState([
    {
      id: "rec-1",
      sessionTitle: "Staff Backend Concurrency Deep Dive",
      date: "2026-10-14",
      duration: "44 min 12 sec",
      size: "184 MB",
      consentStatus: "PRIVATE_ENCRYPTED",
      hesitationsDetected: 3,
    },
    {
      id: "rec-2",
      sessionTitle: "Distributed Systems Architecture Simulation",
      date: "2026-10-10",
      duration: "51 min 08 sec",
      size: "215 MB",
      consentStatus: "PRIVATE_ENCRYPTED",
      hesitationsDetected: 5,
    },
  ]);

  const [activePlayback, setActivePlayback] = useState<any>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this recording? All video and audio assets will be immediately purged in accordance with our data retention policy.")) {
      setRecordings((prev) => prev.filter((r) => r.id !== id));
      if (activePlayback?.id === id) setActivePlayback(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Film className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Session Media & Recordings</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Review recorded mock sessions, jump to hesitation flags, and manage private biometric encryption
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-900">
        <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Strict Privacy & Biometric Protection:</strong>
          <span>
            Recordings are encrypted client-side and stored in isolated tenant storage. They are never used to train global models and are never shared with recruiters unless you explicitly consent on your scorecard.
          </span>
        </div>
      </div>

      {/* Main Grid: List & Playback Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recordings List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className={`p-5 flex items-center justify-between gap-4 transition-colors ${
                  activePlayback?.id === rec.id ? "bg-blue-50/50" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-400">{rec.date}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {rec.duration}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Encrypted
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{rec.sessionTitle}</h3>
                  <p className="text-[11px] text-slate-500">
                    File Size: {rec.size} &middot; {rec.hesitationsDetected} Speech Hesitations Flagged
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setActivePlayback(rec)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Play Recording"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Player Chamber */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {activePlayback ? activePlayback.sessionTitle : "Recording Playback Player"}
            </h3>

            <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center text-slate-400 relative overflow-hidden">
              <div className="text-center p-4">
                <Play className="w-12 h-12 text-slate-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs text-slate-400">
                  {activePlayback ? "Loaded: " + activePlayback.sessionTitle : "Select a session recording to replay"}
                </p>
              </div>
            </div>

            {activePlayback && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-700 block">Hesitation Seek Markers:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200 hover:bg-amber-100">
                    Marker 04:15 (CAS Spinloop hesitation)
                  </button>
                  <button className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200 hover:bg-amber-100">
                    Marker 18:40 (Long pause &gt; 6s)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
