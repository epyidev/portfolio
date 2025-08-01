#!/bin/bash

echo "Starting Portfolio Application..."

# Set environment variables
export NODE_ENV=production
export PORT=${SERVER_PORT:-3001}

echo "Using port: $PORT"
echo "SERVER_PORT env var: $SERVER_PORT"

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    exit 1
fi

echo "Node.js version: $(node --version)"

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "npm version: $(npm --version)"
    
    # Install dependencies if needed (only backend dependencies)
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install --production
    fi
else
    echo "WARNING: npm not found, assuming dependencies are pre-installed"
fi

# Check if dist exists and has the required files
if [ ! -d "dist" ]; then
    echo "ERROR: dist folder not found!"
    echo "Please upload a pre-built version of your application"
    exit 1
fi

if [ ! -f "dist/server.js" ]; then
    echo "ERROR: dist/server.js not found!"
    echo "Please ensure your application is properly built"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "ERROR: dist/index.html not found!"
    echo "Please ensure frontend files are included in the dist folder"
    exit 1
fi

# List files in dist for debugging
echo "Files in dist directory:"
ls -la dist/

# Start the application
echo "Starting Node.js server on port $PORT..."
node dist/server.js
