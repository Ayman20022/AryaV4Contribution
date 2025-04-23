// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// --- Page Imports ---
import Layout from './components/layout/Layout';
import LoginPage from './pages/login';
import UserInterestsPage from './pages/UserInterestsPage'; // <-- Import the new page
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Marketplace from "./pages/Marketplace";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// --- Authentication Hook (keep as is) ---
const useAuth = () => {
  // ... (same implementation as before)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authToken') checkAuthStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { isAuthenticated, isLoading };
};

// --- Protected Route Component (keep as is) ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... (same implementation as before)
   const { isAuthenticated, isLoading } = useAuth();
   const location = useLocation();

   if (isLoading) {
     return <div className="min-h-screen flex items-center justify-center 
     bg-gradient-to-br from-[#0a0f1c] to-[#161e33] text-white">Loading...</div>;
   }

   if (!isAuthenticated) {
     return <Navigate to="/login" state={{ from: location }} replace />;
   }

   return <Layout>{children}</Layout>;
};

// --- Main App Component (Updated Routes) ---
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Route: Login Page */}
            <Route
              path="/login"
              element={
                <AuthRedirector>
                  <LoginPage />
                </AuthRedirector>
              }
            />

            {/* --- Protected Routes --- */}

            {/* Interest Selection Route (also protected) */}
            <Route
              path="/select-interests" // Define the route path
              element={<ProtectedRoute><UserInterestsPage /></ProtectedRoute>}
            />

            {/* Other Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFound />} /> {/* Decide if this needs Layout */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// --- AuthRedirector Helper Component (keep as is) ---
const AuthRedirector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... (same implementation as before)
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
     return <div className="min-h-screen flex items-center justify-center 
     bg-gradient-to-br from-[#0a0f1c] to-[#161e33] text-white">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default App;