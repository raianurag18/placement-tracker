import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, Briefcase, Loader2, Search, Check } from 'lucide-react';

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

        // Save to local storage
        localStorage.setItem('selectedInstitute', JSON.stringify({
            name: selectedInstitute.name,
            city: selectedInstitute.city,
            id: selectedInstitute._id
        }));
        handleNext();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="absolute top-4 left-4">
                <Button asChild variant="link" className="text-gray-300 hover:text-white">
                    <Link to="/">
                        ← Back to Home
                    </Link>
                </Button>
            </div>

            <div className="w-full max-w-md">
                {/* Progress Indicator */}
                <div className="mb-8 flex justify-between items-center px-4">
                    <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-700'} mr-2 transition-colors duration-300`}></div>
                    <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'} mr-2 transition-colors duration-300`}></div>
                    <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-gray-700'} transition-colors duration-300`}></div>
                </div>

                <Card className="w-full shadow-2xl bg-white/10 backdrop-blur-md border-white/10 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">
                            {step === 1 && "Find Your Institute"}
                            {step === 2 && "Select Your Role"}
                            {step === 3 && "Login"}
                        </CardTitle>
                        <CardDescription className="text-center text-gray-300">
                            {step === 1 && "Search for your college to proceed."}
                            {step === 2 && "Are you a Student or Placement Admin?"}
                            {step === 3 && "Access your dashboard."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 1 && (
                            <form onSubmit={handleInstituteSubmit} className="space-y-4 relative">
                                <div className="space-y-2">
                                    <Label htmlFor="search" className="text-gray-300">Search Institute</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="search"
                                            placeholder="Type to search (e.g. BIT, IIT)..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setSelectedInstitute(null); // Clear selection on type
                                            }}
                                            className="bg-white/5 border-white/10 text-white pl-10 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                                            autoComplete="off"
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-3">
                                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    {suggestions.length > 0 && !selectedInstitute && (
                                        <div className="absolute w-full z-10 bg-gray-800 border border-gray-700 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                                            {suggestions.map((inst) => (
                                                <div
                                                    key={inst._id}
                                                    className="p-3 hover:bg-gray-700 cursor-pointer flex justify-between items-center transition-colors"
                                                    onClick={() => handleInstituteSelect(inst)}
                                                >
                                                    <div>
                                                        <div className="font-medium text-white">{inst.name}</div>
                                                        <div className="text-xs text-gray-400">{inst.city}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedInstitute && (
                                        <div className="mt-2 p-3 bg-green-500/20 border border-green-500/30 rounded-md flex items-center text-green-300 text-sm">
                                            <Check className="h-4 w-4 mr-2" />
                                            Selected: {selectedInstitute.name} ({selectedInstitute.city})
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={!selectedInstitute}
                                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next: Select Role
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="grid gap-4">
                                <div
                                    className={`cursor-pointer border-2 rounded-lg p-4 flex items-center space-x-4 transition-all ${formData.role === 'student' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 hover:border-blue-400 hover:bg-white/5'}`}
                                    onClick={() => handleRoleSelect('student')}
                                >
                                    <div className="bg-blue-900/50 p-3 rounded-full">
                                        <GraduationCap className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Student</h3>
                                        <p className="text-sm text-gray-400">View stats & submit experiences</p>
                                    </div>
                                </div>

                                <div
                                    className={`cursor-pointer border-2 rounded-lg p-4 flex items-center space-x-4 transition-all ${formData.role === 'admin' ? 'border-purple-500 bg-purple-500/20' : 'border-gray-700 hover:border-purple-400 hover:bg-white/5'}`}
                                    onClick={() => handleRoleSelect('admin')}
                                >
                                    <div className="bg-purple-900/50 p-3 rounded-full">
                                        <Briefcase className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Placement Cell</h3>
                                        <p className="text-sm text-gray-400">Manage records & approvals</p>
                                    </div>
                                </div>
                                <Button
                                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed border-0"
                                    disabled={!formData.role}
                                    onClick={handleNext}
                                >
                                    Continue
                                </Button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center space-y-6 py-4">
                                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500/30 animate-in zoom-in-50 duration-300">
                                    <Building2 className="h-8 w-8 text-green-400" />
                                </div>
                                <div className="animate-in slide-in-from-bottom-5 duration-500">
                                    <h3 className="text-xl font-bold text-white">{selectedInstitute?.name}</h3>
                                    <p className="text-gray-400">{selectedInstitute?.city}</p>
                                </div>

                                {formData.role === 'student' ? (
                                    <div className="space-y-4 animate-in slide-in-from-bottom-10 duration-700">
                                        <p className="text-sm text-gray-300">Sign in with your college email to access the student portal.</p>
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg hover:shadow-blue-500/25 transition-all"
                                            size="lg"
                                            onClick={() => navigate('/login')}
                                        >
                                            Go to Student Login
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in slide-in-from-bottom-10 duration-700">
                                        <p className="text-sm text-gray-300">Access the administrative dashboard.</p>
                                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all" size="lg" onClick={() => navigate('/admin/login')}>
                                            Go to Admin Login
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                    {step > 1 && (
                        <CardFooter className="flex justify-start">
                            <Button variant="ghost" size="sm" onClick={handleBack} className="text-gray-400 hover:text-white hover:bg-white/10">
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
