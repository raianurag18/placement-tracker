import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ user }) => {
  return (
    <div>
      <Header user={user} />
      <main className="mt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
