import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Settings,
  User,
  Shield,
  Activity,
  CheckCircle2,
  Save,
  Mic,
  Video
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<any>({
    firstName: "David",
    lastName: "Candidate",
    headline: "Senior Full-Stack & Distributed Systems Engineer",
    targetRole: "Senior Backend Engineer",
    location: "San Francisco, CA / Remote",
    bio: "Passionate about high-throughput microservices, concurrency models, and resilient distributed databases.",
    githubUrl: "https://github.com/developer-demo",
    linkedinUrl: "https://linkedin.com/in/developer-demo",
  });

  const [settings, setSettings] = useState<any>({
    speakingCoachLive: true,
    speakingCoachFillerWords: true,
    speakingCoachPaceTracking: true,
    privacyShareRecruiter: false,
    emailNotificationsEnabled: true,
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, setData] = await Promise.all([
          api.user.getProfile(),
          api.user.getSettings(),
        ]);
        if (profData) setProfile(profData);
        if (setData) setSettings(setData);
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        api.user.updateProfile(profile),
        api.user.updateSettings(settings),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings & Profile</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Manage your candidate profile, speaking coach preferences, and recruiter privacy boundaries
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Candidate Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">First Name</label>
              <input
                type="text"
                value={profile.firstName || ""}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name</label>
              <input
                type="text"
                value={profile.lastName || ""}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Professional Headline</label>
              <input
                type="text"
                value={profile.headline || ""}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Role</label>
              <input
                type="text"
                value={profile.targetRole || ""}
                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Location / Timezone</label>
              <input
                type="text"
                value={profile.location || ""}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Bio / Technical Philosophy</label>
              <textarea
                rows={3}
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Speaking Coach HUD Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Activity className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Speaking Coach Telemetry</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.speakingCoachFillerWords}
                onChange={(e) => setSettings({ ...settings, speakingCoachFillerWords: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs font-medium text-slate-700">
                Track filler words ('um', 'uh', 'like', 'basically') in real-time
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.speakingCoachPaceTracking}
                onChange={(e) => setSettings({ ...settings, speakingCoachPaceTracking: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs font-medium text-slate-700">
                Monitor words-per-minute (WPM) cadence during mock sessions
              </span>
            </label>
          </div>
        </div>

        {/* Privacy & Recruiter Consent */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Privacy & Talent Sharing</h2>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacyShareRecruiter}
                onChange={(e) => setSettings({ ...settings, privacyShareRecruiter: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  Allow verified enterprise recruiters to view my interview scorecards
                </span>
                <span className="text-slate-500 leading-relaxed block mt-0.5">
                  Recruiters can inspect competency percentiles and invite you to fast-track technical rounds. Your raw video recordings are never shared.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          {saved && (
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Preferences"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
