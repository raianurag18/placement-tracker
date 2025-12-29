import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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
    <div className="min-h-screen text-white">
      {/* <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-2xl">back</Link>
            </div>
          </div>
        </div>
      </nav> */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          {companyName} Placements
        </h1>
        <div className="grid gap-8 lg:grid-cols-2">
          {placements.map((placement) => (
            <Card key={placement._id} className="bg-white/10 backdrop-blur-md border-white/10 text-white">
              <CardHeader>
                <CardTitle>{placement.role}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mt-1">
                  Package: <span className="font-medium text-blue-300">{placement.package} LPA</span> | Year: <span className="font-medium">{placement.year}</span> | Branch: <span className="font-medium">{placement.branch}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CompanyPlacementsPage;
