#!/bin/bash

# Installation script for Group Change Walkthrough desktop launcher

echo "Installing Group Change Walkthrough desktop launcher..."

# Create the applications directory if it doesn't exist
mkdir -p ~/.local/share/applications

# Copy the .desktop file to the user's applications directory
cp group-change-walkthrough.desktop ~/.local/share/applications/

# Make sure the launcher script is executable
chmod +x launch-app.sh

# Update the desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database ~/.local/share/applications
fi

echo ""
echo "✓ Desktop launcher installed successfully!"
echo ""
echo "You should now see 'Group Change Walkthrough' in your applications menu."
echo "You can also find it by searching for 'Group Change' in your application launcher."
echo ""
echo "To uninstall, run:"
echo "  rm ~/.local/share/applications/group-change-walkthrough.desktop"
