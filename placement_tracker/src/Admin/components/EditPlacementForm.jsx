import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { updatePlacement } from '../../api/placementApi';

const EditPlacementForm = ({ record, onRecordUpdated }) => {
  const { collegeSlug } = useParams();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(record);

  useEffect(() => {
    setFormData(record);
  }, [record]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRecord = await updatePlacement(collegeSlug, record._id, formData);
      onRecordUpdated(updatedRecord);
      setOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to update record.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="mr-2 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md">Edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Placement Record</SheetTitle>
          <SheetDescription>
            Update the details of the placement record.
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
          <Button type="submit">Update Record</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditPlacementForm;
