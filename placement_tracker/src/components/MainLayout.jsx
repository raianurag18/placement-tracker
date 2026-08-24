import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

// Below xl (1280px) — including browser zoom-in, which shrinks CSS viewport — use the icon rail.
const COLLAPSE_QUERY = '(max-width: 1279px)';

const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(COLLAPSE_QUERY).matches;
  });
  const userOverrideRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia(COLLAPSE_QUERY);
    const onViewportChange = (event) => {
      // Zoom / resize crossed the threshold — follow viewport again.
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggle={handleToggle} />
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

      {/* Main Content Area — margin tracks sidebar width so content never sits under the rail */}
      <main className={`min-h-screen pt-20 md:pt-0 transition-all duration-300 ${collapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}>
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;
