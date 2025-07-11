import React from 'react';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Briefcase, DollarSign, Users, BarChart } from 'lucide-react';

const HomePage = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/experiences")
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error("Error fetching experiences:", err));
  }, []);

  const stats = [
    { title: "Total Companies", value: "95+", icon: <Briefcase className="h-8 w-8 text-blue-500" /> },
    { title: "Total Offers", value: "300+", icon: <Users className="h-8 w-8 text-green-500" /> },
    { title: "Highest Package", value: "₹ 45 LPA", icon: <DollarSign className="h-8 w-8 text-yellow-500" /> },
    { title: "Average Package", value: "₹ 8.5 LPA", icon: <BarChart className="h-8 w-8 text-indigo-500" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-2xl">Placement Tracker</Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/"><Button variant="ghost">Home</Button></Link>
                <Link to="/stats"><Button variant="ghost">Stats</Button></Link>
                <Link to="/submit"><Button variant="ghost">Submit Experience</Button></Link>
                <Link to="/about"><Button variant="ghost">About</Button></Link>
                <Link to="/admin"><Button>Admin Login</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome to the Placement Tracker
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            Your one-stop destination for placement statistics and interview experiences.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Placement Stats Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-center mb-8">
            Placement Overview - 2024
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Interview Experiences Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-center mb-8">
            Interview Experiences
          </h2>
          {experiences.length === 0 ? (
            <p className="text-center text-muted-foreground">No experiences submitted yet.</p>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {experiences.map((exp) => (
                <Card key={exp._id}>
                  <CardHeader>
                    <CardTitle>{exp.company} - <span className="font-semibold">{exp.role}</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mt-1">
                      By <span className="font-medium">{exp.name}</span> | Package: <span className="font-medium">{exp.package}</span>
                    </p>
                    <p className="text-foreground mt-4 whitespace-pre-wrap">{exp.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Student Reviews Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-center mb-8">
            What Our Seniors Say
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <p className="italic">"Start solving DSA early, and make sure your GitHub and resume are clean!"</p>
                <p className="mt-4 text-right font-medium text-primary">— Ayush, Placed at Amazon</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic">"Don’t ignore soft skills. Communication helped me crack HR rounds easily."</p>
                <p className="mt-4 text-right font-medium text-primary">— Mehak, Placed at Microsoft</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic">"Be consistent with CP. I gave 500+ Leetcode problems before placements!"</p>
                <p className="mt-4 text-right font-medium text-primary">— Rohan, Placed at Atlassian</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card border rounded-lg">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block text-primary">Share your interview experience today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link to="/submit">
                  <Button size="lg">
                    Get started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
