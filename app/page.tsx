'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--purple-primary)] rounded-2xl mb-4">
          <Sparkles size={40} className="text-white animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Botfusions</h1>
        <p className="text-[var(--text-secondary)]">Yükleniyor...</p>
      </motion.div>
    </div>
  );
}
