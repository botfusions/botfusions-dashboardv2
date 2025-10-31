'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const hashFragment = window.location.hash;

      if (hashFragment && hashFragment.length > 0) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(hashFragment);
          
          if (error) {
            console.error('Auth error:', error);
            router.push('/login?error=' + encodeURIComponent(error.message));
            return;
          }

          router.push('/dashboard');
        } catch (error) {
          console.error('Callback error:', error);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--purple-primary)] rounded-2xl mb-4">
          <Sparkles size={32} className="text-white animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Giriş yapılıyor...</h2>
        <p className="text-[var(--text-secondary)]">Lütfen bekleyin</p>
      </div>
    </div>
  );
}
