import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard'; // Assuming JobCard is created in components
import { Search, Filter, Loader2, Briefcase } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const JobsPage = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/jobs', {
                    headers: {
                        'Authorization': `Bearer ${user.token || localStorage.getItem('placerra_token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [user]);

    const filteredJobs = jobs.filter(job =>
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl flex items-center">
                            <Briefcase className="mr-3 h-8 w-8 text-blue-500" />
                            Placement Drives
                        </h1>
                        <p className="mt-2 text-lg text-slate-400">Explore and apply to upcoming opportunities.</p>
                    </div>
                    {/* Add Job Button (Visible to Admin only - Future Feature) */}
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search companies or roles..."
                            className="pl-10 bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Placeholder for Filters */}
                    {/* <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button> */}
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                        <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300">No drives active</h3>
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
        </div>
    );
};

export default JobsPage;
