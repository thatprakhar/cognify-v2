'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabsProps {
    tabs: string[];
    children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ tabs = [], children }) => {
    const [activeTab, setActiveTab] = useState(0);
    const childrenArray = React.Children.toArray(children);

    return (
        <div className="w-full">
            <div className="flex space-x-2 border-b border-zinc-200 dark:border-zinc-800 mb-4 overflow-x-auto">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === idx
                            ? 'text-black dark:text-white'
                            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                            }`}
                    >
                        {tab}
                        {activeTab === idx && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                >
                    {childrenArray[activeTab]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
