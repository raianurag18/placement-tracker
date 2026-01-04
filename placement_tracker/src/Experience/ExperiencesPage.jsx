import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/experiences`)
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error('Error fetching experiences:', err));
  }, []);

  const filteredExperiences = experiences.filter(exp =>
    exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 mb-4">
          Interview Experiences
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Learn from the journey of your seniors. Search by company or role.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12 relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search Amazon, Google, SDE..."
          className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 h-12 rounded-xl shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Experience List */}
      {filteredExperiences.length === 0 ? (
        <div className="text-center text-slate-500 py-12">
          <p className="text-lg">No experiences found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredExperiences.map((exp) => (
            <Card key={exp._id} className="bg-white border-slate-200 text-slate-900 hover:border-blue-300 transition-all hover:shadow-md group">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{exp.company}</span>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      Selected
                    </span>
                  </div>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    {exp.role}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-slate-500 mb-4 space-x-4">
                  <span className="flex items-center gap-1">👤 <span className="font-medium text-slate-700">{exp.name}</span></span>
                  <span className="flex items-center gap-1">💰 <span className="font-medium text-slate-700">{exp.package}</span></span>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {exp.experience}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperiencesPage;
