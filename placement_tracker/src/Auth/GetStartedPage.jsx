import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, Briefcase, Loader2, Search, Check, ArrowRight, ArrowLeft } from 'lucide-react';

const GetStartedPage = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedInstitute, setSelectedInstitute] = useState(null);

    const [formData, setFormData] = useState({
        role: ''
    });
    const navigate = useNavigate();

    // Debounced Search
    useEffect(() => {
        const fetchInstitutes = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/institutes/search?q=${searchQuery}`);
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                console.error("Failed to search institutes", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchInstitutes, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const handleInstituteSelect = (institute) => {
        setSelectedInstitute(institute);
        setSearchQuery(institute.name); // Fill input with name
        setSuggestions([]); // Clear suggestions
    };

    const handleInstituteSubmit = async (e) => {
        e.preventDefault();
        if (!selectedInstitute) {
            alert("Please select an institute from the list.");
            return;
        }

        // Save to local storage WITH SLUG
        localStorage.setItem('selectedInstitute', JSON.stringify({
            name: selectedInstitute.name,
            city: selectedInstitute.city,
            id: selectedInstitute._id,
            slug: selectedInstitute.slug // REQUIRED for SaaS routing
        }));
        // Store slug separately for easy access
        if (selectedInstitute.slug) {
            localStorage.setItem('placerra_college_slug', selectedInstitute.slug);
        }
        handleNext();
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 relative font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="absolute top-6 left-6">
                <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Let's get started</h1>
                    <p className="mt-2 text-slate-500">Follow the steps to set up your workspace.</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-between items-center px-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {s}
                            </div>
                        </div>
                    ))}
                </div>

                <Card className="w-full bg-white border-slate-200 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-center text-slate-900">
                            {step === 1 && "Find Your Institute"}
                            {step === 2 && "Select Your Role"}
                            {step === 3 && "Ready to Login"}
                        </CardTitle>
                        <CardDescription className="text-center text-slate-500">
                            {step === 1 && "Search for your college to proceed."}
                            {step === 2 && "Are you a Student or Placement Admin?"}
                            {step === 3 && "Access your dashboard."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 1 && (
                            <form onSubmit={handleInstituteSubmit} className="space-y-4 relative">
                                <div className="space-y-2">
                                    <Label htmlFor="search" className="text-slate-700">Search Institute</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="search"
                                            placeholder="Type to search (e.g. BIT, IIT)..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setSelectedInstitute(null);
                                            }}
                                            className="bg-white border-slate-200 pl-10 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20"
                                            autoComplete="off"
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-3">
                                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    {suggestions.length > 0 && !selectedInstitute && (
                                        <div className="absolute w-full z-10 bg-white border border-slate-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                                            {suggestions.map((inst) => (
                                                <div
                                                    key={inst._id}
                                                    className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50 last:border-0"
                                                    onClick={() => handleInstituteSelect(inst)}
                                                >
                                                    <div>
                                                        <div className="font-medium text-slate-900">{inst.name}</div>
                                                        <div className="text-xs text-slate-500">{inst.city}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedInstitute && (
                                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm">
                                            <Check className="h-4 w-4 mr-2" />
                                            <span className="font-medium">Selected:</span>&nbsp;{selectedInstitute.name}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={!selectedInstitute}
                                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next: Select Role <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="grid gap-4">
                                <div
                                    className={`cursor-pointer border rounded-xl p-4 flex items-center space-x-4 transition-all ${formData.role === 'student' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                                    onClick={() => handleRoleSelect('student')}
                                >
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <GraduationCap className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Student</h3>
                                        <p className="text-sm text-slate-500">View stats & submit experiences</p>
                                    </div>
                                </div>

                                <div
                                    className={`cursor-pointer border rounded-xl p-4 flex items-center space-x-4 transition-all ${formData.role === 'admin' ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'}`}
                                    onClick={() => handleRoleSelect('admin')}
                                >
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <Briefcase className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Placement Cell</h3>
                                        <p className="text-sm text-slate-500">Manage records & approvals</p>
                                    </div>
                                </div>
                                <Button
                                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                                    disabled={!formData.role}
                                    onClick={handleNext}
                                >
                                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center space-y-6 py-4">
                                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 border border-green-200">
                                    <Building2 className="h-10 w-10 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedInstitute?.name}</h3>
                                    <p className="text-slate-500">{selectedInstitute?.city}</p>
                                </div>

                                {formData.role === 'student' ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-500">Sign in with your college email to access the student portal.</p>
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                                            size="lg"
                                            onClick={() => navigate(selectedInstitute?.slug ? `/c/${selectedInstitute.slug}/login` : '/login')}
                                        >
                                            Go to Student Login
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-500">Access the administrative dashboard.</p>
                                        <Button 
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg" 
                                            size="lg" 
                                            onClick={() => navigate(selectedInstitute?.slug ? `/c/${selectedInstitute.slug}/admin/login` : '/admin/login')}
                                        >
                                            Go to Admin Login
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                    {step > 1 && (
                        <CardFooter className="flex justify-start">
                            <Button variant="ghost" size="sm" onClick={handleBack} className="text-slate-500 hover:text-slate-900">
                                Back
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default GetStartedPage;
