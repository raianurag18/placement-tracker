import React, { useState, useMemo } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

const PlacementStats = () => {
  // 1. Mock data with `type`
  const records = useMemo(() => [
    { year: 2023, branch: 'CSE', package: 45, company: 'Google', type: 'Tech' },
    { year: 2023, branch: 'ECE', package: 22, company: 'Microsoft', type: 'Tech' },
    { year: 2024, branch: 'CSE', package: 30, company: 'Amazon', type: 'Tech' },
    { year: 2024, branch: 'ME', package: 12, company: 'TCS', type: 'Core' },
    { year: 2024, branch: 'CSE', package: 28, company: 'Meta', type: 'Tech' },
    { year: 2023, branch: 'EE', package: 18, company: 'Deloitte', type: 'Consulting' },
    { year: 2024, branch: 'ECE', package: 24, company: 'Bain & Co.', type: 'Consulting' },
    { year: 2023, branch: 'CSE', package: 14, company: 'Infosys', type: 'Core' },
  ], []);

  const [yearFilter, setYearFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [lpaFilter, setLpaFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [showOffers, setShowOffers] = useState(false);

  const years = [...new Set(records.map(r => r.year))];
  const branches = [...new Set(records.map(r => r.branch))];
  const companies = [...new Set(records.map(r => r.company))];
  const types = [...new Set(records.map(r => r.type))];
  const lpaRanges = ['< 20', '20-30', '> 30'];

  // Filter logic
  const filtered = useMemo(() => {
    return records.filter(r => {
      if (yearFilter && r.year !== +yearFilter) return false;
      if (branchFilter && r.branch !== branchFilter) return false;
      if (companyFilter && r.company !== companyFilter) return false;
      if (typeFilter && r.type !== typeFilter) return false;

      if (lpaFilter) {
        const pkg = r.package;
        if (lpaFilter === '< 20' && pkg >= 20) return false;
        if (lpaFilter === '20-30' && (pkg < 20 || pkg > 30)) return false;
        if (lpaFilter === '> 30' && pkg <= 30) return false;
      }

      return true;
    });
  }, [records, yearFilter, branchFilter, companyFilter, lpaFilter, typeFilter]);

  const stats = useMemo(() => {
    if (filtered.length === 0) {
      return { highest: 0, average: 0, median: 0, total: 0 };
    }
    const pkgs = filtered.map(r => r.package).sort((a, b) => a - b);
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
      labels: Object.keys(data),
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
        backgroundColor: ['#4bc0c0', '#36a2eb', '#9966ff', '#ff6384', '#ff9f40'],
      }],
    };
  }, [filtered]);

  const typeData = useMemo(() => {
    const data = {};
    filtered.forEach(offer => {
      data[offer.type] = (data[offer.type] || 0) + 1;
    });
    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB'],
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
            <Select onValueChange={setYearFilter} defaultValue="all">
              <SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={setBranchFilter} defaultValue="all">
              <SelectTrigger><SelectValue placeholder="All Branches" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={setLpaFilter} defaultValue="all">
              <SelectTrigger><SelectValue placeholder="All Packages" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                {lpaRanges.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={setCompanyFilter} defaultValue="all">
              <SelectTrigger><SelectValue placeholder="All Companies" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={setTypeFilter} defaultValue="all">
              <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-center">Year-wise Offers</CardTitle></CardHeader>
            <CardContent><Bar data={yearData} /></CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-center">Branch-wise Distribution</CardTitle></CardHeader>
            <CardContent><Pie data={branchData} /></CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-center">Company Type</CardTitle></CardHeader>
            <CardContent><Doughnut data={typeData} /></CardContent>
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
                      <TableHead>CTC (LPA)</TableHead>
                      <TableHead>Type</TableHead>
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
                          <TableCell>{offer.company}</TableCell>
                          <TableCell>{offer.role || '—'}</TableCell>
                          <TableCell>{offer.branch}</TableCell>
                          <TableCell>₹{offer.package}</TableCell>
                          <TableCell>{offer.type}</TableCell>
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
