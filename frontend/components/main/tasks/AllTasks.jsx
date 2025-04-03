import React, { memo, useEffect, useState, useRef, useCallback } from 'react';
import MainTask from './MainTask';
import Tasks from './Tasks';
import { useTasks } from '@/hooks/useTasks';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useDashContext } from '@/provider/dashContext';
import { SortableTask } from './SortableTask';
import { createPortal } from 'react-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Undo2, KeyRound } from "lucide-react";

// Keyboard shortcuts help tooltip
const KeyboardShortcutHelp = ({ open, onClose }) => {
  if (!open) return null;
  
  return (
    <div className="absolute right-2 top-12 z-20 p-3 bg-card border rounded-md shadow-md w-64 border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Keyboard Shortcuts</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          ×
        </Button>
      </div>
      <div className="space-y-1">
        <div className="grid grid-cols-2 text-sm">  {/* Increased from text-xs */}
          <span className="font-mono bg-muted px-1 rounded">Ctrl+K</span>
          <span>Search tasks</span>
        </div>
        <div className="grid grid-cols-2 text-sm">  {/* Increased from text-xs */}
          <span className="font-mono bg-muted px-1 rounded">Ctrl+N</span>
          <span>New task</span>
        </div>
        <div className="grid grid-cols-2 text-sm">  {/* Increased from text-xs */}
          <span className="font-mono bg-muted px-1 rounded">Ctrl+Z</span>
          <span>Undo last action</span>
        </div>
        <div className="grid grid-cols-2 text-sm">  {/* Increased from text-xs */}
          <span className="font-mono bg-muted px-1 rounded">Space</span>
          <span>Select/deselect task</span>
        </div>
      </div>
    </div>
  );
};

// Custom drop animation configuration for smoother transitions
const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
  duration: 350,
  easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
};

const AllTasks = ({ initialTasks = [] }) => {
  const {
    tasks,
    focusTask,
    focusTaskId,
    setTaskAsFocus,
    toggleTaskCompletion,
    addTask,
    deleteTask,
    reorderTasks,
    batchAction,
    undoLastAction,
    getTopmostIncompleteTask,
    isMovingToFocus
  } = useTasks(initialTasks);
  
  // Track active dragging item for overlay
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  // Refs for task positions
  const focusAreaRef = useRef(null);
  const taskListRef = useRef({});
  
  // Animation state
  const [animatingTaskId, setAnimatingTaskId] = useState(null);
  const [animationDetails, setAnimationDetails] = useState(null);
  
  // Get timer state from context
  const { workTimerRunning } = useDashContext();
  
  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Z to undo last action
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoLastAction();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoLastAction]);
  
  // When timer starts, if no focus task, auto-select the top task
  useEffect(() => {
    // Only run when the timer starts (not when it stops)
    if (workTimerRunning && !focusTask) {
      const topmostTask = getTopmostIncompleteTask();
      if (topmostTask) {
        setTaskAsFocus(topmostTask.id);
        toast.info('Timer started', {
          description: 'Auto-focused on top task'
        });
      }
    }
  }, [workTimerRunning, focusTask, getTopmostIncompleteTask, setTaskAsFocus]);
  
  // Configure DnD sensors with better defaults
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Reduce the activation constraint for smoother pickup
      activationConstraint: {
        delay: 100, // Small delay to prevent accidental drags
        tolerance: 5,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag start to set up overlay
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    // Find the active task data for the overlay
    const draggedTask = tasks.find(task => task.id === active.id);
    setActiveTask(draggedTask);
  };
  
  // Handle drag end events with improved animation
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Reset state
    setActiveId(null);
    setActiveTask(null);
    
    if (!over) return;
    
    // If dragging to focus area
    if (over.id === 'focus-area') {
      // Check if the task is completed
      const draggedTask = tasks.find(task => task.id === active.id);
      if (draggedTask && draggedTask.completed) {
        // Show a toast notification that completed tasks can't be focus
        toast.info("Can't set as focus", {
          description: "Completed tasks cannot be set as your current focus.",
          duration: 3000,
        });
        return;
      }
      
      // Set the animation state
      setAnimatingTaskId(active.id);
      
      // Get position of the dragged task and focus area for animation
      const taskElement = taskListRef.current[active.id];
      const focusAreaElement = focusAreaRef.current;
      
      if (taskElement && focusAreaElement) {
        const taskRect = taskElement.getBoundingClientRect();
        const focusRect = focusAreaElement.getBoundingClientRect();
        
        // Find the target position inside the focus area (not at the heading)
        const targetY = focusRect.top + focusRect.height * 0.5;
        const targetX = focusRect.left + focusRect.width * 0.5;
        
        setAnimationDetails({
          id: active.id,
          fromRect: taskRect,
          toRect: {
            top: targetY - (taskRect.height / 2),
            left: targetX - (taskRect.width / 2),
            width: taskRect.width,
            height: taskRect.height
          },
          task: tasks.find(task => task.id === active.id)
        });
        
        // Delay actual state change until animation completes
        setTimeout(() => {
          setTaskAsFocus(active.id);
          setAnimatingTaskId(null);
          setAnimationDetails(null);
        }, 280);
      } else {
        // Fallback if elements not found
        setTaskAsFocus(active.id);
      }
      return;
    }
    
    // Regular reordering within the task list
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex(item => item.id === active.id);
      const newIndex = tasks.findIndex(item => item.id === over.id);
      const newTasksOrder = arrayMove([...tasks], oldIndex, newIndex);
      reorderTasks(newTasksOrder);
    }
  };

  // Store refs for task positions
  const registerTaskRef = useCallback((id, element) => {
    if (element && id) {
      taskListRef.current[id] = element;
    }
  }, []);
  
  return (
    <div className="relative">
      {/* Keyboard shortcuts button */}
      <div className="absolute -top-6 right-0 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={undoLastAction}
          title="Undo last action (Ctrl+Z)"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
        
        {/* <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 ml-1"
          onClick={() => setShowShortcuts(!showShortcuts)}
          title="Keyboard shortcuts"
        >
          <KeyRound className="h-3.5 w-3.5" />
        </Button> */}
      </div>
      
      {/* Keyboard shortcuts help */}
      <KeyboardShortcutHelp 
        open={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dropAnimation={dropAnimation}
      >
        <div className="flex flex-col space-y-6 w-90">
          <div ref={focusAreaRef}>
            <MainTask 
              focusTask={focusTask}
              onComplete={toggleTaskCompletion}
              isReceivingTask={animatingTaskId !== null}
            />
          </div>
          <Tasks 
            tasks={tasks}
            focusTaskId={focusTaskId}
            onAddTask={addTask}
            onToggleTask={toggleTaskCompletion}
            onDeleteTask={deleteTask}
            onBatchAction={batchAction}
            registerTaskRef={registerTaskRef}
            animatingTaskId={animatingTaskId}
          />
        </div>
        
        {/* Fixed drag overlay with proper sizing */}
        <DragOverlay adjustScale={false} zIndex={100}>
          {activeId && activeTask ? (
            <div className="opacity-90">
              <SortableTask
                id={activeTask.id}
                text={activeTask.text}
                completed={activeTask.completed}
                isMainTask={activeTask.id === focusTaskId}
                isDragOverlay={true}
                onToggle={() => {}}
                onDelete={() => {}}
                tags={activeTask.tags}
                dueDate={activeTask.dueDate}
                priority={activeTask.priority}
              />
            </div>
          ) : null}
        </DragOverlay>
        
        {/* Flying task animation */}
        {animationDetails && typeof document !== 'undefined' && createPortal(
          <div 
            className="fixed pointer-events-none z-50 transition-all duration-280 ease-out"
            style={{
              top: animationDetails.fromRect.top,
              left: animationDetails.fromRect.left,
              width: animationDetails.fromRect.width,
              height: animationDetails.fromRect.height,
              transform: `translate(
                ${animationDetails.toRect.left - animationDetails.fromRect.left}px,
                ${animationDetails.toRect.top - animationDetails.fromRect.top}px
              )`,
              opacity: 0.9,
            }}
          >
            <SortableTask
              id={animationDetails.task.id}
              text={animationDetails.task.text}
              completed={animationDetails.task.completed}
              isMainTask={false}
              isDragOverlay={true}
              onToggle={() => {}}
              onDelete={() => {}}
              tags={animationDetails.task.tags}
              dueDate={animationDetails.task.dueDate}
              priority={animationDetails.task.priority}
            />
          </div>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default memo(AllTasks);
