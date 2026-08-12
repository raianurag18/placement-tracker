import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    const { collegeSlug } = useParams();
    
    // We try to get the fallback slug from the AuthContext or LocalStorage if not in URL
    const fallbackSlug = user?.collegeSlug || localStorage.getItem('placerra_college_slug');

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to={collegeSlug ? `/c/${collegeSlug}/login` : (fallbackSlug ? `/c/${fallbackSlug}/login` : "/login")} replace />;
    }

    // Tenant Alignment check: If student belongs to a different college than the URL slug
    if (collegeSlug && user.collegeSlug && user.collegeSlug !== collegeSlug) {
        return (
            <Navigate 
                to={`/c/${user.collegeSlug}/dashboard`} 
                state={{ error: "You cannot access another college's portal while logged in. Please log out first to switch colleges." }} 
                replace 
            />
        );
    }

    return children;
};

export default PrivateRoute;
