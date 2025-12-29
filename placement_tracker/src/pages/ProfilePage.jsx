import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, Upload, Save, CheckCircle, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
    const { user, login } = useAuth(); // login used to update context state
    const [formData, setFormData] = useState({
        branch: '',
        cgpa: '',
        phone: ''
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                branch: user.branch || '',
                cgpa: user.cgpa || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            // Using relative path via Proxy to avoid Cross-Origin Cookie issues
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token || localStorage.getItem('placerra_token')}`
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                // Update local context
                login({ ...user, ...data.user });
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Update failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadResume = async () => {
        if (!resumeFile) return;

        setIsLoading(true);
        setMessage(null);

        const formDataObj = new FormData();
        formDataObj.append('resume', resumeFile);

        try {
            const response = await fetch('/api/profile/resume', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token || localStorage.getItem('placerra_token')}`
                },
                body: formDataObj,
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                // Update local context to include new resume URL
                const updatedUser = { ...user, resume: data.resumeUrl };
                login(updatedUser);
                setResumeFile(null); // Clear file input
                setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Upload failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error during upload' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return <div className="text-white text-center mt-20">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My Profile</h1>
                    <p className="mt-2 text-lg text-slate-400">Manage your academic details and resume.</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {message.type === 'success' ? <CheckCircle className="mr-2 h-5 w-5" /> : <AlertCircle className="mr-2 h-5 w-5" />}
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Academic Details Form */}
                    <Card className="bg-slate-900 border-slate-800 text-slate-100">
                        <CardHeader>
                            <CardTitle>Academic Details</CardTitle>
                            <CardDescription className="text-slate-400">Keep your information up to date for recruiters.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={user.name} disabled className="bg-slate-950 border-slate-800 text-slate-400 cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={user.email} disabled className="bg-slate-950 border-slate-800 text-slate-400 cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="branch">Branch</Label>
                                    <Input
                                        id="branch"
                                        name="branch"
                                        value={formData.branch}
                                        disabled
                                        className="bg-slate-950 border-slate-800 text-slate-400 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-slate-500">Contact admin to change branch.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cgpa">CGPA</Label>
                                    <Input
                                        id="cgpa"
                                        name="cgpa"
                                        type="number"
                                        value={formData.cgpa}
                                        disabled
                                        className="bg-slate-950 border-slate-800 text-slate-400 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-slate-500">Contact admin to update scores.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="10-digit number"
                                        className="bg-slate-950 border-slate-800 focus:border-indigo-500"
                                        maxLength={10}
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4">
                                    {isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Resume Upload Section */}
                    <Card className="bg-slate-900 border-slate-800 text-slate-100 h-fit">
                        <CardHeader>
                            <CardTitle>Resume / CV</CardTitle>
                            <CardDescription className="text-slate-400">Upload your latest resume (PDF, Max 5MB).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Current Resume Status */}
                            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${user.resume ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{user.resume ? 'Resume Uploaded' : 'No Resume Found'}</p>
                                        {user.resume && <p className="text-xs text-slate-500">Ready for review</p>}
                                    </div>
                                </div>
                                {user.resume && (
                                    <a
                                        href={user.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                            Download
                                        </Button>
                                    </a>
                                )}
                            </div>

                            {/* Upload Area */}
                            <div className="space-y-2">
                                <Label htmlFor="resume-upload">Update Resume</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="resume-upload"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="bg-slate-950 border-slate-800 text-slate-400 file:bg-slate-800 file:text-white file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-2 hover:file:bg-slate-700"
                                    />
                                    <Button onClick={handleUploadResume} disabled={!resumeFile || isLoading} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">Only PDF files are allowed.</p>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
