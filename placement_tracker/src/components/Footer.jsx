import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Placerra</h2>
            <p className="text-gray-400">
              A platform to track and share placement experiences.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <p className="text-gray-400">Email: anuragrai211004@gmail.com</p>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-2">Follow Me</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/anurag-rai-674855315/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/raianurag18"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://www.instagram.com/anuragrai1404/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Anurag Rai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
