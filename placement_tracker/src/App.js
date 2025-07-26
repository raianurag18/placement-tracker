import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SubmitExperience from './Experience/SubmitExperience';
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
import PrivateRoute from './PrivateRoute';
import { useEffect, useState } from "react";
import MainLayout from './components/MainLayout';

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch("http://localhost:5000/api/current_user", { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Error fetching user:", err)
        setUser(null);
      });
  }, []);

  if (user === undefined) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      {/* Routes with Main Layout (Header and Footer) */}
      <Route element={<MainLayout user={user} />}>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/submit" element={<PrivateRoute user={user}><SubmitExperience /></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute user={user}><PlacementStats /></PrivateRoute>} />
        <Route path="/companies" element={<PrivateRoute user={user}><CompaniesPage /></PrivateRoute>} />
        <Route path="/companies/:companyName" element={<PrivateRoute user={user}><CompanyPlacementsPage /></PrivateRoute>} />
        <Route path="/branch-stats" element={<PrivateRoute user={user}><BranchStatsPage /></PrivateRoute>} />
        <Route path="/branch/:branchName" element={<PrivateRoute user={user}><BranchPlacementsPage /></PrivateRoute>} />
        <Route path="/highest-package-branch" element={<PrivateRoute user={user}><HighestPackageBranchPage /></PrivateRoute>} />
      </Route>

      {/* Routes without Main Layout */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-failure" element={<LoginFailurePage />} />
    </Routes>
  );
}

export default App;
