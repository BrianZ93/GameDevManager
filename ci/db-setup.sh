#!/bin/bash

# Database setup script for development
echo "Setting up PostgreSQL database..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec game-dev-postgres pg_isready -U gamedev -d gamedev; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

# Optional: You can add database seeding here if needed
# echo "Seeding database with initial data..."
# docker exec -i game-dev-postgres psql -U gamedev -d gamedev < ./backend/database/seed.sql

echo "Database setup complete!" 