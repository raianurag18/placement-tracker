import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          About Placerra
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Placerra is a dedicated platform for students to share and explore interview experiences and placement statistics. Our mission is to provide a transparent and supportive community where students can learn from each other's experiences and make informed decisions about their careers.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutPage;
