import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Trash2 } from 'lucide-react';

/**
 * 💡 BIG BROTHER MENTOR TIP:
 * Notice how similar this is to the EducationStep? 
 * In professional coding, we love "Consistency". 
 * If the user (you!) understands the Education list, 
 * you automatically understand the Experience list.
 * This makes the code predictable and "bug-resistant".
 */
const ExperienceStep = ({ data, onChange, onRemove }) => {
    return (
        <div className="space-y-6">
            {/* Empty State */}
            {data.length === 0 && (
                <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                    No experience added yet. Click "Add Position" to begin.
                </div>
            )}

            {/* Dynamic List */}
            {data.map((exp, index) => (
                <Card key={index} className="bg-white border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
                    <Button
                        variant="ghost" size="icon"
                        onClick={() => onRemove(index)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700">Company Name</Label>
                                <Input
                                    name="company"
                                    value={exp.company}
                                    onChange={(e) => onChange(index, e)}
                                    className="bg-white border-slate-300 text-slate-900"
                                    placeholder="e.g. Google"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">Job Title / Role</Label>
                                <Input
                                    name="role"
                                    value={exp.role}
                                    onChange={(e) => onChange(index, e)}
                                    className="bg-white border-slate-300 text-slate-900"
                                    placeholder="e.g. SDE Intern"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Location</Label>
                            <Input
                                name="location"
                                value={exp.location}
                                onChange={(e) => onChange(index, e)}
                                className="bg-white border-slate-300 text-slate-900"
                                placeholder="e.g. Bangalore, Remote"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700">Start Date</Label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    value={exp.startDate ? exp.startDate.split('T')[0] : ''}
                                    onChange={(e) => onChange(index, e)}
                                    className="bg-white border-slate-300 text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">End Date</Label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    value={exp.endDate ? exp.endDate.split('T')[0] : ''}
                                    onChange={(e) => onChange(index, e)}
                                    disabled={exp.current}
                                    className="bg-white border-slate-300 text-slate-900 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`exp-current-${index}`}
                                name="current"
                                checked={exp.current}
                                onCheckedChange={(checked) => onChange(index, { target: { name: 'current', type: 'checkbox', checked } })}
                                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label htmlFor={`exp-current-${index}`} className="text-slate-600 font-normal">I currently work here</Label>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Description</Label>
                            <Textarea
                                name="description"
                                value={exp.description}
                                onChange={(e) => onChange(index, e)}
                                className="bg-white border-slate-300 text-slate-900 h-24"
                                placeholder="Built features for..."
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ExperienceStep;
