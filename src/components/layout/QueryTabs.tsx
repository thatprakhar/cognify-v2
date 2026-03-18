'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { UserNav } from '@/components/auth/UserNav';

export interface QuerySession {
  id: string;
  query: string;
  hasSpec: boolean;
}

interface QueryTabsProps {
  sessions: QuerySession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  runMetadata?: {
    engine: string;
    latencyMs: number;
    retryCount: number;
    semanticDriftDetected: boolean;
    engineFingerprint: string;
    modelClass: string;
  } | null;
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
}

export function QueryTabs({
  sessions,
  activeSessionId,
  onSelectSession,
  runMetadata,
  onToggleDrawer,
  isDrawerOpen,
}: QueryTabsProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-12 bg-zinc-950 border-b border-zinc-800/60 flex items-center">
      <div className="flex items-center h-full px-4 gap-3 w-full min-w-0">

        {/* Left: Logo + drawer toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-mono font-medium tracking-widest text-zinc-100 uppercase select-none">
            Outform
          </span>
          <button
            onClick={onToggleDrawer}
            className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors text-sm"
            aria-label={isDrawerOpen ? 'Close history' : 'Open history'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDrawerOpen ? 'close' : 'open'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1 }}
              >
                {isDrawerOpen ? '✕' : '☰'}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Center: Tabs */}
        <div
          className="flex-1 flex items-center gap-1 overflow-x-auto h-full min-w-0"
          style={{ scrollbarWidth: 'none' }}
        >
          <AnimatePresence initial={false}>
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const label = session.query.length > 28
                ? session.query.slice(0, 28) + '…'
                : session.query;

              return (
                <motion.button
                  key={session.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onSelectSession(session.id)}
                  className={`flex-shrink-0 px-3 h-full flex items-center text-xs font-mono cursor-pointer transition-colors relative whitespace-nowrap ${
                    isActive
                      ? 'text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-400" />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right: Telemetry + UserNav */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {runMetadata && (
            <span className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 whitespace-nowrap hidden sm:inline">
              ⚡ {runMetadata.latencyMs}ms · {runMetadata.engine.toUpperCase()} · {runMetadata.retryCount} retries
            </span>
          )}
          <UserNav />
        </div>
      </div>
    </div>
  );
}
