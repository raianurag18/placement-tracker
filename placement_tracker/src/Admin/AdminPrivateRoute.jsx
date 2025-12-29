import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminPrivateRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');

  return isAdminLoggedIn ? children : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;
