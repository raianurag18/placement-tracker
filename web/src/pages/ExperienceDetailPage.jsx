import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Loader2, ArrowLeft, Building2, Calendar, CheckCircle2, XCircle, Clock, Lightbulb, Share2 } from 'lucide-react';
import { motion } from "framer-motion";
import { getExperienceById } from '../api/experienceApi';

const ExperienceDetailPage = () => {
    // ⚠️ INTERVIEW TIP: useParams() gives BOTH :collegeSlug AND :id here
    // because this component is nested under /c/:collegeSlug/experience/:id
    const { collegeSlug, id } = useParams();
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        // Try native share (mobile) first, fall back to clipboard
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${experience.company} - ${experience.role} Interview Experience`,
                    text: `Check out this interview experience at ${experience.company}`,
                    url
                });
            } catch (err) {
                // User cancelled share — not an error
            }
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const data = await getExperienceById(collegeSlug, id);
                setExperience(data);
            } catch (err) {
                setError(err.message || 'Failed to load experience');
            } finally {
                setLoading(false);
            }
        };
        if (collegeSlug && id) fetchExperience();
    }, [collegeSlug, id]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !experience) {
        return (
            <div className="max-w-4xl mx-auto text-center py-16">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Experience Not Found</h2>
                <p className="text-slate-500 mb-8">{error || "The experience you are looking for does not exist."}</p>
                {/* Relative path — goes back to experiences within this college */}
                <Link to="../experiences">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Experiences
                    </Button>
                </Link>
            </div>
        );
    }

    const getDifficultyColor = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'hard': return 'bg-red-100 text-red-700 hover:bg-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
            case 'easy': return 'bg-green-100 text-green-700 hover:bg-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getVerdictStyle = (verdict) => {
        switch (verdict?.toLowerCase()) {
            case 'selected': return { icon: CheckCircle2, className: 'text-green-600 bg-green-50 border-green-200' };
            case 'rejected': return { icon: XCircle, className: 'text-red-600 bg-red-50 border-red-200' };
            default: return { icon: Clock, className: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
        }
    };

    const VerdictIcon = getVerdictStyle(experience.verdict).icon;

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Back link — relative to the current route context */}
            <Link to="../experiences" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Experiences
            </Link>

            {/* Header Card */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-start gap-6">
                    <div className="h-20 w-20 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Building2 className="h-10 w-10 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{experience.company}</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-lg text-slate-700 font-medium">{experience.role}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{experience.package}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            <span>Batch of {experience.year}</span>
                            <span className="mx-2">•</span>
                            <span>Shared by <span className="font-medium text-slate-900">{experience.name}</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getVerdictStyle(experience.verdict).className}`}>
                        <VerdictIcon className="h-5 w-5" />
                        <span className="font-bold">{experience.verdict}</span>
                    </div>
                    <Badge variant="secondary" className={`${getDifficultyColor(experience.difficulty)} px-3 py-1`}>
                        {experience.difficulty} Difficulty
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">Overall Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                "{experience.experience}"
                            </p>
                        </CardContent>
                    </Card>

                    {/* Rounds Timeline */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" /> Interview Process
                        </h3>
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pl-8 pb-4">
                            {experience.rounds && experience.rounds.map((round, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative"
                                >
                                    <div className="absolute -left-[41px] top-0 h-6 w-6 rounded-full bg-white border-4 border-blue-500" />
                                    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg text-slate-800">{round.name}</CardTitle>
                                            <CardDescription className="text-slate-500">{round.description}</CardDescription>
                                        </CardHeader>
                                        {round.questions && round.questions.length > 0 && (
                                            <CardContent className="bg-slate-50/50 pt-4 border-t border-slate-100">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Key Questions</h4>
                                                <ul className="space-y-2">
                                                    {round.questions.map((q, qIndex) => (
                                                        <li key={qIndex} className="text-slate-600 text-sm flex items-start gap-2">
                                                            <span className="text-blue-400 mt-1">•</span>
                                                            <span>{q}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                            {(!experience.rounds || experience.rounds.length === 0) && (
                                <div className="text-slate-400 italic">No detailed rounds info available.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tips & Share Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-800">
                                <Lightbulb className="h-5 w-5" /> Advice for Aspirants
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {experience.tips && experience.tips.map((tip, index) => (
                                    <li key={index} className="flex gap-3 text-amber-900/80">
                                        <span className="font-bold text-amber-500 text-lg">{index + 1}.</span>
                                        <span className="text-sm leading-relaxed">{tip}</span>
                                    </li>
                                ))}
                                {(!experience.tips || experience.tips.length === 0) && (
                                    <li className="text-amber-900/60 italic text-sm">No specific tips shared.</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <h4 className="font-semibold text-slate-900 mb-2">Find this helpful?</h4>
                            <p className="text-sm text-slate-500 mb-4">Share with your batchmates.</p>
                            <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
                                <Share2 className="h-4 w-4" /> {copied ? 'Link Copied!' : 'Share Experience'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ExperienceDetailPage;
