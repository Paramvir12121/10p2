import React, { memo, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle } from 'lucide-react';
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
        'p-4 shadow-sm max-w-md transition-all duration-300',
        isOver ? 'ring-4 ring-primary/30 scale-[1.02]' : '',
        isReceivingTask ? 'bg-primary/5 ring-2 ring-primary/20 focus-receive' : '',
        (!isOver && !isReceivingTask) ? 'hover:shadow-md hover:border-primary/20' : '',
        isCompletedOver ? completedDropWarning : '',
    ].filter(Boolean).join(' ');

    return (
        <Card 
            ref={setNodeRef} 
            className={cardAnimation}
        >
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Current Focus</h2>
                </div>
                
                {/* Complete button moved outside the task container */}
                {focusTask && (
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1 hover:bg-primary/10 transition-colors duration-200"
                        onClick={() => onComplete(focusTask.id)}
                    >
                        <CheckCircle className="h-4 w-4" />
                        Complete
                    </Button>
                )}
            </div>
            
            {focusTask ? (
                <div className={`border rounded-lg p-3 mb-1 transition-all duration-300 
                    ${isOver ? 'bg-primary/10 border-primary/40' : 'bg-primary/5 border-primary/20'}
                    ${showEnterAnimation ? 'task-focus-enter' : ''}`}
                >
                    <p className="text-base font-medium">{focusTask.text}</p>
                </div>
            ) : (
                <div className={`text-center py-8 text-muted-foreground rounded-lg transition-all duration-300
                    ${isOver ? 'bg-primary/10 border-2 border-dashed border-primary/40 scale-[1.02]' : 'border border-dashed border-primary/20'}
                    ${isReceivingTask ? 'animate-pulse' : ''}`}
                >
                    {isOver ? (
                        <>
                            <p className="font-medium text-primary">Drop to set as focus</p>
                            <p className="text-sm">Release to add this task as your main focus</p>
                        </>
                    ) : (
                        <>
                            <p>No active task set</p>
                            <p className="text-sm">Drag a task here or add tasks to your list</p>
                        </>
                    )}
                </div>
            )}
        </Card>
    );
};

export default memo(MainTask);