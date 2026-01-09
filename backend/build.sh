#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
alembic upgrade head || {
    echo "Migration failed, retrying in 10 seconds..."
    sleep 10
    alembic upgrade head
}

echo "Build completed successfully!"
