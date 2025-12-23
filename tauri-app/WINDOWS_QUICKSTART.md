# Windows Quick Start Guide

## Prerequisites (One-Time Setup)

### 1. Install Node.js
1. Download from: https://nodejs.org/ (LTS version recommended)
2. Run the installer, accept defaults
3. Verify: Open PowerShell and run `node --version`

### 2. Install Rust
1. Download from: https://www.rust-lang.org/tools/install
2. Run `rustup-init.exe`
3. Accept defaults (press Enter for all prompts)
4. Restart your terminal/PowerShell
5. Verify: Run `rustc --version`

### 3. WebView2 (Usually Already Installed)
- Windows 10/11 usually has this pre-installed
- If needed, download from: https://developer.microsoft.com/microsoft-edge/webview2/

## Building the App

### Option 1: Using the Build Script (Easiest)
1. Open PowerShell
2. Navigate to the tauri-app folder:
   ```powershell
   cd path\to\GroupChangeWalkthrough\tauri-app
   ```
3. Run the build script:
   ```powershell
   .\build.bat
   ```

### Option 2: Manual Commands
1. Open PowerShell in the tauri-app folder
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Build the app:
   ```powershell
   npm run build
   ```

## Running the App

### During Development (with hot-reload)
```powershell
npm run dev
```
This opens the app and reloads automatically when you make changes.

### After Building
The installer will be at:
```
tauri-app\src-tauri\target\release\bundle\msi\Practitioner Enrollment Walkthrough_1.0.0_x64_en-US.msi
```

Just double-click the `.msi` file to install!

## Where Are My PWO Files Saved?

After installing, your PWO files will be saved at:
```
C:\Users\<YourUsername>\AppData\Roaming\com.practitionerenrollment.walkthrough\PWO_<PWO#>\state.json
```

Each PWO number gets its own folder!

To view your saved files:
1. Press `Win + R`
2. Type: `%APPDATA%\com.practitionerenrollment.walkthrough`
3. Press Enter

You'll see folders like:
- `PWO_12345/state.json`
- `PWO_67890/state.json`
- etc.

## Troubleshooting

### "npm is not recognized"
- Node.js isn't installed or not in PATH
- Reinstall Node.js, making sure to check "Add to PATH"
- Restart PowerShell

### "cargo is not recognized"
- Rust isn't installed or not in PATH
- Close all PowerShell windows and open a new one
- If still failing, reinstall Rust

### Build takes a long time
- First build can take 10-15 minutes (downloading Rust dependencies)
- Subsequent builds are much faster (2-3 minutes)
- This is normal!

### "WebView2 not found"
- Download WebView2 Runtime from Microsoft
- Install and restart your computer

## Next Steps

1. Run `npm run dev` to test the app in development mode
2. Make sure everything works
3. Run `npm run build` to create the installer
4. Install the `.msi` file
5. Start using your desktop app!

The best part: **Your PWO files survive browser cache clearing!** 🎉
