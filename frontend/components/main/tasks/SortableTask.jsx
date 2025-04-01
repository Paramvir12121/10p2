import React, { useEffect, useRef } from 'react';
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
      duration: 300,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
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

  // Combined ref handler
  const setRefs = (element) => {
    setNodeRef(element);
    ref.current = element;
  };

  // Enhanced animation styles without scaling that might cause stretching
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isAnimating ? 0.6 : 1,
    zIndex: isDragging ? 1 : 0,
    boxShadow: isDragging || isDragOverlay ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
    height: 'auto',
    minHeight: isDragOverlay ? '56px' : undefined,
    // Add visibility for animating state
    visibility: isAnimating ? 'hidden' : 'visible'
  };

  // Generate dynamic class names based on task state
  const taskClassNames = [
    'flex items-center gap-2 p-2 rounded-lg border',
    isDragging ? 'border-primary/60 bg-primary/5' : 'border-border',
    completed ? 'bg-muted/50' : 'bg-background',
    isMainTask && !completed ? 'border-primary/50 bg-primary/5' : '',
    'transition-all duration-200 ease-in-out hover:border-primary/30',
    isDragOverlay ? 'shadow-md bg-card' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setRefs}
      style={style}
      className={taskClassNames}
      {...(!isDragOverlay ? attributes : {})}
    >
      <button
        onClick={onToggle}
        className="flex-none w-5 h-5 text-primary hover:text-primary/80 transition-colors"
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
      </button>
      
      <span 
        className={`flex-grow text-sm ${completed ? 'line-through text-muted-foreground' : ''}`}
      >
        {text}
      </span>
      
      {isMainTask && !completed && (
        <Star className="h-4 w-4 text-amber-500 flex-none" />
      )}
      
      {!isDragOverlay && ( // Don't show buttons on the overlay
        <>
          <button
            onClick={onDelete}
            className="flex-none w-5 h-5 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          
          <div 
            {...listeners}
            className="flex-none w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing hover:text-primary transition-colors"
            title="Drag to reorder or set as focus"
          >
            <GripVertical className="h-5 w-5" />
          </div>
        </>
      )}
    </div>
  );
}
