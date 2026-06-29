#!/bin/bash
set -e

echo "Starting Block-Hash Services..."

# Ensure infrastructure is running
docker-compose up -d

# Start API Server in background
echo "Starting API Server..."
npm run start:dev -w @block-hash/api-server &
API_PID=$!

# Start Frontend in background
echo "Starting Frontend..."
npm run dev -w @block-hash/frontend &
FRONTEND_PID=$!

# Normally you would also start the processing-pipeline and data-collector here
# e.g., npm run start -w @block-hash/data-collector &

echo "Services started:"
echo "API Server PID: $API_PID (http://localhost:3000)"
echo "Frontend PID: $FRONTEND_PID (http://localhost:3001)"
echo "Press Ctrl+C to stop all services."

# Wait and catch Ctrl+C to kill background processes
trap "kill $API_PID $FRONTEND_PID; exit" INT TERM
wait
