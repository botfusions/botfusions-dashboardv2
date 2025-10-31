'use client'

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      setMessage('Giriş bağlantısı email adresinize gönderildi. Lütfen kontrol edin.');
    } catch (error: any) {
      setMessage(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--purple-primary)] rounded-2xl mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Botfusions</h1>
          <p className="text-[var(--text-secondary)]">Marketing Dashboard + AI Asistan</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Giriş Yap</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--purple-primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--purple-primary)] hover:bg-[var(--purple-hover)] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Gönderiliyor...' : 'Magic Link Gönder'}
            </button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('gönderildi') 
                  ? 'bg-[var(--green-success)]/10 text-[var(--green-success)] border border-[var(--green-success)]/20'
                  : 'bg-[var(--red-danger)]/10 text-[var(--red-danger)] border border-[var(--red-danger)]/20'
              }`}
            >
              {message}
            </motion.div>
          )}

          <p className="mt-6 text-xs text-[var(--text-muted)] text-center">
            Email adresinize gönderilen bağlantıya tıklayarak giriş yapabilirsiniz.
            Şifre gerekmez.
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
          Demo için: demo@botfusions.com
        </p>
      </motion.div>
    </div>
  );
}
