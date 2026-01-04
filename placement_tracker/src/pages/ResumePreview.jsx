import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Loader2, Printer, ArrowLeft, Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResumePreview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const token = user.token || localStorage.getItem('placerra_token');
                const res = await fetch('/api/resume/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setResumeData(data);
                }
            } catch (error) {
                console.error("Failed to fetch resume:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchResume();
    }, [user]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-slate-950">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
    );

    if (!resumeData) return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white">
            <p>No resume found.</p>
            <Button onClick={() => navigate('/resume-builder')} className="mt-4">Go to Builder</Button>
        </div>
    );

    const { personalInfo, education, experience, projects, skills } = resumeData;

    return (
        <div className="min-h-screen bg-slate-900 py-10 px-4 print:p-0 print:bg-white print:min-h-0">

            {/* Toolbar - Hidden when printing */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
                <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={() => navigate('/resume-builder')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
                </Button>
                <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
                    <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
                </Button>
            </div>

            {/* A4 Resume Page */}
            <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] p-[20mm] shadow-2xl print:shadow-none print:w-full print:max-w-none text-slate-900 font-serif">

                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                    <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">
                        {personalInfo.firstName} {personalInfo.lastName}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-700">
                        {personalInfo.email && (
                            <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {personalInfo.email}
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {personalInfo.phone}
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-1">
                                <Linkedin className="h-3 w-3" /> <a href={personalInfo.linkedin} className="hover:underline">LinkedIn</a>
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-1">
                                <Github className="h-3 w-3" /> <a href={personalInfo.github} className="hover:underline">GitHub</a>
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" /> <a href={personalInfo.website} className="hover:underline">Portfolio</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                {personalInfo.summary && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-2">Profile Summary</h2>
                        <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
                    </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3">Education</h2>
                        <div className="space-y-3">
                            {education.map((edu, index) => (
                                <div key={index} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-base">{edu.institute}</h3>
                                        <p className="text-sm italic">{edu.degree} in {edu.fieldOfStudy}</p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="font-medium">
                                            {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - {edu.current ? 'Present' : new Date(edu.endDate).getFullYear()}
                                        </p>
                                        {edu.score && <p className="text-slate-600">GPA/Score: {edu.score}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3">Experience</h2>
                        <div className="space-y-4">
                            {experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base">{exp.role}</h3>
                                        <span className="text-sm font-medium">
                                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold italic mb-1">{exp.company} {exp.location && `| ${exp.location}`}</p>
                                    {exp.description && (
                                        <p className="text-sm whitespace-pre-line text-slate-800 leading-relaxed font-sans">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3">Projects</h2>
                        <div className="space-y-4">
                            {projects.map((proj, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base">{proj.title}</h3>
                                        {proj.link && <a href={proj.link} className="text-xs text-blue-600 hover:underline print:text-black print:no-underline">{proj.link}</a>}
                                    </div>
                                    {proj.technologies && (
                                        <p className="text-xs font-semibold text-slate-600 mb-1 font-sans">Tech: {proj.technologies}</p>
                                    )}
                                    {proj.description && (
                                        <p className="text-sm text-slate-800 leading-relaxed font-sans">{proj.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-2">Technical Skills</h2>
                        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm font-sans">
                            {skills.map((skill, index) => (
                                <span key={index} className="bg-slate-100 px-2 py-0.5 rounded print:bg-transparent print:p-0 print:after:content-[','] last:print:after:content-['']">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ResumePreview;
