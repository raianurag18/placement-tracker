import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Briefcase, DollarSign, Users, BarChart, TrendingUp, Calendar, ArrowRight, User } from 'lucide-react';

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

  const StatCard = ({ title, value, icon: Icon, color, link, colSpan = "col-span-1" }) => (
    <Link to={link || '#'} className={`${colSpan} block group`}>
      <div className="h-full bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
          <Icon className="w-24 h-24 -mr-8 -mt-8" />
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className={`p-2 w-fit rounded-lg mb-4 ${color.replace('text-', 'bg-').replace('500', '100')}`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-900">{value}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-slate-500 mt-1">Here is what's happening in your placement journey today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/resume/preview">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">View Resume</Button>
          </Link>
          <Link to="/jobs">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">Browse Jobs</Button>
          </Link>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Highest Package - Hero Stat */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-green-600 font-medium text-sm">Top Performance</span>
            </div>
            <h3 className="text-slate-500 font-medium">Highest Package Record</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-slate-900 tracking-tight">₹ {stats.highestPackage}</span>
              <span className="text-xl text-slate-400 font-medium">LPA</span>
            </div>
            <Link to="/highest-package-branch" className="mt-6 inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <StatCard
          title="Total Offers"
          value={stats.totalOffers}
          icon={Users}
          color="text-purple-500"
          link="/stats"
        />

        <StatCard
          title="Active Companies"
          value={stats.totalCompanies}
          icon={Briefcase}
          color="text-blue-500"
          link="/companies"
        />
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Average Package & Chart Placeholder */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-2 w-fit rounded-lg mb-4 bg-indigo-100">
              <BarChart className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Average Package</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-slate-900">₹ {stats.averagePackage.toFixed(2)}</span>
              <span className="text-sm text-slate-400 ml-1">LPA</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">Consistent growth over last 3 years.</p>
          </div>
        </div>

        {/* Quick Actions / Notices */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Interview Experiences</h3>
            <Link to="/experiences" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
          </div>
          <div className="p-6">
            {experiences.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No experiences yet. Be the first!</div>
            ) : (
              <div className="space-y-4">
                {experiences.slice(0, 3).map((exp, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                      {exp.company?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{exp.company}</h4>
                      <p className="text-sm text-slate-500">{exp.role} • <span className="text-green-600 font-medium">{exp.package}</span></p>
                    </div>
                    <div className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date().toLocaleDateString()} {/* Placeholder for date */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Call to Action */}
      <div className="bg-slate-900 rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to help your juniors?</h2>
          <p className="text-slate-300 mb-8 text-lg">Share your interview journey. Your insights can help someone land their dream job.</p>
          <Link to="/submit">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">Share Experience</Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;
