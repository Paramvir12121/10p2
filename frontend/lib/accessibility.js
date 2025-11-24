/**
 * Accessibility utilities and helpers
 */

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announce = (message, priority = 'polite') => {
  if (typeof window === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Format time for screen readers
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTimeForScreenReader = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);
  
  return parts.join(' and ');
};

/**
 * Get ARIA label for task status
 * @param {boolean} completed - Task completion status
 * @param {string} text - Task text
 * @returns {string} ARIA label
 */
export const getTaskAriaLabel = (completed, text) => {
  return `${completed ? 'Completed' : 'Active'} task: ${text}`;
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Trap focus within a container
 * @param {HTMLElement} container - Container element
 */
export const trapFocus = (container) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  
  return () => container.removeEventListener('keydown', handleKeyDown);
};

/**
 * Get keyboard shortcut display based on platform
 * @param {string} shortcut - Shortcut key (e.g., 'Ctrl+K')
 * @returns {string} Platform-specific shortcut
 */
export const getPlatformShortcut = (shortcut) => {
  if (typeof window === 'undefined') return shortcut;
  
  const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.platform);
  
  if (isMac) {
    return shortcut.replace('Ctrl', '⌘').replace('Alt', '⌥').replace('Shift', '⇧');
  }
  
  return shortcut;
};

/**
 * Create a skip link for keyboard navigation
 * @param {string} targetId - ID of target element
 * @param {string} label - Link label
 */
export const createSkipLink = (targetId, label = 'Skip to main content') => {
  if (typeof window === 'undefined') return;
  
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-background focus:p-4';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
};
