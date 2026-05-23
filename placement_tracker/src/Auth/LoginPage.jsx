import React, { useEffect, useState } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, BarChart3, ShieldCheck, Mail, Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const LoginPage = () => {
  const [institute, setInstitute] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const savedInstitute = localStorage.getItem('selectedInstitute');
    if (savedInstitute) {
      setInstitute(JSON.parse(savedInstitute));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!institute) {
      setError("No institute selected. Please go back to Get Started.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          instituteId: institute.id
        })
      });

      const data = await res.json();

      if (res.ok) {
        login(data);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative font-sans">

      {/* Left Column: Branding (Visible on large screens) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-center p-16 text-white overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full blur-[100px] opacity-20"></div>

        <div className="relative z-10">
          <div className="mb-8 font-bold text-2xl tracking-tight flex items-center gap-2">
            <Logo variant="light" />
          </div>

          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Unlock Your Career <br />
            <span className="text-blue-400">Potential Today.</span>
          </h1>

          <p className="text-slate-400 text-lg mb-12 max-w-lg">
            The ultimate platform for campus placements. Track stats, share experiences, and get hired by top companies.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl"><BarChart3 className="text-blue-400 h-6 w-6" /></div>
              <div>
                <h4 className="font-semibold text-white">Real-time Analytics</h4>
                <p className="text-sm text-slate-400">Track placement trends and packages.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl"><ShieldCheck className="text-purple-400 h-6 w-6" /></div>
              <div>
                <h4 className="font-semibold text-white">Verified Experiences</h4>
                <p className="text-sm text-slate-400">Read genuine interview stories.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Placerra</h2>
          </div>

          <Card className="w-full bg-white border-slate-200 shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-6">
                {institute ? (
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                    <Building2 className="h-10 w-10 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                    <GraduationCap className="h-10 w-10 text-slate-400" />
                  </div>
                )}
              </div>

              <CardTitle className="text-2xl font-bold text-center text-slate-900">
                {institute ? institute.name : "Student Login"}
              </CardTitle>

              <CardDescription className="text-center text-slate-500">
                {institute ? institute.city : "Welcome back! Please login to continue."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@college.edu"
                      className="pl-10 bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-11">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {!institute && (
                <div className="text-sm text-center text-slate-500">
                  Not your college? <Link to="/get-started" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">Find your workspace</Link>
                </div>
              )}

              <div className="text-center space-y-2">
                <Link to="/admin/login" className="block text-sm text-purple-600 hover:text-purple-700 hover:underline font-medium">
                  Placement Cell Member? Admin Login
                </Link>

                <Link to="/" className="block text-sm text-slate-500 hover:text-blue-600 hover:underline">
                  Return to Placement Portal
                </Link>
              </div>

              <div className="text-xs text-center text-slate-400">
                Contact your placement cell for credentials.
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
