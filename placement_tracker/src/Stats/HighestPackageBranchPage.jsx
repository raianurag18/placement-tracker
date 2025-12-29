import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HighestPackageBranchPage = () => {
  const [branchStats, setBranchStats] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placements/stats/branch/highest`)
      .then((res) => res.json())
      .then((data) => setBranchStats(data))
      .catch((err) => console.error('Error fetching branch stats:', err));
  }, []);

  const chartData = useMemo(() => {
    return {
      labels: branchStats.map((stat) => stat._id),
      datasets: [
        {
          label: 'Highest Package (LPA)',
          data: branchStats.map((stat) => stat.maxPackage),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [branchStats]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Highest Package per Branch',
        color: 'white'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Package (LPA)',
          color: 'white'
        },
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-2xl">Placement Tracker</Link>
            </div>
          </div>
        </div>
      </nav> */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          Branch-wise Highest Package
        </h1>

        <div className="mb-12">
          <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white">
            <CardContent className="p-6">
              <Bar data={chartData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {branchStats.map((branch, index) => (
            <Link to={`/branch/${branch._id}`} key={index}>
              <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white hover:bg-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-center">{branch._id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-center">
                    ₹ {branch.maxPackage} LPA
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

export default HighestPackageBranchPage;
