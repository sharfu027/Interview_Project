import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Activity,
  CheckCircle2,
  Clock,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  RefreshCw,
  ArrowLeft
} from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getSystemHealth();
      setHealth(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load health", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/app/dashboard" className="text-slate-400 hover:text-slate-700 mr-1">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Activity className="w-5 h-5 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Telemetry & Health</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Live service status, micro-service connections, and platform metrics
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400">Refreshed: {lastRefreshed}</span>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {health && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-slate-900">Platform Operational</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {health.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Environment: {health.environment} &middot; Verified Local Stack
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">Avg Latency</span>
                  <span className="font-bold text-slate-900 text-sm">{health.metrics?.average_api_latency_ms} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">Uptime</span>
                  <span className="font-bold text-slate-900 text-sm">{(health.metrics?.system_uptime_seconds / 3600).toFixed(1)} hrs</span>
                </div>
              </div>
            </div>

            {/* Core Services Grid */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Service Telemetry Nodes
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(health.services || {}).map(([srv, stat]: [string, any]) => (
                  <div
                    key={srv}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                        {srv.replace(/_/g, " ")}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {stat}
                      </span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs animate-pulse shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Metrics */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Platform Operational Counters
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Registered Users</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                    {health.metrics?.registered_users}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Interviews Run</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                    {health.metrics?.total_mock_interviews_run}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Active Personas</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                    {health.metrics?.active_ai_personas}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">System Database</span>
                  <span className="text-xs font-bold text-emerald-700 mt-2 block">
                    PostgreSQL 16
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
