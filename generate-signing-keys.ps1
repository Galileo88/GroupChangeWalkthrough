# ============================================================
# Tauri Signing Key Generator (NO PASSWORD)
# ============================================================
# This script generates signing keys WITHOUT password protection
# to simplify the GitHub Actions setup
# ============================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Tauri Signing Key Generator" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Generating new signing keys WITHOUT password..." -ForegroundColor Yellow
Write-Host "(This is fine - GitHub Secrets keep them secure)`n" -ForegroundColor Gray

# Navigate to tauri-app directory
Set-Location -Path "$PSScriptRoot\tauri-app"

# Generate keys with empty password (press Enter twice when prompted)
Write-Host "When prompted for password, just press ENTER twice (no password)`n" -ForegroundColor Green

# Run the key generator
npx @tauri-apps/cli signer generate -w "$env:USERPROFILE\.tauri\provider-enrollment.key"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "1. Copy the PUBLIC KEY above" -ForegroundColor Yellow
Write-Host "   - It should start with: dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6" -ForegroundColor Gray
Write-Host "   - Save it temporarily - you'll need it next`n" -ForegroundColor Gray

Write-Host "2. The PRIVATE KEY is saved at:" -ForegroundColor Yellow
Write-Host "   $env:USERPROFILE\.tauri\provider-enrollment.key" -ForegroundColor Gray
Write-Host "   - We'll display it next`n" -ForegroundColor Gray

Write-Host "`nPress any key to display the PRIVATE KEY..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PRIVATE KEY (for GitHub Secret)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$privateKey = Get-Content "$env:USERPROFILE\.tauri\provider-enrollment.key" -Raw
Write-Host $privateKey -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "COPY TO GITHUB SECRETS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "1. Go to: https://github.com/Galileo88/GroupChangeWalkthrough/settings/secrets/actions`n" -ForegroundColor Yellow

Write-Host "2. Update or create these secrets:" -ForegroundColor Yellow
Write-Host "   a) TAURI_SIGNING_PRIVATE_KEY" -ForegroundColor Green
Write-Host "      - Click 'Update' (or 'New repository secret' if it doesn't exist)" -ForegroundColor Gray
Write-Host "      - Paste the PRIVATE KEY shown above" -ForegroundColor Gray
Write-Host "      - Click 'Update secret'`n" -ForegroundColor Gray

Write-Host "   b) TAURI_SIGNING_PRIVATE_KEY_PASSWORD" -ForegroundColor Green
Write-Host "      - Click 'Update'" -ForegroundColor Gray
Write-Host "      - Leave it COMPLETELY EMPTY (delete any existing value)" -ForegroundColor Red
Write-Host "      - Click 'Update secret'`n" -ForegroundColor Gray

Write-Host "3. I will update the public key in tauri.conf.json for you" -ForegroundColor Yellow
Write-Host "   - Just paste the PUBLIC KEY when I ask`n" -ForegroundColor Gray

Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Ready to proceed? (Press any key)" -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
