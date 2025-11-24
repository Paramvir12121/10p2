/**
 * Toast notification helpers for better UX
 */

import { toast } from 'sonner';

/**
 * Show success message with optional action
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    ...options
  });
};

/**
 * Show error message
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 4000,
    ...options
  });
};

/**
 * Show info message
 */
export const showInfo = (message, options = {}) => {
  return toast.info(message, {
    duration: 3000,
    ...options
  });
};

/**
 * Show warning message
 */
export const showWarning = (message, options = {}) => {
  return toast.warning(message, {
    duration: 3500,
    ...options
  });
};

/**
 * Show a loading toast that can be updated
 */
export const showLoading = (message) => {
  return toast.loading(message);
};

/**
 * Show keyboard shortcut hint
 */
export const showShortcutHint = (shortcut, description) => {
  return toast(description, {
    icon: '⌨️',
    description: `Press ${shortcut}`,
    duration: 2000,
  });
};

/**
 * Show task completed celebration
 */
export const celebrateTaskCompletion = (taskText) => {
  return toast.success('Task completed! 🎉', {
    description: taskText,
    duration: 2500,
  });
};

/**
 * Show session milestone
 */
export const showSessionMilestone = (minutes) => {
  const emoji = minutes >= 60 ? '🔥' : minutes >= 30 ? '💪' : '✨';
  return toast.success(`${emoji} ${minutes} minutes focused!`, {
    description: 'Keep up the great work!',
    duration: 3000,
  });
};

/**
 * Show break earned notification
 */
export const showBreakEarned = (minutes) => {
  return toast.success('Break time earned! ☕', {
    description: `You've earned ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} of break time.`,
    duration: 3000,
  });
};

/**
 * Confirm action with promise
 */
export const confirmAction = (message, description) => {
  return new Promise((resolve) => {
    toast(message, {
      description,
      action: {
        label: 'Confirm',
        onClick: () => resolve(true)
      },
      cancel: {
        label: 'Cancel',
        onClick: () => resolve(false)
      },
      duration: 5000,
    });
  });
};
