# Auto-Update System

This application now includes an automatic update system that uses a network share for distribution.

## How It Works

1. **Update Detection**: When the app starts, it checks the network share for new versions
2. **User Notification**: If an update is available, a button appears with the version badge
3. **Automatic Update**: When the user confirms:
   - Downloads the new exe from network share
   - Closes the current app
   - Replaces the old exe with the new one
   - Restarts automatically
   - No installer or code signing required

## Setup for Distribution

### 1. Network Share Setup

Create the following folder on the network share:
```
\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_UPDATES
```

### 2. Publishing a New Version

When you have a new version to release:

**Step 1: Update the version**
- Edit `tauri-app/src-tauri/src/lib.rs`
- Change `const CURRENT_VERSION: &str = "1.0.0";` to your new version (e.g., `"1.0.1"`)
- Edit `tauri-app/src-tauri/tauri.conf.json`
- Change `"version": "1.0.0"` to match (e.g., `"1.0.1"`)

**Step 2: Build the application**
- Run your build script or build command
- This will create an `.exe` in `tauri-app/src-tauri/target/release/`
- The exe filename will be something like `Provider Enrollment Walkthrough.exe`

**Step 3: Copy files to network share**
Copy these files to `\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_UPDATES`:

1. The new `.exe` file (renamed with version)
2. A `version.json` file with this content:
```json
{
  "version": "1.0.1",
  "exe_filename": "provider-enrollment-walkthrough-v1.0.1.exe"
}
```

**Recommended naming convention**: Use `provider-enrollment-walkthrough-v{version}.exe` (e.g., `provider-enrollment-walkthrough-v1.0.1.exe`) to easily track versions on the network share.

**Note**: Make sure the `exe_filename` in `version.json` exactly matches your exe filename.

### 3. How Users Update

1. Users launch the app
2. If an update is available, they'll see "New Update Available" button with a red version badge
3. They click the button
4. A confirmation dialog shows current vs. new version
5. After confirming:
   - The app closes
   - The update runs automatically in the background
   - The app restarts with the new version
6. The entire process takes just a few seconds

## Files Modified

- `tauri-app/src-tauri/src/lib.rs` - Added update checking and installation commands
- `tauri-app/src-tauri/Cargo.toml` - No additional dependencies needed
- `tauri-app/src/index.html` - Added update button UI and JavaScript

## Network Locations

- **PWO Data Storage**: `\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_PWOs`
- **Update Distribution**: `\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_UPDATES`

## Troubleshooting

**Button shows "No Updates Available" even though I uploaded an update:**
- Verify the `version.json` file is in the correct location
- Check that the version in `version.json` differs from `CURRENT_VERSION` in the app
- Verify the exe filename in `version.json` matches the actual file exactly (including the `.exe` extension)

**Update installation fails:**
- Check that the exe file exists on the network share
- Verify the user has permissions to access the network share and write to the app directory
- Ensure the app is not running from a read-only location

**Network share not accessible:**
- Users must be connected to the corporate network
- Check VPN connection if working remotely
- Verify network permissions

## Example Network Share Structure

After publishing version 1.0.1, your network share should look like:
```
\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_UPDATES\
├── version.json
└── provider-enrollment-walkthrough-v1.0.1.exe
```

When you publish 1.0.2, you can keep old versions:
```
\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_UPDATES\
├── version.json  (updated to point to v1.0.2)
├── provider-enrollment-walkthrough-v1.0.1.exe
└── provider-enrollment-walkthrough-v1.0.2.exe
```

## How the Update Works Technically

1. User clicks "Update Available" and confirms
2. App copies new exe from network share to temp folder
3. App creates a batch script in temp folder that:
   - Waits 2 seconds for app to close
   - Replaces old exe with new exe
   - Starts the updated app
   - Cleans up temp files
4. App launches the batch script and exits
5. Batch script completes the update and restarts the app
6. User sees the updated app automatically
