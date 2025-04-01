import { useState, useEffect, useCallback } from 'react';

export function useTasks(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);
  const [focusTaskId, setFocusTaskId] = useState(null);
  const [focusTaskData, setFocusTaskData] = useState(null);
  const [isMovingToFocus, setIsMovingToFocus] = useState(false);

  // Get the topmost incomplete task (for timer-based selection)
  const getTopmostIncompleteTask = useCallback(() => {
    return tasks.find(task => !task.completed);
  }, [tasks]);

  // Set a task as the focus task and remove it from task list
  const setTaskAsFocus = useCallback((taskId) => {
    if (taskId === focusTaskId) return;
    
    // Set animation state to true
    setIsMovingToFocus(true);
    
    // Find the task that will become the focus
    const taskToFocus = tasks.find(task => task.id === taskId);
    
    if (!taskToFocus) {
      console.error("Task not found:", taskId);
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
      // Make sure we don't add a task with the same ID that already exists
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
    
    // Reset animation state after a delay
    setTimeout(() => {
      setIsMovingToFocus(false);
    }, 500);
  }, [focusTaskId, focusTaskData, tasks]);

  // Toggle task completion status
  const toggleTaskCompletion = useCallback((taskId) => {
    // If the focus task is completed
    if (taskId === focusTaskId) {
      // Create a completed copy of the current focus task, ensuring it has a unique ID if needed
      const completedTask = { 
        ...focusTaskData, 
        completed: true,
        // Ensure the ID is unique if it's going to be added back to the list
        id: focusTaskData.id
      };
      
      // Add the completed task back to the list, checking for duplicates
      setTasks(currentTasks => {
        // Check if a task with this ID already exists
        const taskExists = currentTasks.some(task => task.id === completedTask.id);
        
        if (taskExists) {
          // If it exists, update that task instead of adding a new one
          return currentTasks.map(task => 
            task.id === completedTask.id ? completedTask : task
          );
        } else {
          // Otherwise, add it to the list
          return [...currentTasks, completedTask];
        }
      });
      
      // Clear the focus task - but don't automatically select a new one
      setFocusTaskId(null);
      setFocusTaskData(null);
      
      // No longer automatically select a new focus task
      return;
    }
    
    // For regular tasks in the list
    setTasks(currentTasks => currentTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }, [focusTaskId, focusTaskData]);

  // Add a new task
  const addTask = useCallback((text) => {
    if (!text.trim()) return;
    
    const newTask = {
      id: `task-${Date.now().toString()}`, // Ensure IDs are unique with a prefix
      text: text.trim(),
      completed: false
    };
    
    setTasks(currentTasks => [newTask, ...currentTasks]);
  }, []);

  // Delete a task
  const deleteTask = useCallback((taskId) => {
    // If deleted task was the focus task, find a new focus task first
    if (taskId === focusTaskId) {
      setFocusTaskId(null);
      setFocusTaskData(null);
      
      // Find a new focus task
      const nextIncompleteTask = tasks.find(task => 
        !task.completed && task.id !== taskId
      );
      
      if (nextIncompleteTask) {
        setTaskAsFocus(nextIncompleteTask.id);
      }
    } else {
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    }
  }, [focusTaskId, tasks, setTaskAsFocus]);

  // Reorder tasks
  const reorderTasks = useCallback((newTasks) => {
    setTasks(newTasks);
  }, []);

  // Use focusTaskData instead of searching through tasks
  const focusTask = focusTaskData;

  return {
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
  };
}
