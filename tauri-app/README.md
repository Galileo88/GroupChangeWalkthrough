# Provider Enrollment Walkthrough - Desktop Application

A Tauri-based desktop application for managing provider enrollment workflows with persistent file-based storage.

## Features

- ✅ **File-based PWO storage** - Each PWO# gets its own folder with a save file
- ✅ **Persistent across sessions** - Survives browser cache clearing
- ✅ **Desktop application** - Standalone app, no browser required
- ✅ **Cross-platform** - Works on Windows, macOS, and Linux
- ✅ **Auto-save** - Automatically saves your progress
- ✅ **Resume capability** - Continue where you left off

## Where are PWO files saved?

The app stores each PWO# in its own folder at:

- **Windows**: `C:\Users\<YourName>\AppData\Roaming\com.providerenrollment.walkthrough\PWO_<PWO#>\state.json`
- **macOS**: `~/Library/Application Support/com.providerenrollment.walkthrough/PWO_<PWO#>/state.json`
- **Linux**: `~/.local/share/com.providerenrollment.walkthrough/PWO_<PWO#>/state.json`

Each PWO# gets a dedicated folder named `PWO_<number>` containing a `state.json` file.

## Prerequisites

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

## How It Works

### File Storage System

Instead of browser localStorage, the app uses Rust backend commands to save PWO state to the file system:

1. **Save**: When you work on a PWO, it auto-saves to `PWO_<number>/state.json`
2. **Load**: When you resume, it reads from that PWO's folder
3. **Delete**: When you start new, it removes the old PWO folder

### Backend Commands (Rust)

The app provides these Tauri commands:
- `save_pwo_state` - Saves complete application state to file
- `load_pwo_state` - Loads saved state from file
- `delete_pwo_state` - Removes saved state
- `get_save_location` - Shows where files are stored

### Frontend Integration

The walkthrough HTML now uses `window.__TAURI__.invoke()` instead of `localStorage`:
```javascript
// Save state
await window.__TAURI__.invoke('save_pwo_state', { state: stateData });

// Load state
const state = await window.__TAURI__.invoke('load_pwo_state', { pwoNumber });

// Delete state
await window.__TAURI__.invoke('delete_pwo_state', { pwoNumber });
```

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

## Updating the Application

To modify the walkthrough:
1. Edit `src/index.html`
2. The app will auto-reload in dev mode
3. Rebuild for production: `npm run build`

To modify backend (file operations):
1. Edit `src-tauri/src/lib.rs`
2. The app will auto-rebuild in dev mode
3. Rebuild for production: `npm run build`

## Distribution

After building, you can distribute:
- **Windows**: The `.msi` or `.exe` installer from `bundle/msi/` or `bundle/nsis/`
- **macOS**: The `.dmg` from `bundle/dmg/`
- **Linux**: The `.deb`, `.rpm`, or `.AppImage` from respective bundle folders

Users just run the installer - no need for Node.js, Rust, or any dependencies!

## Support

For issues or questions about:
- Tauri framework: https://tauri.app/
- Building/installing: Check prerequisites above
- App functionality: Check the original walkthrough.html documentation
