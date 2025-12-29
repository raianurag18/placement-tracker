import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      <Header user={user} />
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
