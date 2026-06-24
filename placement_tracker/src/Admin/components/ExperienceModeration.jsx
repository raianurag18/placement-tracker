import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { CheckCircle, Trash2, Building2, User, FileText, Loader2, ChevronDown, ChevronUp, Clock, Lightbulb } from 'lucide-react';
import { getPendingExperiences, approveExperience, deleteExperience } from '../../api/experienceApi';

const ExperienceModeration = () => {
    const { collegeSlug } = useParams();
    const [pendingExperiences, setPendingExperiences] = useState([]);
    const [approvedMsg, setApprovedMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const data = await getPendingExperiences(collegeSlug);
                setPendingExperiences(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching pending experiences:', err.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (collegeSlug) fetchPending();
    }, [collegeSlug]);

    const handleApprove = async (id) => {
        try {
            await approveExperience(collegeSlug, id);
            setPendingExperiences(prev => prev.filter(item => item._id !== id));
            setApprovedMsg('Experience approved and published!');
            setTimeout(() => setApprovedMsg(''), 3000);
        } catch (err) {
            alert(err.message || 'Failed to approve experience.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to decline this experience? This cannot be undone.")) return;
        try {
            await deleteExperience(collegeSlug, id);
            setPendingExperiences(prev => prev.filter(exp => exp._id !== id));
        } catch (err) {
            alert(err.message || 'Failed to delete the experience.');
        }
    };

    const getDifficultyColor = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'hard': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'easy': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getVerdictColor = (verdict) => {
        switch (verdict?.toLowerCase()) {
            case 'selected': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Experience Moderation</h2>
                <p className="text-slate-500">Review and approve student interview experiences.</p>
            </div>

            {approvedMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" /> {approvedMsg}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                </div>
            ) : pendingExperiences.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
                    <p className="text-slate-500">No pending experiences to review at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">{pendingExperiences.length} experience{pendingExperiences.length !== 1 ? 's' : ''} pending review</p>

                    {pendingExperiences.map((exp) => (
                        <Card key={exp._id} className="bg-white border-slate-200 shadow-sm overflow-hidden">
                            {/* Header — Always visible */}
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                                            <Building2 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-slate-900">{exp.company}</CardTitle>
                                            <p className="text-sm text-slate-500">{exp.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {exp.verdict && (
                                            <Badge variant="outline" className={getVerdictColor(exp.verdict)}>
                                                {exp.verdict}
                                            </Badge>
                                        )}
                                        {exp.difficulty && (
                                            <Badge variant="outline" className={getDifficultyColor(exp.difficulty)}>
                                                {exp.difficulty}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Meta info */}
                                <div className="flex flex-wrap gap-3 mt-3">
                                    <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50">
                                        <User className="h-3 w-3 mr-1" /> {exp.name}
                                    </Badge>
                                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                                        💰 {exp.package}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0 space-y-4">
                                {/* Experience Summary */}
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="text-sm font-medium text-slate-700 mb-1">Overall Experience</p>
                                    <p className="text-slate-600 text-sm leading-relaxed">{exp.experience}</p>
                                </div>

                                {/* Expand/Collapse for full details */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpandedId(expandedId === exp._id ? null : exp._id)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full justify-center"
                                >
                                    {expandedId === exp._id ? (
                                        <><ChevronUp className="h-4 w-4 mr-1" /> Hide Details</>
                                    ) : (
                                        <><ChevronDown className="h-4 w-4 mr-1" /> View Full Details ({exp.rounds?.length || 0} rounds, {exp.tips?.length || 0} tips)</>
                                    )}
                                </Button>

                                {/* Expanded Details */}
                                {expandedId === exp._id && (
                                    <div className="space-y-5 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                        {/* Interview Rounds */}
                                        {exp.rounds && exp.rounds.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-blue-500" /> Interview Rounds
                                                </h4>
                                                {exp.rounds.map((round, idx) => (
                                                    <div key={idx} className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                                                        <p className="font-medium text-sm text-blue-800 mb-1">
                                                            Round {idx + 1}: {round.name || 'Unnamed Round'}
                                                        </p>
                                                        {round.description && (
                                                            <p className="text-sm text-slate-600 mb-2">{round.description}</p>
                                                        )}
                                                        {round.questions && round.questions.length > 0 && (
                                                            <div className="mt-2">
                                                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Questions Asked:</p>
                                                                <ul className="space-y-1">
                                                                    {round.questions.map((q, qIdx) => (
                                                                        <li key={qIdx} className="text-sm text-slate-700 flex items-start gap-2">
                                                                            <span className="text-blue-400 mt-0.5">•</span>
                                                                            <span>{q}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Tips */}
                                        {exp.tips && exp.tips.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                                    <Lightbulb className="h-4 w-4 text-amber-500" /> Advice for Aspirants
                                                </h4>
                                                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                                                    <ul className="space-y-2">
                                                        {exp.tips.map((tip, idx) => (
                                                            <li key={idx} className="text-sm text-amber-900 flex items-start gap-2">
                                                                <span className="font-bold text-amber-500">{idx + 1}.</span>
                                                                <span>{tip}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>

                            {/* Action Buttons */}
                            <CardFooter className="flex justify-end gap-3 pt-2 pb-5 px-6 border-t border-slate-100">
                                <Button variant="outline" onClick={() => handleDelete(exp._id)} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                                    <Trash2 className="h-4 w-4 mr-2" /> Decline
                                </Button>
                                <Button onClick={() => handleApprove(exp._id)} className="bg-green-600 hover:bg-green-700 text-white">
                                    <CheckCircle className="h-4 w-4 mr-2" /> Approve & Publish
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExperienceModeration;
