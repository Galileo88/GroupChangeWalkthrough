# GitHub Releases Setup for Auto-Updater

This document explains how to set up GitHub releases so the app's auto-updater can work properly.

## How the Updater Works

The app checks for updates by fetching:
```
https://github.com/Galileo88/GroupChangeWalkthrough/releases/latest/download/latest.json
```

This `latest.json` file contains metadata about the latest version and download URLs for the installers.

## Creating a Release

### Option 1: Using GitHub Actions (Recommended)

1. Create a `.github/workflows/release.yml` file that:
   - Builds the Tauri app for all platforms (Windows, macOS, Linux)
   - Generates the `latest.json` file
   - Uploads all artifacts to a GitHub release

### Option 2: Manual Release

1. **Build the app:**
   ```bash
   cd tauri-app
   npm run tauri build
   ```

2. **Create `latest.json` file:**
   Create a file with this structure:
   ```json
   {
     "version": "1.0.1",
     "notes": "Release notes here",
     "pub_date": "2024-01-15T12:00:00Z",
     "platforms": {
       "windows-x86_64": {
         "signature": "",
         "url": "https://github.com/Galileo88/GroupChangeWalkthrough/releases/download/v1.0.1/ProviderEnrollmentWalkthrough_1.0.1_x64_en-US.msi"
       },
       "linux-x86_64": {
         "signature": "",
         "url": "https://github.com/Galileo88/GroupChangeWalkthrough/releases/download/v1.0.1/provider-enrollment-walkthrough_1.0.1_amd64.AppImage"
       },
       "darwin-x86_64": {
         "signature": "",
         "url": "https://github.com/Galileo88/GroupChangeWalkthrough/releases/download/v1.0.1/ProviderEnrollmentWalkthrough_1.0.1_x64.dmg"
       },
       "darwin-aarch64": {
         "signature": "",
         "url": "https://github.com/Galileo88/GroupChangeWalkthrough/releases/download/v1.0.1/ProviderEnrollmentWalkthrough_1.0.1_aarch64.dmg"
       }
     }
   }
   ```

3. **Create GitHub Release:**
   - Go to: https://github.com/Galileo88/GroupChangeWalkthrough/releases/new
   - Tag version: `v1.0.1` (match the version in tauri.conf.json)
   - Release title: `v1.0.1`
   - Upload files:
     - `latest.json`
     - All installers from `tauri-app/src-tauri/target/release/bundle/`
   - Publish the release

## Version Bumping

1. Update version in `tauri-app/src-tauri/tauri.conf.json`
2. Update version in `tauri-app/src-tauri/Cargo.toml`
3. Build and create a new release with the new version number

## Testing Updates

1. Make sure current app version is lower than the release version
2. Click "Check for Updates" in the app
3. If an update is available, the app will prompt to download and install
4. After installation, restart the app to use the new version

## Signature Verification (Optional)

For enhanced security, you can enable signature verification:

1. Generate a keypair:
   ```bash
   tauri signer generate -w ~/.tauri/myapp.key
   ```

2. Update `tauri.conf.json` with the public key:
   ```json
   "updater": {
     "pubkey": "YOUR_PUBLIC_KEY_HERE"
   }
   ```

3. Sign your updates when building:
   ```bash
   tauri build --key ~/.tauri/myapp.key
   ```

4. Include signatures in `latest.json` (Tauri generates these automatically)

## Current Status

- ✅ Updater code is implemented
- ⏳ No releases created yet - updater will show "No releases available" message
- 📝 Version in config: 1.0.0

Next step: Create your first release!
