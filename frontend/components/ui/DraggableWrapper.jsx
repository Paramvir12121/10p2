'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

export default function DraggableWrapper({
  id,
  children,
  defaultPosition = { x: 20, y: 20 },
  bounds = "parent",
  className,
  handle = true,
  showReset = true,
  zIndex = 10
}) {
  const elementRef = useRef(null);
  
  // Get position from local storage or use default
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Update position from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`draggable-${id}`);
        if (saved) {
          setPosition(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading position from localStorage:", error);
      }
    }
  }, [id]);

  // Save position to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isDragging) {
      try {
        localStorage.setItem(`draggable-${id}`, JSON.stringify(position));
      } catch (error) {
        console.error("Error saving position to localStorage:", error);
      }
    }
  }, [position, id, isDragging]);

  const handleMouseDown = (e) => {
    // Only allow dragging from the handle if it's enabled
    if (handle && !e.target.closest('.drag-handle')) return;

    setIsDragging(true);
    
    // Calculate the offset between mouse and the component's top-left corner
    const rect = elementRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Prevent text selection while dragging
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const parentRect = elementRef.current.parentElement.getBoundingClientRect();
    const elemRect = elementRef.current.getBoundingClientRect();
    
    // Calculate new position
    let newX = e.clientX - parentRect.left - offset.x;
    let newY = e.clientY - parentRect.top - offset.y;
    
    // Apply bounds if specified
    if (bounds === 'parent') {
      newX = Math.max(0, Math.min(newX, parentRect.width - elemRect.width));
      newY = Math.max(0, Math.min(newY, parentRect.height - elemRect.height));
    }
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Handle touch events
  const handleTouchStart = (e) => {
    // Only allow dragging from the handle if it's enabled
    if (handle && !e.target.closest('.drag-handle')) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    
    // Calculate the offset between touch and the component's top-left corner
    const rect = elementRef.current.getBoundingClientRect();
    setOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const parentRect = elementRef.current.parentElement.getBoundingClientRect();
    const elemRect = elementRef.current.getBoundingClientRect();
    
    // Calculate new position
    let newX = touch.clientX - parentRect.left - offset.x;
    let newY = touch.clientY - parentRect.top - offset.y;
    
    // Apply bounds if specified
    if (bounds === 'parent') {
      newX = Math.max(0, Math.min(newX, parentRect.width - elemRect.width));
      newY = Math.max(0, Math.min(newY, parentRect.height - elemRect.height));
    }
    
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add global event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, offset]);

  const resetPosition = () => {
    setPosition(defaultPosition);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`draggable-${id}`);
    }
  };

  return (
    <div 
      ref={elementRef}
      className={cn(
        "absolute",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        "transition-shadow shadow-md",
        isDragging && "shadow-lg",
        className
      )}
      style={{ 
        left: position.x,
        top: position.y,
        zIndex: isDragging ? zIndex + 10 : zIndex
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {handle && (
        <div className="drag-handle flex items-center justify-between p-2 bg-card/80 backdrop-blur-sm rounded-t-md border-b border-border hover:bg-muted/50 cursor-grab">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          {showReset && (
            <button 
              onClick={resetPosition} 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      )}
      <div className={isDragging ? "cursor-grabbing pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}
