'use client';
import React, { createContext, useContext, useState } from 'react';

// Create the context
const DashContext = createContext();

// Create a provider component
export const DashProvider = ({ children }) => {
    const [openTimer, setOpenTimer] = useState(false);
    const [openBreakTimer, setOpenBreakTimer] = useState(false);
    const [openTaskList, setOpenTaskList] = useState(false);
    const [openMusic, setOpenMusic] = useState(false);
    

    const value = {
        openTimer,
        setOpenTimer,
        openBreakTimer,
        setOpenBreakTimer,
        openTaskList,
        setOpenTaskList,
        openMusic,
        setOpenMusic,

    };

    return <DashContext.Provider value={value}>
        {children}
        </DashContext.Provider>;
};

// Custom hook to use the DashContext
export const useDashContext = () => {
    const context = useContext(DashContext);
    if (!context) {
        throw new Error('useDashContext must be used within a DashProvider');
    }
    return context;
};