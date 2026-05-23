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

function App() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Allow Admin routes to bypass global loading check (they use their own Auth)
  if (isLoading && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/c/')) {
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

        {/* Get Started: Where user picks their college */}
        <Route path="/get-started" element={<GetStartedPage />} />

        {/* Global info pages — no college needed */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login-failure" element={<LoginFailurePage />} />

        {/* ──────────────────────────────────────────────────── */}
        {/* TENANT ROUTES — /c/:collegeSlug/...                  */}
        {/* These are the NEW SaaS-style routes for each college */}
        {/* ──────────────────────────────────────────────────── */}

        {/* College Student Login — /c/bitmesra/login */}
        <Route path="/c/:collegeSlug/login" element={<LoginPage />} />

        {/* College Admin Login — /c/bitmesra/admin/login */}
        <Route path="/c/:collegeSlug/admin/login" element={<AdminLogin />} />

        {/* College Student Portal — /c/bitmesra/dashboard, etc. */}
        <Route path="/c/:collegeSlug" element={<MainLayout user={user} />}>
          {user && <Route index element={<Navigate to="dashboard" replace />} />}
          {user && <Route path="dashboard" element={<StudentDashboard user={user} />} />}
          <Route path="experiences" element={<ExperiencesPage />} />
          <Route path="experience/:id" element={<PrivateRoute user={user}><ExperienceDetailPage /></PrivateRoute>} />
          <Route path="submit" element={<PrivateRoute user={user}><SubmitExperience /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute user={user}><ProfilePage /></PrivateRoute>} />
          <Route path="resume-builder" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
          <Route path="resume/preview" element={<PrivateRoute><ResumePreview /></PrivateRoute>} />
          <Route path="jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
          <Route path="my-applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />
          <Route path="stats" element={<PrivateRoute><PlacementStats /></PrivateRoute>} />
          <Route path="companies" element={<PrivateRoute user={user}><CompaniesPage /></PrivateRoute>} />
          <Route path="companies/:companyName" element={<PrivateRoute user={user}><CompanyPlacementsPage /></PrivateRoute>} />
          <Route path="branch-stats" element={<PrivateRoute user={user}><BranchStatsPage /></PrivateRoute>} />
          <Route path="branch/:branchName" element={<PrivateRoute user={user}><BranchPlacementsPage /></PrivateRoute>} />
          <Route path="highest-package-branch" element={<PrivateRoute user={user}><HighestPackageBranchPage /></PrivateRoute>} />
        </Route>

        {/* College Admin Portal — /c/bitmesra/admin/dashboard */}
        <Route
          path="/c/:collegeSlug/admin"
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="placements" element={<PlacementTable />} />
          <Route path="experiences" element={<ExperienceModeration />} />
          <Route path="jobs" element={<AdminJobsPage />} />
        </Route>

        {/* ──────────────────────────────────────────────────── */}
        {/* LEGACY ROUTES — Kept for backward compatibility      */}
        {/* Will be removed after full frontend migration        */}
        {/* DO NOT add new features to these legacy routes       */}
        {/* ──────────────────────────────────────────────────── */}

        {/* Routes with Main Layout (Legacy) */}
        <Route element={<MainLayout user={user} />}>
          {user && <Route path="/" element={<StudentDashboard user={user} />} />}
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/experience/:id" element={<PrivateRoute user={user}><ExperienceDetailPage /></PrivateRoute>} />
          <Route path="/submit" element={<PrivateRoute user={user}><SubmitExperience /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute user={user}><ProfilePage /></PrivateRoute>} />
          <Route path="/resume-builder" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
          <Route path="/resume/preview" element={<PrivateRoute><ResumePreview /></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
          <Route path="/my-applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />
          <Route path="/stats" element={<PrivateRoute><PlacementStats /></PrivateRoute>} />
          <Route path="/companies" element={<PrivateRoute user={user}><CompaniesPage /></PrivateRoute>} />
          <Route path="/companies/:companyName" element={<PrivateRoute user={user}><CompanyPlacementsPage /></PrivateRoute>} />
          <Route path="/branch-stats" element={<PrivateRoute user={user}><BranchStatsPage /></PrivateRoute>} />
          <Route path="/branch/:branchName" element={<PrivateRoute user={user}><BranchPlacementsPage /></PrivateRoute>} />
          <Route path="/highest-package-branch" element={<PrivateRoute user={user}><HighestPackageBranchPage /></PrivateRoute>} />
        </Route>

        {/* Admin Routes (Legacy) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="placements" element={<PlacementTable />} />
          <Route path="experiences" element={<ExperienceModeration />} />
          <Route path="jobs" element={<AdminJobsPage />} />
        </Route>

        {/* Login (Legacy) */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </CollegeProvider>
  );
}

export default App;

