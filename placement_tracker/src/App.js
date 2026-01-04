import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import LandingPage from './pages/LandingPage';
import SubmitExperience from './Experience/SubmitExperience';
import ExperiencesPage from './Experience/ExperiencesPage';
import AboutPage from './pages/AboutPage';
import AdminLogin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import PlacementStats from './Stats/PlacementStats';
import CompaniesPage from './Stats/CompaniesPage';
import CompanyPlacementsPage from './Stats/CompanyPlacementsPage';
import BranchStatsPage from './Stats/BranchStatsPage';
import BranchPlacementsPage from './Stats/BranchPlacementsPage';
import HighestPackageBranchPage from './Stats/HighestPackageBranchPage';
import LoginPage from './Auth/LoginPage';
import LoginFailurePage from './Auth/LoginFailurePage';
import GetStartedPage from './Auth/GetStartedPage';
import ProfilePage from './pages/ProfilePage'; // Added import
import ResumeBuilder from './pages/ResumeBuilder';
import ResumePreview from './pages/ResumePreview';
import JobsPage from './pages/JobsPage';
import MyApplications from './pages/MyApplications';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import AdminLayout from './Admin/components/AdminLayout';
import { useAuth } from './context/AuthContext';
import PlacementTable from './Admin/components/PlacementTable';
import ExperienceModeration from './Admin/components/ExperienceModeration';
import AdminPrivateRoute from './Admin/AdminPrivateRoute';

function App() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Allow Admin routes to bypass global loading check (they use their own Auth)
  if (isLoading && !location.pathname.startsWith('/admin')) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Landing Page (No Layout) - Only visible if user is NOT logged in */}
      {!user && <Route path="/" element={<LandingPage />} />}
      <Route path="/get-started" element={<GetStartedPage />} />

      {/* Routes with Main Layout (Header and Footer) */}
      <Route element={<MainLayout user={user} />}>
        {/* If user is logged in, / shows the Dashboard inside the layout */}
        {user && <Route path="/" element={<StudentDashboard user={user} />} />}

        {/* Explicit dashboard route if needed, or redirect from landing if logged in (optional, keeping clean) */}

        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/about" element={<AboutPage />} />
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

      {/* Admin Routes */}
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
      </Route>

      {/* Routes without Main Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-failure" element={<LoginFailurePage />} />
    </Routes>
  );
}

export default App;
