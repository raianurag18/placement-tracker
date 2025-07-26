import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx";
import ExperienceModeration from './components/ExperienceModeration';
import PlacementManagement from './components/PlacementManagement';
import DashboardInsights from './components/DashboardInsights';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="placements">Placement Records</TabsTrigger>
          <TabsTrigger value="experiences">Experience Moderation</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <DashboardInsights />
        </TabsContent>
        <TabsContent value="placements">
          <PlacementManagement />
        </TabsContent>
        <TabsContent value="experiences">
          <ExperienceModeration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
