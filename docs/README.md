# Update Manifest Hosting

This directory contains the update manifest file for the Tauri auto-updater.

## Purpose

The `latest.json` file in this directory is served via GitHub Pages to enable the application's auto-update functionality. This is necessary because:

1. The main repository is private
2. The Tauri updater needs public access to the update manifest
3. GitHub Pages can be enabled for private repositories to serve specific files publicly

## Files

- **latest.json**: The update manifest that tells the application about available updates

## Setup

To enable updates, GitHub Pages must be configured:

1. Go to repository Settings > Pages
2. Under "Source", select "Deploy from a branch"
3. Select branch: `main` (or your default branch)
4. Select folder: `/docs`
5. Click "Save"

After enabling, the update manifest will be available at:
```
https://galileo88.github.io/GroupChangeWalkthrough/latest.json
```

## Updating

When creating a new release:

1. Update the `latest.json` file with the new version information
2. Commit and push the changes
3. GitHub Pages will automatically update within a few minutes
4. The application will detect the new version on next update check

## Security

The manifest includes:
- Version number
- Release notes
- Download URL for the installer
- Cryptographic signature for verification

The signature ensures that only properly signed updates from the official source can be installed.
