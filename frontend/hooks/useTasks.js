import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook for managing tasks with advanced features
 * 
 * @param {Array} initialTasks - Initial list of tasks
 * @returns {Object} Task management methods and state
 */
export function useTasks(initialTasks = []) {
  // Initialize with additional metadata fields if they don't exist
  const enrichedInitialTasks = initialTasks.map(task => ({
    ...task,
    id: task.id || `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    tags: task.tags || [],
    dueDate: task.dueDate || null,
    priority: task.priority || null,
    createdAt: task.createdAt || new Date().toISOString(),
  }));
  
  const [tasks, setTasks] = useState(enrichedInitialTasks);
  const [focusTaskId, setFocusTaskId] = useState(null);
  const [focusTaskData, setFocusTaskData] = useState(null);
  const [isMovingToFocus, setIsMovingToFocus] = useState(false);
  const [taskHistory, setTaskHistory] = useState([]); // For undo functionality
  const animationTimeoutRef = useRef(null);

  // Local storage persistence
  useEffect(() => {
    // Load tasks from local storage on mount
    const loadTasks = () => {
      try {
        const savedTasks = localStorage.getItem('tasks');
        const savedFocusTask = localStorage.getItem('focusTask');
        
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
        
        if (savedFocusTask) {
          const focusData = JSON.parse(savedFocusTask);
          setFocusTaskId(focusData.id);
          setFocusTaskData(focusData);
        }
      } catch (error) {
        console.error('Error loading tasks from localStorage', error);
      }
    };
    
    loadTasks();
  }, []);
  
  // Save tasks to local storage when they change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage', error);
    }
  }, [tasks]);
  
  // Save focus task to local storage when it changes
  useEffect(() => {
    if (focusTaskData) {
      try {
        localStorage.setItem('focusTask', JSON.stringify(focusTaskData));
      } catch (error) {
        console.error('Error saving focus task to localStorage', error);
      }
    } else {
      localStorage.removeItem('focusTask');
    }
  }, [focusTaskData]);

  // Get the topmost incomplete task (for timer-based selection)
  const getTopmostIncompleteTask = useCallback(() => {
    return tasks.find(task => !task.completed);
  }, [tasks]);
  
  // Save current state for undo
  const saveToHistory = useCallback((actionType) => {
    setTaskHistory(prev => [
      ...prev.slice(-9), // Limit history to last 10 actions
      { 
        tasks: [...tasks], 
        focusTaskId, 
        focusTaskData,
        actionType, 
        timestamp: Date.now() 
      }
    ]);
  }, [tasks, focusTaskId, focusTaskData]);

  // Set a task as the focus task with improved animation handling
  const setTaskAsFocus = useCallback((taskId) => {
    if (taskId === focusTaskId) return;
    
    saveToHistory('focus-change');
    
    // Set animation state to true
    setIsMovingToFocus(true);
    
    // Find the task that will become the focus
    const taskToFocus = tasks.find(task => task.id === taskId);
    
    if (!taskToFocus) {
      console.error("Task not found:", taskId);
      setIsMovingToFocus(false);
      return;
    }
    
    // Store the focus task data separately
    setFocusTaskData(taskToFocus);
    
    // Update tasks - remove focused task and return previous focus task if it exists
    setTasks(currentTasks => {
      let updatedTasks = [...currentTasks];
      
      // Remove the new focus task from the list
      updatedTasks = updatedTasks.filter(task => task.id !== taskId);
      
      // If there was a previous focus task, add it back to the list
      if (focusTaskId && focusTaskData) {
        // Check if a task with the same ID already exists in the list
        const taskExists = updatedTasks.some(task => task.id === focusTaskData.id);
        
        if (!taskExists) {
          updatedTasks.unshift(focusTaskData);
        }
      }
      
      return updatedTasks;
    });
    
    // Update the focus task ID
    setFocusTaskId(taskId);
    
    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Reset animation state after a delay
    animationTimeoutRef.current = setTimeout(() => {
      setIsMovingToFocus(false);
    }, 500);
  }, [focusTaskId, focusTaskData, tasks, saveToHistory]);

  // Toggle task completion status with improved handling for focus tasks
  const toggleTaskCompletion = useCallback((taskId) => {
    saveToHistory('task-completion');
    
    // If the focus task is completed
    if (taskId === focusTaskId) {
      // Update the focus task data
      setFocusTaskData(prevData => {
        if (!prevData) return null;
        
        const updatedTask = { 
          ...prevData, 
          completed: !prevData.completed,
          completedAt: !prevData.completed ? new Date().toISOString() : null
        };
        
        // If the task is now completed, we'll add it back to the list later
        if (updatedTask.completed) {
          toast.success('Task completed!', {
            description: updatedTask.text
          });
          
          // Add the completed task back to the list
          setTasks(currentTasks => {
            // Check if a task with this ID already exists
            const taskExists = currentTasks.some(task => task.id === updatedTask.id);
            
            if (taskExists) {
              // If it exists, update that task instead of adding a new one
              return currentTasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
              );
            } else {
              // Otherwise, add it to the list
              return [...currentTasks, updatedTask];
            }
          });
          
          // Clear the focus task
          setFocusTaskId(null);
          return null;
        }
        
        return updatedTask;
      });
      
      return;
    }
    
    // For regular tasks in the list
    setTasks(currentTasks => currentTasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null 
      } : task
    ));
    
    // Show toast for completed tasks
    const completedTask = tasks.find(task => task.id === taskId);
    if (completedTask && !completedTask.completed) {
      toast.success('Task completed!', {
        description: completedTask.text
      });
    }
  }, [focusTaskId, tasks, saveToHistory]);

  // Add a new task with metadata
  const addTask = useCallback((taskData) => {
    // Allow adding task as simple text string or as object with metadata
    const taskText = typeof taskData === 'string' ? taskData : taskData.text;
    
    if (!taskText?.trim()) return;
    
    saveToHistory('task-add');
    
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: taskText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      // Add additional metadata if provided
      ...(typeof taskData === 'object' ? taskData : {}),
      // Ensure text is set correctly
      text: taskText.trim(),
    };
    
    setTasks(currentTasks => [newTask, ...currentTasks]);
    
    // Return the newly created task ID
    return newTask.id;
  }, [saveToHistory]);

  // Update a task's metadata
  const updateTask = useCallback((taskId, updates) => {
    saveToHistory('task-update');
    
    // If updating focus task
    if (taskId === focusTaskId) {
      setFocusTaskData(prev => ({...prev, ...updates}));
      return;
    }
    
    // For regular tasks in the list
    setTasks(currentTasks => currentTasks.map(task => 
      task.id === taskId ? {...task, ...updates} : task
    ));
  }, [focusTaskId, saveToHistory]);

  // Delete a task with improved handling for the focus task
  const deleteTask = useCallback((taskId) => {
    saveToHistory('task-delete');
    
    // If deleted task was the focus task
    if (taskId === focusTaskId) {
      setFocusTaskId(null);
      setFocusTaskData(null);
      
      // Find a new focus task automatically
      const nextIncompleteTask = tasks.find(task => 
        !task.completed && task.id !== taskId
      );
      
      if (nextIncompleteTask) {
        // Use a slight delay to avoid animation issues
        setTimeout(() => {
          setTaskAsFocus(nextIncompleteTask.id);
        }, 100);
      }
    } else {
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    }
  }, [focusTaskId, tasks, setTaskAsFocus, saveToHistory]);

  // Reorder tasks with proper typing
  const reorderTasks = useCallback((newTasks) => {
    saveToHistory('task-reorder');
    setTasks(newTasks);
  }, [saveToHistory]);
  
  // Handle batch operations on multiple tasks
  const batchAction = useCallback((action, taskIds) => {
    saveToHistory('batch-action');
    
    if (action === 'complete') {
      setTasks(currentTasks => currentTasks.map(task => 
        taskIds.includes(task.id) 
          ? { ...task, completed: true, completedAt: new Date().toISOString() } 
          : task
      ));
      
      // If focus task is included, handle it separately
      if (taskIds.includes(focusTaskId)) {
        toggleTaskCompletion(focusTaskId);
      }
      
      toast.success(`${taskIds.length} tasks completed!`);
    } 
    else if (action === 'delete') {
      setTasks(currentTasks => currentTasks.filter(task => !taskIds.includes(task.id)));
      
      // If focus task is included, handle it separately
      if (taskIds.includes(focusTaskId)) {
        deleteTask(focusTaskId);
      }
      
      toast.success(`${taskIds.length} tasks deleted!`);
    }
    // Additional batch actions can be added here (add tags, set priority, etc.)
  }, [focusTaskId, toggleTaskCompletion, deleteTask, saveToHistory]);
  
  // Undo last action
  const undoLastAction = useCallback(() => {
    if (taskHistory.length === 0) {
      toast.info('Nothing to undo');
      return;
    }
    
    const lastAction = taskHistory[taskHistory.length - 1];
    setTasks(lastAction.tasks);
    setFocusTaskId(lastAction.focusTaskId);
    setFocusTaskData(lastAction.focusTaskData);
    
    // Remove the last action from history
    setTaskHistory(prev => prev.slice(0, -1));
    
    toast.info(`Undid ${lastAction.actionType}`);
  }, [taskHistory]);

  // Clean up any timeouts when the component unmounts
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return {
    tasks,
    focusTask: focusTaskData,
    focusTaskId,
    setTaskAsFocus,
    toggleTaskCompletion,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    batchAction,
    undoLastAction,
    getTopmostIncompleteTask,
    isMovingToFocus
  };
}
