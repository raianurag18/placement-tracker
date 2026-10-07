import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, Calendar } from 'lucide-react';
import PageBackLink from '../components/PageBackLink';
import { getBranchPlacements } from '../api/placementApi';

const BACK_FROM = {
  'highest-package-branch': (slug) => `/c/${slug}/highest-package-branch`,
  'branch-stats': (slug) => `/c/${slug}/branch-stats`,
};

const BranchPlacementsPage = () => {
  const { collegeSlug, branchName } = useParams();
  const location = useLocation();
  const [placements, setPlacements] = useState([]);

  const backTo = BACK_FROM[location.state?.from]?.(collegeSlug) ?? `/c/${collegeSlug}/dashboard`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBranchPlacements(collegeSlug, branchName);
        setPlacements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching placements:', err.message);
      }
    };
    if (collegeSlug && branchName) fetchData();
  }, [collegeSlug, branchName]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 min-h-screen">
      <PageBackLink to={backTo} />

      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
          {decodeURIComponent(branchName)} Placements
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Recent placement records for {decodeURIComponent(branchName)} students.
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
