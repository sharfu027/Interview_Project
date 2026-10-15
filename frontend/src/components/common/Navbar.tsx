import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Menu, X, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";

export const Navbar: React.FC = () => {
  const { isAuthenticated, isRecruiter, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                InterviewOS
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  AI 2026
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              Features
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              How It Works
            </Link>
            <Link to="/for-candidates" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              For Candidates
            </Link>
            <Link to="/for-recruiters" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              For Recruiters
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              Pricing
            </Link>
            <Link to="/security" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Security
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isRecruiter ? "/recruiter/dashboard" : "/app/dashboard"}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                >
                  <Briefcase className="w-4 h-4" />
                  {isRecruiter ? "Recruiter Workspace" : "Candidate Dashboard"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Features
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </Link>
          <Link
            to="/for-candidates"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            For Candidates
          </Link>
          <Link
            to="/for-recruiters"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            For Recruiters
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Pricing
          </Link>
          <Link
            to="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Security & Compliance
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to={isRecruiter ? "/recruiter/dashboard" : "/app/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
