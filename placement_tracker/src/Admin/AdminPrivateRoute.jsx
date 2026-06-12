import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminPrivateRoute = ({ children }) => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const collegeSlug = localStorage.getItem('admin_college_slug') || localStorage.getItem('placerra_college_slug');
    
    return isAdminLoggedIn ? children : <Navigate to={collegeSlug ? `/c/${collegeSlug}/admin/login` : "/admin/login"} replace />;
};

export default AdminPrivateRoute;
