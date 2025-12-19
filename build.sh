#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "=== Starting build process ==="

# Build Frontend
echo "=== Installing npm dependencies ==="
npm install

echo "=== Building frontend with Vite ==="
npm run build

echo "=== Checking if dist folder was created ==="
ls -la
if [ -d "dist" ]; then
    echo "✓ dist folder exists"
    ls -la dist/
else
    echo "✗ ERROR: dist folder was NOT created!"
    exit 1
fi

# Install Python dependencies
echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

# Collect static files
echo "=== Collecting static files ==="
python backend/manage.py collectstatic --noinput

# Run migrations
echo "=== Running migrations ==="
python backend/manage.py migrate

echo "=== Build complete ==="
