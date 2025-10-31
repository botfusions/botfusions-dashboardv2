'use client'

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../auth/AuthProvider';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type ChatModalProps = {
  onClose: () => void;
};

const quickActions = [
  { label: 'Haftalık Rapor', prompt: 'Bu hafta için SEO ve marketing performans raporu hazırla' },
  { label: 'SEO Kontrolü', prompt: 'Keyword pozisyonlarımı kontrol et, önemli değişiklikler var mı?' },
  { label: 'Rakip Analizi', prompt: 'Rakiplerimde bu hafta hangi değişiklikler oldu?' },
];

export function ChatModal({ onClose }: ChatModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Merhaba! Botfusions Marketing Dashboard asistanıyım. Size nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question?: string) => {
    const messageText = question || input;
    if (!messageText.trim() || loading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call chat-handler edge function
      const { data, error } = await supabase.functions.invoke('chat-handler', {
        body: {
          tenant_id: '11111111-1111-1111-1111-111111111111', // Demo tenant
          user_id: user?.id || null,
          question: messageText
        }
      });

      if (error) throw error;

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.data.answer || 'Üzgünüm, bir hata oluştu.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, mesajınızı işlerken bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-screen w-full max-w-md bg-[var(--bg-secondary)] border-l border-[var(--border-color)] shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--purple-primary)] rounded-full flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Asistan</h3>
            <p className="text-xs text-[var(--text-muted)]">Her zaman yanınızda</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] rounded-lg transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-[var(--border-color)] space-y-2">
        <p className="text-xs text-[var(--text-muted)] mb-2">Hızlı İşlemler:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleSend(action.prompt)}
              disabled={loading}
              className="px-3 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--purple-primary)] rounded-lg transition-all disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-[var(--purple-primary)] text-white'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-60">
                {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[var(--purple-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[var(--purple-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[var(--purple-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mesajınızı yazın..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--purple-primary)] disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-[var(--purple-primary)] hover:bg-[var(--purple-hover)] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
