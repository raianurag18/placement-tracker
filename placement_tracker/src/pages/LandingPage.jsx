import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { ArrowRight, BarChart2, Users, BookOpen, CheckCircle, GraduationCap, ShieldCheck, ArrowLeft, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import InstituteSearch from '../components/InstituteSearch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const LandingPage = () => {
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const navigate = useNavigate();

    // Check localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('selectedInstitute');
        if (saved) {
            setSelectedInstitute(JSON.parse(saved));
        }
    }, []);

    const handleInstituteSelect = (institute) => {
        setSelectedInstitute(institute);
        // Business Logic: We save the slug here because it is the URL identifier
        // for the tenant. Without it, we cannot build /c/:slug/login routes.
        localStorage.setItem('selectedInstitute', JSON.stringify({
            name: institute.name,
            city: institute.city,
            id: institute._id,
            slug: institute.slug  // ✅ Critical: needed to build tenant-specific routes
        }));
    };

    const clearInstitute = () => {
        setSelectedInstitute(null);
        localStorage.removeItem('selectedInstitute');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">

            {/* Background Gradients (Shared) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px] opacity-40"></div>
            </div>

            {/* --- STATE A: DEFAULT SEARCH HERO --- */}
            {!selectedInstitute ? (
                <div className="min-h-screen flex flex-col animate-in fade-in duration-700">
                    <header className="p-6 flex justify-between items-center container mx-auto">
                        <div className="flex items-center gap-2">
                            <Logo />
                        </div>
                        <div></div>
                    </header>

                    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
                        <div className="inline-block px-4 py-1.5 mb-8 text-sm font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                            🌐 The National Placement Network
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
                            Find Your <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Campus Ecosystem</span>
                        </h1>
                        <p className="text-xl text-slate-500 mb-12 max-w-2xl leading-relaxed">
                            Search for your institute to access exclusive placement stats, interview experiences, and live recruitment notices.
                        </p>

                        <div className="w-full max-w-xl mx-auto relative z-10">
                            <InstituteSearch onSelect={handleInstituteSelect} className="shadow-2xl shadow-blue-900/10 rounded-xl" />
                        </div>

                        {/* Social Proof Logos */}
                        <div className="mt-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Trusted By Top Institutes</p>
                            <div className="flex gap-12 justify-center items-center flex-wrap grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <img src="/logos/bit_mesra.png" alt="BIT Mesra" className="h-20 object-contain" title="BIT Mesra" />
                                <img src="/logos/iit_bombay.png" alt="IIT Bombay" className="h-20 object-contain" title="IIT Bombay" />
                                <img src="/logos/nit_trichy.png" alt="NIT Trichy" className="h-20 object-contain" title="NIT Trichy" />
                                <img src="/logos/dtu.png" alt="DTU" className="h-20 object-contain" title="Delhi Technological University" />
                            </div>
                        </div>
                    </main>
                </div>
            ) : (
                /* --- STATE B: PORTAL HERO (Bento Grid) --- */
                <div className="min-h-screen flex flex-col animate-in slide-in-from-bottom-10 duration-700">
                    {/* Portal Header */}
                    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={clearInstitute} className="text-slate-400 hover:text-slate-900">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <GraduationCap className="h-6 w-6 text-blue-600" />
                                        {selectedInstitute.name}
                                    </h1>
                                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Placement Portal</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* ✅ FIX: Use dynamic tenant slug instead of legacy /admin/login */}
                                <Link to={`/c/${selectedInstitute.slug}/admin/login`}>
                                    <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 hidden sm:flex">
                                        <ShieldCheck className="h-4 w-4 mr-2" /> Admin
                                    </Button>
                                </Link>
                                {/* ✅ FIX: Use dynamic tenant slug instead of legacy /login */}
                                <Link to={`/c/${selectedInstitute.slug}/login`}>
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20">
                                        Student Login <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </header>

                    <main className="container mx-auto px-6 py-12 flex-1">

                        {/* Welcome & Notices Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="text-4xl font-bold text-slate-900">
                                    Welcome back, <br />
                                    <span className="text-blue-600">Future Leader.</span>
                                </h2>
                                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                                    Access real-time placement insights, track your applications, and prepare for interviews withverified experiences from {selectedInstitute.name} seniors.
                                </p>
                                <div className="flex gap-4 pt-4">
                                    {/* ✅ FIX: Navigates to /c/iitbombay/login (or whichever college slug) */}
                                    <Link to={`/c/${selectedInstitute.slug}/login`}>
                                        <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 text-white hover:bg-slate-800">
                                            Access Dashboard
                                        </Button>
                                    </Link>
                                    {/* ✅ FIX: Navigates to /c/iitbombay/admin/login */}
                                    <Link to={`/c/${selectedInstitute.slug}/admin/login`}>
                                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg sm:hidden">
                                            Admin Portal
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Live Notice Board Card */}
                            <Card className="bg-white border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Bell className="h-5 w-5 text-blue-500 animate-pulse" /> Latest Notices
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                                        <span className="text-xs font-bold text-blue-600 block mb-1">TODAY</span>
                                        Google Interview Shortlist released. Check email.
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                                        <span className="text-xs font-bold text-slate-500 block mb-1">YESTERDAY</span>
                                        Pre-placement talk by Amazon scheduled for 10 AM.
                                    </div>
                                    <Button variant="link" className="p-0 h-auto text-blue-600 text-xs w-full justify-end">
                                        View All Notices &rarr;
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Bento Grid Stats - Consistent Design */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                            {/* Feature 1: Large Card */}
                            <Card className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-white/20"></div>
                                <CardHeader>
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                        <BarChart2 className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl">Placement Analytics</CardTitle>
                                    <CardDescription className="text-blue-100 text-lg">
                                        Real-time insights into branch-wise performance and package distribution.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="absolute bottom-6 right-6">
                                    <div className="text-5xl font-bold opacity-20">2026</div>
                                </CardContent>
                            </Card>

                            {/* Feature 2: Companies */}
                            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                <CardHeader>
                                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-slate-900">Dream Companies</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">50+</div>
                                    <p className="text-sm text-slate-500">Recruiters visiting this season.</p>
                                </CardContent>
                            </Card>

                            {/* Feature 3: Experiences */}
                            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                <CardHeader>
                                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-slate-900">Interview Archive</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">500+</div>
                                    <p className="text-sm text-slate-500">Real experiences shared.</p>
                                </CardContent>
                            </Card>

                            {/* Feature 4: Community */}
                            <Card className="lg:col-span-2 bg-slate-900 text-white border-none shadow-lg group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <CardHeader className="relative z-10 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Community Driven</CardTitle>
                                        <CardDescription className="text-slate-400"> Verified insights from your placed seniors.</CardDescription>
                                    </div>
                                    <Users className="h-8 w-8 text-slate-600 group-hover:text-white transition-colors" />
                                </CardHeader>
                            </Card>

                        </div>
                    </main>

                    <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-12 bg-white">
                        <p>© 2026 Placerra for {selectedInstitute.name}. All rights reserved.</p>
                    </footer>
                </div>
            )}
        </div>
    );
};

// Helper Icon
function Briefcase(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="6" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M2 10h20" /><path d="M2 14h20" /></svg>
    )
}

export default LandingPage;
