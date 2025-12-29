import React, { useEffect, useState } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, BarChart3, ShieldCheck, Globe, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [institute, setInstitute] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        // Direct Entry: Update global state manually and navigate
        // Assuming data.user is what we need based on standard behavior, 
        // or passing the whole data object if it returns the user directly.
        // We'll pass 'data' if it's the user object, or 'data.user' if nested.
        // Based on typical passport responses, let's try data.user first, fallback to data
        // Pass the full data object (containing user and token) to login context
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
    <div className="min-h-screen bg-[#0f172a] text-white flex relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      {/* Left Column: Branding & Features (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center p-16 relative z-10">
        <div className="mb-8">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Placerra
          </Link>
        </div>

        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Unlock Your Career <br />
          <span className="text-blue-400">Potential Today.</span>
        </h1>

        <p className="text-gray-400 text-lg mb-12 max-w-lg">
          The ultimate platform for campus placements. Track stats, share experiences, and get hired by top companies.
        </p>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg"><BarChart3 className="text-blue-400 h-6 w-6" /></div>
            <div>
              <h4 className="font-semibold text-gray-200">Real-time Analytics</h4>
              <p className="text-sm text-gray-500">Track placement trends and packages.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-lg"><ShieldCheck className="text-purple-400 h-6 w-6" /></div>
            <div>
              <h4 className="font-semibold text-gray-200">Verified Experiences</h4>
              <p className="text-sm text-gray-500">Read genuine interview stories.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 z-10">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              {institute ? (
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <Building2 className="h-8 w-8 text-blue-400" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center border border-white/10">
                  <GraduationCap className="h-8 w-8 text-gray-300" />
                </div>
              )}
            </div>

            <CardTitle className="text-2xl font-bold text-center text-white">
              {institute ? institute.name : "Student Login"}
            </CardTitle>

            <CardDescription className="text-center text-gray-400">
              {institute ? institute.city : "Welcome back! Please login to continue."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@college.edu"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-11">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {!institute && (
              <div className="text-sm text-center text-gray-400">
                Not your college? <Link to="/get-started" className="text-blue-400 hover:text-blue-300 hover:underline">Find your workspace</Link>
              </div>
            )}

            <div className="text-xs text-center text-gray-600">
              Contact your placement cell for credentials.
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Mobile-only branding footer */}
      <div className="absolute bottom-4 left-0 w-full text-center lg:hidden">
        <p className="text-gray-600 text-xs">© 2024 Placerra</p>
      </div>
    </div>
  );
};

export default LoginPage;
