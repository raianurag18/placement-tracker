import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import { Search, Loader2, Briefcase } from 'lucide-react';
import { Input } from "../components/ui/input";
import { getJobs } from '../api/jobsApi';

const JobsPage = () => {
    const { collegeSlug } = useParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!collegeSlug) return;

        // AbortController: stop the request if the user navigates away before it completes
        const controller = new AbortController();

        const fetchJobs = async () => {
            try {
                const data = await getJobs(collegeSlug, controller.signal);
                setJobs(Array.isArray(data) ? data : []);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Failed to fetch jobs:", err.message);
                    setError('Failed to load jobs. Please refresh the page.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
        return () => controller.abort();
    }, [collegeSlug]);

    const filteredJobs = jobs.filter(job =>
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl flex items-center">
                        <Briefcase className="mr-3 h-8 w-8 text-blue-600" />
                        Placement Drives
                    </h1>
                    <p className="mt-2 text-lg text-slate-500">Explore and apply to upcoming opportunities.</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search companies or roles..."
                        className="pl-10 bg-white border-slate-200 text-slate-900 focus:border-blue-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-600">{error}</p>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700">No drives active</h3>
                    <p className="text-slate-500 mt-2">New opportunities will appear here soon.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map(job => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobsPage;
