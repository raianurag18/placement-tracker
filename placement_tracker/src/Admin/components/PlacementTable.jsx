import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import AddPlacementForm from './AddPlacementForm';
import EditPlacementForm from './EditPlacementForm';

const PlacementTable = () => {
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placements/all`)
      .then((res) => res.json())
      .then((data) => setPlacements(data))
      .catch((err) => console.error('Error fetching placements:', err));
  }, []);

  const handleRecordAdded = (newRecord) => {
    setPlacements((prevPlacements) => [newRecord, ...prevPlacements]);
  };

  const handleRecordUpdated = (updatedRecord) => {
    setPlacements((prevPlacements) =>
      prevPlacements.map((p) =>
        p._id === updatedRecord._id ? updatedRecord : p
      )
    );
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this record?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setPlacements((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete the record.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while deleting.');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Placement Records</h2>
      <div className="flex justify-end mb-4">
        <AddPlacementForm onRecordAdded={handleRecordAdded} />
      </div>
      <div className="rounded-md border border-white/10 overflow-hidden bg-white/5 backdrop-blur-md">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="text-gray-300">Company</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">Student</TableHead>
              <TableHead className="text-gray-300">CTC (LPA)</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placements.map((p) => (
              <TableRow key={p._id} className="hover:bg-white/5 border-white/5">
                <TableCell className="text-gray-200">{p.companyName}</TableCell>
                <TableCell className="text-gray-200">{p.role}</TableCell>
                <TableCell className="text-gray-200">{p.studentName}</TableCell>
                <TableCell className="text-gray-200">{p.package}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <EditPlacementForm record={p} onRecordUpdated={handleRecordUpdated} />
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(p._id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlacementTable;
