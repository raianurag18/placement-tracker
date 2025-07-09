import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingExperiences, setpendingExperiences] = useState([]);
  const [approvedMsg, setApprovedMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/pending-experiences')
      .then(res => res.json())
      .then(data => setpendingExperiences(data))
      .catch(err => console.error('Error fetching pending experiences:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

    const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
        method: 'PATCH',
      });

      if (res.ok) {
        setpendingExperiences(prev => prev.filter(item => item._id !== id));
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
      setpendingExperiences((prev) => prev.filter((exp) => exp._id !== id));
    } else {
      alert('Failed to delete the experience.');
    }
  } catch (err) {
    console.error(err);
    alert('Server error while deleting.');
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      {approvedMsg && <p className="text-green-600 text-center mb-4">{approvedMsg}</p>}

      <div className="space-y-6">
        {pendingExperiences.length === 0 ? (
          <p>No pending experiences yet.</p>
        ) : (
          pendingExperiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200 relative"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-1">
                {exp.role} at {exp.company}
              </h3>
              <p className="text-sm text-gray-600 mb-1">Name: {exp.name}</p>
              <p className="text-sm text-gray-600 mb-1">Package: {exp.package}</p>
              <p className="text-gray-700 mt-3">{exp.experience}</p>
              
              <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleApprove(exp._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Approve
              </button>

              <button
                onClick={() => handleDelete(exp._id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;



