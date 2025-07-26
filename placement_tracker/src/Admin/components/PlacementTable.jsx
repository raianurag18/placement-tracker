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
    fetch('http://localhost:5000/api/placements/all')
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
      const res = await fetch(`http://localhost:5000/api/placements/${id}`, {
        method: 'DELETE',
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
      <div className="flex justify-end mb-4">
        <AddPlacementForm onRecordAdded={handleRecordAdded} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>CTC (LPA)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placements.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.companyName}</TableCell>
              <TableCell>{p.role}</TableCell>
              <TableCell>{p.studentName}</TableCell>
              <TableCell>{p.package}</TableCell>
              <TableCell>
                <EditPlacementForm record={p} onRecordUpdated={handleRecordUpdated} />
                <Button variant="destructive" size="sm" onClick={() => handleDelete(p._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlacementTable;
