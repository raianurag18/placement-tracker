import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from "../components/ui/button";
import { ArrowLeft, Building2, Calendar } from 'lucide-react';

const BranchPlacementsPage = () => {
  const { branchName } = useParams();
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placements/branch/${branchName}`)
      .then((res) => res.json())
      .then((data) => setPlacements(data))
      .catch((err) => console.error('Error fetching placements:', err));
  }, [branchName]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 min-h-screen">
      <div className="flex items-center space-x-4 mb-4">
        <Link to="/branch-stats">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Branch Stats
          </Button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
          {branchName} Placements
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Recent placement records for {branchName} students.
        </p>
      </div>

      {placements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No placement records found for this branch yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {placements.map((placement) => (
            <Card key={placement._id} className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 border border-blue-100">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">{placement.companyName}</CardTitle>
                  <p className="text-sm text-slate-500">{placement.role}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-4 border-t border-slate-50 mt-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium border border-green-100">
                    {placement.package} LPA
                  </div>
                  <div className="flex items-center text-slate-400">
                    <Calendar className="h-3 w-3 mr-1" /> {placement.year}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchPlacementsPage;
