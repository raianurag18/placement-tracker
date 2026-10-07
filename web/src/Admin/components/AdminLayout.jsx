import React, { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  ShieldCheck,
  Briefcase,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Below xl (1280px) — including browser zoom-in — default to icon rail.
const COLLAPSE_QUERY = '(max-width: 1279px)';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collegeSlug } = useParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(COLLAPSE_QUERY).matches;
  });
  const userOverrideRef = useRef(false);

  const basePath = collegeSlug ? `/c/${collegeSlug}/admin` : '/admin';

  useEffect(() => {
    const mq = window.matchMedia(COLLAPSE_QUERY);
    const onViewportChange = (event) => {
      userOverrideRef.current = false;
      setCollapsed(event.matches);
    };
    mq.addEventListener('change', onViewportChange);
    return () => mq.removeEventListener('change', onViewportChange);
  }, []);

  const handleToggle = () => {
    userOverrideRef.current = true;
    setCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('admin_token');
    navigate(collegeSlug ? `/c/${collegeSlug}/admin/login` : '/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, showLabel = true }) => (
    <Link to={to} className="block mb-1" title={!showLabel ? label : undefined} onClick={() => setIsMobileOpen(false)}>
      <div className={`flex items-center rounded-xl transition-all duration-200 group
            ${!showLabel ? 'justify-center px-0 py-3' : 'px-4 py-3'}
            ${isActive(to)
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}>
        <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${showLabel ? 'mr-3' : ''} ${isActive(to) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
        <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-200 ${showLabel ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
          {label}
        </span>
      </div>
    </Link>
  );

  const renderSidebar = ({ collapsed: isCollapsed = false, onToggle = null } = {}) => (
    <aside
      className={`h-full bg-slate-900 border-r border-slate-800 flex flex-col transition-[width] duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-64'}`}
    >
      {/* Logo Area */}
      <div className={`relative border-b border-slate-800/50 ${isCollapsed ? 'p-4 flex justify-center' : 'p-6'}`}>
        <Link to={`${basePath}/dashboard`} className="block overflow-hidden" onClick={() => setIsMobileOpen(false)}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
            <div className="bg-purple-600/10 p-2 rounded-lg border border-purple-600/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-6 w-6 text-purple-600" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-bold text-xl tracking-tight text-white block">Admin Portal</span>
                <span className="text-xs text-slate-500 font-medium">Placerra</span>
              </div>
            )}
          </div>
        </Link>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:bg-purple-600 hover:text-white hover:border-purple-500 flex items-center justify-center shadow-md z-10 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className={`flex-1 overflow-y-auto py-6 space-y-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {!isCollapsed && (
          <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overview
          </div>
        )}
        <NavItem to={`${basePath}/dashboard`} icon={LayoutDashboard} label="Dashboard" showLabel={!isCollapsed} />

        {!isCollapsed && (
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Management
          </div>
        )}
        {isCollapsed && <div className="my-3 mx-2 border-t border-slate-800" />}
        <NavItem to={`${basePath}/jobs`} icon={Briefcase} label="Placement Drives" showLabel={!isCollapsed} />
        <NavItem to={`${basePath}/applications`} icon={Users} label="Applications" showLabel={!isCollapsed} />
        <NavItem to={`${basePath}/placements`} icon={FileText} label="Placement Records" showLabel={!isCollapsed} />
        <NavItem to={`${basePath}/experiences`} icon={FileText} label="Experience Moderation" showLabel={!isCollapsed} />
      </div>

      {/* User & Logout */}
      <div className={`border-t border-slate-800/50 bg-slate-900/50 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between'}`}>
          <div
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}
            title={isCollapsed ? 'Admin User' : undefined}
          >
            <div className="h-9 w-9 flex-shrink-0 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-200 border border-purple-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-500">Placement Cell</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
            className="text-slate-500 hover:text-red-400 hover:bg-slate-800"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:block fixed top-0 left-0 h-screen z-50">
        {renderSidebar({ collapsed, onToggle: handleToggle })}
      </div>

      {/* Mobile Header (Visible only on Mobile) */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-slate-900 text-white h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-purple-500" />
          <span className="font-bold text-lg">Admin Portal</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r-slate-800 bg-slate-900 w-64 text-white">
            {renderSidebar()}
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area — margin tracks sidebar width */}
      <main className={`flex-1 min-h-screen pt-20 md:pt-8 p-6 md:p-8 overflow-y-auto transition-all duration-300 ${collapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
