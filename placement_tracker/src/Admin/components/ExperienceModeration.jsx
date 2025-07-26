import React, { useEffect, useState } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const ExperienceModeration = () => {
  const [pendingExperiences, setPendingExperiences] = useState([]);
  const [approvedMsg, setApprovedMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/pending-experiences')
      .then(res => res.json())
      .then(data => setPendingExperiences(data))
      .catch(err => console.error('Error fetching pending experiences:', err));
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
        method: 'PATCH',
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
      const res = await fetch(`http://localhost:5000/api/experience/${id}`, {
        method: 'DELETE',
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
      {approvedMsg && <p className="text-green-600 text-center mb-4">{approvedMsg}</p>}
      {pendingExperiences.length === 0 ? (
        <p>No pending experiences yet.</p>
      ) : (
        pendingExperiences.map((exp) => (
          <Card key={exp._id}>
            <CardHeader>
              <CardTitle>{exp.role} at {exp.company}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Badge>Name: {exp.name}</Badge>
                <Badge variant="secondary">Package: {exp.package}</Badge>
              </div>
              <p>{exp.experience}</p>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button onClick={() => handleApprove(exp._id)}>Approve</Button>
              <Button variant="destructive" onClick={() => handleDelete(exp._id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default ExperienceModeration;
