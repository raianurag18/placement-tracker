import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { getAllPlacements } from '../api/placementApi';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

const PlacementStats = () => {
  const { collegeSlug } = useParams();
  const [placements, setPlacements] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [lpaFilter, setLpaFilter] = useState('');
  const [showOffers, setShowOffers] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPlacements(collegeSlug);
        setPlacements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching placements:', err.message);
      }
    };
    if (collegeSlug) fetchData();
  }, [collegeSlug]);

  const years = useMemo(() => [...new Set(placements.map(p => p.year))].sort((a, b) => b - a), [placements]);
  const branches = useMemo(() => [...new Set(placements.map(p => p.branch))].sort(), [placements]);
  const companies = useMemo(() => [...new Set(placements.map(p => p.companyName))].sort(), [placements]);
  const roles = useMemo(() => [...new Set(placements.map(p => p.role))].sort(), [placements]);
  const lpaRanges = ['< 10', '10-20', '20-30', '> 30'];

  // Filter logic
  const filtered = useMemo(() => {
    return placements.filter(p => {
      if (yearFilter && p.year !== +yearFilter) return false;
      if (branchFilter && p.branch !== branchFilter) return false;
      if (companyFilter && p.companyName !== companyFilter) return false;
      if (roleFilter && p.role !== roleFilter) return false;

      if (lpaFilter) {
        const pkg = p.package;
        if (lpaFilter === '< 10' && pkg >= 10) return false;
        if (lpaFilter === '10-20' && (pkg < 10 || pkg > 20)) return false;
        if (lpaFilter === '20-30' && (pkg < 20 || pkg > 30)) return false;
        if (lpaFilter === '> 30' && pkg <= 30) return false;
      }

      return true;
    });
  }, [placements, yearFilter, branchFilter, companyFilter, lpaFilter, roleFilter]);

  const stats = useMemo(() => {
    if (filtered.length === 0) {
      return { highest: 0, average: 0, median: 0, total: 0 };
    }
    const pkgs = filtered.map(p => p.package).sort((a, b) => a - b);
    const total = pkgs.length;
    const sum = pkgs.reduce((a, b) => a + b, 0);
    const avg = (sum / total).toFixed(2);
    const highest = pkgs[pkgs.length - 1];
    const mid = Math.floor(total / 2);
    const median = total % 2 === 1 ? pkgs[mid] : ((pkgs[mid - 1] + pkgs[mid]) / 2).toFixed(2);
    return { highest, average: avg, median, total };
  }, [filtered]);

  // Chart data
  const yearData = useMemo(() => {
    const data = {};
    filtered.forEach(offer => {
      data[offer.year] = (data[offer.year] || 0) + 1;
    });
    return {
      labels: Object.keys(data).sort((a, b) => a - b),
      datasets: [{
        label: 'Offers per Year',
        data: Object.values(data),
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue-500
      }],
    };
  }, [filtered]);

  const branchData = useMemo(() => {
    const data = {};
    filtered.forEach(offer => {
      data[offer.branch] = (data[offer.branch] || 0) + 1;
    });
    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ['#4bc0c0', '#36a2eb', '#9966ff', '#ff6384', '#ff9f40', '#ffcd56'],
      }],
    };
  }, [filtered]);

  const roleData = useMemo(() => {
    const data = {};
    filtered.forEach(offer => {
      data[offer.role] = (data[offer.role] || 0) + 1;
    });
    const sortedRoles = Object.entries(data).sort(([, a], [, b]) => b - a).slice(0, 10);
    return {
      labels: sortedRoles.map(([label]) => label),
      datasets: [{
        label: 'Top 10 Roles',
        data: sortedRoles.map(([, value]) => value),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }],
    };
  }, [filtered]);

  // Chart Options for Light Mode
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#1e293b' } // Slate-800
      }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } }, // Slate-500 ticks, Slate-200 grid
      y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#1e293b' }
      }
    }
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-center">📊 Placement Statistics</h1>
        <p className="mt-2 text-lg text-slate-500 text-center">Analyze placement trends and data.</p>
      </div>

      {/* Filters */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Select onValueChange={(value) => setYearFilter(value === 'all' ? '' : value)} defaultValue="">
            <SelectTrigger className="bg-white border-slate-200 text-slate-700"><SelectValue placeholder="All Years" /></SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-700">
              <SelectItem value="all">All Years</SelectItem>
              {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setBranchFilter(value === 'all' ? '' : value)} defaultValue="">
            <SelectTrigger className="bg-white border-slate-200 text-slate-700"><SelectValue placeholder="All Branches" /></SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-700">
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setLpaFilter(value === 'all' ? '' : value)} defaultValue="">
            <SelectTrigger className="bg-white border-slate-200 text-slate-700"><SelectValue placeholder="All Packages" /></SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-700">
              <SelectItem value="all">All Packages</SelectItem>
              {lpaRanges.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setCompanyFilter(value === 'all' ? '' : value)} defaultValue="">
            <SelectTrigger className="bg-white border-slate-200 text-slate-700"><SelectValue placeholder="All Companies" /></SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-700">
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setRoleFilter(value === 'all' ? '' : value)} defaultValue="">
            <SelectTrigger className="bg-white border-slate-200 text-slate-700"><SelectValue placeholder="All Roles" /></SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-700">
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-12">
        <Card className="bg-white border-slate-200 shadow-sm transition-all hover:shadow-md">
          <CardHeader><CardTitle className="text-slate-500 text-sm font-medium uppercase">Total Records</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-slate-900">{stats.total}</p></CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm transition-all hover:shadow-md">
          <CardHeader><CardTitle className="text-slate-500 text-sm font-medium uppercase">Highest Package</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-green-600">₹{stats.highest} LPA</p></CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm transition-all hover:shadow-md">
          <CardHeader><CardTitle className="text-slate-500 text-sm font-medium uppercase">Average Package</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-blue-600">₹{stats.average} LPA</p></CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm transition-all hover:shadow-md">
          <CardHeader><CardTitle className="text-slate-500 text-sm font-medium uppercase">Median Package</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-purple-600">₹{stats.median} LPA</p></CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 mb-12">
        <Card className="lg:col-span-1 bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-center text-slate-800">Year-wise Offers</CardTitle></CardHeader>
          <CardContent><Bar data={yearData} options={chartOptions} /></CardContent>
        </Card>
        <Card className="lg:col-span-1 bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-center text-slate-800">Branch-wise Distribution</CardTitle></CardHeader>
          <CardContent className="max-h-80 flex justify-center"><Pie data={branchData} options={pieOptions} /></CardContent>
        </Card>
      </div>
      <div className="mb-12">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-center text-slate-800">Top 10 Job Roles</CardTitle></CardHeader>
          <CardContent><Bar data={roleData} options={{ ...chartOptions, indexAxis: 'y' }} /></CardContent>
        </Card>
      </div>

      {/* Offer Details */}
      <div>
        <Button onClick={() => setShowOffers(!showOffers)} variant="outline" className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50">
          {showOffers ? '🔼 Hide Offer Details' : '🔽 View Offer Details'}
        </Button>

        {showOffers && (
          <Card className="mt-6 bg-white border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-slate-50">
                    <TableHead className="text-slate-700 font-semibold">Company</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Role</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Branch</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Year</TableHead>
                    <TableHead className="text-slate-700 font-semibold">CTC (LPA)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500 py-8">No offers match your current filters.</TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((offer, index) => (
                      <TableRow key={index} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-900">{offer.companyName}</TableCell>
                        <TableCell className="text-slate-600">{offer.role}</TableCell>
                        <TableCell className="text-slate-600">{offer.branch}</TableCell>
                        <TableCell className="text-slate-600">{offer.year}</TableCell>
                        <TableCell className="text-blue-600 font-semibold">₹{offer.package}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlacementStats;
