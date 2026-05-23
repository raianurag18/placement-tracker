import React, { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Loader2 } from 'lucide-react';

const JobForm = ({ isOpen, onClose, onSubmit, initialData = null, isLoading }) => {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        ctc: '',
        description: '',
        eligibility: '',
        deadline: '',
        applyLink: '',
        logo: ''
    });

    useEffect(() => {
        if (initialData) {
            // Format format date for input
            const formattedDate = initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '';
            setFormData({ ...initialData, deadline: formattedDate });
        } else {
            setFormData({
                company: '', role: '', ctc: '', description: '',
                eligibility: 'All Branches', deadline: '', applyLink: '', logo: ''
            });
        }
    }, [initialData, isOpen]); // Reset when opening/closing or data changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white text-slate-900 border-slate-200 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Job Opening' : 'Post New Job'}</DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Update the details for this placement drive.' : 'Fill in the details to notify students about a new opportunity.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company">Company Name *</Label>
                            <Input id="company" name="company" value={formData.company} onChange={handleChange} required placeholder="e.g. Microsoft" className="bg-slate-50 border-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Job Role *</Label>
                            <Input id="role" name="role" value={formData.role} onChange={handleChange} required placeholder="e.g. SDE 1" className="bg-slate-50 border-slate-300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ctc">CTC (Package) *</Label>
                            <Input id="ctc" name="ctc" value={formData.ctc} onChange={handleChange} required placeholder="e.g. 12-15 LPA" className="bg-slate-50 border-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Application Deadline *</Label>
                            <Input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} required className="bg-slate-50 border-slate-300" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="eligibility">Eligibility Criteria</Label>
                        <Input id="eligibility" name="eligibility" value={formData.eligibility} onChange={handleChange} placeholder="e.g. CSE, ECE, > 7.5 CGPA" className="bg-slate-50 border-slate-300" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="applyLink">Application Link (Optional)</Label>
                        <Input id="applyLink" name="applyLink" value={formData.applyLink} onChange={handleChange} placeholder="https://careers.google.com/..." className="bg-slate-50 border-slate-300" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Logo URL (Optional)</Label>
                        <Input id="logo" name="logo" value={formData.logo} onChange={handleChange} placeholder="https://logo.com/image.png" className="bg-slate-50 border-slate-300" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Key responsibilities and skills required..." className="bg-slate-50 border-slate-300 min-h-[100px]" />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="border-slate-300">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (initialData ? 'Update Job' : 'Post Job')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default JobForm;
