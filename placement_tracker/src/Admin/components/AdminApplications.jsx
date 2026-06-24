import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Loader2, Users, Briefcase, ChevronDown, ChevronUp, Calendar, GraduationCap } from 'lucide-react';
import { adminFetch } from '../../api/client';

const STATUS_COLORS = {
    Applied: 'bg-blue-100 text-blue-700',
    Assessment: 'bg-yellow-100 text-yellow-700',
    Interview: 'bg-purple-100 text-purple-700',
    Selected: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
};

const AdminApplications = () => {
    const { collegeSlug } = useParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedJob, setExpandedJob] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await adminFetch(collegeSlug, '/admin/applications');
                setJobs(data);
            } catch (err) {
                console.error('Error fetching applications:', err.message);
            } finally {
                setLoading(false);
            }
        };
        if (collegeSlug) fetchApplications();
    }, [collegeSlug]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await adminFetch(collegeSlug, `/admin/applications/${applicationId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            // Update local state
            setJobs(prev => prev.map(job => ({
                ...job,
                applicants: job.applicants.map(app =>
                    app._id === applicationId ? { ...app, status: newStatus } : app
                )
            })));
        } catch (err) {
            console.error('Error updating status:', err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const totalApplications = jobs.reduce((sum, job) => sum + job.applicants.length, 0);
    const jobsWithApplicants = jobs.filter(j => j.applicants.length > 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Student Applications</h2>
                    <p className="text-slate-500">Track and manage student applications for your job postings.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-slate-200">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Applications</p>
                            <p className="text-2xl font-bold text-slate-900">{totalApplications}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Jobs with Applicants</p>
                            <p className="text-2xl font-bold text-slate-900">{jobsWithApplicants.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Selected</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {jobs.reduce((sum, job) => sum + job.applicants.filter(a => a.status === 'Selected').length, 0)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Jobs List with Applicants */}
            {jobs.length === 0 ? (
                <Card className="border-slate-200">
                    <CardContent className="p-12 text-center">
                        <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700">No job postings yet</h3>
                        <p className="text-slate-500 mt-2">Post a job to start receiving applications.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <Card key={job._id} className="border-slate-200 overflow-hidden">
                            {/* Job Header — Clickable to expand */}
                            <div
                                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                                        {job.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{job.role}</h3>
                                        <p className="text-sm text-slate-500">{job.company}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                        {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
                                    </span>
                                    {expandedJob === job._id ? (
                                        <ChevronUp className="h-5 w-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-slate-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Applicants Table */}
                            {expandedJob === job._id && (
                                <div className="border-t border-slate-100 bg-slate-50/50">
                                    {job.applicants.length === 0 ? (
                                        <div className="p-6 text-center text-slate-500 text-sm">
                                            No applications received yet.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-slate-200 text-slate-500">
                                                        <th className="text-left p-4 font-medium">Student</th>
                                                        <th className="text-left p-4 font-medium">Branch</th>
                                                        <th className="text-left p-4 font-medium">CGPA</th>
                                                        <th className="text-left p-4 font-medium">Applied On</th>
                                                        <th className="text-left p-4 font-medium">Status</th>
                                                        <th className="text-left p-4 font-medium">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {job.applicants.map(applicant => (
                                                        <tr key={applicant._id} className="border-b border-slate-100 hover:bg-white transition-colors">
                                                            <td className="p-4">
                                                                <div>
                                                                    <p className="font-medium text-slate-900">{applicant.studentName}</p>
                                                                    <p className="text-xs text-slate-500">{applicant.studentEmail}</p>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-slate-700">{applicant.branch || '—'}</td>
                                                            <td className="p-4 text-slate-700">{applicant.cgpa || '—'}</td>
                                                            <td className="p-4 text-slate-500">
                                                                {new Date(applicant.appliedAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="p-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[applicant.status] || 'bg-slate-100 text-slate-600'}`}>
                                                                    {applicant.status}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <select
                                                                    value={applicant.status}
                                                                    onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                                                                    className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                                                >
                                                                    <option value="Applied">Applied</option>
                                                                    <option value="Assessment">Assessment</option>
                                                                    <option value="Interview">Interview</option>
                                                                    <option value="Selected">Selected</option>
                                                                    <option value="Rejected">Rejected</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminApplications;
