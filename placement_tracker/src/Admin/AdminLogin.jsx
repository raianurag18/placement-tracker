import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowLeft, Loader2, LayoutDashboard } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Read collegeSlug from URL: /c/bitmesra/admin/login → collegeSlug = 'bitmesra'
  // If accessing legacy /admin/login, collegeSlug will be undefined
  const { collegeSlug } = useParams();

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') === 'true' && collegeSlug) {
      navigate(`/c/${collegeSlug}/admin/dashboard`);
    }
  }, [navigate, collegeSlug]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

      // Business Logic: Use tenant-aware endpoint for login.
      // E.g. /api/c/bitmesra/admin/login. It ensures the admin belongs to THIS college.
      const endpoint = `${apiUrl}/api/c/${collegeSlug}/admin/login`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('admin_token', data.token);
        // Store collegeSlug for use in subsequent admin API calls
        if (collegeSlug) {
          localStorage.setItem('admin_college_slug', collegeSlug);
        }

        // Navigate to college-specific admin dashboard
        navigate(`/c/${collegeSlug}/admin/dashboard`);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative font-sans">
      {/* Left Column: Admin Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-center p-16 text-white overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[100px] opacity-20"></div>

        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="bg-purple-600/20 p-2 rounded-lg border border-purple-500/30">
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Placerra Admin</span>
          </div>

          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Manage Campus <br />
            <span className="text-purple-400">Placements Efficiently.</span>
          </h1>

          <p className="text-slate-400 text-lg mb-12 max-w-lg">
            Streamline recruitment drives, track student progress, and moderate interview experiences from a single dashboard.
          </p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-500">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
        </div>

        <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
          <CardHeader className="space-y-1">
            <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4 border border-purple-100">
              <LayoutDashboard className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-slate-900">Admin Portal</CardTitle>
            <CardDescription className="text-center text-slate-500">
              Secure login for Placement Cell members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@college.edu"
                    className="pl-10 bg-white border-slate-200 text-slate-900 focus:border-purple-500 focus:ring-purple-500/20"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
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
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white border-slate-200 text-slate-900 focus:border-purple-500 focus:ring-purple-500/20"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md h-11" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In to Dashboard'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center">
            <Link to={`/c/${collegeSlug}/login`} className="text-sm text-purple-600 hover:text-purple-700 hover:underline font-medium">
              Not an Admin? Go to Student Login
            </Link>
            <Link to="/" className="text-sm text-slate-500 hover:text-purple-600 hover:underline">
              Return to Placement Portal
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
