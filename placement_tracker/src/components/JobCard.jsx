import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Building2, Calendar, Banknote, GraduationCap, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

const JobCard = ({ job }) => {
    const { user } = useAuth(); // Get user for token
    const [hasApplied, setHasApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // Format Date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isExpired = new Date(job.deadline) < new Date();

    // Check if already applied
    useEffect(() => {
        const checkStatus = async () => {
            if (!user) return;
            try {
                const response = await fetch(`/api/applications/check/${job._id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token || localStorage.getItem('placerra_token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setHasApplied(data.hasApplied);
                }
            } catch (error) {
                console.error("Failed to check application status", error);
            } finally {
                setChecking(false);
            }
        };
        checkStatus();
    }, [job._id, user]);

    const handleApply = async () => {
        if (!window.confirm(`Apply to ${job.company} for ${job.role}?`)) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/applications/apply/${job._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token || localStorage.getItem('placerra_token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setHasApplied(true);
                // Simple alert for now, can be upgraded to Toast
                alert('Application Successful!');
            } else {
                alert(data.message || 'Application Failed');
            }
        } catch (error) {
            console.error("Apply error", error);
            alert('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-100 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
            <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        {/* Logo Placeholder or Image */}
                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                            {job.logo ? (
                                <img src={job.logo} alt={job.company} className="h-8 w-8 object-contain" />
                            ) : (
                                <Building2 className="h-6 w-6 text-blue-400" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                {job.role}
                            </CardTitle>
                            <div className="text-slate-400 font-medium">{job.company}</div>
                        </div>
                    </div>
                    {/* Status Badge */}
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${isExpired ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {isExpired ? 'Closed' : 'Active'}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-slate-300">
                        <Banknote className="h-4 w-4 text-slate-500" />
                        <span className="font-semibold">{job.ctc}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>{formatDate(job.deadline)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300 col-span-2">
                        <GraduationCap className="h-4 w-4 text-slate-500" />
                        <span className="truncate">{job.eligibility}</span>
                    </div>
                </div>

                {/* Short Description */}
                {job.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">
                        {job.description}
                    </p>
                )}
            </CardContent>

            <CardFooter>
                <Button
                    className={`w-full ${isExpired
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : hasApplied
                                ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    disabled={isExpired || hasApplied || loading || checking}
                    onClick={handleApply}
                >
                    {checking ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isExpired ? (
                        'Applications Closed'
                    ) : hasApplied ? (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Applied
                        </>
                    ) : loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default JobCard;
