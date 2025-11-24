# Quick Reference Card

## 🚀 Getting Started

```bash
# Clone and setup
git clone <repo-url>
cd 10p2
./setup.sh

# Start development
cd frontend
npm run dev
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `frontend/.env.local` | Environment configuration |
| `SECURITY.md` | Security guidelines |
| `CHANGELOG.md` | Recent changes |
| `IMPROVEMENTS.md` | All improvements summary |

## 🔧 Environment Variables

```bash
# Required
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=focusApp
MONGODB_COLLECTION=users
NODE_ENV=development
```

## 🛡️ Security Features

### Input Validation
```javascript
import { sanitizeUsername, sanitizeTaskText } from '@/lib/sanitize';
```

### Rate Limiting
- Create user: 5/hour per IP
- Get user: 20/min per IP  
- Save tasks: 30/min per user

## 📊 Health Check

```bash
curl http://localhost:3000/api/health
```

Returns:
```json
{
  "status": "healthy",
  "checks": {
    "database": "connected"
  }
}
```

## 🐛 Common Issues

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongosh --eval "db.version()"

# Or use Docker
docker run -d -p 27017:27017 mongo
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Missing Dependencies
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 🔍 Development Commands

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Start production
npm start
```

## 🎯 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Main app |
| `/api/health` | GET | Health check |
| `/db` | GET | DB test page |

## 📚 Server Actions

```javascript
import { 
  createUser,
  getUserByUsername,
  checkUserExists,
  createNewUser,
  saveTasks 
} from '@/app/actions';
```

## 🧪 Testing

```bash
# Test MongoDB connection
cd frontend/db
node testConnection.cjs

# Test Docker setup
docker-compose up -d
curl http://localhost:3000/api/health
```

## 🔐 Security Checklist

- [x] Input sanitization implemented
- [x] Rate limiting active
- [x] Error boundary in place
- [x] Environment variables documented
- [x] Unused dependencies removed
- [x] MongoDB connection secured
- [ ] Set up production MongoDB Atlas
- [ ] Configure HTTPS
- [ ] Set up error monitoring

## 📞 Quick Links

- [Full README](./README.md)
- [Security Guide](./SECURITY.md)
- [Changelog](./CHANGELOG.md)
- [Improvements](./IMPROVEMENTS.md)

## 💡 Tips

1. Always use `.env.local` (never commit it)
2. Run `npm run lint` before committing
3. Check `/api/health` for system status
4. Review `SECURITY.md` before deployment
5. Keep dependencies updated: `npm audit`

---

**Need help?** Check the docs or open an issue!
