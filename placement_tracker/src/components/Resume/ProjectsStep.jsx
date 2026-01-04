import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Trash2, Github, Link as LinkIcon } from 'lucide-react';

const ProjectsStep = ({ data, onChange, onRemove }) => {
    return (
        <div className="space-y-6">
            {/* Empty State */}
            {data.length === 0 && (
                <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                    No projects added yet. Adding projects is crucial for freshers!
                </div>
            )}

            {/* Projects Loop */}
            {data.map((proj, index) => (
                <Card key={index} className="bg-slate-950 border-slate-800 relative group">
                    {/* Delete Button */}
                    <Button
                        variant="ghost" size="icon"
                        onClick={() => onRemove(index)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Project Title</Label>
                                <Input
                                    name="title"
                                    value={proj.title}
                                    onChange={(e) => onChange(index, e)}
                                    className="bg-slate-900 border-slate-700 text-white"
                                    placeholder="e.g. Placement Tracker"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Project Link (GitHub/Demo)</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input
                                        name="link"
                                        value={proj.link}
                                        onChange={(e) => onChange(index, e)}
                                        className="bg-slate-900 border-slate-700 text-white pl-10"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Tech Stack (Comma separated)</Label>
                            <Input
                                name="technologies"
                                value={proj.technologies}
                                onChange={(e) => onChange(index, e)}
                                className="bg-slate-900 border-slate-700 text-white"
                                placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Description</Label>
                            <Textarea
                                name="description"
                                value={proj.description}
                                onChange={(e) => onChange(index, e)}
                                className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                                placeholder="Describe what the project does and your role in building it..."
                            />
                            <p className="text-xs text-slate-500">
                                Tip: Mention the problem you solved and the impact of the project.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ProjectsStep;
