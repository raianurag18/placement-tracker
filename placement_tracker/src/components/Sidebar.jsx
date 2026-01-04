import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    PieChart,
    Send,
    User,
    LogOut,
    Menu,
    BookOpen,
    ClipboardList
} from 'lucide-react';
import { Button } from "./ui/button";
import Logo from './Logo';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link to={to} className="block mb-1">
            <div className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive(to)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}>
                <Icon className={`h-5 w-5 mr-3 transition-colors ${isActive(to) ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="font-medium text-sm">{label}</span>
            </div>
        </Link>
    );

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-700/50">
                <Link to="/" className="block">
                    <Logo variant="light" />
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Menu
                </div>

                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/jobs" icon={Briefcase} label="Opportunities" />
                <NavItem to="/my-applications" icon={ClipboardList} label="My Applications" />
                <NavItem to="/stats" icon={PieChart} label="Placement Stats" />

                <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Career
                </div>
                <NavItem to="/experiences" icon={BookOpen} label="Experiences" />
                <NavItem to="/resume/preview" icon={FileText} label="My Resume" />
                <NavItem to="/submit" icon={Send} label="Submit Experience" />
            </div>

            {/* User Profile & Logout (Bottom) */}
            <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
                {user ? (
                    <div className="flex items-center justify-between">
                        <Link to="/profile" className="flex items-center gap-3 overflow-hidden group">
                            <div className="h-9 w-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">Student</p>
                            </div>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-400 hover:bg-slate-800">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                ) : (
                    <Link to="/get-started">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
