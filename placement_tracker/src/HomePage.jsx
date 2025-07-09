import React from 'react';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';


const HomePage = () => {
   // ⬇️ Add this part right here
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/experiences")
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error("Error fetching experiences:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Placement Tracker</h1>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">
              <Link to="/stats">Stats</Link>
            </li>

            <li className="hover:text-blue-600 cursor-pointer">Submit Experience</li>
            <li className="hover:text-blue-600 cursor-pointer">About</li>
            <li>
            <Link to="/admin" className="hover:text-blue-600 cursor-pointer">Admin Login</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Welcome to the College Placement Tracker
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Track placement statistics, explore interview experiences, and get tips for cracking your dream company.
        </p>
      </main>
       {/* 📊 Placement Stats Section — Paste it here */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Placement Overview - 2024
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-blue-100 p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-sm text-gray-600">Total Companies</p>
              <h4 className="text-3xl font-bold text-blue-700">95+</h4>
            </div>
            <div className="bg-green-100 p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-sm text-gray-600">Total Offers</p>
              <h4 className="text-3xl font-bold text-green-700">300+</h4>
            </div>
            <div className="bg-yellow-100 p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-sm text-gray-600">Highest Package</p>
              <h4 className="text-3xl font-bold text-yellow-700">₹ 45 LPA</h4>
            </div>
            <div className="bg-purple-100 p-6 rounded-xl shadow hover:shadow-md transition">
              <p className="text-sm text-gray-600">Average Package</p>
              <h4 className="text-3xl font-bold text-purple-700">₹ 8.5 LPA</h4>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-10">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Interview Experiences</h2>
  {experiences.length === 0 ? (
    <p className="text-gray-500">No experiences submitted yet.</p>
  ) : (
    <div className="space-y-6">
      {experiences.map((exp) => (
        <div key={exp._id} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-blue-600">{exp.company} – {exp.role}</h3>
          <p className="text-gray-700 text-sm mb-1">By {exp.name} | {exp.package}</p>
          <p className="text-gray-600 mt-2 whitespace-pre-line">{exp.experience}</p>
        </div>
      ))}
    </div>
  )}
</section>

      
      {/* Student Reviews Section */}
<section className="bg-gray-100 py-16">
  <div className="max-w-6xl mx-auto px-4">
    <h3 className="text-2xl font-semibold text-gray-800 mb-10 text-center">
      What Our Seniors Say
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Review Card */}
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <p className="text-gray-600 italic">
          "Start solving DSA early, and make sure your GitHub and resume are clean!"
        </p>
        <div className="mt-4 text-sm text-gray-500">— Ayush, Placed at Amazon</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <p className="text-gray-600 italic">
          "Don’t ignore soft skills. Communication helped me crack HR rounds easily."
        </p>
        <div className="mt-4 text-sm text-gray-500">— Mehak, Placed at Microsoft</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <p className="text-gray-600 italic">
          "Be consistent with CP. I gave 500+ Leetcode problems before placements!"
        </p>
        <div className="mt-4 text-sm text-gray-500">— Rohan, Placed at Atlassian</div>
      </div>
    </div>
  </div>
</section>
    <div className="text-center my-12">
  <Link
    to="/submit"
    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
  >
    Share Your Interview Experience
  </Link>
</div>


    </div>
  );
};

export default HomePage;
