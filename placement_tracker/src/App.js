import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import LandingPage from './pages/LandingPage';
import SubmitExperience from './Experience/SubmitExperience';
import ExperiencesPage from './Experience/ExperiencesPage';
import AboutPage from './pages/AboutPage';
import AdminLogin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import ExperienceDetailPage from './pages/ExperienceDetailPage';
import PlacementStats from './Stats/PlacementStats';
import CompaniesPage from './Stats/CompaniesPage';
import CompanyPlacementsPage from './Stats/CompanyPlacementsPage';
import BranchStatsPage from './Stats/BranchStatsPage';
import BranchPlacementsPage from './Stats/BranchPlacementsPage';
import HighestPackageBranchPage from './Stats/HighestPackageBranchPage';
import LoginPage from './Auth/LoginPage';
import LoginFailurePage from './Auth/LoginFailurePage';
import GetStartedPage from './Auth/GetStartedPage';
import ProfilePage from './pages/ProfilePage';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumePreview from './pages/ResumePreview';
import JobsPage from './pages/JobsPage';
import MyApplications from './pages/MyApplications';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import AdminLayout from './Admin/components/AdminLayout';
import { useAuth } from './context/AuthContext';
import { CollegeProvider } from './context/CollegeContext';
import PlacementTable from './Admin/components/PlacementTable';
import ExperienceModeration from './Admin/components/ExperienceModeration';
import AdminPrivateRoute from './Admin/AdminPrivateRoute';
import AdminJobsPage from './Admin/components/AdminJobsPage';
import AdminApplications from './Admin/components/AdminApplications';
import TenantLayout from './components/TenantLayout';

function App() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner only for non-tenant routes while auth state initializes
  if (isLoading && !location.pathname.startsWith('/c/')) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    // ⚠️ INTERVIEW TIP: CollegeProvider wraps ALL routes so any component
    // can access the current college data via useCollege() hook.
    // This is the React Context pattern for global state management.
    <CollegeProvider>
      <Routes>
        {/* ──────────────────────────────────────────────────── */}
        {/* GLOBAL ROUTES (No college slug — visible to anyone)  */}
        {/* ──────────────────────────────────────────────────── */}

        {/* Landing Page: College search bar lives here */}
        {!user && <Route path="/" element={<LandingPage />} />}
        {user && <Route path="/" element={<Navigate to={`/c/${user.collegeSlug}/dashboard`} replace />} />}

        {/* Get Started: Where user picks their college */}
        <Route path="/get-started" element={<GetStartedPage />} />

        {/* Global info pages — no college needed */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login-failure" element={<LoginFailurePage />} />

        {/* ──────────────────────────────────────────────────── */}
        {/* TENANT ROUTES — /c/:collegeSlug/...                  */}
        {/* These are the NEW SaaS-style routes for each college */}
        {/* ──────────────────────────────────────────────────── */}

        {/* TenantLayout handles college loading/validation for ALL /c/ routes */}
        <Route path="/c/:collegeSlug" element={<TenantLayout />}>
            
            {/* College Student Login — /c/bitmesra/login */}
            <Route path="login" element={<LoginPage />} />

            {/* College Student Portal — /c/bitmesra/dashboard, etc. */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="experiences" element={<ExperiencesPage />} />
                <Route path="experience/:id" element={<ExperienceDetailPage />} />
                <Route path="submit" element={<SubmitExperience />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="resume-builder" element={<ResumeBuilder />} />
                <Route path="resume/preview" element={<ResumePreview />} />
                <Route path="jobs" element={<JobsPage />} />
                <Route path="my-applications" element={<MyApplications />} />
                <Route path="stats" element={<PlacementStats />} />
                <Route path="companies" element={<CompaniesPage />} />
                <Route path="companies/:companyName" element={<CompanyPlacementsPage />} />
                <Route path="branch-stats" element={<BranchStatsPage />} />
                <Route path="branch/:branchName" element={<BranchPlacementsPage />} />
                <Route path="highest-package-branch" element={<HighestPackageBranchPage />} />
            </Route>

            {/* College Admin — /c/bitmesra/admin/login + /c/bitmesra/admin/dashboard */}
            <Route path="admin">
                <Route path="login" element={<AdminLogin />} />
                <Route element={<AdminPrivateRoute><AdminLayout /></AdminPrivateRoute>}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="placements" element={<PlacementTable />} />
                    <Route path="experiences" element={<ExperienceModeration />} />
                    <Route path="jobs" element={<AdminJobsPage />} />
                    <Route path="applications" element={<AdminApplications />} />
                </Route>
            </Route>
        </Route>

      </Routes>
    </CollegeProvider>
  );
}

export default App;

