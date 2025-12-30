# How to Create a GitHub Release

Follow these steps to create a new release and enable automatic updates.

## Prerequisites

1. Build the application first:
   ```bash
   cd tauri-app
   npm run build
   ```

2. Locate the installer at:
   ```
   src-tauri\target\release\bundle\nsis\Provider Enrollment Walkthrough_1.0.0_x64-setup.exe
   ```

## Step-by-Step Release Process

### 1. Go to GitHub Releases

1. Navigate to: https://github.com/Galileo88/GroupChangeWalkthrough/releases
2. Click **"Draft a new release"**

### 2. Create Release Tag

1. Click **"Choose a tag"**
2. Type: `v1.0.0` (must match version in `tauri.conf.json`)
3. Click **"Create new tag: v1.0.0 on publish"**

### 3. Fill Release Information

**Release Title:** `v1.0.0 - Initial Release`

**Description:** Copy content from `GITHUB_RELEASE_TEMPLATE.md` or customize as needed.

### 4. Upload Files

Click **"Attach binaries by dropping them here or selecting them"** and upload:

1. **The installer:**
   - File: `Provider Enrollment Walkthrough_1.0.0_x64-setup.exe`
   - From: `src-tauri\target\release\bundle\nsis\`

2. **The update manifest:**
   - File: `latest.json`
   - From: `tauri-app\latest.json`
   - **IMPORTANT:** Before uploading, update the `url` field to match the actual filename

### 5. Update latest.json Before Upload

Edit `latest.json` to ensure the URL is correct:

```json
{
  "version": "1.0.0",
  "notes": "Initial release",
  "pub_date": "2024-12-30T22:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "url": "https://github.com/Galileo88/GroupChangeWalkthrough/releases/download/v1.0.0/Provider-Enrollment-Walkthrough_1.0.0_x64-setup.exe"
    }
  }
}
```

**Important Notes:**
- The filename in the URL must EXACTLY match the uploaded installer filename
- Use the actual upload date in `pub_date` (ISO 8601 format)
- Version must match the tag (without the 'v' prefix)

### 6. Publish

1. Check **"Set as the latest release"**
2. Click **"Publish release"**

## Verification

After publishing:

1. Open the release page
2. Verify both files are attached:
   - `Provider Enrollment Walkthrough_1.0.0_x64-setup.exe`
   - `latest.json`
3. Click on `latest.json` to view it and verify the URL is correct

## Testing the Update

1. Install an older version of the app (or use current version for v1.0.1+)
2. Open the app
3. Click "Check for Updates" on the main page
4. The app should detect and install the new version

## For Future Releases

### Update Version Numbers

1. **In `tauri.conf.json`:** Change `"version": "1.0.1"`
2. **In `package.json`:** Change `"version": "1.0.1"`
3. **In `Cargo.toml`:** Change `version = "1.0.1"`
4. **In `walkthrough.html`:** Change `const VERSION = '1.0.1';`

### Build and Release

1. Build: `npm run build`
2. Create new GitHub release with tag `v1.0.1`
3. Upload new installer
4. Update and upload new `latest.json` with version `1.0.1`

### Tips

- Keep release notes clear and concise
- Always test the update flow before announcing
- Tag format must be `vX.Y.Z` (with the 'v' prefix)
- Version in files must be `X.Y.Z` (without the 'v' prefix)
- The updater checks `latest.json` at the endpoint specified in config

## Troubleshooting

**Update not detected:**
- Verify `latest.json` is uploaded to the release
- Check the URL in `latest.json` is correct
- Ensure version number is higher than current version
- Check browser console for errors (F12 in dev mode)

**Download fails:**
- Verify installer file is public and downloadable
- Check filename matches exactly in `latest.json`
- Ensure URL uses `https://` not `http://`

**Installation fails:**
- Check installer is not corrupted
- Verify sufficient disk space
- Try manual download and installation
