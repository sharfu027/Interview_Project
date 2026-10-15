import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Award,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Activity,
  ArrowLeft
} from "lucide-react";

export const RecruiterLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Recruiter Dashboard", path: "/recruiter/dashboard", icon: LayoutDashboard },
    { label: "Job Postings", path: "/recruiter/jobs", icon: Briefcase },
    { label: "Candidate Roster", path: "/recruiter/candidates", icon: Users },
    { label: "Evaluation Scorecards", path: "/recruiter/scorecards", icon: Award },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/recruiter/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            REC
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">InterviewOS Recruiter</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Recruiter Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/recruiter/dashboard" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
              REC
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-tight">
                InterviewOS
              </span>
              <span className="text-[11px] font-medium text-emerald-600 tracking-wide uppercase">
                Enterprise Talent
              </span>
            </div>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable nav items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-sm">
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1.5">
              RECRUITMENT OPERATIONS
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                </Link>
              );
            })}
          </div>

          {/* Switch back to candidate portal */}
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <div className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1.5">
              SWITCH PORTAL
            </div>
            <Link
              to="/app/dashboard"
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Candidate Suite</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Activity className="w-4 h-4 text-slate-400" />
              <span>System Telemetry</span>
            </Link>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
                {user?.firstName?.[0] || "S"}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : "Sarah Recruiter"}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email || "recruiter@interviewos.dev"}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out of Recruiter Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Recruiter Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              Verified Enterprise Workspace &middot; ACME Tech Corp
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/recruiter/jobs"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Create Job Opening</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
