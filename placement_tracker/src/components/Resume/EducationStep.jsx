import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Trash2 } from 'lucide-react';

/**
 * 💡 BIG BROTHER MENTOR TIP:
 * Handling arrays is trickier! 
 * We use '.map' to loop through your schools and show each one as a card.
 * Notice how we pass 'index' back to the parent—that's how the parent knows 
 * WHICH school you are currently typing in.
 */
const EducationStep = ({ data, onChange, onRemove }) => {
    return (
        <div className="space-y-6">
            {/* Show this if the list is empty */}
            {data.length === 0 && (
                <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                    No education added yet. Click "Add School" to begin.
                </div>
            )}

            {/* Loop through each school in the array */}
            {data.map((edu, index) => (
                <Card key={index} className="bg-white border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
                    {/* Delete Button (Only shows when you hover!) */}
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
                                <Label className="text-slate-700">Institute / School</Label>
                                <Input
                                    name="institute"
                                    value={edu.institute}
                                    onChange={(e) => onChange(index, e)}
                                    className="bg-white border-slate-300 text-slate-900"
                                    placeholder="e.g. NIT Jhalwa"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">Degree</Label>
                                <Input
                                    name="degree"
                                    value={edu.degree}
                                    onChange={(e) => onChange(index, e)}
                                    className="bg-white border-slate-300 text-slate-900"
                                    placeholder="e.g. B.Tech"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700">Field of Study</Label>
                                <Input
                                    name="fieldOfStudy"
                                    value={edu.fieldOfStudy}
                                    onChange={(e) => onChange(index, e)}
                                    className="bg-white border-slate-300 text-slate-900"
                                    placeholder="e.g. Computer Science"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">Score (CGPA/%)</Label>
                                <Input
                                    name="score"
                                    value={edu.score}
                                    onChange={(e) => onChange(index, e)}
                                    className="bg-white border-slate-300 text-slate-900"
                                    placeholder="e.g. 9.5"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700">Start Date</Label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    value={edu.startDate ? edu.startDate.split('T')[0] : ''}
                                    onChange={(e) => onChange(index, e)}
                                    className="bg-white border-slate-300 text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">End Date</Label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    value={edu.endDate ? edu.endDate.split('T')[0] : ''}
                                    onChange={(e) => onChange(index, e)}
                                    disabled={edu.current}
                                    className="bg-white border-slate-300 text-slate-900 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`edu-current-${index}`}
                                name="current"
                                checked={edu.current}
                                onCheckedChange={(checked) => onChange(index, { target: { name: 'current', type: 'checkbox', checked } })}
                                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label htmlFor={`edu-current-${index}`} className="text-slate-600 font-normal">I currently study here</Label>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default EducationStep;
