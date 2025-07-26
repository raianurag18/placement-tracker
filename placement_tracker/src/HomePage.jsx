import React from 'react';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Briefcase, DollarSign, Users, BarChart, User, FileText } from 'lucide-react';

const HomePage = ({ user }) => {
  const [experiences, setExperiences] = useState([]);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalOffers: 0,
    highestPackage: 0,
    averagePackage: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/experiences", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error("Error fetching experiences:", err));

    fetch("http://localhost:5000/api/placements/stats", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  const displayStats = [
    { title: "Total Companies", value: stats.totalCompanies, icon: <Briefcase className="h-8 w-8 text-blue-500" />, link: "/companies" },
    { title: "Total Offers", value: stats.totalOffers, icon: <Users className="h-8 w-8 text-green-500" /> },
    { title: "Highest Package", value: `₹ ${stats.highestPackage} LPA`, icon: <DollarSign className="h-8 w-8 text-yellow-500" />, link: "/highest-package-branch" },
    { title: "Average Package", value: `₹ ${stats.averagePackage.toFixed(2)} LPA`, icon: <BarChart className="h-8 w-8 text-indigo-500" />, link: "/branch-stats" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome to the Placerra
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
            {displayStats.map((stat, index) => (
              <Link to={stat.link || '#'} key={index}>
                <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
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
        {user && (
          <section className="mb-12">
            <h2 className="text-3xl font-extrabold text-center mb-8">
              Student Zone
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2" /> My Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>View and update your profile information.</p>
                  <Button className="mt-4">Go to Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2" /> My Experiences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>See the interview experiences you've submitted.</p>
                  <Button className="mt-4">View My Submissions</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2" /> Placement Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Explore detailed placement statistics.</p>
                  <Link to="/stats"><Button className="mt-4">Explore Stats</Button></Link>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default HomePage;
