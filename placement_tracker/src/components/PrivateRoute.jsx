import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    
    // We try to get the slug from the AuthContext or LocalStorage
    const collegeSlug = user?.collegeSlug || localStorage.getItem('placerra_college_slug');

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // If there's a slug, send them to the tenant login, otherwise global login
    return user ? children : <Navigate to={collegeSlug ? `/c/${collegeSlug}/login` : "/login"} replace />;
};

export default PrivateRoute;
