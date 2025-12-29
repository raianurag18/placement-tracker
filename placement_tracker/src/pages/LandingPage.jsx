import React from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowRight, BarChart2, Users, BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-30 animate-pulse delay-1000"></div>
            </div>

            {/* Navbar Placeholder (Header handles this mostly, but here for structure) */}

            {/* Hero Section */}
            <main className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
                <div className="inline-block px-3 py-1 mb-6 text-sm font-semibold rounded-full bg-slate-800 text-purple-400 border border-slate-700">
                    🚀 The Ultimate Placement Tracker
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Your Gateway to <br /> Career Success
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10 leading-relaxed">
                    Track placement stats, read interview experiences, and prepare for your dream company with real-time insights from seniors.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/get-started">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-lg shadow-blue-500/20">
                            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Glassmorphism Stats Preview */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    {[
                        { icon: <BarChart2 className="h-8 w-8 text-blue-400" />, title: "Real-time Stats", desc: "Live dashboard of offers, packages, and top recruiters." },
                        { icon: <BookOpen className="h-8 w-8 text-purple-400" />, title: "Interview Archive", desc: "Access 500+ real interview experiences." },
                        { icon: <Users className="h-8 w-8 text-green-400" />, title: "Community Driven", desc: "Verified insights from placed seniors." }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="mb-4 bg-slate-800/50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Features Section */}
            <section className="py-24 bg-gray-900/50 relative">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Why Placerra?</h2>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            {[
                                "Comprehensive Company-wise Analysis",
                                "Branch-specific Placement Trends",
                                "Verified Highest & Average Packages",
                                "Seamless Mobile-first Experience"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    <span className="text-xl text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                            <div className="relative bg-slate-800 rounded-2xl p-4 border border-slate-700">
                                {/* Placeholder for a UI screenshot or graphic */}
                                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-slate-500">
                                    <BarChart2 className="h-24 w-24 opacity-20" />
                                    <span className="ml-2 py-2">Dashboard Preview</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
