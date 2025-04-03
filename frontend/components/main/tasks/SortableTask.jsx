import React, { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, CheckCircle, Circle, Star, Calendar, Flag, Tag, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SortableTask({ 
  id, 
  text, 
  completed, 
  isMainTask, 
  isSelected = false,
  onToggle, 
  onDelete,
  onSelect,
  isDragOverlay = false,
  isAnimating = false,
  registerRef = () => {},
  tags = [],
  dueDate,
  priority,
  notes
}) {
  const [isNew, setIsNew] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
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
      duration: 250,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    disabled: completed // Disable dragging for completed tasks
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
      }, 400); 
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

  // Is the task overdue?
  const isOverdue = dueDate && new Date(dueDate) < new Date() && !completed;

  // Generate dynamic class names based on task state
  const taskClassNames = cn(
    'rounded-sm border overflow-hidden',
    isDragging ? 'border-primary/60 bg-primary/5' : 'border-slate-200 dark:border-slate-800',
    completed ? 'bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-900',
    isMainTask && !completed ? 'border-primary/40 bg-primary/5' : '',
    isSelected ? 'ring-1 ring-primary/50' : '',
    'transition-all duration-200',
    isDragOverlay ? 'shadow-sm bg-card' : '',
    isNew ? 'task-enter' : '',
    isCompleting ? 'task-complete' : '',
    isOverdue ? 'border-red-200 dark:border-red-900/30' : '',
    completed ? 'cursor-default' : '',
    (!isDragging && !isAnimating) ? 'hover:border-primary/30 hover:shadow-sm' : '',
  );

  // Format due date for display
  const formatDueDate = (date) => {
    if (!date) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) return 'Today';
    if (taskDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return taskDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Render priority indicator with appropriate color
  const renderPriority = (prio) => {
    if (!prio) return null;
    
    const colors = {
      high: 'text-red-500',
      medium: 'text-amber-500',
      low: 'text-blue-500'
    };
    
    return (
      <div className={`flex items-center gap-0.5 ${colors[prio]}`}>
        <Flag className="h-2.5 w-2.5" />
      </div>
    );
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={taskClassNames}
      {...(!isDragOverlay ? attributes : {})}
      onClick={(e) => {
        // Don't trigger selection when clicking specific controls
        const isActionClick = e.target.closest('button') || 
                             e.target.closest('[role="button"]') ||
                             e.target.closest('.task-action');
        if (!isActionClick && onSelect && !completed) onSelect();
      }}
      {...(completed ? { title: "Completed tasks can't be set as focus" } : {})}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1 py-1 px-1.5">
          <button
            onClick={handleToggle}
            className={`flex-none w-3.5 h-3.5 ${!completed ? 'text-primary/80 hover:text-primary' : 'text-slate-400 hover:text-slate-500'} transition-colors task-action`}
            aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {completed ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <Circle className={`h-3 w-3 ${isCompleting ? 'scale-90' : ''}`} />
            )}
          </button>
          
          <span 
            className={`flex-grow text-[13px] leading-tight truncate ${completed ? 'line-through text-slate-400' : isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'} transition-all duration-300`}
          >
            {text}
          </span>
          
          {isMainTask && !completed && (
            <Star className="h-3 w-3 text-amber-500/80 flex-none task-action" />
          )}
          
          {notes && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex-none w-3.5 h-3.5 text-slate-400 hover:text-primary/70 transition-colors task-action"
              title="View notes"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
          
          {!isDragOverlay && !completed && (
            <div 
              {...listeners}
              className="flex-none w-3.5 h-3.5 text-slate-400 cursor-grab active:cursor-grabbing hover:text-primary/70 transition-colors task-action"
              title="Drag to reorder or set as focus"
            >
              <GripVertical className="h-3 w-3" />
            </div>
          )}
          
          {!isDragOverlay && completed && (
            <div 
              className="flex-none w-3.5 h-3.5 text-slate-300 dark:text-slate-600 cursor-not-allowed transition-colors task-action"
              title="Completed tasks can't be set as focus"
            >
              <GripVertical className="h-3 w-3" />
            </div>
          )}
          
          {!isDragOverlay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-none w-3.5 h-3.5 text-slate-400 hover:text-red-500/80 transition-colors task-action"
              aria-label="Delete task"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Task metadata row */}
        {((dueDate || priority || (tags && tags.length > 0)) && !isDragOverlay) && (
          <div className="flex items-center gap-1.5 ml-4 px-1 mb-0.5">
            {dueDate && (
              <div className={`flex items-center gap-0.5 text-[11px] ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                <Calendar className="h-2.5 w-2.5" />
                <span>{formatDueDate(dueDate)}</span>
              </div>
            )}
            
            {renderPriority(priority)}
            
            {tags && tags.length > 0 && (
              <div className="flex items-center gap-0.5 flex-wrap">
                {tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-[10px] px-1 py-0 h-3 bg-muted/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Expandable notes section */}
        {showNotes && notes && (
          <div className="ml-4 mt-0.5 px-1 mb-1 text-[11px] text-muted-foreground bg-muted/20 p-1 rounded">
            {notes}
          </div>
        )}
      </div>
    </div>
  );
}
