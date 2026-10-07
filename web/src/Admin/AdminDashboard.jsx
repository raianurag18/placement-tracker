import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PlacementInsights from './components/PlacementInsights';
import { AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState(location.state?.error || '');

  useEffect(() => {
    if (location.state?.error) {
      // Clear location state from history to avoid banner persisting on page reloads
      window.history.replaceState({}, document.title);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Alert Banner for admin tenant violations */}
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm animate-in slide-in-from-top duration-300 flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3 shrink-0" />
            <p className="text-sm text-red-800 font-medium">{errorMsg}</p>
          </div>
          <button 
            onClick={() => setErrorMsg('')} 
            className="text-red-400 hover:text-red-600 font-bold text-lg px-2 animate-pulse"
          >
            ×
          </button>
        </div>
      )}

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
