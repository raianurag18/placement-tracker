import React from 'react';
import {Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SubmitExperience from './SubmitExperience';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import PlacementStats from './PlacementStats';

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/submit" element={<SubmitExperience />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/stats" element={<PlacementStats />} />
      </Routes>
  );
}

export default App;

