import React, { useState, useMemo } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);


const PlacementStats = () => {
  // 1. Mock data with `type`
  const records = [
    { year: 2023, branch: 'CSE', package: 45, company: 'Google', type: 'Tech' },
    { year: 2023, branch: 'ECE', package: 22, company: 'Microsoft', type: 'Tech' },
    { year: 2024, branch: 'CSE', package: 30, company: 'Amazon', type: 'Tech' },
    { year: 2024, branch: 'ME',  package: 12, company: 'TCS', type: 'Core' },
    { year: 2024, branch: 'CSE', package: 28, company: 'Meta', type: 'Tech' },
    { year: 2023, branch: 'EE', package: 18, company: 'Deloitte', type: 'Consulting' },
    { year: 2024, branch: 'ECE', package: 24, company: 'Bain & Co.', type: 'Consulting' },
    { year: 2023, branch: 'CSE', package: 14, company: 'Infosys', type: 'Core' },
  ];

  const [yearFilter, setYearFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [lpaFilter, setLpaFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [showOffers, setShowOffers] = useState(false);

  const years     = [...new Set(records.map(r => r.year))];
  const branches  = [...new Set(records.map(r => r.branch))];
  const companies = [...new Set(records.map(r => r.company))];
  const types     = [...new Set(records.map(r => r.type))];
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
  }, [yearFilter, branchFilter, companyFilter, lpaFilter, typeFilter]);

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

  //📊 1. Year-wise Bar Chart
  const yearData = {};
filtered.forEach(offer => {
  yearData[offer.year] = (yearData[offer.year] || 0) + 1;
});

const yearChartData = {
  labels: Object.keys(yearData),
  datasets: [
    {
      label: 'Offers per Year',
      data: Object.values(yearData),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    },
  ],
};

   //📊 2. Branch-wise Pie Chart
   const branchData = {};
filtered.forEach(offer => {
  branchData[offer.branch] = (branchData[offer.branch] || 0) + 1;
});

const branchChartData = {
  labels: Object.keys(branchData),
  datasets: [
    {
      data: Object.values(branchData),
      backgroundColor: ['#4bc0c0', '#36a2eb', '#9966ff', '#ff6384', '#ff9f40'],
    },
  ],
};
   
  //📊 3. Company Type Doughnut Chart
  const typeData = {};
filtered.forEach(offer => {
  typeData[offer.companyType] = (typeData[offer.companyType] || 0) + 1;
});

const typeChartData = {
  labels: Object.keys(typeData),
  datasets: [
    {
      data: Object.values(typeData),
      backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB'],
    },
  ],
};
   
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">📊 Placement Statistics</h2>

      {/* Filters */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Branches</option>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select value={lpaFilter} onChange={e => setLpaFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Packages</option>
          {lpaRanges.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Companies</option>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="max-w-5xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Total Records</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Highest Package</h3>
          <p className="text-2xl font-bold">₹{stats.highest} LPA</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Average Package</h3>
          <p className="text-2xl font-bold">₹{stats.average} LPA</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-sm text-gray-500">Median Package</h3>
          <p className="text-2xl font-bold">₹{stats.median} LPA</p>
        </div>
      </div>

       
      <div className="my-12 space-y-12">
  <h3 className="text-2xl font-bold text-center">📊 Placement Visualizations</h3>

  <div className="max-w-4xl mx-auto">
    <h4 className="text-lg font-semibold mb-2 text-center">Year-wise Offers</h4>
    <Bar data={yearChartData} />
  </div>

  <div className="max-w-4xl mx-auto">
    <h4 className="text-lg font-semibold mb-2 text-center">Branch-wise Distribution</h4>
    <Pie data={branchChartData} />
  </div>

  <div className="max-w-4xl mx-auto">
    <h4 className="text-lg font-semibold mb-2 text-center">Company Type</h4>
    <Doughnut data={typeChartData} />
  </div>
</div>


      <div className="max-w-5xl mx-auto mt-8">
  <button
    onClick={() => setShowOffers(!showOffers)}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
  >
    {showOffers ? '🔼 Hide Offer Details' : '🔽 View Offer Details'}
  </button>

  {showOffers && (
    <div className="mt-6 bg-white p-4 rounded-xl shadow space-y-4 max-h-[400px] overflow-y-auto">
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No offers match your current filters.</p>
      ) : (
        filtered.map((offer, index) => (
          <div
            key={index}
            className="border-b pb-2 mb-2 flex flex-col sm:flex-row sm:justify-between text-sm text-gray-700"
          >
            <span><strong>Company:</strong> {offer.company}</span>
            <span><strong>Role:</strong> {offer.role || '—'}</span>
            <span><strong>Branch:</strong> {offer.branch}</span>
            <span><strong>CTC:</strong> ₹{offer.package} LPA</span>
            <span><strong>Type:</strong> {offer.type}</span>
          </div>
        ))
      )}
        </div>
    )}
    </div>

    </div>
  );
};

export default PlacementStats;

