'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/lib/chat-types';
import { MessageBubble } from '@/components/chat/MessageBubble';

interface ConversationDrawerProps {
  isOpen: boolean;
  messages: ChatMessage[];
  activeQuery: string | null;
  onClose: () => void;
}

export function ConversationDrawer({
  isOpen,
  messages,
  activeQuery,
  onClose,
}: ConversationDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  return (
    <>
      {/* Backdrop (mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -360 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-12 bottom-16 z-40 w-[360px] bg-white border-r border-zinc-100 flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-3 border-b border-zinc-100">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            Current query
          </p>
          {activeQuery ? (
            <p className="text-sm text-zinc-600 mt-0.5 leading-snug line-clamp-2">{activeQuery}</p>
          ) : (
            <p className="text-sm text-zinc-400 mt-0.5 italic">None</p>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-300 text-sm">
              No messages yet
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
