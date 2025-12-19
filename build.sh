#!/usr/bin/env bash
# Exit on error
set -o errexit

# Build Frontend
npm install
npm run build

# Install Python dependencies
pip install -r requirements.txt

# Collect static files
python backend/manage.py collectstatic --noinput

# Run migrations
python backend/manage.py migrate
