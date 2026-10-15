import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Lock, Mail, User, ArrowRight, AlertCircle, Briefcase, GraduationCap } from "lucide-react";

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      if (role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/app/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">InterviewOS</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900">Create your account</h2>
          <p className="text-xs text-slate-500 mt-1">Start preparing or hiring with intelligent AI tools</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Workspace Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("CANDIDATE")}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition text-left ${
                  role === "CANDIDATE"
                    ? "border-blue-600 bg-blue-50/50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0 text-blue-600" />
                <div>
                  <span className="block font-bold">Candidate</span>
                  <span className="text-[10px] text-slate-500 font-normal">Prepare & mock</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("RECRUITER")}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition text-left ${
                  role === "RECRUITER"
                    ? "border-blue-600 bg-blue-50/50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0 text-blue-600" />
                <div>
                  <span className="block font-bold">Recruiter</span>
                  <span className="text-[10px] text-slate-500 font-normal">Jobs & scorecards</span>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="David"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Miller"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Work or Personal Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="david@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password (Min. 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
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
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
