import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Plus, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { getAdminJobs, createJob, updateJob, deleteJob } from '../../api/jobsApi';
import JobForm from './JobForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";

const AdminJobsPage = () => {
    const { collegeSlug } = useParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch all jobs for this college's admin panel
    const fetchJobs = async () => {
        try {
            const data = await getAdminJobs(collegeSlug);
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch jobs:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (collegeSlug) fetchJobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collegeSlug]);

    // Business logic: same handler for create AND update (determined by editingJob state)
    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (editingJob) {
                // Update existing job using its ID
                await updateJob(collegeSlug, editingJob._id, formData);
            } else {
                // Create a new job listing
                await createJob(collegeSlug, formData);
            }
            await fetchJobs(); // Re-fetch the full list to stay in sync
            setIsFormOpen(false);
            setEditingJob(null);
        } catch (error) {
            alert(error.message || "Failed to save job.");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete Handler
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job opening? This cannot be undone.")) return;
        try {
            await deleteJob(collegeSlug, id);
            setJobs(prev => prev.filter(job => job._id !== id));
        } catch (error) {
            alert(error.message || "Failed to delete job.");
        }
    };

    const openCreateModal = () => {
        setEditingJob(null);
        setIsFormOpen(true);
    };

    const openEditModal = (job) => {
        setEditingJob(job);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Placement Drives</h1>
                    <p className="text-slate-500">Manage job openings and campus recruitment drives.</p>
                </div>
                <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> Post New Job
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading jobs...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {jobs.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-slate-300 text-slate-500">
                            No jobs posted yet. Click "Post New Job" to get started.
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <Card key={job._id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            {job.logo ? (
                                                <img src={job.logo} alt={job.company} className="h-10 w-10 rounded object-contain border border-slate-100" />
                                            ) : (
                                                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-lg border border-blue-200">
                                                    {job.company.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1">{job.role}</CardTitle>
                                                <CardDescription className="font-medium text-slate-600">{job.company}</CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 flex-1">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded">
                                            <DollarSign className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">{job.ctc}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            <span className="truncate">{new Date(job.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-500 line-clamp-2 min-h-[2.5em]">
                                        {job.description || "No description provided."}
                                    </div>

                                    <div className="pt-2 flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(job)} className="flex-1 hover:bg-slate-50 border-slate-200 text-slate-700">
                                            <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(job._id)} className="hover:bg-red-50 hover:text-red-600 border-slate-200 text-slate-500">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            <JobForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                initialData={editingJob}
                isLoading={actionLoading}
            />
        </div>
    );
};

export default AdminJobsPage;
