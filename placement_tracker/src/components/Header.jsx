import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { User, Menu } from 'lucide-react';

const Header = ({ user }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const closeSheet = () => setIsSheetOpen(false);

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
              <Link to="/experiences"><Button variant="ghost">Experiences</Button></Link>
              <Link to="/submit"><Button variant="ghost">Submit Experience</Button></Link>
              <Link to="/about"><Button variant="ghost">About</Button></Link>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center">
                      <User className="mr-2" /> {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Link to="/profile">My Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link to="/my-experiences">My Experiences</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <a href="http://localhost:5000/auth/logout">Logout</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <a href="http://localhost:5000/auth/google"><Button>Login with Google</Button></a>
              )}
              <Link to="/admin"><Button>Admin Login</Button></Link>
            </div>
          </div>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4">
                  <Link to="/" onClick={closeSheet}><Button variant="ghost">Home</Button></Link>
                  <Link to="/stats" onClick={closeSheet}><Button variant="ghost">Stats</Button></Link>
                  <Link to="/experiences" onClick={closeSheet}><Button variant="ghost">Experiences</Button></Link>
                  <Link to="/submit" onClick={closeSheet}><Button variant="ghost">Submit Experience</Button></Link>
                  <Link to="/about" onClick={closeSheet}><Button variant="ghost">About</Button></Link>
                  {user ? (
                    <>
                      <Link to="/profile" onClick={closeSheet}><Button variant="ghost">My Profile</Button></Link>
                      <Link to="/my-experiences" onClick={closeSheet}><Button variant="ghost">My Experiences</Button></Link>
                      <a href="http://localhost:5000/auth/logout"><Button>Logout</Button></a>
                    </>
                  ) : (
                    <a href="http://localhost:5000/auth/google"><Button>Login with Google</Button></a>
                  )}
                  <Link to="/admin" onClick={closeSheet}><Button>Admin Login</Button></Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
