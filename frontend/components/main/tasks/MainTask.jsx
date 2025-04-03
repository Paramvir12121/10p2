import React, { memo, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, GripVertical, Clock, Flag, Tag } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';

const MainTask = ({ 
    focusTask, 
    onComplete, 
    isReceivingTask = false, 
    isCompletedOver = false 
}) => {
    const [showEnterAnimation, setShowEnterAnimation] = useState(false);
    const [prevTaskId, setPrevTaskId] = useState(null);

    // Set up the drop area for the focus task
    const { setNodeRef, isOver } = useDroppable({
        id: 'focus-area',
        data: {
            type: 'focus-area',
        }
    });

    // Track task changes to trigger animations
    useEffect(() => {
        if (focusTask?.id !== prevTaskId) {
            if (focusTask) {
                setShowEnterAnimation(true);
                setTimeout(() => setShowEnterAnimation(false), 500);
            }
            setPrevTaskId(focusTask?.id);
        }
    }, [focusTask, prevTaskId]);

    // Extra styling for when trying to drop completed task
    const completedDropWarning = isCompletedOver 
        ? 'ring-2 ring-orange-300 bg-orange-50 dark:bg-orange-900/20' 
        : '';

    return (
        <Card 
            ref={setNodeRef} 
            className={`rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${isOver ? 'ring-2 ring-primary/30' : ''} ${isReceivingTask ? 'bg-primary/5 ring-1 ring-primary/20 focus-receive' : ''} ${isCompletedOver ? completedDropWarning : ''}`}
        >
            <div className="flex items-center justify-between p-1.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 card-header">
                <div className="flex items-center gap-1 text-[13px] font-medium">
                    <Target className="h-3.5 w-3.5 text-primary/70" />
                    Current Focus
                </div>
                
                <div className="flex items-center gap-1">
                    {focusTask && (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-6 text-[12px] px-1.5 py-0 rounded-sm"
                            onClick={() => onComplete(focusTask.id)}
                        >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                        </Button>
                    )}
                    <div className="card-header h-6 w-6 flex items-center justify-center rounded-sm hover:bg-muted/80">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </div>
            
            <div className="p-2">
                {focusTask ? (
                    <div className={`border rounded-sm p-1.5 text-[13px] transition-all duration-300 min-h-[50px] flex flex-col gap-1
                        ${isOver ? 'bg-primary/10 border-primary/40' : 'bg-primary/5 border-primary/20'}
                        ${showEnterAnimation ? 'task-focus-enter' : ''}`}
                    >
                        <p className="leading-tight">{focusTask.text}</p>
                        
                        {/* Task metadata section */}
                        <div className="flex items-center gap-1.5 mt-1">
                            {focusTask.dueDate && (
                                <div className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                                    <Clock className="h-2.5 w-2.5" />
                                    <span>{new Date(focusTask.dueDate).toLocaleDateString()}</span>
                                </div>
                            )}
                            
                            {focusTask.priority && (
                                <div className={`flex items-center gap-0.5 text-[11px] ${
                                    focusTask.priority === 'high' ? 'text-red-500' : 
                                    focusTask.priority === 'medium' ? 'text-amber-500' : 
                                    'text-blue-500'
                                }`}>
                                    <Flag className="h-2.5 w-2.5" />
                                    <span>{focusTask.priority}</span>
                                </div>
                            )}
                            
                            {focusTask.tags && focusTask.tags.length > 0 && (
                                <div className="flex items-center gap-0.5">
                                    {focusTask.tags.map((tag, index) => (
                                        <Badge 
                                            key={index} 
                                            variant="outline" 
                                            className="text-[10px] px-1 py-0 h-3.5 bg-muted/30"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={`text-center py-3 text-[13px] rounded-sm transition-all duration-300 min-h-[50px] flex flex-col justify-center
                        ${isOver ? 'bg-primary/10 border border-dashed border-primary/40 scale-[1.02]' : 'border border-dashed border-primary/20'}
                        ${isReceivingTask ? 'animate-pulse' : ''}`}
                    >
                        {isOver ? (
                            <p className="font-medium text-primary">Drop to set as focus</p>
                        ) : (
                            <>
                                <p>No active task set</p>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                    Drag a task here to focus on it
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

MainTask.displayName = 'MainTask';

export default memo(MainTask);