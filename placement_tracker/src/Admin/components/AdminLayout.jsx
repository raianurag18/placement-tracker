import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import Footer from '../../components/Footer';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', text: 'Dashboard' },
    { to: '/admin/placements', text: 'Placement Records' },
    { to: '/admin/experiences', text: 'Experience Moderation' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/admin/dashboard">
              <img src="/company_logo.png" alt="Company Logo" className="h-16 my-2" />
            </Link>
            <div className="hidden md:flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link to={link.to} key={link.to}>
                  <Button
                    variant="ghost"
                    className={`rounded-full px-5 transition-all duration-300 ${location.pathname === link.to ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                  >
                    {link.text}
                  </Button>
                </Link>
              ))}
              <Button variant="destructive" onClick={handleLogout} className="rounded-full shadow-lg shadow-red-500/20">Logout</Button>
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-gray-900 text-white border-gray-700">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navLinks.map((link) => (
                      <Link to={link.to} key={link.to}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${location.pathname === link.to ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                        >
                          {link.text}
                        </Button>
                      </Link>
                    ))}
                    <Button variant="destructive" onClick={handleLogout} className="w-full">Logout</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      <main className="relative z-10 container mx-auto p-6 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
