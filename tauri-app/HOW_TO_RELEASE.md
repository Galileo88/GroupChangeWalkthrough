# How to Create a GitHub Release

Follow these steps to create a new release and enable automatic updates.

## First-Time Setup: Enable GitHub Pages

**This only needs to be done once for the repository.**

1. Go to repository Settings > Pages
2. Under "Source", select "Deploy from a branch"
3. Select branch: `main` (or `claude/fix-update-download-error-NfR0U` if not yet merged)
4. Select folder: `/docs`
5. Click "Save"

After a few minutes, the update manifest will be available at:
```
https://galileo88.github.io/GroupChangeWalkthrough/latest.json
```

This allows the updater to work even though the repository is private.

## Prerequisites

1. Build the application first:
   ```bash
   cd tauri-app
   npm run build
   ```

2. Sign the installer (REQUIRED):
   ```bash
   npm run tauri signer sign "src-tauri\target\release\bundle\nsis\Provider Enrollment Walkthrough_1.0.0_x64-setup.exe" -- --private-key "your-private-key-here"
   ```

   This creates `Provider Enrollment Walkthrough_1.0.0_x64-setup.exe.sig` file.

3. Locate the files at:
   ```
   src-tauri\target\release\bundle\nsis\Provider Enrollment Walkthrough_1.0.0_x64-setup.exe
   src-tauri\target\release\bundle\nsis\Provider Enrollment Walkthrough_1.0.0_x64-setup.exe.sig
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

### 4. Upload Installer

Click **"Attach binaries by dropping them here or selecting them"** and upload:

**The installer:**
- File: `Provider Enrollment Walkthrough_1.0.0_x64-setup.exe`
- From: `src-tauri\target\release\bundle\nsis\`

### 5. Update latest.json for GitHub Pages

Edit `tauri-app/latest.json` to include the new version information:

```json
{
  "version": "1.0.0",
  "notes": "Initial release",
  "pub_date": "2024-12-30T22:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "url": "https://github.com/Galileo88/GroupChangeWalkthrough/releases/download/v1.0.0/Provider.Enrollment.Walkthrough_1.0.0_x64-setup.exe",
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVUL3dOcEts..."
    }
  }
}
```

**How to update:**
1. After signing (step 2 in Prerequisites), open the `.sig` file
2. Copy the entire contents (it's a long base64 string)
3. Update `tauri-app/latest.json`:
   - Set `version` to the new version (without 'v' prefix)
   - Set `notes` with release description
   - Set `pub_date` to current date/time (ISO 8601 format)
   - Update the `url` to point to the uploaded installer (must EXACTLY match filename)
   - Paste the signature into the `signature` field
4. Copy `tauri-app/latest.json` to `docs/latest.json`:
   ```bash
   cp tauri-app/latest.json docs/latest.json
   ```
5. Commit and push both files to the repository
6. Wait 2-3 minutes for GitHub Pages to update

**Important Notes:**
- The filename in the URL must EXACTLY match the uploaded installer filename
- The signature must be from the `.sig` file created when you signed the installer
- Both `tauri-app/latest.json` and `docs/latest.json` should be identical
- The app fetches updates from GitHub Pages, not from the release assets

### 6. Publish

1. Check **"Set as the latest release"**
2. Click **"Publish release"**

## Verification

After publishing:

1. **Verify the release:**
   - Open the release page
   - Confirm `Provider Enrollment Walkthrough_1.0.0_x64-setup.exe` is attached
   - Try downloading it to ensure it's publicly accessible

2. **Verify GitHub Pages (wait 2-3 minutes after pushing):**
   - Visit: https://galileo88.github.io/GroupChangeWalkthrough/latest.json
   - Verify the content matches what you updated
   - Confirm the `url` and `signature` fields are correct

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
2. Sign the new installer
3. Update `tauri-app/latest.json` with new version info and signature
4. Copy to `docs/latest.json`: `cp tauri-app/latest.json docs/latest.json`
5. Commit and push the updated `latest.json` files
6. Create new GitHub release with tag `v1.0.1`
7. Upload the signed installer to the release

### Tips

- Keep release notes clear and concise
- Always test the update flow before announcing
- Tag format must be `vX.Y.Z` (with the 'v' prefix)
- Version in files must be `X.Y.Z` (without the 'v' prefix)
- The updater fetches `latest.json` from GitHub Pages (configured in `tauri.conf.json`)
- Always keep `tauri-app/latest.json` and `docs/latest.json` in sync
- GitHub Pages typically updates within 2-3 minutes of pushing changes

## Troubleshooting

**Update not detected:**
- Verify GitHub Pages is enabled and working (visit the URL in a browser)
- Check `docs/latest.json` is committed and pushed to the repository
- Ensure version number in `latest.json` is higher than current app version
- Wait 2-3 minutes for GitHub Pages to update after pushing
- Check browser console for errors (F12 in dev mode)
- Verify the updater endpoint in `tauri.conf.json` is correct

**"Could not fetch a valid release JSON" error:**
- This means the `latest.json` file is not accessible at the configured URL
- Verify GitHub Pages is enabled: Settings > Pages
- Check that `/docs` folder is selected as the source
- Confirm `docs/latest.json` exists in the repository
- Test the URL directly: https://galileo88.github.io/GroupChangeWalkthrough/latest.json

**Download fails:**
- Verify installer file is public and downloadable from the release
- Check filename matches exactly in `latest.json`
- Ensure URL uses `https://` not `http://`
- Make sure the release is published (not a draft)

**Installation fails:**
- Check installer is not corrupted
- Verify sufficient disk space
- Verify the signature in `latest.json` matches the `.sig` file
- Try manual download and installation
