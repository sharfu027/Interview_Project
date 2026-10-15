import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Volume2,
  Clock
} from "lucide-react";

export const SpeakingCoachPage: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [currentWpm, setCurrentWpm] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [detectedFillers, setDetectedFillers] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");

  const samplePrompts = [
    "Tell me about a time you had to make an architectural trade-off under strict deadline pressure.",
    "Explain how the Java Virtual Machine manages heap memory and garbage collection to a junior developer.",
    "Walk me through how you resolve a production outage caused by an intermittent database deadlock.",
    "Describe a disagreement with a product manager regarding technical debt versus feature velocity.",
  ];

  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
        setCurrentWpm(Math.floor(130 + Math.random() * 20));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setSecondsElapsed(0);
      setFillerCount(0);
      setDetectedFillers([]);
      setTranscript("");
    } else {
      setRecording(false);
    }
  };

  const simulateSpeechInput = (text: string) => {
    setTranscript(text);
    const fillers = ["um", "uh", "like", "basically", "literally", "you know"];
    const found: string[] = [];
    const lower = text.toLowerCase();
    fillers.forEach((f) => {
      const regex = new RegExp(`\\b${f}\\b`, "g");
      const matches = lower.match(regex);
      if (matches) {
        matches.forEach(() => found.push(f));
      }
    });
    setFillerCount(found.length);
    setDetectedFillers(found);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Real-Time Speaking Coach Lab</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Hone vocal presence, eliminate filler words, control cadences, and master the 60-second executive summary rule
        </p>
      </div>

      {/* Practice Prompt Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
            Practice Prompt #{activePromptIndex + 1}
          </span>
          <button
            onClick={() => setActivePromptIndex((prev) => (prev + 1) % samplePrompts.length)}
            className="text-xs font-semibold text-blue-200 hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Next Prompt</span>
          </button>
        </div>
        <h2 className="text-lg md:text-xl font-bold leading-relaxed">
          "{samplePrompts[activePromptIndex]}"
        </h2>
        <p className="text-xs text-blue-200">
          Aim for 60 to 90 seconds. Open with a decisive claim, deliver 2 quantified evidence points, and summarize the result.
        </p>
      </div>

      {/* HUD Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Cadence & Pacing
          </span>
          <div className="mt-2 flex items-baseline justify-center space-x-1">
            <span className="text-3xl font-extrabold text-slate-900">{recording ? currentWpm : 138}</span>
            <span className="text-xs text-slate-400 font-semibold">WPM</span>
          </div>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
            Optimal Target (120 - 150)
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Filler Word Counter
          </span>
          <div className="mt-2 flex items-baseline justify-center space-x-1">
            <span className={`text-3xl font-extrabold ${fillerCount > 3 ? "text-amber-600" : "text-blue-600"}`}>
              {fillerCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">instances</span>
          </div>
          <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
            fillerCount > 3 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}>
            {fillerCount > 3 ? "Hedging Alert" : "Clean Delivery"}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Response Duration
          </span>
          <div className="mt-2 flex items-baseline justify-center space-x-1">
            <span className="text-3xl font-extrabold text-slate-900">{secondsElapsed}</span>
            <span className="text-xs text-slate-400 font-semibold">sec</span>
          </div>
          <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
            secondsElapsed > 120 ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            {secondsElapsed > 120 ? "Monologue Risk" : "Under 2 Minutes"}
          </span>
        </div>
      </div>

      {/* Interactive Recording Chamber */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
            recording
              ? "bg-red-50 text-red-600 ring-8 ring-red-100 animate-pulse"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
          }`} onClick={toggleRecording}>
            {recording ? <Mic className="w-12 h-12" /> : <MicOff className="w-12 h-12" />}
          </div>
        </div>

        <div>
          <button
            onClick={toggleRecording}
            className={`px-6 py-2.5 rounded-full font-bold text-xs shadow-xs transition-colors ${
              recording
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {recording ? "Stop Speaking Analysis" : "Start Live Speaking Analysis"}
          </button>
          <p className="text-xs text-slate-400 mt-2">
            Speak aloud naturally. The audio analyzer samples pacing, pauses, and speech hedges.
          </p>
        </div>

        {/* Quick Simulator Test */}
        <div className="pt-4 border-t border-slate-100 max-w-lg mx-auto text-left">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Or Test with Speech Transcript:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Um, so basically I think we should, like, use Redis..."
              onChange={(e) => simulateSpeechInput(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => simulateSpeechInput("Um, basically in our last project, like, we literally rebuilt the pipeline with Kafka.")}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0"
            >
              Load Test
            </button>
          </div>

          {detectedFillers.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong className="block mb-1">Detected Fillers ({detectedFillers.length}):</strong>
              <div className="flex flex-wrap gap-1">
                {detectedFillers.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-amber-200 font-bold uppercase text-[10px]">
                    "{f}"
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
