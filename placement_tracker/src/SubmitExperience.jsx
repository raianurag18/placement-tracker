import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SubmitExperience = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    ctc: '',
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
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <Link to="/" className="text-blue-600 underline mb-6 inline-block">
        ← Back to Home
      </Link>

      <h2 className="text-2xl font-bold text-center mb-8">
        Submit Your Interview Experience
      </h2>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow space-y-6">
          {success && <p className="text-green-600 text-center">{success}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}
        <input
          name="name"
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <input
          name="company"
          type="text"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <div className="flex space-x-4">
          <input
            name="role"
            type="text"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            name="ctc"
            type="text"
            placeholder="Package"
            value={formData.ctc}
            onChange={handleChange}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <textarea
          name="experience"
          rows="5"
          placeholder="Write your experience..."
          value={formData.experience}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitExperience;

