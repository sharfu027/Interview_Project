import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Cpu, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">InterviewOS</span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
              The intelligent AI interview preparation, multi-persona panel simulation, real-time speech coaching, and career intelligence platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational &middot; Multi-Provider AI Active</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/features" className="hover:text-blue-600 transition">AI Mock Interviews</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition">4-Persona AI Panel</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition">Real-Time Speaking Coach</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition">Resume ATS Intelligence</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition">Career Roadmaps</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition">Salary Intelligence</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-4">Solutions</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/for-candidates" className="hover:text-blue-600 transition">For Software Engineers</Link></li>
              <li><Link to="/for-candidates" className="hover:text-blue-600 transition">For System Architects</Link></li>
              <li><Link to="/for-recruiters" className="hover:text-blue-600 transition">For Hiring Managers</Link></li>
              <li><Link to="/for-recruiters" className="hover:text-blue-600 transition">Recruiter Workspace</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600 transition">Enterprise Plans</Link></li>
            </ul>
          </div>

          {/* Governance & Trust */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-4">Trust & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/security" className="hover:text-blue-600 transition">Security Overview</Link></li>
              <li><Link to="/security" className="hover:text-blue-600 transition">Privacy & Data Consent</Link></li>
              <li><Link to="/security" className="hover:text-blue-600 transition">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-blue-600 transition">AI Evaluation Ethics</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition flex items-center gap-1">OpenAPI Spec <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} InterviewOS Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built with React 19, Spring Boot, Three.js, and PostgreSQL.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
