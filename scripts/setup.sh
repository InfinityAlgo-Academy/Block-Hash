#!/bin/bash
set -e

echo "Starting Block-Hash Setup..."

# 1. Install dependencies
echo "Installing Node.js dependencies..."
npm install

# 2. Build common package first (required by others)
echo "Building @block-hash/common..."
npm run build -w @block-hash/common

# 3. Start Infrastructure
echo "Starting Docker containers (PostgreSQL, Redis, ClickHouse)..."
docker-compose up -d

# Wait for DBs to be ready
echo "Waiting for databases to initialize (10s)..."
sleep 10

# 4. Run Prisma Migrations
echo "Running Prisma migrations..."
cd packages/database
npx prisma generate
npx prisma db push # Or prisma migrate dev for prod setup
cd ../..

# 5. Build all packages
echo "Building all packages..."
npm run build --workspaces --if-present

echo "Setup complete! Run ./scripts/start-all.sh to start the services."
