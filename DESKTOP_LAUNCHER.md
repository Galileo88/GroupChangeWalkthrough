# Desktop Launcher Installation

This application now includes a desktop launcher so you can easily start it from your desktop environment.

## Quick Installation

Run the installation script:

```bash
./install-desktop-launcher.sh
```

After installation, you can:
- Find "Group Change Walkthrough" in your applications menu
- Search for it in your application launcher
- Pin it to your dock/favorites

## Manual Installation

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

- **launch-app.sh**: Script that starts the Vite dev server and opens the app in your browser
- **group-change-walkthrough.desktop**: Desktop entry file that integrates with your system's application menu
- **install-desktop-launcher.sh**: Automated installation script

## Requirements

- Node.js and npm installed
- A desktop environment that supports .desktop files (GNOME, KDE, XFCE, etc.)

## Uninstallation

To remove the desktop launcher:

```bash
rm ~/.local/share/applications/group-change-walkthrough.desktop
```

## Troubleshooting

**Launcher doesn't appear in menu:**
- Log out and log back in
- Run `update-desktop-database ~/.local/share/applications`
- Check that the file exists: `ls ~/.local/share/applications/group-change-walkthrough.desktop`

**Application doesn't start:**
- Make sure Node.js is installed: `node --version`
- Ensure dependencies are installed: `npm install`
- Try running `./launch-app.sh` directly to see error messages
