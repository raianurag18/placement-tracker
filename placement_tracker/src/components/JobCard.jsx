import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Building2, Calendar, Banknote, GraduationCap, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { checkApplicationStatus, applyToJob } from '../api/jobsApi';

// ⚠️ INTERVIEW TIP: JobCard uses useParams() directly even though it's a
// reusable component — not a page. This works because it's always rendered
// inside a /c/:collegeSlug/* route, so React Router provides the slug.
// This avoids "prop drilling" the slug from JobsPage → JobCard.
const JobCard = ({ job }) => {
    const { collegeSlug } = useParams();
    const [hasApplied, setHasApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isExpired = new Date(job.deadline) < new Date();

    // On mount: check if the student already applied to this job
    // This determines whether to show "Apply" or "Applied" button
    useEffect(() => {
        const checkStatus = async () => {
            if (!collegeSlug) return;
            try {
                const data = await checkApplicationStatus(collegeSlug, job._id);
                setHasApplied(data.hasApplied);
            } catch (error) {
                // A 401 here means the user is not logged in — that's ok, just show Apply
                console.error("Failed to check application status:", error.message);
            } finally {
                setChecking(false);
            }
        };
        checkStatus();
    }, [job._id, collegeSlug]);

    const handleApply = async () => {
        if (!window.confirm(`Apply to ${job.company} for ${job.role}?`)) return;

        setLoading(true);
        try {
            // applyToJob sends POST to /api/c/:slug/applications/apply/:jobId
            await applyToJob(collegeSlug, job._id);
            setHasApplied(true);
            alert('Application Successful!');
        } catch (err) {
            alert(err.message || 'Application Failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-white border-slate-200 text-slate-900 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/10 group">
            <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:border-blue-200 transition-colors">
                            {job.logo ? (
                                <img src={job.logo} alt={job.company} className="h-8 w-8 object-contain" />
                            ) : (
                                <Building2 className="h-6 w-6 text-blue-600" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {job.role}
                            </CardTitle>
                            <div className="text-slate-500 font-medium">{job.company}</div>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${isExpired ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                        {isExpired ? 'Closed' : 'Active'}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-slate-600">
                        <Banknote className="h-4 w-4 text-slate-400" />
                        <span className="font-semibold">{job.ctc}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{formatDate(job.deadline)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600 col-span-2">
                        <GraduationCap className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{job.eligibility}</span>
                    </div>
                </div>

                {job.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">
                        {job.description}
                    </p>
                )}
            </CardContent>

            <CardFooter>
                <Button
                    className={`w-full font-medium ${isExpired
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100'
                        : hasApplied
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                        }`}
                    disabled={isExpired || hasApplied || loading || checking}
                    onClick={handleApply}
                >
                    {checking ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isExpired ? (
                        'Applications Closed'
                    ) : hasApplied ? (
                        <><CheckCircle2 className="mr-2 h-4 w-4" /> Applied</>
                    ) : loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>Apply Now <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default JobCard;
