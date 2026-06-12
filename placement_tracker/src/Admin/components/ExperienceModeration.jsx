import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { CheckCircle, Trash2, Building2, User, FileText, Loader2 } from 'lucide-react';
import { getPendingExperiences, approveExperience, deleteExperience } from '../../api/experienceApi';

const ExperienceModeration = () => {
  const { collegeSlug } = useParams();
  const [pendingExperiences, setPendingExperiences] = useState([]);
  const [approvedMsg, setApprovedMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        // getPendingExperiences uses adminFetch, which injects the admin_token
        const data = await getPendingExperiences(collegeSlug);
        setPendingExperiences(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching pending experiences:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (collegeSlug) fetchPending();
  }, [collegeSlug]);

  const handleApprove = async (id) => {
    try {
      await approveExperience(collegeSlug, id);
      // Optimistic UI: remove from list immediately after approval
      setPendingExperiences(prev => prev.filter(item => item._id !== id));
      setApprovedMsg('✅ Experience approved and published!');
      setTimeout(() => setApprovedMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to approve experience.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteExperience(collegeSlug, id);
      setPendingExperiences(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete the experience.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Experience Moderation</h2>
          <p className="text-slate-500">Review and approve student interview experiences.</p>
        </div>
      </div>

      {approvedMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" /> {approvedMsg}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : pendingExperiences.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
          <p className="text-slate-500">No pending experiences to review at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingExperiences.map((exp) => (
            <Card key={exp._id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50 rounded-t-xl border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100/50 rounded-lg flex items-center justify-center border border-blue-200">
                    <Building2 className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">{exp.company}</CardTitle>
                    <p className="text-sm text-slate-500">{exp.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50">
                    <User className="h-3 w-3 mr-1" /> {exp.name}
                  </Badge>
                  <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                    CTC: {exp.package} LPA
                  </Badge>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {exp.experience}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-2 pb-6 px-6">
                <Button variant="outline" onClick={() => handleDelete(exp._id)} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" /> Decline
                </Button>
                <Button onClick={() => handleApprove(exp._id)} className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" /> Approve & Publish
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceModeration;
