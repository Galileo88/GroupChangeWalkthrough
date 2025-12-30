#!/bin/bash
# Script to sign Tauri bundles

PRIVATE_KEY="$1"

if [ -z "$PRIVATE_KEY" ]; then
    echo "Usage: ./sign-bundles.sh <private-key>"
    exit 1
fi

# Find all bundle files to sign
MSI_FILE="src-tauri/target/release/bundle/msi/Provider Enrollment Walkthrough_1.0.0_x64_en-US.msi"
NSIS_FILE="src-tauri/target/release/bundle/nsis/Provider Enrollment Walkthrough_1.0.0_x64-setup.exe"

echo "Signing bundles..."

# Sign MSI
if [ -f "$MSI_FILE" ]; then
    echo "Signing MSI..."
    npm run tauri signer sign "$MSI_FILE" -- --private-key "$PRIVATE_KEY"
else
    echo "MSI file not found"
fi

# Sign NSIS
if [ -f "$NSIS_FILE" ]; then
    echo "Signing NSIS..."
    npm run tauri signer sign "$NSIS_FILE" -- --private-key "$PRIVATE_KEY"
else
    echo "NSIS file not found"
fi

echo "Done!"
