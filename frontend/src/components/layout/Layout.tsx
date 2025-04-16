
import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] to-[#161e33] backdrop-blur-sm text-white">
      <Navbar />
      <main className="pt-20 pb-20 md:pb-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
