import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import Logo from '../../components/Logo';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link to={to} className="block mb-1">
      <div className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
            ${isActive(to)
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}>
        <Icon className={`h-5 w-5 mr-3 transition-colors ${isActive(to) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
        <span className="font-medium text-sm">{label}</span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-800/50">
          <Link to="/admin/dashboard" className="block">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600/10 p-2 rounded-lg border border-purple-600/20 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white block">Admin Portal</span>
                <span className="text-xs text-slate-500 font-medium">Placerra</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overview
          </div>
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Management
          </div>
          <NavItem to="/admin/jobs" icon={Briefcase} label="Placement Drives" />
          <NavItem to="/admin/placements" icon={Users} label="Placement Records" />
          <NavItem to="/admin/experiences" icon={FileText} label="Experience Moderation" />
        </div>

        {/* User & Logout */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-200 border border-purple-800">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-500">Placement Cell</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-400 hover:bg-slate-800">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
