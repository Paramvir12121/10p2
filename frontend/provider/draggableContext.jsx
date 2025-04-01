'use client';
import React, { createContext, useContext, useState } from 'react';

// Create the context
const DraggableContext = createContext();

// Create a provider component
export const DraggableProvider = ({ children }) => {
  // Track which element is currently being dragged (for z-index management)
  const [activeElement, setActiveElement] = useState(null);
  
  // Track z-index of elements to ensure proper stacking
  const [zIndices, setZIndices] = useState({});
  
  // Function to bring a component to the front (increase z-index)
  const bringToFront = (id) => {
    setActiveElement(id);
    setZIndices(prev => {
      // Get current max z-index
      const maxZ = Object.values(prev).reduce((max, z) => Math.max(max, z), 10);
      return {
        ...prev,
        [id]: maxZ + 1
      };
    });
  };
  
  // Reset all positions
  const resetAllPositions = () => {
    if (typeof window !== 'undefined') {
      // Clear all draggable positions from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('draggable-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Force reload to reset positions visually
      window.location.reload();
    }
  };

  const value = {
    activeElement,
    zIndices,
    bringToFront,
    resetAllPositions
  };

  return <DraggableContext.Provider value={value}>{children}</DraggableContext.Provider>;
};

// Custom hook to use the DraggableContext
export const useDraggableContext = () => {
  const context = useContext(DraggableContext);
  if (!context) {
    throw new Error('useDraggableContext must be used within a DraggableProvider');
  }
  return context;
};
