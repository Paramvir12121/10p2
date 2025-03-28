import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, CheckCircle, Circle, Star } from 'lucide-react';

export function SortableTask({ id, text, completed, isMainTask, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 p-2 rounded-lg border 
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'} 
        ${completed ? 'bg-muted/50' : 'bg-background'} 
        ${isMainTask && !completed ? 'border-primary/50 bg-primary/5' : ''}
      `}
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
      
      <button
        onClick={onDelete}
        className="flex-none w-5 h-5 text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      
      <div 
        {...attributes} 
        {...listeners}
        className="flex-none w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </div>
    </div>
  );
}
