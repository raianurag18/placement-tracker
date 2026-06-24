import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "../components/ui/sheet";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Loader2, Briefcase, Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
    getMyApplications,
    createApplication,
    updateApplication,
    deleteApplication
} from '../api/jobsApi';

const COLUMN_STATUSES = ['Applied', 'Assessment', 'Interview', 'Selected', 'Rejected'];

const MyApplications = () => {
    const { collegeSlug } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sheet (side drawer) state
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [formData, setFormData] = useState({
        company: '', role: '', status: 'Applied', notes: ''
    });

    const fetchApplications = async () => {
        try {
            const data = await getMyApplications(collegeSlug);
            setApplications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch applications:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (collegeSlug) fetchApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collegeSlug]);

    const openCreate = () => {
        setEditingApp(null);
        setFormData({ company: '', role: '', status: 'Applied', notes: '' });
        setIsSheetOpen(true);
    };

    const openEdit = (app) => {
        setEditingApp(app);
        setFormData({ company: app.company, role: app.role, status: app.status, notes: app.notes || '' });
        setIsSheetOpen(true);
    };

    // Business logic: create OR update depending on whether editingApp is set
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingApp) {
                // Update existing application
                await updateApplication(collegeSlug, editingApp._id, formData);
            } else {
                // Create new application
                await createApplication(collegeSlug, formData);
            }
            await fetchApplications(); // Refresh the board after save
            setIsSheetOpen(false);
        } catch (err) {
            alert(err.message || "Failed to save application");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;
        try {
            await deleteApplication(collegeSlug, id);
            // Optimistic UI: remove immediately without re-fetching
            setApplications(apps => apps.filter(a => a._id !== id));
        } catch (err) {
            alert(err.message || "Failed to delete application");
        }
    };

    // ⚠️ INTERVIEW TIP: This is "optimistic updating" — we update the UI first,
    // then send the API request. If it fails, we roll back to the old state.
    // This makes the UI feel instantaneous to the user.
    const quickUpdateStatus = async (id, newStatus) => {
        const oldApps = [...applications];
        setApplications(apps => apps.map(app =>
            app._id === id ? { ...app, status: newStatus } : app
        ));
        try {
            await updateApplication(collegeSlug, id, { status: newStatus });
        } catch (error) {
            setApplications(oldApps); // Roll back on failure
            alert("Failed to update status");
        }
    };

    const getColumnColor = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-50 border-blue-100 text-blue-700';
            case 'Assessment': return 'bg-purple-50 border-purple-100 text-purple-700';
            case 'Interview': return 'bg-amber-50 border-amber-100 text-amber-700';
            case 'Selected': return 'bg-green-50 border-green-100 text-green-700';
            case 'Rejected': return 'bg-red-50 border-red-100 text-red-700';
            default: return 'bg-slate-100 border-slate-200';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 overflow-x-auto pb-4">
            <div className="min-w-max">
                <div className="mb-8 flex justify-between items-center sticky left-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center">
                            <Briefcase className="mr-3 h-8 w-8 text-blue-600" />
                            My Application Board
                        </h1>
                        <p className="mt-2 text-slate-500">Track and manage your job applications.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20">
                        <Plus className="mr-2 h-4 w-4" /> Add Application
                    </Button>
                </div>

                <div className="flex gap-6 pb-8">
                    {COLUMN_STATUSES.map(status => {
                        const columnApps = applications.filter(app => app.status === status);
                        return (
                            <div key={status} className="w-80 flex-shrink-0">
                                <div className={`flex items-center justify-between mb-4 p-3 rounded-lg border ${getColumnColor(status)}`}>
                                    <span className="font-semibold">{status}</span>
                                    <Badge variant="secondary" className="bg-white/50 text-inherit border-0 shadow-sm">
                                        {columnApps.length}
                                    </Badge>
                                </div>
                                <div className="space-y-4">
                                    {columnApps.map(app => (
                                        <Card key={app._id} className="bg-white border-slate-200 text-slate-900 hover:border-blue-300 transition-colors relative group shadow-sm">
                                            <CardHeader className="p-4 pb-2 pr-10">
                                                <CardTitle className="text-lg font-medium text-slate-800 truncate">{app.company}</CardTitle>
                                                <p className="text-sm text-slate-500 truncate">{app.role}</p>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <div className="text-xs text-slate-400 mb-4">
                                                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100">
                                                    {app.job ? (
                                                        <span className="text-xs text-slate-400 italic">Status managed by placement cell</span>
                                                    ) : (
                                                        <>
                                                            {status !== 'Applied' && (
                                                                <button
                                                                    onClick={() => quickUpdateStatus(app._id, COLUMN_STATUSES[COLUMN_STATUSES.indexOf(status) - 1])}
                                                                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                                                                >
                                                                    &larr; Prev
                                                                </button>
                                                            )}
                                                            {status !== 'Rejected' && status !== 'Selected' && (
                                                                <button
                                                                    onClick={() => quickUpdateStatus(app._id, COLUMN_STATUSES[COLUMN_STATUSES.indexOf(status) + 1])}
                                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors ml-auto"
                                                                >
                                                                    Next &rarr;
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-32 bg-white border-slate-200 text-slate-700">
                                                            <DropdownMenuItem onClick={() => openEdit(app)} className="hover:bg-slate-50 cursor-pointer">
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDelete(app._id)} className="text-red-500 hover:bg-red-50 cursor-pointer">
                                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Create/Edit Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="bg-white border-l-slate-200 text-slate-900 sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle className="text-slate-900">{editingApp ? 'Edit Application' : 'Add New Application'}</SheetTitle>
                            <SheetDescription className="text-slate-500">
                                {editingApp ? 'Update application details and notes.' : 'Manually track an application you submitted outside the portal.'}
                            </SheetDescription>
                        </SheetHeader>
                        <form onSubmit={handleSave} className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-slate-700">Company Name</Label>
                                <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required className="bg-white border-slate-200 text-slate-900" placeholder="e.g. Google" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-slate-700">Role / Position</Label>
                                <Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required className="bg-white border-slate-200 text-slate-900" placeholder="e.g. SDE Intern" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-slate-700">Current Status</Label>
                                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                    <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                                        {COLUMN_STATUSES.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-slate-700">Notes (Optional)</Label>
                                <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="bg-white border-slate-200 text-slate-900 min-h-[100px]" placeholder="Add interview dates, contact details, or other notes..." />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsSheetOpen(false)} className="text-slate-500 hover:text-slate-900">Cancel</Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    {editingApp ? 'Save Changes' : 'Create Application'}
                                </Button>
                            </div>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default MyApplications;
