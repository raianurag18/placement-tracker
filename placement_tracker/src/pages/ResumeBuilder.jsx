import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Loader2, ArrowRight, ArrowLeft, FileText, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { Checkbox } from "../components/ui/checkbox";
import PersonalInfoStep from '../components/Resume/PersonalInfoStep';
import EducationStep from '../components/Resume/EducationStep';
import ExperienceStep from '../components/Resume/ExperienceStep';
import ProjectsStep from '../components/Resume/ProjectsStep';
import SkillsStep from '../components/Resume/SkillsStep';

const STEPS = [
    { id: 1, title: 'Personal Info', description: 'Contact details and summary' },
    { id: 2, title: 'Education', description: 'Schools and degrees' },
    { id: 3, title: 'Experience', description: 'Work history and internships' },
    { id: 4, title: 'Projects', description: 'Academic and side projects' },
    { id: 5, title: 'Skills', description: 'Technical skills and achievements' },
];

const ResumeBuilder = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
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
                        setResumeData(prev => ({ ...prev, ...data }));
                    } else {
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
    // (Handlers remain unchanged, logic is solid)
    const handlePersonalChange = (e) => {
        const { id, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [id]: value }
        }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { institute: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', score: '', current: false }]
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
        newEdu[index] = { ...newEdu[index], [name]: type === 'checkbox' ? checked : value };
        setResumeData(prev => ({ ...prev, education: newEdu }));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, { company: '', role: '', location: '', startDate: '', endDate: '', description: '', current: false }]
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
        newExp[index] = { ...newExp[index], [name]: type === 'checkbox' ? checked : value };
        setResumeData(prev => ({ ...prev, experience: newExp }));
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, { title: '', link: '', technologies: '', description: '' }]
        }));
    };
    const removeProject = (index) => {
        const newProj = [...resumeData.projects];
        newProj.splice(index, 1);
        setResumeData(prev => ({ ...prev, projects: newProj }));
    };
    const handleProjectChange = (index, e) => {
        const { name, value } = e.target;
        const newProj = [...resumeData.projects];
        newProj[index] = { ...newProj[index], [name]: value };
        setResumeData(prev => ({ ...prev, projects: newProj }));
    };

    const addSkill = (skill) => {
        setResumeData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    };
    const removeSkill = (index) => {
        const newSkills = [...resumeData.skills];
        newSkills.splice(index, 1);
        setResumeData(prev => ({ ...prev, skills: newSkills }));
    };

    const saveResume = async () => {
        setSaving(true);
        try {
            const token = user.token || localStorage.getItem('placerra_token');
            const cleanedData = {
                ...resumeData,
                education: resumeData.education.filter(edu => edu.institute && edu.institute.trim() !== ''),
                experience: resumeData.experience.filter(exp => exp.company && exp.company.trim() !== '')
            };

            const res = await fetch('/api/resume/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cleanedData)
            });

            if (!res.ok) alert("Failed to save progress.");
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
            window.scrollTo(0, 0); // Scroll to top on step change
        } else {
            navigate('/resume/preview');
        }
    };

    const handlePrev = () => {
        if (activeStep > 1) {
            setActiveStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        Resume Builder
                    </h1>
                    <p className="mt-2 text-slate-500">Build a professional resume in minutes.</p>
                </div>

                {/* Progress Steps (Modernized) */}
                <div className="mb-8 relative px-4">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 translate-y-[-50%]" />
                    <div className="flex justify-between items-center relative z-10">
                        {STEPS.map((step) => {
                            const isActive = step.id === activeStep;
                            const isCompleted = step.id < activeStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center cursor-pointer group" onClick={() => setActiveStep(step.id)}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4 ${isActive ? 'bg-blue-600 text-white border-blue-100 shadow-md scale-110' :
                                            isCompleted ? 'bg-green-500 text-white border-green-100' : 'bg-white text-slate-400 border-slate-200'
                                        }`}>
                                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${isActive ? 'text-blue-600' :
                                            isCompleted ? 'text-green-600' : 'text-slate-400'
                                        } hidden sm:block bg-slate-50 px-2`}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content (Bento Style) */}
                <Card className="bg-white border-slate-200 text-slate-900 shadow-lg rounded-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                    <CardHeader className="border-b border-slate-100 pb-6 flex flex-row items-center justify-between bg-slate-50/50">
                        <div>
                            <CardTitle className="text-xl text-slate-800">{STEPS[activeStep - 1].title}</CardTitle>
                            <CardDescription className="text-slate-500">{STEPS[activeStep - 1].description}</CardDescription>
                        </div>
                        {/* Dynamic Action Buttons */}
                        <div className="flex gap-2">
                            {activeStep === 2 && (
                                <Button onClick={addEducation} size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                    <Plus className="h-4 w-4 mr-2" /> Add School
                                </Button>
                            )}
                            {activeStep === 3 && (
                                <Button onClick={addExperience} size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                    <Plus className="h-4 w-4 mr-2" /> Add Position
                                </Button>
                            )}
                            {activeStep === 4 && (
                                <Button onClick={addProject} size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                    <Plus className="h-4 w-4 mr-2" /> Add Project
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-8 p-6 lg:p-8 min-h-[400px]">
                        {/* STEP 1: PERSONAL INFO */}
                        {activeStep === 1 && (
                            <PersonalInfoStep data={resumeData.personalInfo} onChange={handlePersonalChange} />
                        )}

                        {/* STEP 2: EDUCATION */}
                        {activeStep === 2 && (
                            <EducationStep data={resumeData.education} onChange={handleEducationChange} onRemove={removeEducation} />
                        )}

                        {/* STEP 3: EXPERIENCE */}
                        {activeStep === 3 && (
                            <ExperienceStep data={resumeData.experience} onChange={handleExperienceChange} onRemove={removeExperience} />
                        )}

                        {/* STEP 4: PROJECTS */}
                        {activeStep === 4 && (
                            <ProjectsStep data={resumeData.projects} onChange={handleProjectChange} onRemove={removeProject} />
                        )}

                        {/* STEP 5: SKILLS */}
                        {activeStep === 5 && (
                            <SkillsStep skills={resumeData.skills} onAdd={addSkill} onRemove={removeSkill} />
                        )}
                    </CardContent>
                </Card>

                {/* Navigation Footer */}
                <div className="mt-8 flex justify-between">
                    <Button
                        onClick={handlePrev}
                        disabled={activeStep === 1 || saving}
                        variant="outline"
                        className="border-slate-300 text-slate-600 hover:bg-slate-100"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg min-w-[140px]"
                    >
                        {saving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <>{activeStep === STEPS.length ? 'Finish & Preview' : 'Next Step'} <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default ResumeBuilder;
