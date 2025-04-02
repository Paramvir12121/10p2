import React, { memo, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, GripVertical } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';

const MainTask = ({ focusTask, onComplete, isReceivingTask = false, isCompletedOver = false }) => {
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

    // Determine animation classes
    const cardAnimation = [
        'p-2 shadow-sm max-w-[320px] w-full text-xs',
        isOver ? 'ring-2 ring-primary/30 scale-[1.01]' : '',
        isReceivingTask ? 'bg-primary/5 ring-1 ring-primary/20 focus-receive' : '',
        (!isOver && !isReceivingTask) ? 'hover:shadow-sm hover:border-primary/20' : '',
        isCompletedOver ? completedDropWarning : '',
    ].filter(Boolean).join(' ');

    return (
        <Card 
            ref={setNodeRef} 
            className={cardAnimation}
        >
            <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1">
                    <Target className="h-3.5 w-3.5 text-primary/70" />
                    <h2 className="text-xs font-semibold">Current Focus</h2>
                </div>
                
                <div className="flex items-center gap-1">
                    {focusTask && (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-1 text-[10px] px-1.5 py-0 h-5 rounded-sm"
                            onClick={() => onComplete(focusTask.id)}
                        >
                            <CheckCircle className="h-2.5 w-2.5" />
                            Complete
                        </Button>
                    )}
                    {/* Add drag handle */}
                    <div className="card-header h-5 w-5 flex items-center justify-center rounded-sm hover:bg-muted/80">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                </div>
            </div>
            
            {focusTask ? (
                <div className={`border rounded-sm p-1.5 text-[11px] transition-all duration-300 min-h-[40px] flex items-center
                    ${isOver ? 'bg-primary/10 border-primary/40' : 'bg-primary/5 border-primary/20'}
                    ${showEnterAnimation ? 'task-focus-enter' : ''}`}
                >
                    <p className="leading-tight">{focusTask.text}</p>
                </div>
            ) : (
                <div className={`text-center py-3 text-[11px] rounded-sm transition-all duration-300 min-h-[40px] flex flex-col justify-center
                    ${isOver ? 'bg-primary/10 border border-dashed border-primary/40 scale-[1.02]' : 'border border-dashed border-primary/20'}
                    ${isReceivingTask ? 'animate-pulse' : ''}`}
                >
                    {isOver ? (
                        <>
                            <p className="font-medium text-primary">Drop to set as focus</p>
                        </>
                    ) : (
                        <>
                            <p>No active task set</p>
                        </>
                    )}
                </div>
            )}
        </Card>
    );
};

export default memo(MainTask);