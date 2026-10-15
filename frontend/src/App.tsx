import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public Pages
import { LandingPage } from "./pages/public/LandingPage";
import { FeaturesPage } from "./pages/public/FeaturesPage";
import { HowItWorksPage } from "./pages/public/HowItWorksPage";
import { ForCandidatesPage } from "./pages/public/ForCandidatesPage";
import { ForRecruitersPage } from "./pages/public/ForRecruitersPage";
import { PricingPage } from "./pages/public/PricingPage";
import { SecurityPrivacyPage } from "./pages/public/SecurityPrivacyPage";
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";

// Candidate Layout & Pages
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/app/DashboardPage";
import { ResumeIntelligencePage } from "./pages/app/ResumeIntelligencePage";
import { CompanyPrepPage } from "./pages/app/CompanyPrepPage";
import { JobMarketPage } from "./pages/app/JobMarketPage";
import { InterviewsPage } from "./pages/app/InterviewsPage";
import { NewInterviewWizard } from "./pages/app/NewInterviewWizard";
import { InterviewSessionRunner } from "./pages/app/InterviewSessionRunner";
import { InterviewReportPage } from "./pages/app/InterviewReportPage";
import { AIPanelPage } from "./pages/app/AIPanelPage";
import { SpeakingCoachPage } from "./pages/app/SpeakingCoachPage";
import { RecordingsPage } from "./pages/app/RecordingsPage";
import { WeaknessFinderPage } from "./pages/app/WeaknessFinderPage";
import { CareerRoadmapPage } from "./pages/app/CareerRoadmapPage";
import { QuestionBankPage } from "./pages/app/QuestionBankPage";
import { CodingLabPage } from "./pages/app/CodingLabPage";
import { SalaryInsightsPage } from "./pages/app/SalaryInsightsPage";
import { ApplicationTrackerPage } from "./pages/app/ApplicationTrackerPage";
import { SettingsPage } from "./pages/app/SettingsPage";

// Recruiter Layout & Pages
import { RecruiterLayout } from "./layouts/RecruiterLayout";
import { RecruiterDashboardPage } from "./pages/recruiter/RecruiterDashboardPage";
import { RecruiterJobsPage } from "./pages/recruiter/RecruiterJobsPage";
import { RecruiterCandidatesPage } from "./pages/recruiter/RecruiterCandidatesPage";
import { RecruiterScorecardsPage } from "./pages/recruiter/RecruiterScorecardsPage";

// Admin Observability
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/for-candidates" element={<ForCandidatesPage />} />
      <Route path="/for-recruiters" element={<ForRecruitersPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/security" element={<SecurityPrivacyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Candidate App Workspace */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="resumes" element={<ResumeIntelligencePage />} />
        <Route path="companies" element={<CompanyPrepPage />} />
        <Route path="jobs" element={<JobMarketPage />} />
        <Route path="interviews" element={<InterviewsPage />} />
        <Route path="interviews/new" element={<NewInterviewWizard />} />
        <Route path="interviews/:id" element={<InterviewSessionRunner />} />
        <Route path="interviews/:id/report" element={<InterviewReportPage />} />
        <Route path="panel" element={<AIPanelPage />} />
        <Route path="speech" element={<SpeakingCoachPage />} />
        <Route path="recordings" element={<RecordingsPage />} />
        <Route path="weaknesses" element={<WeaknessFinderPage />} />
        <Route path="roadmap" element={<CareerRoadmapPage />} />
        <Route path="questions" element={<QuestionBankPage />} />
        <Route path="coding" element={<CodingLabPage />} />
        <Route path="salary" element={<SalaryInsightsPage />} />
        <Route path="applications" element={<ApplicationTrackerPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Recruiter Workspace */}
      <Route path="/recruiter" element={<RecruiterLayout />}>
        <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterDashboardPage />} />
        <Route path="jobs" element={<RecruiterJobsPage />} />
        <Route path="candidates" element={<RecruiterCandidatesPage />} />
        <Route path="scorecards" element={<RecruiterScorecardsPage />} />
      </Route>

      {/* Admin Platform Telemetry */}
      <Route path="/admin" element={<AdminDashboardPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
