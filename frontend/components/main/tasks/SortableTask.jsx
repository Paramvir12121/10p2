import React, { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, CheckCircle, Circle, Star } from 'lucide-react';

export function SortableTask({ 
  id, 
  text, 
  completed, 
  isMainTask, 
  onToggle, 
  onDelete,
  isDragOverlay = false,
  isAnimating = false,
  registerRef = () => {}
}) {
  const [isNew, setIsNew] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id,
    transition: {
      duration: 250, // Slightly faster for snappier feel
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring-like easing curve
    }
  });

  // Use a ref to combine sortable ref with our registration ref
  const ref = useRef(null);

  // Register the element for animation tracking
  useEffect(() => {
    if (ref.current) {
      registerRef(ref.current);
    }
  }, [registerRef]);

  // Remove "new" state after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle completion animation
  const handleToggle = () => {
    if (!completed && !isDragOverlay) {
      setIsCompleting(true);
      setTimeout(() => {
        onToggle();
        setIsCompleting(false);
      }, 400); // Wait for animation to complete
    } else {
      onToggle();
    }
  };

  // Combined ref handler
  const setRefs = (element) => {
    setNodeRef(element);
    ref.current = element;
  };

  // Enhanced animation styles
  const style = {
    transform: CSS.Transform.toString(transform ? {
      ...transform,
      scaleX: isDragging ? 1.03 : 1,
      scaleY: isDragging ? 1.03 : 1
    } : null),
    transition: isDragging ? transition : undefined,
    opacity: isDragging ? 0.8 : isAnimating ? 0 : 1,
    zIndex: isDragging ? 10 : 1,
    boxShadow: isDragging ? '0 8px 20px rgba(0,0,0,0.15)' : isDragOverlay ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
    visibility: isAnimating ? 'hidden' : 'visible'
  };

  // Generate dynamic class names based on task state
  const taskClassNames = [
    'flex items-center gap-2 p-2 rounded-lg border',
    isDragging ? 'border-primary/60 bg-primary/5' : 'border-border',
    completed ? 'bg-muted/50' : 'bg-background',
    isMainTask && !completed ? 'border-primary/50 bg-primary/5' : '',
    'transition-all duration-200',
    isDragOverlay ? 'shadow-md bg-card' : '',
    isNew ? 'task-enter' : '',
    isCompleting ? 'task-complete' : '',
    // Add cursor not-allowed for completed tasks when dragging
    completed ? 'cursor-default' : '',
    // Apply hover states only when not dragging or animating
    (!isDragging && !isAnimating) ? 'hover:border-primary/30 hover:shadow-sm' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setRefs}
      style={style}
      className={taskClassNames}
      {...(!isDragOverlay ? attributes : {})}
      {...(completed ? { title: "Completed tasks can't be set as focus" } : {})}
    >
      <button
        onClick={handleToggle}
        className={`flex-none w-5 h-5 text-primary ${!completed ? 'hover:text-primary/80' : 'hover:text-primary/60'} transition-colors`}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {completed ? (
          <CheckCircle className="h-5 w-5 transition-transform duration-200 ease-spring" />
        ) : (
          <Circle className={`h-5 w-5 ${isCompleting ? 'scale-90' : ''} transition-transform duration-200`} />
        )}
      </button>
      
      <span 
        className={`flex-grow text-sm ${completed ? 'line-through text-muted-foreground' : ''} transition-all duration-300`}
      >
        {text}
      </span>
      
      {isMainTask && !completed && (
        <Star className="h-4 w-4 text-amber-500 flex-none animate-pulse" />
      )}
      
      {!isDragOverlay && !completed && ( // Only show drag handle if not completed
        <div 
          {...listeners}
          className="flex-none w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing hover:text-primary transition-colors"
          title="Drag to reorder or set as focus"
        >
          <GripVertical className="h-5 w-5" />
        </div>
      )}
      
      {!isDragOverlay && completed && ( // Show non-interactive drag handle for completed tasks
        <div 
          className="flex-none w-5 h-5 text-muted-foreground/40 cursor-not-allowed transition-colors"
          title="Completed tasks can't be set as focus"
        >
          <GripVertical className="h-5 w-5" />
        </div>
      )}
      
      {!isDragOverlay && ( // Don't show buttons on the overlay
        <button
          onClick={onDelete}
          className="flex-none w-5 h-5 text-muted-foreground hover:text-destructive transition-colors opacity-60 hover:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
