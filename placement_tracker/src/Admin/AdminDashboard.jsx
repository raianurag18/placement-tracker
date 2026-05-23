import React from 'react';
import PlacementInsights from './components/PlacementInsights';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">Real-time insights on campus placement activities.</p>
        </div>
        {/* <Button>Download Report</Button> (Placeholder for future) */}
      </div>

      <PlacementInsights />
    </div>
  );
};

export default AdminDashboard;
