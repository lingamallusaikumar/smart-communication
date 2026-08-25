'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
    if (localStorage.getItem('access_token')) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router, loadFromStorage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-medium text-sm">
      Loading SmartCommunication CRM...
    </div>
  );
}
