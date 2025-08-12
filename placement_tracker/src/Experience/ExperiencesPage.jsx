import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/experiences')
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error('Error fetching experiences:', err));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          Interview Experiences
        </h1>
        <div className="grid gap-8 lg:grid-cols-2">
          {experiences.map((exp) => (
            <Card key={exp._id}>
              <CardHeader>
                <CardTitle>{exp.company} - <span className="font-semibold">{exp.role}</span></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mt-1">
                  By <span className="font-medium">{exp.name}</span> | Package: <span className="font-medium">{exp.package}</span>
                </p>
                <p className="text-foreground mt-4 whitespace-pre-wrap">{exp.experience}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ExperiencesPage;
