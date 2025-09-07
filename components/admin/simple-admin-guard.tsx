'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Lock } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function SimpleAdminGuard({ children }: AdminGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const router = useRouter();

  // Simple admin password - in production, this should be in environment variables
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    // Check if admin is already logged in
    const adminSession = sessionStorage.getItem('admin-authenticated');
    if (adminSession === 'true') {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-authenticated', 'true');
      setIsAuthorized(true);
      setShowLogin(false);
    } else {
      alert('Incorrect admin password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-authenticated');
    setIsAuthorized(false);
    setShowLogin(true);
    setAdminPassword('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading...</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized || showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lock className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Access</h3>
            <p className="text-gray-600 text-center mb-6">
              Enter admin password to access the admin panel
            </p>
            <form onSubmit={handleAdminLogin} className="w-full space-y-4">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-500">
              <p>Default password: <code className="bg-gray-100 px-1 rounded">admin123</code></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Header with Logout */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}
