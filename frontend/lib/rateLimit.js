/**
 * Simple in-memory rate limiter for server actions
 * For production, consider using Redis or a more robust solution
 */

class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  /**
   * Check if request should be rate limited
   * @param {string} identifier - Unique identifier (IP, userId, etc.)
   * @param {number} maxRequests - Maximum requests allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {boolean} True if rate limit exceeded
   */
  isRateLimited(identifier, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const key = `${identifier}`;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const timestamps = this.requests.get(key);
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(
      timestamp => now - timestamp < windowMs
    );

    if (validTimestamps.length >= maxRequests) {
      return true; // Rate limit exceeded
    }

    // Add current timestamp
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);

    return false;
  }

  /**
   * Get remaining requests for an identifier
   * @param {string} identifier - Unique identifier
   * @param {number} maxRequests - Maximum requests allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {number} Number of remaining requests
   */
  getRemainingRequests(identifier, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const key = `${identifier}`;

    if (!this.requests.has(key)) {
      return maxRequests;
    }

    const timestamps = this.requests.get(key);
    const validTimestamps = timestamps.filter(
      timestamp => now - timestamp < windowMs
    );

    return Math.max(0, maxRequests - validTimestamps.length);
  }

  /**
   * Clean up old entries
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 300000; // 5 minutes

    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(
        timestamp => now - timestamp < maxAge
      );

      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }

  /**
   * Clear rate limit for an identifier (useful for testing)
   * @param {string} identifier - Unique identifier
   */
  clear(identifier) {
    this.requests.delete(`${identifier}`);
  }

  /**
   * Destroy the rate limiter and cleanup
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requests.clear();
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;

/**
 * Helper function to get client identifier from headers
 * @param {Headers} headers - Request headers
 * @returns {string} Client identifier
 */
export function getClientIdentifier(headers) {
  // Try to get real IP from various headers (for proxied requests)
  const forwarded = headers?.get('x-forwarded-for');
  const realIp = headers?.get('x-real-ip');
  const remoteAddr = headers?.get('x-vercel-forwarded-for');
  
  const ip = forwarded?.split(',')[0] || realIp || remoteAddr || 'unknown';
  
  return ip;
}
