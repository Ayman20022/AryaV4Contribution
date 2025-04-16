// src/components/AuthNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const AuthNavbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1225]/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary flex items-center">
            <span className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-2">S</span>
            <span className="hidden sm:inline-block">Sphere</span>
          </Link>

          {/* Links for unauthenticated users (Optional) */}
          <nav className="flex items-center space-x-4">
            {/* Example: Link to a Sign Up page */}
            {/* <Link to="/signup" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Sign Up
            </Link> */}
            {/* You could add a Login link here too, but it might be redundant on the login page itself */}
            <span className="text-sm font-medium text-muted-foreground">
              Welcome
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;