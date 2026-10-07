import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { AlertCircle } from 'lucide-react';

const LoginFailurePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Login Failed</CardTitle>
          <CardDescription className="text-slate-500">We couldn't verify your credentials.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
            Please ensure you are using your official college email address (e.g., student@bitmesra.ac.in).
          </div>
          <Link to="/">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginFailurePage;
