import { Button } from "../components/ui/button";
import { ArrowRight, BarChart2, Users, BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative font-sans">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px] opacity-40 animate-pulse delay-1000"></div>
            </div>

            {/* Navbar Placeholder */}
            <header className="p-6 flex justify-between items-center container mx-auto">
                <Logo />
                <div className="space-x-4">
                    <Link to="/login">
                        <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Login</Button>
                    </Link>
                    <Link to="/get-started">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-md">Get Started</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
                <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    🚀 The Ultimate Placement Tracker
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
                    Your Gateway to <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Career Success</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mb-10 leading-relaxed">
                    Track placement stats, read interview experiences, and prepare for your dream company with real-time insights from seniors.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/get-started">
                        <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-6 text-lg shadow-xl shadow-slate-900/20">
                            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Feature Cards */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                    {[
                        { icon: <BarChart2 className="h-8 w-8 text-blue-600" />, title: "Real-time Stats", desc: "Live dashboard of offers, packages, and top recruiters." },
                        { icon: <BookOpen className="h-8 w-8 text-purple-600" />, title: "Interview Archive", desc: "Access 500+ real interview experiences." },
                        { icon: <Users className="h-8 w-8 text-green-600" />, title: "Community Driven", desc: "Verified insights from placed seniors." }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="mb-6 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto border border-blue-100">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Features Section */}
            <section className="py-24 bg-white border-t border-slate-200">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-slate-900">Why Placerra?</h2>
                    <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <div className="space-y-8">
                            {[
                                "Comprehensive Company-wise Analysis",
                                "Branch-specific Placement Trends",
                                "Verified Highest & Average Packages",
                                "Seamless Mobile-first Experience"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    <span className="text-xl text-slate-600">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative bg-white rounded-2xl p-4 border border-slate-100 shadow-xl">
                                {/* Placeholder for Dashboard Preview */}
                                <div className="aspect-video bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                                    <div className="text-center">
                                        <BarChart2 className="h-16 w-16 mx-auto opacity-50 mb-2" />
                                        <span className="text-sm font-medium">Dashboard Preview</span>
                                    </div>
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
