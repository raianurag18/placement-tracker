import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Loader2, Printer, ArrowLeft, Mail, Phone, Linkedin, Github, Globe, FileEdit, ArrowRight } from 'lucide-react';
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
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
    );

    if (!resumeData) return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-900">
            <h2 className="text-2xl font-bold mb-2">No Resume Found</h2>
            <p className="text-slate-500 mb-6">You haven't created a resume yet.</p>
            <Button onClick={() => navigate('/resume-builder')} className="bg-blue-600 hover:bg-blue-700">
                <FileEdit className="mr-2 h-4 w-4" /> Go to Resume Builder
            </Button>
        </div>
    );

    const { personalInfo, education, experience, projects, skills } = resumeData;

    return (
        <div className="min-h-screen bg-slate-900 py-10 px-4 print:p-0 print:bg-white print:min-h-0 font-sans">

            {/* Toolbar - Sticky Top for better UX */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden sticky top-4 z-50 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => navigate('/resume-builder')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
                </Button>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 mr-2 uppercase tracking-wider font-semibold">Preview Mode</span>
                    <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all hover:scale-105 active:scale-95">
                        <Printer className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* A4 Resume Page */}
            <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] p-[20mm] shadow-2xl print:shadow-none print:w-full print:max-w-none text-slate-900 transform transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,0,0,0.3)]">

                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                    <h1 className="text-4xl font-extrabold uppercase tracking-wider mb-3 text-slate-900">
                        {personalInfo.firstName} <span className="text-blue-700">{personalInfo.lastName}</span>
                    </h1>

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-700 font-medium">
                        {personalInfo.email && (
                            <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                <Mail className="h-3.5 w-3.5" /> {personalInfo.email}
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                <Phone className="h-3.5 w-3.5" /> {personalInfo.phone}
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                <Linkedin className="h-3.5 w-3.5" /> <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                <Github className="h-3.5 w-3.5" /> <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                <Globe className="h-3.5 w-3.5" /> <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                {personalInfo.summary && (
                    <div className="mb-8">
                        <p className="text-sm leading-relaxed text-justify text-slate-800 font-medium">{personalInfo.summary}</p>
                    </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-slate-200 mb-4 pb-1">Education</h2>
                        <div className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={index} className="flex justify-between items-start group">
                                    <div>
                                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">{edu.institute}</h3>
                                        <p className="text-sm font-medium text-slate-700">{edu.degree} in {edu.fieldOfStudy}</p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <div className="inline-block bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-600 mb-1">
                                            {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - {edu.current ? 'Present' : new Date(edu.endDate).getFullYear()}
                                        </div>
                                        {edu.score && <p className="text-slate-600 font-medium">GPA: {edu.score}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-slate-200 mb-4 pb-1">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={index} className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">{exp.role}</h3>
                                        <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-semibold text-slate-700">{exp.company}</p>
                                        {exp.location && <p className="text-xs text-slate-500 italic">{exp.location}</p>}
                                    </div>

                                    {exp.description && (
                                        <p className="text-sm whitespace-pre-line text-slate-600 leading-relaxed text-justify border-l-2 border-slate-100 pl-3">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-slate-200 mb-4 pb-1">Projects</h2>
                        <div className="space-y-5">
                            {projects.map((proj, index) => (
                                <div key={index} className="group">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">{proj.title}</h3>
                                        {proj.link && (
                                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline print:text-black print:no-underline flex items-center gap-1">
                                                Link <ArrowRight className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                    {proj.technologies && (
                                        <div className="mb-2">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tech Stack:</span>
                                            <span className="ml-2 text-xs font-medium text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{proj.technologies}</span>
                                        </div>
                                    )}
                                    {proj.description && (
                                        <p className="text-sm text-slate-600 leading-relaxed text-justify">{proj.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-slate-200 mb-4 pb-1">Technical Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span key={index} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-md text-sm font-medium print:bg-transparent print:border-none print:p-0 print:text-slate-900 print:after:content-[','] last:print:after:content-['']">
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
