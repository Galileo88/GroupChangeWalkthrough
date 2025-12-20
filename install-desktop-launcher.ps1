# PowerShell script to create a desktop shortcut for Group Change Walkthrough

Write-Host "Installing Group Change Walkthrough desktop launcher..." -ForegroundColor Green
Write-Host ""

# Get the current directory (where the script is running from)
$AppDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Path to the batch file
$BatchPath = Join-Path $AppDir "launch-app.bat"

# Create desktop shortcut
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "Group Change Walkthrough.lnk"

# Create WScript Shell object
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)

# Set shortcut properties
$Shortcut.TargetPath = $BatchPath
$Shortcut.WorkingDirectory = $AppDir
$Shortcut.Description = "Interactive walkthrough form for group change procedures"

# Set icon if available
$IconPath = Join-Path $AppDir "images\groupchange_application.jpg"
if (Test-Path $IconPath) {
    # Note: .jpg icons may not work, but we'll set it anyway
    $Shortcut.IconLocation = $IconPath
}

# Save the shortcut
$Shortcut.Save()

Write-Host ""
Write-Host "✓ Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "You should now see 'Group Change Walkthrough' on your desktop." -ForegroundColor Cyan
Write-Host "Double-click it to launch the application." -ForegroundColor Cyan
Write-Host ""
Write-Host "To uninstall, simply delete the shortcut from your desktop." -ForegroundColor Yellow
Write-Host ""

# Optional: Create Start Menu shortcut
$CreateStartMenu = Read-Host "Would you also like to add a Start Menu shortcut? (Y/N)"
if ($CreateStartMenu -eq 'Y' -or $CreateStartMenu -eq 'y') {
    $StartMenuPath = Join-Path ([Environment]::GetFolderPath("StartMenu")) "Programs"
    $StartMenuShortcut = Join-Path $StartMenuPath "Group Change Walkthrough.lnk"

    $Shortcut2 = $WScriptShell.CreateShortcut($StartMenuShortcut)
    $Shortcut2.TargetPath = $BatchPath
    $Shortcut2.WorkingDirectory = $AppDir
    $Shortcut2.Description = "Interactive walkthrough form for group change procedures"
    $Shortcut2.Save()

    Write-Host "✓ Start Menu shortcut created!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
