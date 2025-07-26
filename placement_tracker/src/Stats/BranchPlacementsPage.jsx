import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const BranchPlacementsPage = () => {
  const { branchName } = useParams();
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/placements/branch/${branchName}`)
      .then((res) => res.json())
      .then((data) => setPlacements(data))
      .catch((err) => console.error('Error fetching placements:', err));
  }, [branchName]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-2xl">Placement Tracker</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          {branchName} Placements
        </h1>
        <div className="grid gap-8 lg:grid-cols-2">
          {placements.map((placement) => (
            <Card key={placement._id}>
              <CardHeader>
                <CardTitle>{placement.companyName} - {placement.role}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mt-1">
                  Package: <span className="font-medium">{placement.package} LPA</span> | Year: <span className="font-medium">{placement.year}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BranchPlacementsPage;
