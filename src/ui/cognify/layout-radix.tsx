'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/shadcn/tabs';
import {
    Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from '@/ui/shadcn/accordion';

// --- CognifyTabs ---

interface CognifyTabsProps {
    tabs: string[];
    children: React.ReactNode;
}

export const CognifyTabs: React.FC<CognifyTabsProps> = ({ tabs = [], children }) => {
    const childrenArray = React.Children.toArray(children);

    return (
        <Tabs defaultValue="tab-0" className="w-full">
            <TabsList className="w-full justify-start">
                {tabs.map((tab, idx) => (
                    <TabsTrigger key={idx} value={`tab-${idx}`}>
                        {tab}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map((_, idx) => (
                <TabsContent key={idx} value={`tab-${idx}`}>
                    {childrenArray[idx] ?? null}
                </TabsContent>
            ))}
        </Tabs>
    );
};

// --- CognifyAccordion ---

interface CognifyAccordionProps {
    allowMultiple?: boolean;
    children: React.ReactNode;
}

export const CognifyAccordion: React.FC<CognifyAccordionProps> = ({ allowMultiple = false, children }) => {
    const items = React.Children.toArray(children);

    if (allowMultiple) {
        return (
            <Accordion type="multiple" defaultValue={['item-0']} className="w-full rounded-xl border border-border overflow-hidden">
                {items.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="px-4">Section {idx + 1}</AccordionTrigger>
                        <AccordionContent className="px-4">{item}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        );
    }

    return (
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full rounded-xl border border-border overflow-hidden">
            {items.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="px-4">Section {idx + 1}</AccordionTrigger>
                    <AccordionContent className="px-4">{item}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
