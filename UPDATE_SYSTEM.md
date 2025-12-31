# Auto-Update System

This application now includes an automatic update system that uses a network share for distribution.

## How It Works

1. **Update Detection**: When the app starts, it checks the network share for new versions
2. **User Notification**: If an update is available, a button appears with a "NEW" badge
3. **Silent Installation**: When the user confirms, the installer runs silently in passive mode

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

**Step 2: Build the installer**
- Run your build script or build command
- This will create an `.msi` installer in `tauri-app/src-tauri/target/release/bundle/msi/`

**Step 3: Copy files to network share**
Copy these files to `\\njtrfs1pv01.nj.core.him\shared\Provider Services\Enrollment\WALKTHROUGH_UPDATES`:

1. The new `.msi` installer file
2. A `version.json` file with this content:
```json
{
  "version": "1.0.1",
  "installer_filename": "Provider Enrollment Walkthrough_1.0.1_x64_en-US.msi"
}
```

**Note**: Make sure the `installer_filename` in `version.json` exactly matches your `.msi` filename.

### 3. How Users Update

1. Users launch the app
2. If an update is available, they'll see "New Update Available" button with a red "NEW" badge
3. They click the button
4. A confirmation dialog shows current vs. new version
5. After confirming, the installer runs silently (just shows a progress bar)
6. Users restart the app to use the new version

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
- Verify the installer filename in `version.json` matches the actual file

**Update installation fails:**
- Check that the installer file exists on the network share
- Verify the user has permissions to access the network share
- Ensure Windows allows the app to run msiexec

**Network share not accessible:**
- Users must be connected to the corporate network
- Check VPN connection if working remotely
- Verify network permissions
