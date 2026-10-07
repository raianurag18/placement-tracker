import React, { useEffect, useState } from 'react';
import { Outlet, useParams, Link } from 'react-router-dom';
import { useCollege } from '../context/CollegeContext';
import { Loader2 } from 'lucide-react';

const TenantLayout = () => {
    const { collegeSlug } = useParams();
    const { college, fetchCollege, isLoadingCollege } = useCollege();
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            if (collegeSlug && college?.slug !== collegeSlug) {
                await fetchCollege(collegeSlug);
            }
            if (isMounted) setInitialLoad(false);
        };
        init();
        return () => { isMounted = false; };
    }, [collegeSlug, college?.slug, fetchCollege]);

    if (isLoadingCollege || initialLoad) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading college workspace...</p>
            </div>
        );
    }

    if (!college) {
        // We tried to fetch but got nothing, meaning 404
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 text-center">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">🏛️</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">College Not Found</h1>
                <p className="text-slate-500 max-w-md mb-8">
                    The placement portal for <span className="font-semibold text-slate-700">'{collegeSlug}'</span> does not exist or is currently inactive.
                </p>
                <Link to="/get-started" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                    Find Your College
                </Link>
            </div>
        );
    }

    // College loaded successfully, render nested routes
    return <Outlet />;
};

export default TenantLayout;
