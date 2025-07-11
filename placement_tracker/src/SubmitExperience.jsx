import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";

const SubmitExperience = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    package: '',
    experience: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const { name, company, role, ctc, experience } = formData;
    if (!name || !company || !role || !ctc || !experience) {
      setError('Please fill out all fields before submitting.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess('✅ Thanks! Your experience was submitted.');
        setError('');
        setFormData({
          name: '',
          company: '',
          role: '',
          package: '',
          experience: ''
        });

        // Optional: Auto-hide success after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      }
      else {
        alert('Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="link" className="mb-6">
          <Link to="/">
            ← Back to Home
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Submit Your Interview Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {success && <p className="text-green-600 text-center">{success}</p>}
              {error && <p className="text-red-600 text-center">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="Role"
                    value={formData.role}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="package">Package</Label>
                  <Input
                    id="package"
                    name="package"
                    type="text"
                    placeholder="e.g., 12 LPA"
                    value={formData.package}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience">Your Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  rows="5"
                  placeholder="Write your experience..."
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitExperience;
