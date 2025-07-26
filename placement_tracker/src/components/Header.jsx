import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";

const Header = ({ user }) => {
  return (
    <nav className="sticky top-0 z-50 bg-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/">
              <img src="/company_logo.png" alt="Company Logo" className="h-16 my-2" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/"><Button variant="ghost">Home</Button></Link>
              <Link to="/stats"><Button variant="ghost">Stats</Button></Link>
              <Link to="/submit"><Button variant="ghost">Submit Experience</Button></Link>
              <Link to="/about"><Button variant="ghost">About</Button></Link>
              {user ? (
                <a href="http://localhost:5000/auth/logout"><Button>Logout</Button></a>
              ) : (
                <a href="http://localhost:5000/auth/google"><Button>Login with Google</Button></a>
              )}
              <Link to="/admin"><Button>Admin Login</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
