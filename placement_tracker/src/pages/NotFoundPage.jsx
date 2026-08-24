import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-6 text-center">
            <p className="text-sm font-semibold text-blue-600 mb-2">404</p>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Page not found</h1>
            <p className="text-slate-500 max-w-md mb-8">
                This URL is not a Placcera page. Head back to the landing page to find your college portal.
            </p>
            <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
                Go home
            </Link>
        </div>
    );
};

export default NotFoundPage;
