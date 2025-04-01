import { useState, useEffect } from 'react';

// Custom hook to manage draggable element state and persistence
export function useDraggableElement(id, defaultPosition = { x: 0, y: 0 }) {
  // State for the current position of the draggable element
  const [position, setPosition] = useState(defaultPosition);
  // State to track if the element is being dragged
  const [isDragging, setIsDragging] = useState(false);

  // Load saved position from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPosition = localStorage.getItem(`draggable-${id}`);
        if (savedPosition) {
          setPosition(JSON.parse(savedPosition));
        }
      } catch (error) {
        console.error("Error loading position from localStorage:", error);
      }
    }
  }, [id]);

  // Handle the start of dragging
  const handleStart = () => {
    setIsDragging(true);
  };

  // Handle the drag event
  const handleDrag = (e, data) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
  };

  // Handle the end of dragging
  const handleStop = (e, data) => {
    setIsDragging(false);
    
    // Save position to localStorage
    const newPosition = { x: data.x, y: data.y };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`draggable-${id}`, JSON.stringify(newPosition));
      } catch (error) {
        console.error("Error saving position to localStorage:", error);
      }
    }
    setPosition(newPosition);
  };

  // Reset position to default
  const resetPosition = () => {
    setPosition(defaultPosition);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`draggable-${id}`);
    }
  };

  return {
    position,
    isDragging,
    handleStart,
    handleDrag,
    handleStop,
    resetPosition
  };
}
