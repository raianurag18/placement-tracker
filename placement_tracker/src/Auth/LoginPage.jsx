import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Login Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">You need to be logged in to view this page.</p>
          <a href="http://localhost:5000/auth/google">
            <Button>Login with Google</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
