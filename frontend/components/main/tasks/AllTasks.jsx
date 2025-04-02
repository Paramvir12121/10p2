import React, { memo, useEffect, useState, useRef } from 'react';
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

// Custom drop animation configuration for smoother transitions
const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
  duration: 350, // Slower animation (default is 250ms)
  easing: 'cubic-bezier(0.33, 1, 0.68, 1)', // Smoother easing curve
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
    getTopmostIncompleteTask,
    isMovingToFocus
  } = useTasks(initialTasks);
  
  // Track active dragging item for overlay
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  
  // Refs for task positions
  const focusAreaRef = useRef(null);
  const taskListRef = useRef({});
  
  // Animation state
  const [animatingTaskId, setAnimatingTaskId] = useState(null);
  const [animationDetails, setAnimationDetails] = useState(null);
  
  // Get timer state from context
  const { workTimerRunning } = useDashContext();
  
  // When timer starts, if no focus task, auto-select the top task
  useEffect(() => {
    // Only run when the timer starts (not when it stops)
    if (workTimerRunning && !focusTask) {
      const topmostTask = getTopmostIncompleteTask();
      if (topmostTask) {
        setTaskAsFocus(topmostTask.id);
      }
    }
  }, [workTimerRunning, focusTask, getTopmostIncompleteTask, setTaskAsFocus]);
  
  // Configure DnD sensors with better defaults
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Reduce the activation constraint for smoother pickup
      activationConstraint: {
        delay: 100, // Small delay to prevent accidental drags
        tolerance: 5, // Lower tolerance for smoother pickup
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
        const targetY = focusRect.top + focusRect.height * 0.5; // Position halfway down
        const targetX = focusRect.left + focusRect.width * 0.5; // Position at center
        
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
        }, 280); // Slightly shorter for snappier feel
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
  const registerTaskRef = (id, element) => {
    if (element && id) {
      taskListRef.current[id] = element;
    }
  };
  
  return (
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
          />
        </div>,
        document.body
      )}
    </DndContext>
  );
};

export default memo(AllTasks);
