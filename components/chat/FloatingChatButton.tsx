'use client'

import React, { useState } from 'react';
import { MessageSquare, X, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatModal } from './ChatModal';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && <ChatModal onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--purple-primary)] hover:bg-[var(--purple-hover)] text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all"
          style={{
            boxShadow: '0 0 20px rgba(123, 63, 228, 0.5)'
          }}
        >
          <MessageSquare size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--red-danger)] rounded-full text-xs flex items-center justify-center">
            1
          </span>
        </motion.button>
      )}
    </>
  );
}
