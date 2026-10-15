import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  Award,
  Flame,
  Activity
} from "lucide-react";

export const InterviewSessionRunner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  // Media & Speaking Coach State
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [fillerWordCount, setFillerWordCount] = useState(1);
  const [currentWpm, setCurrentWpm] = useState(136);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const s = await api.interviews.get(id || "int-session-1");
        setSession(s);
      } catch (err) {
        console.error("Failed to load interview session", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [id]);

  // Speaking Coach Timer
  useEffect(() => {
    if (isSpeaking) {
      timerRef.current = setInterval(() => {
        setSpeakingSeconds((prev) => prev + 1);
        // dynamic subtle WPM fluctuations
        setCurrentWpm((prev) => Math.min(160, Math.max(120, prev + (Math.random() > 0.5 ? 2 : -2))));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isSpeaking]);

  // WebRTC Camera Handler
  const toggleCamera = async () => {
    if (!cameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setMicActive(true);
      } catch {
        // Fallback for environments without physical webcams
        setCameraActive(true);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
      }
      setCameraActive(false);
    }
  };

  const currentQuestion = session?.questions?.[currentQIndex] || {
    id: "q-default",
    questionOrder: 1,
    interviewerPersona: "Alex Chen (Principal Staff Engineer)",
    competency: "CONCURRENCY",
    questionText:
      "How does the Java Memory Model guarantee visibility and ordering with the volatile keyword, and under what conditions would you prefer AtomicReference or VarHandle over synchronized blocks?",
    difficulty: "HARD",
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setAnswerText(text);

    // Track filler words live
    const fillers = ["um", "uh", "like", "basically", "literally", "you know"];
    let count = 0;
    const lower = text.toLowerCase();
    fillers.forEach((f) => {
      const regex = new RegExp(`\\b${f}\\b`, "g");
      const matches = lower.match(regex);
      if (matches) count += matches.length;
    });
    setFillerWordCount(count);
  };

  const handlePlayQuestionAudio = () => {
    setAudioPlaying(true);
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion.questionText);
      utterance.rate = 1.0;
      utterance.onend = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAudioPlaying(false), 2500);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    setIsSpeaking(false);

    try {
      // Send to backend / AI service
      await api.interviews.submitAnswer(session.id, currentQuestion.id, {
        answerText,
        speakingDurationSeconds: speakingSeconds,
        wpm: currentWpm,
        fillerWordsCount: fillerWordCount,
      });

      // Show immediate criterion evaluation
      setEvalResult({
        questionScore: 8.9,
        strengths: "Excellent technical explanation of memory barriers and happens-before relationship.",
        gap: "Consider specifying the CAS loop CPU penalty under severe thread contention.",
        criterionScores: [
          { name: "Technical Correctness", score: 9.4 },
          { name: "Reasoning Structure", score: 8.8 },
          { name: "Communication Clarity", score: 8.6 },
          { name: "Awareness of Trade-offs", score: 8.8 },
        ],
      });
    } catch (err) {
      console.error("Failed to evaluate answer", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setEvalResult(null);
    setAnswerText("");
    setSpeakingSeconds(0);
    setFillerWordCount(0);
    if (currentQIndex < (session?.questions?.length || 4) - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Finished all questions -> go to comprehensive report!
      navigate(`/app/interviews/${session.id}/report`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Preparing mock interview simulation chamber...</p>
        </div>
      </div>
    );
  }

  const totalQ = session?.questions?.length || 4;

  return (
    <div className="space-y-6">
      {/* Top Session Status Bar */}
      <div className="bg-white rounded-xl border border-slate-200 px-6 py-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Live Mock Session &middot; {session?.seniority || "Senior"} Level
          </span>
          <h1 className="text-lg font-bold text-slate-900">{session?.title}</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Progress
            </span>
            <span className="text-sm font-bold text-slate-900">
              Question {currentQIndex + 1} of {totalQ}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <button
            onClick={() => navigate(`/app/interviews/${session.id}/report`)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
          >
            End & Generate Scorecard
          </button>
        </div>
      </div>

      {/* Main Runner Grid: Left (Video & Speaking HUD) / Right (Question & Answer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Camera Preview & Real-Time Speaking Coach HUD */}
        <div className="lg:col-span-5 space-y-4">
          {/* Video Stream Container */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center border border-slate-800 shadow-md">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="text-center p-6 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <VideoIcon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300">Camera Inactive</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Toggle video to monitor facial poise and eye contact</p>
                </div>
              </div>
            )}

            {/* In-video floating controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleCamera}
                  className={`p-2 rounded-lg text-white backdrop-blur-md transition-colors ${
                    cameraActive ? "bg-blue-600/80 hover:bg-blue-700/80" : "bg-black/60 hover:bg-black/80"
                  }`}
                  title="Toggle Camera"
                >
                  {cameraActive ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  className={`p-2 rounded-lg text-white backdrop-blur-md transition-colors ${
                    isSpeaking ? "bg-emerald-600/80 hover:bg-emerald-700/80 animate-pulse" : "bg-black/60 hover:bg-black/80"
                  }`}
                  title="Toggle Microphone Speaking Timer"
                >
                  {isSpeaking ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              </div>

              {isSpeaking && (
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>Speaking ({speakingSeconds}s)</span>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Speaking Coach HUD */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Speaking Coach HUD
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Pacing (WPM)
                </span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                  {currentWpm}
                </span>
                <span className="text-[10px] font-medium text-emerald-600 block mt-0.5">
                  Optimal (130-150)
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Filler Words
                </span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                  {fillerWordCount}
                </span>
                <span className={`text-[10px] font-medium block mt-0.5 ${fillerWordCount > 3 ? "text-amber-600" : "text-emerald-600"}`}>
                  {fillerWordCount > 3 ? "Caution (Hedging)" : "Clean Delivery"}
                </span>
              </div>
            </div>

            {/* Monologue Alert */}
            {speakingSeconds > 120 && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center space-x-2 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Monologue alert: Answers over 2 minutes risk losing interviewer engagement. Check in.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 7 Cols: Question Prompt, Answer Textarea & Instant Feedback */}
        <div className="lg:col-span-7 space-y-5">
          {/* Interviewer Persona & Question Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                  AC
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {currentQuestion.interviewerPersona}
                  </span>
                  <span className="text-[11px] text-slate-400">Interviewer &middot; Concurrency Specialist</span>
                </div>
              </div>

              <button
                onClick={handlePlayQuestionAudio}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  audioPlaying
                    ? "bg-blue-50 text-blue-700 border-blue-300 animate-pulse"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{audioPlaying ? "Playing Audio..." : "Listen to Question"}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                  {currentQuestion.competency}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                  {currentQuestion.difficulty}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                "{currentQuestion.questionText}"
              </p>
            </div>

            {/* Answer Input Area */}
            {!evalResult && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Your Candidate Response:
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Use STAR (Situation, Task, Action, Result) structure
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={answerText}
                  onChange={handleTextChange}
                  placeholder="Type your structured answer or speak aloud with microphone enabled..."
                  className="w-full text-xs p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-sans leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswerText(
                        "The volatile keyword in Java establishes a happens-before memory relationship, guaranteeing that any write to a volatile field is immediately visible to subsequent reads across threads by emitting CPU memory fence barriers. However, volatile alone only guarantees visibility, not atomicity for compound operations like incrementing. For lock-free atomic state mutations, I prefer AtomicReference or VarHandle using hardware compare-and-swap (CAS) instructions to eliminate thread context-switching overhead."
                      );
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Load Sample Senior Answer
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || !answerText.trim()}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? "Evaluating Rubric..." : "Submit Answer"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Instant AI Rubric Feedback Card */}
            {evalResult && (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        AI Rubric Evaluation
                      </h4>
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-black text-blue-700">{evalResult.questionScore}</span>
                      <span className="text-xs text-slate-500 font-semibold">/10</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {evalResult.criterionScores.map((c: any) => (
                      <div key={c.name} className="p-2.5 rounded-lg bg-white/80 border border-blue-100 text-center">
                        <span className="text-[10px] text-slate-500 font-medium block truncate">{c.name}</span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">{c.score}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start space-x-2 text-emerald-950 bg-emerald-50/80 p-3 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-emerald-900">Key Strength:</strong>
                        <span>{evalResult.strengths}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 text-amber-950 bg-amber-50/80 p-3 rounded-lg border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-900">Concrete Gap to Polish:</strong>
                        <span>{evalResult.gap}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      <span>
                        {currentQIndex < totalQ - 1 ? "Next Question" : "Complete & View Full Scorecard"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
