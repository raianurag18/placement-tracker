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

const PlacementTable = () => {
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/placements/all')
      .then((res) => res.json())
      .then((data) => setPlacements(data))
      .catch((err) => console.error('Error fetching placements:', err));
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button>Add New Record</Button>
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
                <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlacementTable;
