import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    PieChart,
    Send,
    User,
    LogOut,
    BookOpen,
    ClipboardList,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Button } from "./ui/button";
import Logo from './Logo';

const Sidebar = ({ collapsed = false, onToggle }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { collegeSlug } = useParams();

    const basePath = collegeSlug ? `/c/${collegeSlug}` : '';

    const handleLogout = () => {
        logout();
        navigate(collegeSlug ? `/c/${collegeSlug}/login` : '/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link to={to} className="block mb-1" title={collapsed ? label : undefined}>
            <div className={`flex items-center rounded-xl transition-all duration-200 group
                ${collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'}
                ${isActive(to)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}>
                <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${collapsed ? '' : 'mr-3'} ${isActive(to) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-200 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    {label}
                </span>
            </div>
        </Link>
    );

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-[width] duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-64'}`}
        >
            {/* Logo Area */}
            <div className={`relative border-b border-slate-700/50 ${collapsed ? 'p-4 flex justify-center' : 'p-6'}`}>
                <Link to="/" className="block overflow-hidden">
                    <Logo variant="light" collapsed={collapsed} />
                </Link>
                {onToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 flex items-center justify-center shadow-md z-10 transition-colors"
                    >
                        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                    </button>
                )}
            </div>

            {/* Navigation Links */}
            <div className={`flex-1 overflow-y-auto py-6 space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
                {!collapsed && (
                    <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Menu
                    </div>
                )}

                <NavItem to={`${basePath}/dashboard`} icon={LayoutDashboard} label="Dashboard" />
                <NavItem to={`${basePath}/jobs`} icon={Briefcase} label="Opportunities" />
                <NavItem to={`${basePath}/my-applications`} icon={ClipboardList} label="My Applications" />
                <NavItem to={`${basePath}/stats`} icon={PieChart} label="Placement Stats" />

                {!collapsed && (
                    <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Career
                    </div>
                )}
                {collapsed && <div className="my-3 mx-2 border-t border-slate-800" />}
                <NavItem to={`${basePath}/experiences`} icon={BookOpen} label="Experiences" />
                <NavItem to={`${basePath}/resume/preview`} icon={FileText} label="My Resume" />
                <NavItem to={`${basePath}/submit`} icon={Send} label="Submit Experience" />
            </div>

            {/* User Profile & Logout (Bottom) */}
            <div className={`border-t border-slate-800/50 bg-slate-900/50 ${collapsed ? 'p-2' : 'p-4'}`}>
                {user ? (
                    <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'}`}>
                        <Link
                            to={`${basePath}/profile`}
                            title={collapsed ? user.name : undefined}
                            className={`flex items-center overflow-hidden group ${collapsed ? 'justify-center' : 'gap-3'}`}
                        >
                            <div className="h-9 w-9 flex-shrink-0 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <User className="h-5 w-5" />
                            </div>
                            {!collapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">Student</p>
                                </div>
                            )}
                        </Link>
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
                ) : (
                    <Link to="/get-started">
                        <Button className={`bg-blue-600 hover:bg-blue-700 ${collapsed ? 'w-full px-0' : 'w-full'}`}>
                            {collapsed ? 'Go' : 'Get Started'}
                        </Button>
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
