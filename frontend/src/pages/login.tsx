// src/pages/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthNavbar from '@/components/layout/AuthNavbar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import {authUri} from '../apis/api-uri'



const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const url = authUri

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const credentials = {
      email,password
    }

    console.log('Attempting login with:', credentials);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { accessToken } = await response.json();
      
      // Store token and notify other tabs
      localStorage.setItem('authToken', accessToken);
      window.dispatchEvent(new StorageEvent('storage', { 
        key: 'authToken', 
        newValue: accessToken 
      }));

      // Check if user has selected interests
      const interestsSelected = localStorage.getItem('userInterestsSelected') === 'true';
      
      toast({
        title: "Login Successful",
        description: "Redirecting...",
      });

      // Navigate based on interest selection
      navigate(interestsSelected ? '/' : '/select-interests', { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... rest of the LoginPage JSX remains the same
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] to-[#161e33] backdrop-blur-sm text-white">
      <AuthNavbar />
      <main className="pt-20 pb-20 md:pb-6 animate-fade-in flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md px-4">
          <div className="bg-card/70 backdrop-blur-sm border border-border/30 rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-primary mb-6">Login to Sphere</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-input/50 border-border/50 focus:border-primary" autoComplete="email" />
              </div>
              {/* Password Input */}
              <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                 <Input id="password" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-input/50 border-border/50 focus:border-primary" autoComplete="current-password" />
              </div>
              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;