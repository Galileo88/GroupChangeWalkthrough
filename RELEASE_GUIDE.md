# Release Guide

This guide explains how to create new releases for the Provider Enrollment Walkthrough application.

## Automated Release Process

The application uses GitHub Actions to automatically build, package, and publish releases. The workflow:

1. ✅ Builds the Tauri application for Windows
2. ✅ Generates the `latest.json` update manifest
3. ✅ Creates a GitHub release
4. ✅ Uploads all installers and artifacts
5. ✅ Enables automatic updates for users

## How to Create a New Release

### Method 1: Using Git Tags (Recommended)

1. **Update the version number** in `tauri-app/src-tauri/Cargo.toml`:
   ```toml
   [package]
   version = "1.0.1"  # Change this
   ```

2. **Update the version** in `tauri-app/package.json`:
   ```json
   {
     "version": "1.0.1"  // Change this
   }
   ```

3. **Commit the version changes**:
   ```bash
   git add tauri-app/src-tauri/Cargo.toml tauri-app/package.json
   git commit -m "Bump version to 1.0.1"
   git push
   ```

4. **Create and push a version tag**:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

5. **Wait for the workflow** - GitHub Actions will automatically:
   - Build the Windows installer
   - Create a GitHub release at: `https://github.com/Galileo88/GroupChangeWalkthrough/releases`
   - Upload the installer and `latest.json`

### Method 2: Manual Workflow Trigger

1. Go to: `https://github.com/Galileo88/GroupChangeWalkthrough/actions`
2. Click on "Release" workflow
3. Click "Run workflow"
4. Enter the version (e.g., `v1.0.1`)
5. Click "Run workflow"

## What Gets Published

For each release, the following files are automatically created and uploaded:

- **Installer**: `Provider-Enrollment-Walkthrough_X.X.X_x64-setup.exe`
- **Update Manifest**: `latest.json` (required for auto-updates)
- **Signatures**: `.sig` files (for security verification)

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., `1.0.1`)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## Testing Auto-Updates

After publishing a release:

1. Install the **previous version** of the app
2. Open the app - it should check for updates
3. The "Update Available" button should appear on the index page
4. Click the button to test the auto-update process
5. Verify the app updates and prompts for restart

## Troubleshooting

### Workflow Fails

- Check the Actions tab for error logs
- Ensure version numbers are updated in both files
- Verify tag follows `v*.*.*` format

### Updates Not Detected

- Verify `latest.json` exists in the release assets
- Check that the new version > current version
- Look at browser console for error messages

### Installer Issues

- Ensure Windows build environment is available
- Check that all dependencies are installed
- Review Tauri build logs in Actions

## Release Checklist

Before creating a release:

- [ ] Update version in `Cargo.toml`
- [ ] Update version in `package.json`
- [ ] Test the application locally
- [ ] Update CHANGELOG (if you have one)
- [ ] Commit and push version changes
- [ ] Create and push version tag
- [ ] Verify GitHub Actions workflow completes
- [ ] Test the installer download
- [ ] Test auto-update from previous version

## Current Version

Current version: **1.0.0**

Next recommended version: **1.0.1**
