# Provider Group Change Walkthrough - Desktop Application

## Overview

This is a **step-by-step walkthrough tool** for Gainwell provider group change processes. It guides users through the workflow without gathering any provider information - it's purely an interactive guide showing what steps to take in external systems.

### What It Does

The app provides a structured walkthrough for adding providers to groups, with intelligent branching logic:
- **Existing Provider Path**: Steps for adding already-enrolled providers to a group
- **New Provider Path**: Steps for enrolling new providers before adding them to a group
- **Auto-detection**: Automatically routes users through the correct workflow based on provider enrollment status
- **State Management**: Tracks progress through the workflow and allows resuming where you left off

### Tech Stack

**Desktop Application (Tauri)**:
- **Frontend**: HTML, CSS (Tailwind), Vanilla JavaScript
- **Backend**: Rust (Tauri framework)
- **Storage**: File-based state persistence using Tauri's filesystem API
- **Platform**: Cross-platform desktop app (Windows, macOS, Linux)

### Flow Logic

1. **Steps 1-9**: Initial verification questions (Group Practice, Pay To/Mail To, Questions 6-23)
2. **Branch Point (Step 9)**: System determines path based on provider enrollment status
   - **New Providers**: Routes to enrollment workflow (Steps 24-37), then to existing provider workflow
   - **Existing Providers**: Routes directly to group addition workflow (Steps 11-23)
3. **Looping**: Supports multiple providers through repeatable workflows
4. **Completion**: Tracks enrolled providers and provides final confirmation

### Impact

**Problem Solved**: Provider group changes involve complex, multi-step processes across multiple systems (CICS, SNOW, mainframe). Without structured guidance, staff can miss steps or perform them out of order.

**Solution**: This desktop app provides a reliable, persistent walkthrough that:
- ✅ **Reduces errors** - Ensures all steps are completed in the correct order
- ✅ **Saves time** - No need to reference external documentation or remember complex workflows
- ✅ **Improves consistency** - All staff follow the same standardized process
- ✅ **Enables resumption** - File-based storage survives system restarts and allows picking up where you left off
- ✅ **Works offline** - Desktop app requires no internet connection or browser

---

## Technical Details

### File Storage

The app stores each PWO# in its own folder at:

- **Windows**: `C:\Users\<YourName>\AppData\Roaming\com.providerenrollment.walkthrough\PWO_<PWO#>\state.json`
- **macOS**: `~/Library/Application Support/com.providerenrollment.walkthrough/PWO_<PWO#>/state.json`
- **Linux**: `~/.local/share/com.providerenrollment.walkthrough/PWO_<PWO#>/state.json`

---

## Development & Build

### Prerequisites

Before building the app, you need to install:

### 1. Node.js and npm
- Download from: https://nodejs.org/
- Verify installation: `node --version` and `npm --version`

### 2. Rust
- Download from: https://www.rust-lang.org/tools/install
- Verify installation: `rustc --version` and `cargo --version`

### 3. System Dependencies

#### Windows
Install WebView2 (usually pre-installed on Windows 10/11):
- Download: https://developer.microsoft.com/microsoft-edge/webview2/

#### macOS
Install Xcode Command Line Tools:
```bash
xcode-select --install
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### Linux (Fedora)
```bash
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

#### Linux (Arch)
```bash
sudo pacman -S webkit2gtk-4.1 \
  base-devel \
  openssl \
  libappindicator-gtk3 \
  librsvg
```

## Installation & Build

### 1. Install Dependencies
```bash
cd tauri-app
npm install
```

### 2. Development Mode (Hot Reload)
```bash
npm run dev
```

This will start the app in development mode with hot-reload enabled.

### 3. Build Production App
```bash
npm run build
```

The built application will be in:
- **Windows**: `src-tauri/target/release/provider-enrollment-walkthrough.exe`
- **macOS**: `src-tauri/target/release/bundle/macos/Provider Enrollment Walkthrough.app`
- **Linux**: `src-tauri/target/release/provider-enrollment-walkthrough`

The installer packages will be in:
- **Windows**: `src-tauri/target/release/bundle/msi/` or `nsis/`
- **macOS**: `src-tauri/target/release/bundle/dmg/`
- **Linux**: `src-tauri/target/release/bundle/deb/` or `appimage/`

### Architecture

**Frontend-Backend Communication**:
The app uses Tauri's IPC (Inter-Process Communication) bridge:
- Frontend: HTML/CSS/JS handles the UI and walkthrough logic
- Backend: Rust provides file system operations via Tauri commands
- Communication: `window.__TAURI__.invoke()` calls Rust functions from JavaScript

**State Persistence**:
1. **Save**: Auto-saves walkthrough state to `PWO_<number>/state.json`
2. **Load**: Reads saved state when resuming a PWO
3. **Delete**: Removes old PWO data when starting fresh

## Troubleshooting

### App won't build
- Ensure all prerequisites are installed
- On Linux, make sure you installed the webkit2gtk libraries
- Try `cargo clean` in src-tauri directory and rebuild

### Can't find saved files
- The app uses the OS-specific app data directory
- Use the Tauri command `get_save_location` to see the exact path
- On Windows, check AppData\Roaming
- On macOS, check ~/Library/Application Support
- On Linux, check ~/.local/share

### Development mode not working
- Check that port 1420 isn't in use
- Try `npm run dev` from the tauri-app directory
- Check browser console for errors

## Project Structure

```
tauri-app/
├── src/                      # Frontend files
│   ├── index.html           # Main walkthrough (formerly walkthrough.html)
│   └── images/              # Image assets
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── lib.rs          # Main Tauri commands
│   │   └── main.rs         # App entry point
│   ├── icons/              # App icons (auto-generated)
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── package.json            # Node dependencies
└── README.md               # This file
```

### Modifying the App

**Walkthrough changes**: Edit `src/index.html` (auto-reloads in dev mode)
**Backend changes**: Edit `src-tauri/src/lib.rs` (auto-rebuilds in dev mode)
**Production build**: Run `npm run build`

## Distribution

After building, you can distribute:
- **Windows**: The `.msi` or `.exe` installer from `bundle/msi/` or `bundle/nsis/`
- **macOS**: The `.dmg` from `bundle/dmg/`
- **Linux**: The `.deb`, `.rpm`, or `.AppImage` from respective bundle folders

Users just run the installer - no need for Node.js, Rust, or any dependencies!

## Support

For issues or questions:
- **Tauri framework**: https://tauri.app/
- **Building/installing**: Check prerequisites above
