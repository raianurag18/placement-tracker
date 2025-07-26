import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

const AddPlacementForm = ({ onRecordAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    studentName: '',
    package: '',
    branch: '',
    year: new Date().getFullYear(),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/placements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newRecord = await res.json();
        onRecordAdded(newRecord);
        setFormData({
          companyName: '',
          role: '',
          studentName: '',
          package: '',
          branch: '',
          year: new Date().getFullYear(),
        });
        setOpen(false);
      } else {
        alert('Failed to add record.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while adding record.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Add New Record</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Placement Record</SheetTitle>
          <SheetDescription>
            Fill in the details of the new placement record.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" value={formData.role} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="studentName">Student Name</Label>
            <Input id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="package">CTC (LPA)</Label>
            <Input id="package" name="package" type="number" value={formData.package} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Input id="branch" name="branch" value={formData.branch} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input id="year" name="year" type="number" value={formData.year} onChange={handleChange} />
          </div>
          <Button type="submit">Add Record</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddPlacementForm;
