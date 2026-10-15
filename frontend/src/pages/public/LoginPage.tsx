import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login, isRecruiter } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      if (email.includes("recruiter")) {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/app/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: "candidate" | "recruiter") => {
    if (role === "candidate") {
      setEmail("candidate@interviewos.dev");
      setPassword("Password123!");
    } else {
      setEmail("recruiter@interviewos.dev");
      setPassword("Password123!");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">InterviewOS</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to your candidate or recruiter workspace</p>
        </div>

        {/* Demo Fast-Login Pills */}
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-xs">
          <span className="font-bold text-blue-900 block mb-2">One-Click Demo Credentials:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("candidate")}
              className="py-1.5 px-3 bg-white rounded-lg border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100/50 transition text-left"
            >
              Candidate Demo &rarr;
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("recruiter")}
              className="py-1.5 px-3 bg-white rounded-lg border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100/50 transition text-left"
            >
              Recruiter Demo &rarr;
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-md shadow-blue-500/10 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to Workspace"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Create an account free
          </Link>
        </p>
      </div>
    </div>
  );
};
