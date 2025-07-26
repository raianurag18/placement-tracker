import React, { useState, useMemo, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

const PlacementStats = () => {
  const [placements, setPlacements] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [lpaFilter, setLpaFilter] = useState('');
  const [showOffers, setShowOffers] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/placements/all')
      .then((res) => res.json())
      .then((data) => setPlacements(data))
      .catch((err) => console.error('Error fetching placements:', err));
  }, []);

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
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
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
    const sortedRoles = Object.entries(data).sort(([,a],[,b]) => b-a).slice(0, 10);
    return {
        labels: sortedRoles.map(([label]) => label),
        datasets: [{
            label: 'Top 10 Roles',
            data: sortedRoles.map(([,value]) => value),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }],
    };
  }, [filtered]);


  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">📊 Placement Statistics</h2>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select onValueChange={(value) => setYearFilter(value === 'all' ? '' : value)} defaultValue="">
              <SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setBranchFilter(value === 'all' ? '' : value)} defaultValue="">
              <SelectTrigger><SelectValue placeholder="All Branches" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setLpaFilter(value === 'all' ? '' : value)} defaultValue="">
              <SelectTrigger><SelectValue placeholder="All Packages" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                {lpaRanges.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setCompanyFilter(value === 'all' ? '' : value)} defaultValue="">
              <SelectTrigger><SelectValue placeholder="All Companies" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setRoleFilter(value === 'all' ? '' : value)} defaultValue="">
              <SelectTrigger><SelectValue placeholder="All Roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-12">
          <Card>
            <CardHeader><CardTitle>Total Records</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Highest Package</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">₹{stats.highest} LPA</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Average Package</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">₹{stats.average} LPA</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Median Package</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">₹{stats.median} LPA</p></CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 mb-12">
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-center">Year-wise Offers</CardTitle></CardHeader>
            <CardContent><Bar data={yearData} options={{ responsive: true }} /></CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-center">Branch-wise Distribution</CardTitle></CardHeader>
            <CardContent className="max-h-80 flex justify-center"><Pie data={branchData} options={{ responsive: true, maintainAspectRatio: false }} /></CardContent>
          </Card>
        </div>
        <div className="mb-12">
            <Card>
                <CardHeader><CardTitle className="text-center">Top 10 Job Roles</CardTitle></CardHeader>
                <CardContent><Bar data={roleData} options={{ responsive: true, indexAxis: 'y' }} /></CardContent>
            </Card>
        </div>

        {/* Offer Details */}
        <div>
          <Button onClick={() => setShowOffers(!showOffers)}>
            {showOffers ? '🔼 Hide Offer Details' : '🔽 View Offer Details'}
          </Button>

          {showOffers && (
            <Card className="mt-6">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>CTC (LPA)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No offers match your current filters.</TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((offer, index) => (
                        <TableRow key={index}>
                          <TableCell>{offer.companyName}</TableCell>
                          <TableCell>{offer.role}</TableCell>
                          <TableCell>{offer.branch}</TableCell>
                          <TableCell>{offer.year}</TableCell>
                          <TableCell>₹{offer.package}</TableCell>
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
    </div>
  );
};

export default PlacementStats;
