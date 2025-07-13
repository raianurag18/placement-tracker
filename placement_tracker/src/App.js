import React from 'react';
import {Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SubmitExperience from './SubmitExperience';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import PlacementStats from './PlacementStats';
import Footer from './components/Footer';
import CompaniesPage from './CompaniesPage';
import CompanyPlacementsPage from './CompanyPlacementsPage';
import BranchStatsPage from './BranchStatsPage';
import BranchPlacementsPage from './BranchPlacementsPage';
import HighestPackageBranchPage from './HighestPackageBranchPage';
import LoginPage from './LoginPage';
import PrivateRoute from './PrivateRoute';
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/current_user", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/submit" element={<SubmitExperience />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/stats" element={<PrivateRoute user={user}><PlacementStats /></PrivateRoute>} />
        <Route path="/companies" element={<PrivateRoute user={user}><CompaniesPage /></PrivateRoute>} />
        <Route path="/companies/:companyName" element={<PrivateRoute user={user}><CompanyPlacementsPage /></PrivateRoute>} />
        <Route path="/branch-stats" element={<PrivateRoute user={user}><BranchStatsPage /></PrivateRoute>} />
        <Route path="/branch/:branchName" element={<PrivateRoute user={user}><BranchPlacementsPage /></PrivateRoute>} />
        <Route path="/highest-package-branch" element={<PrivateRoute user={user}><HighestPackageBranchPage /></PrivateRoute>} />
        <Route path="/submit" element={<PrivateRoute user={user}><SubmitExperience /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
