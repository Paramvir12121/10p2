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
    
    // Added visibility controls for work and break timers
    const [showWorkTimer, setShowWorkTimer] = useState(true);
    const [showBreakTimer, setShowBreakTimer] = useState(true);
    
    // Toggle functions for easier control
    const toggleWorkTimer = () => setShowWorkTimer(prev => !prev);
    const toggleBreakTimer = () => setShowBreakTimer(prev => !prev);
    
    // Toggle both timers together
    const toggleBothTimers = (value) => {
        setShowWorkTimer(value);
        setShowBreakTimer(value);
    };

    const value = {
        openTimer,
        setOpenTimer,
        openBreakTimer,
        setOpenBreakTimer,
        openTaskList,
        setOpenTaskList,
        openMusic,
        setOpenMusic,
        // Add new controls
        showWorkTimer,
        setShowWorkTimer,
        showBreakTimer,
        setShowBreakTimer,
        toggleWorkTimer,
        toggleBreakTimer,
        toggleBothTimers
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