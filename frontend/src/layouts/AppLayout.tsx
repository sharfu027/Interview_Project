import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Briefcase,
  BookOpen,
  Code2,
  Video,
  PlusCircle,
  Users2,
  Mic,
  Film,
  AlertTriangle,
  Compass,
  DollarSign,
  Kanban,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationGroups = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "PILLAR 1: PREPARE",
      items: [
        { label: "Resume Intelligence", path: "/app/resumes", icon: FileText },
        { label: "Company Prep", path: "/app/companies", icon: Building2 },
        { label: "Job Market", path: "/app/jobs", icon: Briefcase },
        { label: "Question Bank", path: "/app/questions", icon: BookOpen },
        { label: "Coding Lab", path: "/app/coding", icon: Code2 },
      ],
    },
    {
      title: "PILLAR 2: PRACTISE",
      items: [
        { label: "Mock Interviews", path: "/app/interviews", icon: Video },
        { label: "New Interview", path: "/app/interviews/new", icon: PlusCircle },
        { label: "4-Persona AI Panel", path: "/app/panel", icon: Users2 },
        { label: "Speaking Coach", path: "/app/speech", icon: Mic },
        { label: "Recordings", path: "/app/recordings", icon: Film },
      ],
    },
    {
      title: "PILLAR 3: IMPROVE",
      items: [
        { label: "Weakness Finder", path: "/app/weaknesses", icon: AlertTriangle },
        { label: "Career Roadmap", path: "/app/roadmap", icon: Compass },
        { label: "Salary Insights", path: "/app/salary", icon: DollarSign },
        { label: "Application Tracker", path: "/app/applications", icon: Kanban },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isRecruiter = user?.roles?.includes("ROLE_RECRUITER");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/app/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            OS
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">InterviewOS</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/app/dashboard" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
              OS
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-tight">
                InterviewOS
              </span>
              <span className="text-[11px] font-medium text-blue-600 tracking-wide uppercase">
                Candidate Suite
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable nav items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 text-sm">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1.5">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Recruiter Switcher (if privileged) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-1.5">
              WORKSPACES
            </div>
            {isRecruiter ? (
              <Link
                to="/recruiter/dashboard"
                className="flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Recruiter Portal</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500" />
              </Link>
            ) : (
              <Link
                to="/for-recruiters"
                className="flex items-center justify-between px-3 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Recruiter Demo</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            )}
            <Link
              to="/admin"
              className="flex items-center justify-between px-3 py-2 mt-1 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                <span>System Telemetry</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
                {user?.firstName?.[0] || "U"}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : "Candidate User"}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email || "candidate@interviewos.dev"}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/app/settings"
              className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              AI Engines Ready
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400">|</span>
            <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
              PostgreSQL 16 &middot; Spring Boot 3.4 &middot; Python AI
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/app/interviews/new"
              className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Launch Mock Interview</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
              <span className="text-xs font-bold">{user?.firstName?.[0] || "D"}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
