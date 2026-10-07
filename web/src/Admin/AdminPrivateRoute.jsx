import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const AdminPrivateRoute = ({ children }) => {
    const { collegeSlug } = useParams();
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const adminCollegeSlug = localStorage.getItem('admin_college_slug');
    const fallbackSlug = localStorage.getItem('placerra_college_slug');

    // Tenant Alignment check: If admin belongs to a different college than the URL slug
    const isMismatch = isAdminLoggedIn && collegeSlug && adminCollegeSlug && adminCollegeSlug !== collegeSlug;

    if (isMismatch) {
        return (
            <Navigate 
                to={`/c/${adminCollegeSlug}/admin/dashboard`} 
                state={{ error: "You cannot access another college's admin portal while logged in. Please log out first to switch colleges." }} 
                replace 
            />
        );
    }
    
    return isAdminLoggedIn ? children : <Navigate to={collegeSlug ? `/c/${collegeSlug}/admin/login` : (fallbackSlug ? `/c/${fallbackSlug}/admin/login` : "/admin/login")} replace />;
};

export default AdminPrivateRoute;
