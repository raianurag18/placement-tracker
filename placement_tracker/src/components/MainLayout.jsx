import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Header (Visible only on Mobile) */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-slate-900 text-white h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <span className="font-bold text-lg">Placerra</span>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r-slate-800 bg-slate-900 w-64 text-white">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen pt-20 md:pt-0 transition-all duration-300">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;
