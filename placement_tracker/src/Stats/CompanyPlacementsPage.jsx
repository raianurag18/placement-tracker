import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from "../components/ui/button";
import { ArrowLeft, Briefcase, Calendar, GraduationCap } from 'lucide-react';

const CompanyPlacementsPage = () => {
  const { companyName } = useParams();
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placements/companies/${companyName}`)
      .then((res) => res.json())
      .then((data) => setPlacements(data))
      .catch((err) => console.error('Error fetching placements:', err));
  }, [companyName]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 min-h-screen">
      <div className="flex items-center space-x-4 mb-4">
        <Link to="/companies">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Companies
          </Button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
          {companyName} Placements
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          History of offers and roles provided by {companyName}.
        </p>
      </div>

      {placements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No placement records found for this company yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {placements.map((placement) => (
            <Card key={placement._id} className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2 flex flex-row items-start space-y-0 gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 mt-1">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div className='flex-1'>
                  <CardTitle className="text-lg font-bold leading-tight">{placement.role}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 border-t border-slate-50 mt-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center"><GraduationCap className="h-4 w-4 mr-2" /> Branch</span>
                    <span className="font-medium text-slate-900">{placement.branch}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center"><Calendar className="h-4 w-4 mr-2" /> Year</span>
                    <span className="font-medium text-slate-900">{placement.year}</span>
                  </div>
                  <div className="pt-2">
                    <div className="bg-green-50 text-green-700 w-full text-center py-2 rounded-lg font-semibold border border-green-100">
                      {placement.package} LPA
                    </div>
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

export default CompanyPlacementsPage;
