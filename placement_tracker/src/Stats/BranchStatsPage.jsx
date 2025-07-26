import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const BranchStatsPage = () => {
  const [branchStats, setBranchStats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/placements/stats/branch')
      .then((res) => res.json())
      .then((data) => setBranchStats(data))
      .catch((err) => console.error('Error fetching branch stats:', err));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-2xl">Placement Tracker</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          Branch-wise Average Package
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {branchStats.map((branch, index) => (
            <Link to={`/branch/${branch._id}`} key={index}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">{branch._id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-center">
                    ₹ {branch.avgPackage.toFixed(2)} LPA
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BranchStatsPage;
