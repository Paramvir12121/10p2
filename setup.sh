#!/bin/bash

# Setup script for 10p2 Focus App
# This script helps set up the development environment

set -e  # Exit on error

echo "🚀 Setting up 10p2 Focus App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or later."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version $NODE_VERSION detected. Version 18 or later is recommended."
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Navigate to frontend directory
cd frontend

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ .env.local created. Please edit it with your MongoDB connection details."
        echo ""
        echo "Required environment variables:"
        echo "  - MONGODB_URI (default: mongodb://localhost:27017)"
        echo "  - MONGODB_DB (default: focusApp)"
        echo "  - MONGODB_COLLECTION (default: users)"
        echo ""
    else
        echo "⚠️  .env.example not found. Creating minimal .env.local..."
        cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=focusApp
MONGODB_COLLECTION=users
NODE_ENV=development
EOF
        echo "✅ Minimal .env.local created"
        echo ""
    fi
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo "   Run 'npm install' if you want to update dependencies"
    echo ""
fi

# Check if MongoDB is running (optional)
echo "🔍 Checking MongoDB connection..."
if command -v mongosh &> /dev/null || command -v mongo &> /dev/null; then
    MONGO_CMD=$(command -v mongosh || command -v mongo)
    if $MONGO_CMD --eval "db.version()" --quiet &> /dev/null; then
        echo "✅ MongoDB is running and accessible"
    else
        echo "⚠️  MongoDB is not running or not accessible"
        echo "   Make sure MongoDB is running before starting the app"
    fi
else
    echo "ℹ️  MongoDB client not found. Cannot verify MongoDB connection."
    echo "   Make sure MongoDB is running before starting the app"
fi
echo ""

# Check for Docker (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker detected - you can use docker-compose for easy setup"
    echo "   Run: docker-compose up -d"
else
    echo "ℹ️  Docker not found - local MongoDB installation required"
fi
echo ""

echo "✨ Setup complete! Next steps:"
echo ""
echo "1. Make sure MongoDB is running (or use docker-compose)"
echo "2. Edit .env.local with your MongoDB connection details if needed"
echo "3. Start the development server:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see:"
echo "   - README.md for general documentation"
echo "   - SECURITY.md for security guidelines"
echo "   - CHANGELOG.md for recent changes"
echo ""
