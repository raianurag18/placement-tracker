import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';

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
        backgroundColor: ['#4bc0c0', '#36a2eb', '#9966ff', '#ff6384', '#ff9f40', '#ffcd56'],
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
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }],
    };
  }, [placements]);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white">
        <CardHeader><CardTitle className="text-gray-200">Total Offers</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold text-white">{stats.total}</p></CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white">
        <CardHeader><CardTitle className="text-gray-200">Highest Package</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold text-white">₹{stats.highest} LPA</p></CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white">
        <CardHeader><CardTitle className="text-gray-200">Average Package</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold text-white">₹{stats.average} LPA</p></CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white">
        <CardHeader><CardTitle className="text-gray-200">Median Package</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold text-white">₹{stats.median} LPA</p></CardContent>
      </Card>
      <Card className="col-span-1 sm:col-span-2 bg-white/10 backdrop-blur-md border-white/10 text-white">
        <CardHeader><CardTitle className="text-center text-gray-200">Branch-wise Distribution</CardTitle></CardHeader>
        <CardContent className="h-64 flex justify-center"><Pie data={branchData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} /></CardContent>
      </Card>
      <Card className="col-span-1 sm:col-span-2 bg-white/10 backdrop-blur-md border-white/10 text-white">
        <CardHeader><CardTitle className="text-center text-gray-200">Top 5 Job Roles</CardTitle></CardHeader>
        <CardContent><Bar data={roleData} options={{ responsive: true, plugins: { legend: { labels: { color: 'white' } } }, scales: { x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } }, y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } } } }} /></CardContent>
      </Card>
    </div>
  );
};

export default PlacementInsights;
