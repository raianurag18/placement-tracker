import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Linkedin, Github, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-md text-white pt-0 pb-8 mt-auto relative">
      {/* Modern Gradient Separator */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="/company_logo.png" alt="Placerra Logo" className="h-10" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students with transparent placement insights and experiences. Join the community today.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/stats" className="hover:text-blue-400 transition-colors">Statistics</Link></li>
              <li><Link to="/experiences" className="hover:text-blue-400 transition-colors">Experiences</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact & Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center hover:text-white transition-colors">
                <Mail className="h-4 w-4 mr-2" /> anuragrai211004@gmail.com
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest placement trends.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 flex-1"
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Placerra by Anurag Rai. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="https://www.linkedin.com/in/anurag-rai-674855315/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com/raianurag18" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/anuragrai1404/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
