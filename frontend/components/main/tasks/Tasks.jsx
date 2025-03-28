'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Trash2, GripVertical, CheckCircle, Circle, ListTodo } from 'lucide-react';
import { useDashContext } from '@/provider/dashContext';
import { SortableTask } from './SortableTask';

const Tasks = () => {
    const [tasks, setTasks] = useState([
        { id: '1', text: 'Complete project proposal', completed: false },
        { id: '2', text: 'Research competitor products', completed: false },
        { id: '3', text: 'Design user interface mockups', completed: false },
        { id: '4', text: 'Set up development environment', completed: true },
        { id: '5', text: 'Create project timeline', completed: false },
    ]);
    
    const [newTask, setNewTask] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [mainTask, setMainTask] = useState(null);
    
    // Update main task whenever the task list changes
    useEffect(() => {
        // Set the first incomplete task as the main task
        const firstIncompleteTask = tasks.find(task => !task.completed);
        setMainTask(firstIncompleteTask || null);
    }, [tasks]);
    
    // Configure DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Event handlers
    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    
    const addTask = () => {
        if (newTask.trim() === '') return;
        
        const newTaskItem = {
            id: Date.now().toString(),
            text: newTask.trim(),
            completed: false
        };
        
        setTasks([newTaskItem, ...tasks]); // Add to the beginning
        setNewTask('');
    };
    
    const toggleTask = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };
    
    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };
    
    // Filter tasks based on active tab
    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return !task.completed;
        if (activeTab === 'completed') return task.completed;
        return true;
    });

    return (
        <div className="w-full max-w-md">
            <Card className="p-4 shadow-sm mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <ListTodo className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Task List</h2>
                </div>
                
                <div className="flex mb-4">
                    <Input
                        type="text"
                        placeholder="Add a new task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-grow mr-2"
                    />
                    <Button onClick={addTask}>Add</Button>
                </div>
                
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full mb-4">
                        <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                        <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                        <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                    </TabsList>
                    
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {filteredTasks.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 text-sm">
                                        No tasks found
                                    </div>
                                ) : (
                                    filteredTasks.map(task => (
                                        <SortableTask
                                            key={task.id}
                                            id={task.id}
                                            text={task.text}
                                            completed={task.completed}
                                            isMainTask={mainTask?.id === task.id}
                                            onToggle={() => toggleTask(task.id)}
                                            onDelete={() => deleteTask(task.id)}
                                        />
                                    ))
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </Tabs>
            </Card>
        </div>
    );
};

export default Tasks;