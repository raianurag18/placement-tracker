import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Lightweight back navigation — matches dashboard drill-down pages
 * (text link + arrow, not a heavy ghost button).
 */
const PageBackLink = ({ to, label = 'Back', className = '' }) => (
    <Link
        to={to}
        className={`inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 ${className}`}
    >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        {label}
    </Link>
);

export default PageBackLink;
