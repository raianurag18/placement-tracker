import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/experiences`)
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error('Error fetching experiences:', err));
  }, []);

  return (
    <div className="min-h-screen text-white">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12 text-white">
          Interview Experiences
        </h1>
        <div className="grid gap-8 lg:grid-cols-2">
          {experiences.map((exp) => (
            <Card key={exp._id} className="bg-white/10 backdrop-blur-md border-white/10 text-white">
              <CardHeader>
                <CardTitle>{exp.company} - <span className="font-semibold text-blue-300">{exp.role}</span></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mt-1">
                  By <span className="font-medium">{exp.name}</span> | Package: <span className="font-medium">{exp.package}</span>
                </p>
                <p className="text-gray-100 mt-4 whitespace-pre-wrap">{exp.experience}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ExperiencesPage;
