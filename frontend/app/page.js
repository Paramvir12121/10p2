'use client';

import { useState, useEffect } from 'react';
import Timer from "@/components/main/timer/DoubleTimer";
import AllTasks from "@/components/main/tasks/AllTasks";
import DraggableWrapper from "@/components/ui/DraggableWrapper";

export default function Home() {
  // Initial tasks data
  const initialTasks = [
    { id: '1', text: 'Complete project proposal', completed: false },
    { id: '2', text: 'Research competitor products', completed: false },
    { id: '3', text: 'Design user interface mockups', completed: false },
  ];

  // Initialize with safe default positions
  const [timerPosition, setTimerPosition] = useState({ x: 40, y: 20 });
  
  // Update positions after component mounts in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimerPosition({ x: window.innerWidth - 420, y: 20 });
    }
  }, []);

  return (
    <div className="container relative min-h-screen">
      {/* Draggable tasks */}
      <DraggableWrapper id="tasks-component" defaultPosition={{ x: 20, y: 20 }} bounds="parent" zIndex={10}>
        
          <AllTasks initialTasks={initialTasks} />
        
      </DraggableWrapper>
      
      {/* Draggable timer */}
      <DraggableWrapper id="timer-component" defaultPosition={timerPosition} bounds="parent" zIndex={20}>
          <Timer />
       
      </DraggableWrapper>
    </div>
  );
}
