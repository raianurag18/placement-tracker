import React, { useState } from 'react';
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { X } from 'lucide-react';

const SkillsStep = ({ skills, onAdd, onRemove }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmedInput = inputValue.trim();
            if (trimmedInput && !skills.includes(trimmedInput)) {
                onAdd(trimmedInput);
                setInputValue('');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-slate-900">Technical Skills</h3>
                <p className="text-sm text-slate-500">
                    Type a skill (e.g. "React", "Python") and press <b>Enter</b> to add it.
                </p>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Label className="sr-only">Add Skill</Label>
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-white border-slate-300 text-slate-900 pl-4"
                                placeholder="Type skill here..."
                            />
                            <div className="absolute right-3 top-2.5 text-xs text-slate-400">
                                Press ↵
                            </div>
                        </div>

                        {/* Chips Container */}
                        <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                            {skills.length === 0 && (
                                <p className="text-slate-400 text-sm italic w-full text-center py-8">
                                    No skills added yet. Start typing above!
                                </p>
                            )}

                            {skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200"
                                >
                                    <span>{skill}</span>
                                    <button
                                        onClick={() => onRemove(index)}
                                        className="hover:text-red-600 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SkillsStep;
