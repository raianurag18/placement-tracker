import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Loader2, Briefcase, Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react';

const COLUMN_STATUSES = ['Applied', 'Assessment', 'Interview', 'Selected', 'Rejected'];

const MyApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sheet State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null); // If null, we are creating. If set, we are editing.
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        status: 'Applied',
        notes: ''
    });

    const fetchApplications = async () => {
        try {
            const token = user.token || localStorage.getItem('placerra_token');
            const res = await fetch('/api/applications/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Open Sheet for Create
    const openCreate = () => {
        setEditingApp(null);
        setFormData({ company: '', role: '', status: 'Applied', notes: '' });
        setIsSheetOpen(true);
    };

    // Open Sheet for Edit
    const openEdit = (app) => {
        setEditingApp(app);
        setFormData({
            company: app.company,
            role: app.role,
            status: app.status,
            notes: app.notes || ''
        });
        setIsSheetOpen(true);
    };

    // Handle Form Submit (Create or Update)
    const handleSave = async (e) => {
        e.preventDefault();
        const token = user.token || localStorage.getItem('placerra_token');

        try {
            let res;
            if (editingApp) {
                // UPDATE
                res = await fetch(`/api/applications/${editingApp._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(formData)
                });
            } else {
                // CREATE
                res = await fetch('/api/applications/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(formData)
                });
            }

            if (res.ok) {
                fetchApplications(); // Refresh board
                setIsSheetOpen(false);
            } else {
                alert("Failed to save application");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving application");
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;

        try {
            const token = user.token || localStorage.getItem('placerra_token');
            const res = await fetch(`/api/applications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setApplications(apps => apps.filter(a => a._id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Optimistic Status Update (Drag/Button flow)
    const quickUpdateStatus = async (id, newStatus) => {
        const oldApps = [...applications];
        setApplications(apps => apps.map(app =>
            app._id === id ? { ...app, status: newStatus } : app
        ));

        try {
            const token = user.token || localStorage.getItem('placerra_token');
            // Use PATCH route (which we just fixed to ignore validation errors)
            const res = await fetch(`/api/applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Failed to update');
        } catch (error) {
            setApplications(oldApps);
            alert("Failed to update status");
        }
    };

    const getColumnColor = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            case 'Assessment': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
            case 'Interview': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            case 'Selected': return 'bg-green-500/10 border-green-500/20 text-green-400';
            case 'Rejected': return 'bg-red-500/10 border-red-500/20 text-red-400';
            default: return 'bg-slate-800 border-slate-700';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-slate-950">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8 font-sans overflow-x-auto">
            <div className="max-w-[1600px] mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
                            <Briefcase className="mr-3 h-8 w-8 text-blue-500" />
                            My Application Board
                        </h1>
                        <p className="mt-2 text-slate-400">Track and manage your job applications.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Application
                    </Button>
                </div>

                <div className="flex gap-6 pb-8 min-w-max">
                    {COLUMN_STATUSES.map(status => {
                        const columnApps = applications.filter(app => app.status === status);
                        return (
                            <div key={status} className="w-80 flex-shrink-0">
                                <div className={`flex items-center justify-between mb-4 p-3 rounded-lg border ${getColumnColor(status)}`}>
                                    <span className="font-semibold">{status}</span>
                                    <Badge variant="secondary" className="bg-black/30 text-inherit border-0">
                                        {columnApps.length}
                                    </Badge>
                                </div>
                                <div className="space-y-4">
                                    {columnApps.map(app => (
                                        <Card key={app._id} className="bg-slate-900/50 border-slate-800 text-white hover:border-slate-700 transition-colors relative group">
                                            <CardHeader className="p-4 pb-2 pr-10"> {/* pr-10 for menu space */}
                                                <CardTitle className="text-lg font-medium text-slate-200 truncate">{app.company}</CardTitle>
                                                <p className="text-sm text-slate-400 truncate">{app.role}</p>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <div className="text-xs text-slate-500 mb-4">
                                                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                                </div>

                                                {/* Actions Footer */}
                                                <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-800/50">
                                                    {status !== 'Applied' && (
                                                        <button
                                                            onClick={() => quickUpdateStatus(app._id, COLUMN_STATUSES[COLUMN_STATUSES.indexOf(status) - 1])}
                                                            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                                                        >
                                                            &larr; Prev
                                                        </button>
                                                    )}

                                                    {status !== 'Rejected' && status !== 'Selected' && (
                                                        <button
                                                            onClick={() => quickUpdateStatus(app._id, COLUMN_STATUSES[COLUMN_STATUSES.indexOf(status) + 1])}
                                                            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors ml-auto"
                                                        >
                                                            Next &rarr;
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Dropdown Menu (Top Right) */}
                                                <div className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-32 bg-slate-900 border-slate-800 text-slate-300">
                                                            <DropdownMenuItem onClick={() => openEdit(app)} className="hover:bg-slate-800 cursor-pointer">
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDelete(app._id)} className="text-red-400 hover:bg-slate-800 cursor-pointer">
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
                    <SheetContent className="bg-slate-950 border-slate-800 text-white sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle className="text-slate-100">{editingApp ? 'Edit Application' : 'Add New Application'}</SheetTitle>
                            <SheetDescription className="text-slate-400">
                                {editingApp ? 'Update application details and notes.' : 'Manually track an application you submitted outside the portal.'}
                            </SheetDescription>
                        </SheetHeader>
                        <form onSubmit={handleSave} className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-slate-300">Company Name</Label>
                                <Input
                                    id="company"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    required
                                    className="bg-slate-900 border-slate-700 focus:ring-blue-500"
                                    placeholder="e.g. Google"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-slate-300">Role / Position</Label>
                                <Input
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                    className="bg-slate-900 border-slate-700 focus:ring-blue-500"
                                    placeholder="e.g. SDE Intern"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-slate-300">Current Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                        {COLUMN_STATUSES.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-slate-300">Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="bg-slate-900 border-slate-700 focus:ring-blue-500 min-h-[100px]"
                                    placeholder="Add interview dates, contact details, or other notes..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsSheetOpen(false)} className="text-slate-400 hover:text-white">
                                    Cancel
                                </Button>
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
