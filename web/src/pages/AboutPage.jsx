import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen text-white pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            About Placerra
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Empowering students with data-driven insights and real placement experiences to shape their careers.
          </p>
        </div>

        {/* Mission Card */}
        <div className="mb-20">
          <Card className="bg-white/5 backdrop-blur-md border-white/10 text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <span className="bg-blue-500/20 p-2 rounded-lg mr-3">🚀</span> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-gray-300">
                Placerra is a dedicated platform for students to share and explore interview experiences and placement statistics. We bridge the gap between seniors and juniors, creating a transparent community where knowledge flows freely. Our goal is to ensure every student walks into their placement drive with confidence and clarity.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Offer Grid */}
        <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 text-blue-300">Placement Statistics</h3>
            <p className="text-gray-400">Detailed insights into branch-wise packages, top recruiters, and yearly trends to help you strategize.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2 text-purple-300">Interview Experiences</h3>
            <p className="text-gray-400">Real stories from seniors who cracked the code. Learn about rounds, questions asked, and preparation tips.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2 text-pink-300">Student Community</h3>
            <p className="text-gray-400">A supportive network where you can contribute your own journey and help next year's batch succeed.</p>
          </div>
        </div>

        {/* Closing Note */}
        <div className="text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl p-12 border border-white/10">
          <h2 className="text-3xl font-bold mb-4">Built for Students, by Students.</h2>
          <p className="text-gray-400 mb-0">Join us in building the largest placement repository for our college.</p>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
