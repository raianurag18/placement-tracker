import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, Upload, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { updateProfile, uploadResume } from '../api/profileApi';

const ProfilePage = () => {
    const { collegeSlug } = useParams();
    const { user, login } = useAuth();
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
            // updateProfile sends PUT to /api/c/:slug/profile with auth token
            const data = await updateProfile(collegeSlug, formData);
            login({ ...user, ...data.user }); // Update local auth context with new data
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Update failed' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadResume = async () => {
        if (!resumeFile) return;
        setIsLoading(true);
        setMessage(null);

        // ⚠️ INTERVIEW TIP: FormData is used for file uploads (multipart/form-data).
        // We do NOT set Content-Type manually — the browser adds it with the
        // correct "boundary" string that separates the file parts.
        const formDataObj = new FormData();
        formDataObj.append('resume', resumeFile);

        try {
            const data = await uploadResume(collegeSlug, formDataObj);
            login({ ...user, resume: data.resumeUrl }); // Update resume URL in context
            setResumeFile(null);
            setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Upload failed' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return <div className="text-center mt-20 text-slate-500">Loading profile...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">My Profile</h1>
                <p className="mt-2 text-lg text-slate-500">Manage your academic details and resume.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="mr-2 h-5 w-5" /> : <AlertCircle className="mr-2 h-5 w-5" />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Academic Details Form */}
                <Card className="bg-white border-slate-200 text-slate-900">
                    <CardHeader>
                        <CardTitle>Academic Details</CardTitle>
                        <CardDescription className="text-slate-500">Keep your information up to date for recruiters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                                <Input id="name" value={user.name} disabled className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">Email</Label>
                                <Input id="email" value={user.email} disabled className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="branch" className="text-slate-700">Branch</Label>
                                <Input id="branch" name="branch" value={formData.branch} disabled className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" />
                                <p className="text-xs text-slate-400">Contact admin to change branch.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cgpa" className="text-slate-700">CGPA</Label>
                                <Input id="cgpa" name="cgpa" type="number" value={formData.cgpa} disabled className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" />
                                <p className="text-xs text-slate-400">Contact admin to update scores.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-700">Phone</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit number" className="bg-white border-slate-200 focus:ring-blue-500 text-slate-900" maxLength={10} />
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                                {isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Resume Upload Section */}
                <Card className="bg-white border-slate-200 text-slate-900 h-fit">
                    <CardHeader>
                        <CardTitle>Resume / CV</CardTitle>
                        <CardDescription className="text-slate-500">Upload your latest resume (PDF, Max 5MB).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${user.resume ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{user.resume ? 'Resume Uploaded' : 'No Resume Found'}</p>
                                    {user.resume && <p className="text-xs text-slate-500">Ready for review</p>}
                                </div>
                            </div>
                            {user.resume && (
                                <a href={user.resume} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="border-slate-300 text-slate-600 hover:bg-slate-100">Download</Button>
                                </a>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resume-upload" className="text-slate-700">Update Resume</Label>
                            <div className="flex gap-2">
                                <Input id="resume-upload" type="file" accept=".pdf" onChange={handleFileChange} className="bg-white border-slate-200 text-slate-500 file:bg-slate-100 file:text-slate-700 file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-2 hover:file:bg-slate-100" />
                                <Button onClick={handleUploadResume} disabled={!resumeFile || isLoading} className="bg-slate-900 hover:bg-slate-800 text-white">
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-slate-400">Only PDF files are allowed.</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default ProfilePage;
