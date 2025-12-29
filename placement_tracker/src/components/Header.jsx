import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { User, Menu } from 'lucide-react';

const Header = ({ user }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/">
              <img src="/company_logo.png" alt="Company Logo" className="h-16 my-2" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/"><Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-5 transition-all duration-300">Home</Button></Link>
              {user && (
                <>
                  <Link to="/jobs"><Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-5 transition-all duration-300">Opportunities</Button></Link>
                  <Link to="/my-applications"><Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-5 transition-all duration-300">My Applications</Button></Link>
                  <Link to="/stats"><Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-5 transition-all duration-300">Stats</Button></Link>
                  <Link to="/experiences"><Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-5 transition-all duration-300">Experiences</Button></Link>
                  <Link to="/resume"><Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-5 transition-all duration-300">Resume</Button></Link>
                  <Link to="/submit"><Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-5 transition-all duration-300">Submit Experience</Button></Link>
                </>
              )}
              <Link to="/about"><Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-5 transition-all duration-300">About</Button></Link>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-300">
                      <User className="mr-2 h-4 w-4" /> {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white rounded-xl shadow-2xl">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer"><Link to="/profile">My Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer"><Link to="/my-experiences">My Experiences</Link></DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer" onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/get-started"><Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-105">Get Started</Button></Link>
              )}

            </div>
          </div>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-900 text-white border-l border-gray-700">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link to="/" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">Home</Button></Link>
                  {user && (
                    <>
                      <Link to="/jobs" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">Opportunities</Button></Link>
                      <Link to="/my-applications" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">My Applications</Button></Link>
                      <Link to="/stats" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">Stats</Button></Link>
                      <Link to="/experiences" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">Experiences</Button></Link>
                      <Link to="/resume" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">Resume</Button></Link>
                      <Link to="/submit" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">Submit Experience</Button></Link>
                    </>
                  )}
                  <Link to="/about" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">About</Button></Link>
                  {user ? (
                    <>
                      <Link to="/profile" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">My Profile</Button></Link>
                      <Link to="/my-experiences" onClick={closeSheet}><Button variant="ghost" className="justify-start text-gray-300 hover:text-white hover:bg-white/10">My Experiences</Button></Link>
                      <Button variant="ghost" className="justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full" onClick={handleLogout}>Logout</Button>
                    </>
                  ) : (
                    <Link to="/get-started"><Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button></Link>
                  )}

                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
