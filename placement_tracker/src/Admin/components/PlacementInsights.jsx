import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';
import { Briefcase, TrendingUp, Users, DollarSign, Award } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

const PlacementInsights = () => {
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placements/all`)
      .then((res) => res.json())
      .then((data) => setPlacements(data))
      .catch((err) => console.error('Error fetching placements:', err));
  }, []);

  const stats = useMemo(() => {
    if (placements.length === 0) {
      return { highest: 0, average: 0, median: 0, total: 0 };
    }
    const pkgs = placements.map(p => p.package).sort((a, b) => a - b);
    const total = pkgs.length;
    const sum = pkgs.reduce((a, b) => a + b, 0);
    const avg = (sum / total).toFixed(2);
    const highest = pkgs[pkgs.length - 1];
    const mid = Math.floor(total / 2);
    const median = total % 2 === 1 ? pkgs[mid] : ((pkgs[mid - 1] + pkgs[mid]) / 2).toFixed(2);
    return { highest, average: avg, median, total };
  }, [placements]);

  const branchData = useMemo(() => {
    const data = {};
    placements.forEach(offer => {
      data[offer.branch] = (data[offer.branch] || 0) + 1;
    });
    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ['#8b5cf6', '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'], // Purple/Blue theme
        borderWidth: 0,
      }],
    };
  }, [placements]);

  const roleData = useMemo(() => {
    const data = {};
    placements.forEach(offer => {
      data[offer.role] = (data[offer.role] || 0) + 1;
    });
    const sortedRoles = Object.entries(data).sort(([, a], [, b]) => b - a).slice(0, 5);
    return {
      labels: sortedRoles.map(([label]) => label),
      datasets: [{
        label: 'Top 5 Roles',
        data: sortedRoles.map(([, value]) => value),
        backgroundColor: 'rgba(124, 58, 237, 0.8)', // Violet-600
        borderRadius: 4,
      }],
    };
  }, [placements]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#475569', // slate-600
          font: { family: 'Inter, sans-serif' }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b' }, // slate-500
        grid: { display: false }
      },
      y: {
        ticks: { color: '#64748b' },
        grid: { color: '#e2e8f0' } // slate-200
      }
    }
  };


  const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Stats Overview */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Offers"
          value={stats.total}
          icon={Briefcase}
          colorClass="bg-blue-500 text-blue-600"
          subtitle="Confirmed placements so far"
        />
        <StatCard
          title="Highest Package"
          value={`₹${stats.highest} LPA`}
          icon={Award}
          colorClass="bg-purple-500 text-purple-600"
          subtitle="Top offer of the season"
        />
        <StatCard
          title="Average Package"
          value={`₹${stats.average} LPA`}
          icon={TrendingUp}
          colorClass="bg-green-500 text-green-600"
          subtitle="Season average"
        />
        <StatCard
          title="Median Package"
          value={`₹${stats.median} LPA`}
          icon={DollarSign}
          colorClass="bg-amber-500 text-amber-600"
          subtitle="Middle value of offers"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Branch Distribution (Pie Chart) */}
        <Card className="col-span-3 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Branch Distribution</CardTitle>
            <CardDescription>Composition of offers by engineering branch.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex justify-center items-center">
            <Pie
              data={branchData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { color: '#475569' } }
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Role Distribution (Bar Chart) */}
        <Card className="col-span-4 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Top Job Roles</CardTitle>
            <CardDescription>Most frequently offered positions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar data={roleData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlacementInsights;
