import React, { useEffect, useState } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const ExperienceModeration = () => {
  const [pendingExperiences, setPendingExperiences] = useState([]);
  const [approvedMsg, setApprovedMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/pending-experiences`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setPendingExperiences(data))
      .catch(err => console.error('Error fetching pending experiences:', err));
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/approve/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.ok) {
        setPendingExperiences(prev => prev.filter(item => item._id !== id));
        setApprovedMsg('✅ Experience approved successfully!');
        setTimeout(() => setApprovedMsg(''), 3000);
      } else {
        alert('Failed to approve experience.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error during approval.');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this experience?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setPendingExperiences((prev) => prev.filter((exp) => exp._id !== id));
      } else {
        alert('Failed to delete the experience.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while deleting.');
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <h2 className="text-3xl font-bold mb-6">Experience Moderation</h2>
      {approvedMsg && <p className="text-green-600 text-center mb-4">{approvedMsg}</p>}
      {pendingExperiences.length === 0 ? (
        <p>No pending experiences yet.</p>
      ) : (
        pendingExperiences.map((exp) => (
          <Card key={exp._id} className="bg-white/10 backdrop-blur-md border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-blue-300">{exp.role} at <span className="text-white">{exp.company}</span></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Badge className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30">Name: {exp.name}</Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30">Package: {exp.package}</Badge>
              </div>
              <p className="text-gray-300 bg-black/20 p-4 rounded-lg">{exp.experience}</p>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button onClick={() => handleApprove(exp._id)} className="bg-green-600 hover:bg-green-700">Approve</Button>
              <Button variant="destructive" onClick={() => handleDelete(exp._id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default ExperienceModeration;
