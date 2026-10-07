import React from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

/**
 * 💡 BIG BROTHER MENTOR TIP:
 * This is a "Functional Component". It doesn't have its own 'state'.
 * It just received 'data' from its parent (ResumeBuilder) and shows it.
 * When you type, it calls 'onChange' which is actually a function in the parent!
 * This pattern is called "Lifting State Up".
 */
const PersonalInfoStep = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* First Row: Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
          <Input
            id="firstName"
            value={data.firstName || ''}
            onChange={onChange}
            className="bg-white border-slate-300 text-slate-900 focus:ring-blue-500"
            placeholder="e.g. John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
          <Input
            id="lastName"
            value={data.lastName || ''}
            onChange={onChange}
            className="bg-white border-slate-300 text-slate-900 focus:ring-blue-500"
            placeholder="e.g. Doe"
          />
        </div>
      </div>

      {/* Second Row: Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">Email Address</Label>
          <Input
            id="email"
            value={data.email || ''}
            onChange={onChange}
            className="bg-white border-slate-300 text-slate-900 focus:ring-blue-500"
            placeholder="e.g. john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
          <Input
            id="phone"
            value={data.phone || ''}
            onChange={onChange}
            className="bg-white border-slate-300 text-slate-900 focus:ring-blue-500"
            placeholder="e.g. +91 98765 43210"
          />
        </div>
      </div>

      {/* Third Row: Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="text-slate-700">LinkedIn</Label>
          <Input
            id="linkedin"
            value={data.linkedin || ''}
            onChange={onChange}
            className="bg-white border-slate-300 text-slate-900 focus:ring-blue-500"
            placeholder="linkedin.com/in/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github" className="text-slate-700">GitHub</Label>
          <Input
            id="github"
            value={data.github || ''}
            onChange={onChange}
            className="bg-white border-slate-300 text-slate-900 focus:ring-blue-500"
            placeholder="github.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website" className="text-slate-700">Website</Label>
          <Input
            id="website"
            value={data.website || ''}
            onChange={onChange}
            className="bg-white border-slate-300 text-slate-900 focus:ring-blue-500"
            placeholder="myportfolio.com"
          />
        </div>
      </div>

      {/* Full Row: Summary */}
      <div className="space-y-2">
        <Label htmlFor="summary" className="text-slate-700">Professional Summary</Label>
        <Textarea
          id="summary"
          value={data.summary || ''}
          onChange={onChange}
          className="bg-white border-slate-300 text-slate-900 h-32 focus:ring-blue-500"
          placeholder="Briefly describe your career goals..."
        />
      </div>
    </div>
  );
};

export default PersonalInfoStep;
