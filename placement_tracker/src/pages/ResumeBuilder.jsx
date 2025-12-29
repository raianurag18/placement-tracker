import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Loader2, ArrowRight, ArrowLeft, FileText, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { Checkbox } from "../components/ui/checkbox";

const STEPS = [
    { id: 1, title: 'Personal Info', description: 'Contact details and summary' },
    { id: 2, title: 'Education', description: 'Schools and degrees' },
    { id: 3, title: 'Experience', description: 'Work history and internships' },
    { id: 4, title: 'Projects', description: 'Academic and side projects' },
    { id: 5, title: 'Skills', description: 'Technical skills and achievements' },
];

const ResumeBuilder = () => {
    const { user } = useAuth();
    const [activeStep, setActiveStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Resume Data State
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            firstName: '', lastName: '', email: '', phone: '',
            linkedin: '', github: '', website: '', summary: ''
        },
        education: [],
        experience: [],
        projects: [],
        skills: [],
        achievements: []
    });

    // Fetch existing resume on mount
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const token = user.token || localStorage.getItem('placerra_token');
                const res = await fetch('/api/resume/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        // Merge with default state to ensure structure exists
                        setResumeData(prev => ({ ...prev, ...data }));
                    } else {
                        // Pre-fill from User Profile if no resume exists
                        setResumeData(prev => ({
                            ...prev,
                            personalInfo: {
                                ...prev.personalInfo,
                                firstName: user?.name?.split(' ')[0] || '',
                                lastName: user?.name?.split(' ')[1] || '',
                                email: user?.email || '',
                            }
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch resume:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchResume();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // --- HANDLERS ---

    // 1. Personal Info Handler
    const handlePersonalChange = (e) => {
        const { id, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [id]: value }
        }));
    };

    // 2. Education Handlers
    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [
                ...prev.education,
                { institute: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', score: '', current: false }
            ]
        }));
    };

    const removeEducation = (index) => {
        const newEdu = [...resumeData.education];
        newEdu.splice(index, 1);
        setResumeData(prev => ({ ...prev, education: newEdu }));
    };

    const handleEducationChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newEdu = [...resumeData.education];
        newEdu[index] = {
            ...newEdu[index],
            [name]: type === 'checkbox' ? checked : value
        };
        setResumeData(prev => ({ ...prev, education: newEdu }));
    };

    // 3. Experience Handlers
    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { company: '', role: '', location: '', startDate: '', endDate: '', description: '', current: false }
            ]
        }));
    };

    const removeExperience = (index) => {
        const newExp = [...resumeData.experience];
        newExp.splice(index, 1);
        setResumeData(prev => ({ ...prev, experience: newExp }));
    };

    const handleExperienceChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newExp = [...resumeData.experience];
        newExp[index] = {
            ...newExp[index],
            [name]: type === 'checkbox' ? checked : value
        };
        setResumeData(prev => ({ ...prev, experience: newExp }));
    };

    // Save Data to Backend
    const saveResume = async () => {
        setSaving(true);
        try {
            const token = user.token || localStorage.getItem('placerra_token');
            const res = await fetch('/api/resume/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(resumeData)
            });

            if (!res.ok) {
                alert("Failed to save progress.");
            }
        } catch (error) {
            console.error("Save failed:", error);
            alert("Error saving resume.");
        } finally {
            setSaving(false);
        }
    };

    const handleNext = async () => {
        await saveResume();
        if (activeStep < STEPS.length) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (activeStep > 1) {
            setActiveStep(prev => prev - 1);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-slate-950">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8 font-sans pb-20">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        Resume Builder
                    </h1>
                    <p className="mt-2 text-slate-400">Build a professional resume in minutes.</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10" />
                    {STEPS.map((step) => {
                        const isActive = step.id === activeStep;
                        const isCompleted = step.id < activeStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center bg-slate-950 px-2 cursor-pointer" onClick={() => setActiveStep(step.id)}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isActive ? 'bg-blue-600 text-white' :
                                    isCompleted ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-blue-400' : 'text-slate-500'} hidden sm:block`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Form Content */}
                <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
                    <CardHeader className="border-b border-slate-800 pb-6 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{STEPS[activeStep - 1].title}</CardTitle>
                            <CardDescription className="text-slate-400">{STEPS[activeStep - 1].description}</CardDescription>
                        </div>
                        {/* Add Button for List Steps */}
                        {activeStep === 2 && (
                            <Button onClick={addEducation} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" /> Add School
                            </Button>
                        )}
                        {activeStep === 3 && (
                            <Button onClick={addExperience} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" /> Add Position
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6">

                        {/* STEP 1: PERSONAL INFO */}
                        {activeStep === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                                        <Input id="firstName" value={resumeData.personalInfo.firstName} onChange={handlePersonalChange} className="bg-slate-950 border-slate-700" placeholder="e.g. John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                                        <Input id="lastName" value={resumeData.personalInfo.lastName} onChange={handlePersonalChange} className="bg-slate-950 border-slate-700" placeholder="e.g. Doe" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                        <Input id="email" value={resumeData.personalInfo.email} onChange={handlePersonalChange} className="bg-slate-950 border-slate-700" placeholder="e.g. john@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                                        <Input id="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalChange} className="bg-slate-950 border-slate-700" placeholder="e.g. +91 98765 43210" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin" className="text-slate-300">LinkedIn</Label>
                                        <Input id="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalChange} className="bg-slate-950 border-slate-700" placeholder="linkedin.com/in/..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="github" className="text-slate-300">GitHub</Label>
                                        <Input id="github" value={resumeData.personalInfo.github} onChange={handlePersonalChange} className="bg-slate-950 border-slate-700" placeholder="github.com/..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website" className="text-slate-300">Website</Label>
                                        <Input id="website" value={resumeData.personalInfo.website} onChange={handlePersonalChange} className="bg-slate-950 border-slate-700" placeholder="myportfolio.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="summary" className="text-slate-300">Professional Summary</Label>
                                    <Textarea id="summary" value={resumeData.personalInfo.summary} onChange={handlePersonalChange} className="bg-slate-950 border-slate-700 h-32" placeholder="Briefly describe your career goals..." />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: EDUCATION */}
                        {activeStep === 2 && (
                            <div className="space-y-6">
                                {resumeData.education.length === 0 && (
                                    <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                                        No education added yet. Click "Add School" to begin.
                                    </div>
                                )}
                                {resumeData.education.map((edu, index) => (
                                    <Card key={index} className="bg-slate-950 border-slate-800 relative group">
                                        <Button
                                            variant="ghost" size="icon"
                                            onClick={() => removeEducation(index)}
                                            className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Institute / School</Label>
                                                    <Input name="institute" value={edu.institute} onChange={(e) => handleEducationChange(index, e)} className="bg-slate-900 border-slate-700" placeholder="e.g. NIT Jhalwa" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Degree</Label>
                                                    <Input name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} className="bg-slate-900 border-slate-700" placeholder="e.g. B.Tech" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Field of Study</Label>
                                                    <Input name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(index, e)} className="bg-slate-900 border-slate-700" placeholder="e.g. Computer Science" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Score (CGPA/%)</Label>
                                                    <Input name="score" value={edu.score} onChange={(e) => handleEducationChange(index, e)} className="bg-slate-900 border-slate-700" placeholder="e.g. 9.5" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Start Date</Label>
                                                    <Input type="date" name="startDate" value={edu.startDate ? edu.startDate.split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} className="bg-slate-900 border-slate-700" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">End Date</Label>
                                                    <Input type="date" name="endDate" value={edu.endDate ? edu.endDate.split('T')[0] : ''} onChange={(e) => handleEducationChange(index, e)} disabled={edu.current} className="bg-slate-900 border-slate-700 disabled:opacity-50" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`edu-current-${index}`}
                                                    name="current"
                                                    checked={edu.current}
                                                    onCheckedChange={(checked) => handleEducationChange(index, { target: { name: 'current', type: 'checkbox', checked } })}
                                                    className="border-slate-500"
                                                />
                                                <Label htmlFor={`edu-current-${index}`} className="text-slate-400 font-normal">I currently study here</Label>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* STEP 3: EXPERIENCE */}
                        {activeStep === 3 && (
                            <div className="space-y-6">
                                {resumeData.experience.length === 0 && (
                                    <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                                        No experience added yet. Click "Add Position" to begin.
                                    </div>
                                )}
                                {resumeData.experience.map((exp, index) => (
                                    <Card key={index} className="bg-slate-950 border-slate-800 relative group">
                                        <Button
                                            variant="ghost" size="icon"
                                            onClick={() => removeExperience(index)}
                                            className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Company Name</Label>
                                                    <Input name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} className="bg-slate-900 border-slate-700" placeholder="e.g. Google" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Job Title / Role</Label>
                                                    <Input name="role" value={exp.role} onChange={(e) => handleExperienceChange(index, e)} className="bg-slate-900 border-slate-700" placeholder="e.g. SDE Intern" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Location</Label>
                                                <Input name="location" value={exp.location} onChange={(e) => handleExperienceChange(index, e)} className="bg-slate-900 border-slate-700" placeholder="e.g. Bangalore, Remote" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">Start Date</Label>
                                                    <Input type="date" name="startDate" value={exp.startDate ? exp.startDate.split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} className="bg-slate-900 border-slate-700" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">End Date</Label>
                                                    <Input type="date" name="endDate" value={exp.endDate ? exp.endDate.split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, e)} disabled={exp.current} className="bg-slate-900 border-slate-700 disabled:opacity-50" />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`exp-current-${index}`}
                                                    name="current"
                                                    checked={exp.current}
                                                    onCheckedChange={(checked) => handleExperienceChange(index, { target: { name: 'current', type: 'checkbox', checked } })}
                                                    className="border-slate-500"
                                                />
                                                <Label htmlFor={`exp-current-${index}`} className="text-slate-400 font-normal">I currently work here</Label>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">Description</Label>
                                                <Textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className="bg-slate-900 border-slate-700 h-24" placeholder="Built features for..." />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* PLACEHOLDERS FOR FUTURE STEPS */}
                        {activeStep > 3 && (
                            <div className="text-center py-12 text-slate-500">
                                <p>Step {activeStep} content coming soon...</p>
                                <p className="text-xs mt-2">Projects and Skills sections under construction</p>
                            </div>
                        )}

                    </CardContent>
                </Card>

                {/* Navigation Footer */}
                <div className="mt-8 flex justify-between">
                    <Button
                        onClick={handlePrev}
                        disabled={activeStep === 1 || saving}
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                    >
                        {saving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <>{activeStep === STEPS.length ? 'Finish' : 'Next Step'} <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default ResumeBuilder;
