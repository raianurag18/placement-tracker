import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const LoginFailurePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Login Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">Please use your college mail (@bitmesra.ac.in) to log in.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginFailurePage;
