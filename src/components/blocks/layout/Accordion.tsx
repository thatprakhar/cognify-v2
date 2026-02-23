'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
 allowMultiple?: boolean;
 children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ allowMultiple = false, children }) => {
 const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0])); // First open by default

 const toggle = (idx: number) => {
 setOpenIndexes(prev => {
 const next = new Set(prev);
 if (next.has(idx)) {
 next.delete(idx);
 } else {
 if (!allowMultiple) {
 next.clear();
 }
 next.add(idx);
 }
 return next;
 });
 };

 const items = React.Children.toArray(children);

 return (
 <div className="w-full border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200 ">
 {items.map((item, idx) => {
 const isOpen = openIndexes.has(idx);
 // We assume each child has some title prop, or we extract it.
 // In a real system, the children might be special wrapper elements, but for MVP:
 // We can't easily extract title from children unless they expose it. Let's just use "Section N".
 // Actually, accordion usually wraps specific items. Let's just render the item directly 
 // and give a generic toggle or expect the item to handle it.
 // Wait, if children are just layout/content blocks, we need a title.
 // Let's assume the first child of the item is the header?
 // The UISpec doesn't define AccordionItem. Let's just number them for now.
 const title = `Section ${idx + 1}`;

 return (
 <div key={idx} className="bg-white ">
 <button
 onClick={() => toggle(idx)}
 className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-zinc-50 transition-colors"
 >
 <span>{title}</span>
 <motion.div
 animate={{ rotate: isOpen ? 180 : 0 }}
 transition={{ duration: 0.2 }}
 >
 <ChevronDown className="w-4 h-4 text-zinc-500" />
 </motion.div>
 </button>
 <AnimatePresence initial={false}>
 {isOpen && (
 <motion.section
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden"
 >
 <div className="p-4 pt-0 border-t border-zinc-100 ">
 {item}
 </div>
 </motion.section>
 )}
 </AnimatePresence>
 </div>
 );
 })}
 </div>
 );
};
