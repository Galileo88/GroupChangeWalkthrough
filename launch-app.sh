#!/bin/bash

# Group Change Walkthrough Launcher
# This script launches the Group Change Walkthrough application

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the application directory
cd "$DIR"

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the Vite dev server and open in browser
echo "Starting Group Change Walkthrough..."
npm run dev -- --open
