import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Bar } from 'react-chartjs-2';
import { ArrowLeft } from 'lucide-react';
import { Button } from "../components/ui/button";
import { getHighestPackageBranch } from '../api/placementApi';
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
  const { collegeSlug } = useParams();
  const [branchStats, setBranchStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHighestPackageBranch(collegeSlug);
        setBranchStats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching branch stats:', err.message);
      }
    };
    if (collegeSlug) fetchData();
  }, [collegeSlug]);

  const chartData = useMemo(() => {
    return {
      labels: branchStats.map((stat) => stat._id),
      datasets: [
        {
          label: 'Highest Package (LPA)',
          data: branchStats.map((stat) => stat.maxPackage),
          backgroundColor: 'rgba(37, 99, 235, 0.8)', // blue-600
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 50,
        },
      ],
    };
  }, [branchStats]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#475569', // slate-600
          font: { family: 'Inter, sans-serif' }
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Package (LPA)',
          color: '#64748b' // slate-500
        },
        ticks: { color: '#64748b', font: { family: 'Inter, sans-serif' } }, // slate-500
        grid: { color: 'rgba(226, 232, 240, 0.6)' } // slate-200
      },
      x: {
        ticks: { color: '#64748b', font: { family: 'Inter, sans-serif' } },
        grid: { display: false }
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4 mb-8">
        <Link to="../stats">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Stats
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Branch-wise Highest Package
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          Comparing the top offers across different engineering disciplines.
        </p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Highest Package Distribution</CardTitle>
          <CardDescription>Visual representation of peak placement performance by branch.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <Bar data={chartData} options={chartOptions} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {branchStats.map((branch, index) => (
          <Link to={`branch/${branch._id}`} key={index}>
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-400 group cursor-pointer">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
                <CardTitle className="text-center text-lg font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                  {branch._id}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-center text-sm text-slate-500 uppercase tracking-wide font-medium">Highest Package</p>
                <div className="text-3xl font-bold text-center text-slate-900 mt-1">
                  ₹ {branch.maxPackage} <span className="text-base font-normal text-slate-500">LPA</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HighestPackageBranchPage;
