/**
 * Utility functions for input validation and sanitization
 */

/**
 * Sanitize username input
 * @param {string} username - Raw username input
 * @returns {string|null} Sanitized username or null if invalid
 */
export function sanitizeUsername(username) {
  if (!username || typeof username !== 'string') {
    return null;
  }

  // Trim whitespace
  let sanitized = username.trim();

  // Check length (3-30 characters)
  if (sanitized.length < 3 || sanitized.length > 30) {
    return null;
  }

  // Allow only alphanumeric characters, spaces, hyphens, and underscores
  const validPattern = /^[a-zA-Z0-9\s\-_]+$/;
  if (!validPattern.test(sanitized)) {
    return null;
  }

  // Remove any potential HTML/script tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  return sanitized;
}

/**
 * Sanitize task text input
 * @param {string} text - Raw task text
 * @returns {string|null} Sanitized text or null if invalid
 */
export function sanitizeTaskText(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Trim whitespace
  let sanitized = text.trim();

  // Check length (1-500 characters)
  if (sanitized.length < 1 || sanitized.length > 500) {
    return null;
  }

  // Remove any potential script tags but allow other characters
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove any potential event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  return sanitized;
}

/**
 * Validate and sanitize generic text input
 * @param {string} text - Raw text input
 * @param {number} maxLength - Maximum allowed length
 * @returns {string|null} Sanitized text or null if invalid
 */
export function sanitizeText(text, maxLength = 1000) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  let sanitized = text.trim();

  if (sanitized.length === 0 || sanitized.length > maxLength) {
    return null;
  }

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  return sanitized;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim());
}

/**
 * Escape special characters for safe display
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  if (!text) return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId format
 */
export function isValidObjectId(id) {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // Check if it matches MongoDB ObjectId pattern or custom ID pattern
  const objectIdPattern = /^[a-f\d]{24}$/i;
  const customIdPattern = /^user_\d+_[a-z0-9]+$/;
  
  return objectIdPattern.test(id) || customIdPattern.test(id);
}
