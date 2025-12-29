import React from 'react';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Briefcase, DollarSign, Users, BarChart, User, FileText } from 'lucide-react';

const StudentDashboard = ({ user }) => {
  const [experiences, setExperiences] = useState([]);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalOffers: 0,
    highestPackage: 0,
    averagePackage: 0,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/experiences`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error("Error fetching experiences:", err));

    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placements/stats`, { credentials: 'include' })
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
    <div className="min-h-screen text-foreground">
      {/* Hero Section */}
      <header className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 mb-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
            Welcome to the Placerra
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
            Your one-stop destination for placement statistics and interview experiences.
          </p>
        </div>
      </header>

      <main>
        {/* Placement Stats Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-white">
            Placement Overview - 2025
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayStats.map((stat, index) => (
              <Link to={stat.link || '#'} key={index}>
                <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-white/20 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-200">{stat.title}</CardTitle>
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
          <h2 className="text-3xl font-extrabold text-center mb-8 text-white">
            Recent Interview Experiences
          </h2>
          {experiences.length === 0 ? (
            <p className="text-center text-gray-400">No experiences submitted yet.</p>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {experiences.slice(0, 2).map((exp) => (
                <Card key={exp._id} className="bg-white/10 backdrop-blur-md border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>{exp.company} - <span className="font-semibold text-blue-300">{exp.role}</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mt-1">
                      By <span className="font-medium">{exp.name}</span> | Package: <span className="font-medium">{exp.package}</span>
                    </p>
                    <p className="text-gray-100 mt-4 whitespace-pre-wrap">{exp.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/experiences">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">View All Experiences</Button>
            </Link>
          </div>
        </section>

        {/* Student Reviews Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-white">
            What Our Seniors Say
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white">
              <CardContent className="pt-6">
                <p className="italic text-gray-300">"Start solving DSA early, and make sure your GitHub and resume are clean!"</p>
                <p className="mt-4 text-right font-medium text-blue-400">— Ayush, Placed at Amazon</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white">
              <CardContent className="pt-6">
                <p className="italic text-gray-300">"Don’t ignore soft skills. Communication helped me crack HR rounds easily."</p>
                <p className="mt-4 text-right font-medium text-blue-400">— Mehak, Placed at Microsoft</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white">
              <CardContent className="pt-6">
                <p className="italic text-gray-300">"Be consistent with CP. I gave 500+ Leetcode problems before placements!"</p>
                <p className="mt-4 text-right font-medium text-blue-400">— Rohan, Placed at Atlassian</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-lg bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span className="block text-white">Ready to dive in?</span>
              <span className="block text-blue-400">Share your interview experience today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link to="/submit">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
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

export default StudentDashboard;
