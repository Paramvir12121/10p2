# Changelog

All notable changes and improvements to this project will be documented in this file.

## [Unreleased] - 2025-11-24

### Added
- **Input Sanitization**: Added comprehensive input validation and sanitization utilities (`lib/sanitize.js`)
  - Username validation (3-30 characters, alphanumeric with spaces, hyphens, underscores)
  - Task text sanitization (1-500 characters, removes malicious scripts)
  - HTML escape utilities for safe display
  - MongoDB ObjectId validation
  
- **Rate Limiting**: Implemented in-memory rate limiter for API protection (`lib/rateLimit.js`)
  - Create user: 5 requests per hour per IP
  - Get user: 20 requests per minute per IP
  - Save tasks: 30 requests per minute per user
  
- **Error Boundary**: Added React Error Boundary component for graceful error handling
  - Catches and displays runtime errors
  - Shows detailed error info in development mode
  - Provides recovery options (Try Again, Go Home)
  
- **Environment Variables**: Created `.env.example` file documenting all required environment variables
  - MongoDB configuration variables
  - Optional DynamoDB variables for future use

- **Missing Server Actions**: Implemented missing functions called by UsernamePrompt
  - `checkUserExists()`: Check if username exists in database
  - `createNewUser()`: Wrapper for createUser with appropriate return format

### Fixed
- **Critical Bug**: Fixed malformed ThemeProvider prop in `layout.js`
  - Changed `enableSystemdisableTransitionOnChange` to separate props: `enableSystem` and `disableTransitionOnChange`
  
- **Typo**: Corrected app title from "Awsome Focus" to "Awesome Focus"

- **MongoDB Client**: Enhanced error handling and connection management
  - Added connection retry logic
  - Better error messages
  - Connection pool configuration (min: 2, max: 10)
  - Automatic connection cleanup on errors
  - Added `closeConnection()` utility function
  - URI format validation

### Removed
- **Unused Dependencies**: Removed unused database packages to reduce bundle size
  - `@aws-sdk/client-dynamodb` (DynamoDB - not currently used)
  - `@aws-sdk/lib-dynamodb`
  - `@aws-sdk/util-dynamodb`
  - `pg` (PostgreSQL - not used)
  - `sqlite` and `sqlite3` (SQLite - not used)
  
- **Debug Code**: Removed console.log statements from production code
  - Removed from `mongodbClient.js`
  - Removed from `UsernamePrompt.jsx`

### Changed
- **Docker Base Image**: Updated from Node 19 (EOL) to Node 20 Alpine for better security and support
  
- **MongoDB Client**: Improved connection configuration
  - Better timeout settings
  - Connection pooling
  - Retry logic for writes and reads
  - Proper error cleanup

- **Server Actions Security**: All server actions now include:
  - Input sanitization
  - Rate limiting
  - Validation checks
  - Better error messages

### Security Improvements
- Input validation prevents XSS and injection attacks
- Rate limiting prevents abuse and DoS attacks
- Sanitization removes potentially malicious content
- MongoDB URI validation prevents configuration errors
- Better error handling prevents information leakage

### Developer Experience
- Clear environment variable documentation
- Better error messages for debugging
- Type-safe validation utilities
- Comprehensive inline documentation
- Error boundary for better user experience

## Notes

### Breaking Changes
None - all changes are backward compatible

### Migration Guide
1. Copy `.env.example` to `.env.local` and fill in your MongoDB connection details
2. Run `npm install` to update dependencies (will remove unused packages)
3. Restart your development server

### Future Improvements
- Add Redis-based rate limiting for production
- Implement proper logging service
- Add unit tests for sanitization utilities
- Add integration tests for server actions
- Consider adding request signing for additional security
