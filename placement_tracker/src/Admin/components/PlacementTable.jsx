import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Download, Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import AddPlacementForm from './AddPlacementForm';
import EditPlacementForm from './EditPlacementForm';
import { getAllPlacements, deletePlacement } from '../../api/placementApi';

const PlacementTable = () => {
  const { collegeSlug } = useParams();
  const [placements, setPlacements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        // getAllPlacements fetches /api/c/:slug/placements/all with admin token
        const data = await getAllPlacements(collegeSlug);
        setPlacements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching placements:', err.message);
      }
    };
    if (collegeSlug) fetchPlacements();
  }, [collegeSlug]);

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
    if (!window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;
    try {
      await deletePlacement(collegeSlug, id);
      setPlacements(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete the record.');
    }
  };

  const filteredPlacements = placements.filter(p =>
    p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Placement Records</h2>
          <p className="text-slate-500">Manage and track student placement data.</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button> */}
          <AddPlacementForm onRecordAdded={handleRecordAdded} />
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search records by company, student, or role..."
              className="pl-10 max-w-md bg-slate-50 border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-600 font-semibold">Company</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Role</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Student</TableHead>
                  <TableHead className="text-slate-600 font-semibold">CTC (LPA)</TableHead>
                  <TableHead className="text-slate-600 font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlacements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No records found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlacements.map((p) => (
                    <TableRow key={p._id} className="hover:bg-slate-50 border-slate-100 group">
                      <TableCell className="font-medium text-slate-900">{p.companyName}</TableCell>
                      <TableCell className="text-slate-600">{p.role}</TableCell>
                      <TableCell className="text-slate-600">{p.studentName}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          {p.package} LPA
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <EditPlacementForm record={p} onRecordUpdated={handleRecordUpdated} />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(p._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlacementTable;
