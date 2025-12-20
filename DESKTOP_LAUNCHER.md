# Desktop Launcher Installation

This application now includes a desktop launcher so you can easily start it from your desktop environment.

## Windows Installation

### Quick Installation (Recommended)

1. Right-click on `install-desktop-launcher.ps1` and select **"Run with PowerShell"**

   OR open PowerShell in this directory and run:
   ```powershell
   .\install-desktop-launcher.ps1
   ```

2. The script will create a desktop shortcut and optionally a Start Menu shortcut

After installation, you can:
- Double-click the "Group Change Walkthrough" icon on your desktop
- Find it in your Start Menu (if you chose to create that shortcut)
- Pin it to your taskbar for quick access

### Manual Installation (Windows)

1. Double-click `launch-app.bat` to test that it works
2. Right-click `launch-app.bat` → "Create shortcut"
3. Move the shortcut to your Desktop or Start Menu

### Direct Launch (Windows)

You can also just double-click `launch-app.bat` directly anytime to start the application.

---

## Linux/macOS Installation

### Quick Installation

Run the installation script:

```bash
./install-desktop-launcher.sh
```

After installation, you can:
- Find "Group Change Walkthrough" in your applications menu
- Search for it in your application launcher
- Pin it to your dock/favorites

### Manual Installation (Linux/macOS)

If you prefer to install manually:

1. Copy the .desktop file:
   ```bash
   cp group-change-walkthrough.desktop ~/.local/share/applications/
   ```

2. Update the desktop database (optional):
   ```bash
   update-desktop-database ~/.local/share/applications
   ```

## How It Works

### Windows Files
- **launch-app.bat**: Batch script that starts the Vite dev server and opens the app in your browser
- **install-desktop-launcher.ps1**: PowerShell script that creates desktop and Start Menu shortcuts

### Linux/macOS Files
- **launch-app.sh**: Shell script that starts the Vite dev server and opens the app in your browser
- **group-change-walkthrough.desktop**: Desktop entry file that integrates with your system's application menu
- **install-desktop-launcher.sh**: Automated installation script

## Requirements

- Node.js and npm installed
- **Windows**: PowerShell (included with Windows)
- **Linux/macOS**: A desktop environment that supports .desktop files (GNOME, KDE, XFCE, etc.)

## Uninstallation

### Windows
Simply delete the shortcut(s) from your Desktop and/or Start Menu

### Linux/macOS
```bash
rm ~/.local/share/applications/group-change-walkthrough.desktop
```

## Troubleshooting

### Windows

**"Cannot be loaded because running scripts is disabled" error:**
- Open PowerShell as Administrator
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Try the installation script again

**Application doesn't start:**
- Make sure Node.js is installed: `node --version`
- Ensure dependencies are installed: `npm install`
- Try running `launch-app.bat` directly to see error messages

**Shortcut doesn't work:**
- Verify the path in the shortcut points to the correct location
- Try creating a new shortcut manually

### Linux/macOS

**Launcher doesn't appear in menu:**
- Log out and log back in
- Run `update-desktop-database ~/.local/share/applications`
- Check that the file exists: `ls ~/.local/share/applications/group-change-walkthrough.desktop`

**Application doesn't start:**
- Make sure Node.js is installed: `node --version`
- Ensure dependencies are installed: `npm install`
- Try running `./launch-app.sh` directly to see error messages
