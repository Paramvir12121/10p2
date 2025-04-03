'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function DraggableWrapper({
  id,
  children,
  defaultPosition = { x: 20, y: 20 },
  bounds = "parent",
  className,
  handleSelector = ".card-header", // CSS selector for the handle element
  showReset = false,
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
    // Only allow dragging from the handle if it exists
    if (handleSelector && !e.target.closest(handleSelector)) return;

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
    
    // Get references for boundary calculations
    const elemRect = elementRef.current.getBoundingClientRect();
    
    // Calculate new position
    let newX, newY;
    
    if (bounds === "viewport") {
      // For viewport bounds, use window dimensions
      newX = e.clientX - offset.x;
      newY = e.clientY - offset.y;
      
      // Constrain to viewport
      const maxX = window.innerWidth - elemRect.width;
      const maxY = window.innerHeight - elemRect.height;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    } else {
      // For parent bounds (container)
      const parentRect = elementRef.current.parentElement.getBoundingClientRect();
      newX = e.clientX - parentRect.left - offset.x;
      newY = e.clientY - parentRect.top - offset.y;
      
      // Apply bounds if specified
      if (bounds === 'parent') {
        newX = Math.max(0, Math.min(newX, parentRect.width - elemRect.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - elemRect.height));
      }
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
    // Only allow dragging from the handle if it exists
    if (handleSelector && !e.target.closest(handleSelector)) return;
    
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
    const elemRect = elementRef.current.getBoundingClientRect();
    
    // Calculate new position
    let newX, newY;
    
    if (bounds === "viewport") {
      // For viewport bounds, use window dimensions 
      newX = touch.clientX - offset.x;
      newY = touch.clientY - offset.y;
      
      // Constrain to viewport
      const maxX = window.innerWidth - elemRect.width;
      const maxY = window.innerHeight - elemRect.height;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    } else {
      // For parent bounds
      const parentRect = elementRef.current.parentElement.getBoundingClientRect();
      newX = touch.clientX - parentRect.left - offset.x;
      newY = touch.clientY - parentRect.top - offset.y;
      
      // Apply bounds if specified
      if (bounds === 'parent') {
        newX = Math.max(0, Math.min(newX, parentRect.width - elemRect.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - elemRect.height));
      }
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

  return (
    <div 
      ref={elementRef}
      className={cn(
        "absolute",
        isDragging && "cursor-grabbing",
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
      {children}
    </div>
  );
}
