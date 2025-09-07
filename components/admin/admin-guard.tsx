'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/account/login');
          return;
        }

        // Verify token and get user info
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.role === 'ADMIN') {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          // Token is invalid, redirect to login
          localStorage.removeItem('token');
          router.push('/account/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        router.push('/account/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying Access</h3>
            <p className="text-gray-600 text-center">
              Please wait while we verify your admin privileges...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 text-center mb-4">
              You don't have permission to access the admin panel. 
              Please contact an administrator if you believe this is an error.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Go to Homepage
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
