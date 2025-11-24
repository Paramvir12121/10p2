# Security Guidelines

This document outlines the security measures implemented in the 10p2 application and best practices for maintaining security.

## Implemented Security Measures

### 1. Input Sanitization and Validation

All user inputs are validated and sanitized before processing:

#### Username Validation (`lib/sanitize.js`)
- **Length**: 3-30 characters
- **Allowed Characters**: Letters, numbers, spaces, hyphens, underscores only
- **Protection Against**: XSS, script injection, SQL injection
- **Implementation**: `sanitizeUsername()`

#### Task Text Validation
- **Length**: 1-500 characters
- **Protection**: Removes script tags and event handlers
- **Implementation**: `sanitizeTaskText()`

#### Object ID Validation
- **Format Check**: Validates MongoDB ObjectId or custom ID patterns
- **Implementation**: `isValidObjectId()`

### 2. Rate Limiting

Protection against abuse and DDoS attacks:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Create User | 5 requests | 1 hour |
| Get User | 20 requests | 1 minute |
| Save Tasks | 30 requests | 1 minute |

**Implementation**: In-memory rate limiter (`lib/rateLimit.js`)

**Note**: For production, consider using Redis-based rate limiting for distributed systems.

### 3. Database Security

#### MongoDB Connection
- **Connection Pooling**: Prevents connection exhaustion
- **Timeouts**: Prevents hanging connections
  - Connection: 5 seconds
  - Socket: 30 seconds
  - Server selection: 5 seconds
- **Retry Logic**: Automatic retries for transient failures
- **URI Validation**: Validates MongoDB connection string format

#### Query Security
- **Parameterized Queries**: All MongoDB queries use parameterized inputs
- **No Direct String Interpolation**: Prevents NoSQL injection
- **Case-Insensitive Search**: Uses regex with proper escaping

### 4. Error Handling

#### Error Boundary Component
- **Runtime Error Catching**: Catches and handles React component errors
- **User-Friendly Messages**: Shows helpful error messages without exposing sensitive data
- **Development Mode**: Detailed error info only in development
- **Recovery Options**: Provides "Try Again" and "Go Home" buttons

#### Server Action Error Handling
- **Generic Error Messages**: Doesn't expose implementation details
- **Logging**: Errors logged server-side for debugging
- **Graceful Degradation**: Application remains functional even with database errors

### 5. Environment Variable Security

#### Required Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=focusApp
MONGODB_COLLECTION=users
NODE_ENV=development
```

#### Best Practices
- Never commit `.env` files to version control
- Use `.env.example` for documentation only
- Use different credentials for development and production
- Rotate credentials regularly
- Use environment-specific configurations

### 6. Client-Side Security

#### localStorage Usage
- **Limited Sensitive Data**: Only stores username and userId locally
- **No Passwords**: Never stores passwords or tokens
- **Fallback**: Works offline with localStorage when database unavailable

## Security Best Practices

### For Developers

1. **Always Sanitize Inputs**
   ```javascript
   import { sanitizeUsername } from '@/lib/sanitize';
   const clean = sanitizeUsername(userInput);
   ```

2. **Use Rate Limiting for New Endpoints**
   ```javascript
   import rateLimiter from '@/lib/rateLimit';
   if (rateLimiter.isRateLimited(identifier, maxRequests, windowMs)) {
     return { error: 'Too many requests' };
   }
   ```

3. **Validate All Database IDs**
   ```javascript
   import { isValidObjectId } from '@/lib/sanitize';
   if (!isValidObjectId(userId)) {
     return { error: 'Invalid ID' };
   }
   ```

4. **Handle Errors Gracefully**
   - Don't expose stack traces to users
   - Log detailed errors server-side
   - Return generic error messages to clients

5. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm update
   ```

### For Deployment

1. **Environment Variables**
   - Set strong, unique MongoDB credentials
   - Use MongoDB Atlas with IP whitelisting
   - Enable MongoDB authentication
   - Use connection string with SRV records for MongoDB Atlas

2. **HTTPS Only**
   - Always use HTTPS in production
   - Enable HSTS (HTTP Strict Transport Security)
   - Use secure cookies when implementing authentication

3. **Content Security Policy**
   - Consider adding CSP headers
   - Restrict script sources
   - Prevent inline scripts where possible

4. **Rate Limiting in Production**
   - Use Redis for distributed rate limiting
   - Implement at reverse proxy level (nginx, Cloudflare)
   - Consider using API Gateway services

5. **Monitoring and Logging**
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Monitor rate limit violations
   - Track failed authentication attempts
   - Set up alerts for unusual activity

## Known Limitations

### Current Implementation
1. **In-Memory Rate Limiting**: Resets on server restart; not suitable for horizontal scaling
2. **No Authentication System**: Currently only username-based identification
3. **No Encryption**: Data stored in plain text (consider encryption for sensitive data)
4. **No CSRF Protection**: Consider adding CSRF tokens for state-changing operations

### Future Enhancements
- [ ] Implement proper authentication (JWT, sessions)
- [ ] Add Redis-based rate limiting
- [ ] Implement field-level encryption for sensitive data
- [ ] Add CSRF protection
- [ ] Implement Content Security Policy headers
- [ ] Add request signing
- [ ] Implement IP-based blocking for repeated violations
- [ ] Add 2FA support
- [ ] Implement audit logging

## Reporting Security Issues

If you discover a security vulnerability, please:
1. **Do not** open a public issue
2. Email the security contact (add email here)
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be fixed before public disclosure

## Security Checklist for New Features

- [ ] All inputs validated and sanitized
- [ ] Rate limiting implemented for new endpoints
- [ ] Error handling doesn't expose sensitive information
- [ ] Database queries use parameterization
- [ ] No sensitive data in client-side code
- [ ] Environment variables used for configuration
- [ ] Tested for common vulnerabilities (XSS, injection, etc.)
- [ ] Documentation updated

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
