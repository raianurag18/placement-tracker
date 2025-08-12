import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
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
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  const navLinks = [
    { to: '/admin/dashboard', text: 'Dashboard' },
    { to: '/admin/placements', text: 'Placement Records' },
    { to: '/admin/experiences', text: 'Experience Moderation' },
  ];

  return (
    <div>
      <nav className="sticky top-0 z-50 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/admin/dashboard">
              <img src="/company_logo.png" alt="Company Logo" className="h-16" />
            </Link>
            <div className="hidden md:flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link to={link.to} key={link.to}>
                  <Button variant={location.pathname === link.to ? 'default' : 'ghost'}>
                    {link.text}
                  </Button>
                </Link>
              ))}
              <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link to={link.to} key={link.to}>
                        <Button variant={location.pathname === link.to ? 'default' : 'ghost'} className="w-full justify-start">
                          {link.text}
                        </Button>
                      </Link>
                    ))}
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
