'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface ExperienceContextType {
    submitClarification: (answers: Record<string, string>) => void;
}

const ExperienceContext = createContext<ExperienceContextType | null>(null);

export const useExperienceContext = () => {
    const context = useContext(ExperienceContext);
    if (!context) {
        throw new Error("useExperienceContext must be used within an ExperienceProvider");
    }
    return context;
};

export const ExperienceProvider = ({
    children,
    submitClarification
}: {
    children: ReactNode;
    submitClarification: (answers: Record<string, string>) => void;
}) => {
    return (
        <ExperienceContext.Provider value={{ submitClarification }}>
            {children}
        </ExperienceContext.Provider>
    );
};
