# Code Signing Guide for Windows

This guide walks you through the complete process of signing your Tauri application to eliminate Windows SmartScreen warnings.

## Prerequisites

- Windows 10/11
- PowerShell
- Your Tauri application ready to build

## Step 1: Obtain a Code Signing Certificate

### Option A: Purchase from a Certificate Authority (Production)

**Standard Code Signing Certificate** ($300-500/year):
1. Visit a certificate authority:
   - [DigiCert](https://www.digicert.com/signing/code-signing-certificates)
   - [Sectigo](https://sectigo.com/ssl-certificates-tls/code-signing)
   - [SSL.com](https://www.ssl.com/certificates/code-signing/)

2. Select "Standard Code Signing Certificate"

3. Complete identity verification (requires):
   - Business registration documents
   - Phone verification
   - Email verification
   - May take 1-7 days

4. Download and install the certificate to your Windows certificate store

**Extended Validation (EV) Certificate** ($400-600/year, recommended):
- Provides immediate SmartScreen reputation
- Requires hardware token (USB security key)
- More rigorous verification process
- Best for commercial distribution

### Option B: Create Self-Signed Certificate (Testing Only)

**Warning**: Self-signed certificates still trigger SmartScreen warnings but are useful for:
- Testing the signing process
- Internal distribution where you can install the certificate on all machines
- Verifying build integrity

Create a self-signed certificate:

```powershell
# Run PowerShell as Administrator
$cert = New-SelfSignedCertificate `
    -Subject "CN=Your Company Name, O=Your Company, C=US" `
    -Type CodeSigningCert `
    -KeySpec Signature `
    -KeyLength 2048 `
    -KeyAlgorithm RSA `
    -HashAlgorithm SHA256 `
    -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider" `
    -CertStoreLocation "Cert:\CurrentUser\My" `
    -NotAfter (Get-Date).AddYears(3)

# Export the certificate (optional, for backup)
$certPath = "C:\Temp\MyCodeSigningCert.pfx"
$certPassword = ConvertTo-SecureString -String "YourPassword123" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath $certPath -Password $certPassword

# Get the thumbprint (you'll need this)
$cert.Thumbprint
```

Copy the thumbprint that's displayed - you'll need it for configuration.

## Step 2: Install the Certificate (if not already installed)

If you purchased a certificate and received a `.pfx` file:

```powershell
# Import the certificate
$pfxPath = "C:\path\to\your\certificate.pfx"
$pfxPassword = Read-Host -AsSecureString "Enter certificate password"

Import-PfxCertificate `
    -FilePath $pfxPath `
    -CertStoreLocation Cert:\CurrentUser\My `
    -Password $pfxPassword
```

Verify it's installed:

```powershell
# List all code signing certificates
Get-ChildItem -Path Cert:\CurrentUser\My -CodeSigningCert
```

Find your certificate and note the **Thumbprint** value.

## Step 3: Configure Tauri for Code Signing

### Method 1: Using tauri.conf.json (Recommended)

Edit `/tauri-app/src-tauri/tauri.conf.json`:

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Provider Enrollment Walkthrough",
  "version": "1.0.0",
  "identifier": "com.providerenrollment.walkthrough",
  "build": {
    "beforeDevCommand": "",
    "beforeBuildCommand": "",
    "frontendDist": "../src"
  },
  "app": {
    "windows": [
      {
        "title": "Provider Enrollment Walkthrough",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "devtools": true
      }
    ],
    "security": {
      "csp": null
    },
    "withGlobalTauri": true
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "windows": {
      "certificateThumbprint": "YOUR_CERTIFICATE_THUMBPRINT_HERE",
      "digestAlgorithm": "sha256",
      "timestampUrl": "http://timestamp.digicert.com"
    }
  }
}
```

Replace `YOUR_CERTIFICATE_THUMBPRINT_HERE` with your actual certificate thumbprint (no spaces or dashes).

**Important**: DO NOT commit your certificate thumbprint to public repositories if it's a paid certificate.

### Method 2: Using Environment Variables (More Secure)

Instead of hardcoding the thumbprint, use an environment variable:

In `tauri.conf.json`:
```json
"windows": {
  "certificateThumbprint": "$WINDOWS_CERTIFICATE_THUMBPRINT",
  "digestAlgorithm": "sha256",
  "timestampUrl": "http://timestamp.digicert.com"
}
```

Set the environment variable before building:

```powershell
# Set for current session
$env:WINDOWS_CERTIFICATE_THUMBPRINT = "YOUR_THUMBPRINT_HERE"

# Or set permanently
[System.Environment]::SetEnvironmentVariable('WINDOWS_CERTIFICATE_THUMBPRINT', 'YOUR_THUMBPRINT_HERE', 'User')
```

## Step 4: Build and Sign

### Automatic Signing (During Build)

With the configuration above, Tauri will automatically sign during build:

```powershell
cd tauri-app
npm run build
```

Tauri will sign the executable and MSI installer automatically.

### Manual Signing (Alternative)

If you need to manually sign after building:

```powershell
# Install Windows SDK (includes signtool)
# Download from: https://developer.microsoft.com/windows/downloads/windows-sdk/

# Find signtool (usually here)
$signtool = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe"

# Sign the MSI installer
& $signtool sign `
    /fd SHA256 `
    /sha1 YOUR_CERT_THUMBPRINT `
    /tr http://timestamp.digicert.com `
    /td SHA256 `
    "tauri-app\src-tauri\target\release\bundle\msi\Provider Enrollment Walkthrough_1.0.0_x64_en-US.msi"

# Sign the executable too
& $signtool sign `
    /fd SHA256 `
    /sha1 YOUR_CERT_THUMBPRINT `
    /tr http://timestamp.digicert.com `
    /td SHA256 `
    "tauri-app\src-tauri\target\release\Provider Enrollment Walkthrough.exe"
```

## Step 5: Verify the Signature

Check that signing worked:

```powershell
# Verify MSI signature
Get-AuthenticodeSignature "tauri-app\src-tauri\target\release\bundle\msi\Provider Enrollment Walkthrough_1.0.0_x64_en-US.msi"

# Should show:
# Status: Valid
# SignerCertificate: CN=Your Company Name
```

Or use signtool:

```powershell
& $signtool verify /pa "path\to\your\installer.msi"
```

You should see: "Successfully verified"

## Step 6: Test on a Clean Machine

1. Copy the signed installer to a different Windows machine
2. Try to run it
3. With a proper certificate from a CA, you should see:
   - No SmartScreen warning, OR
   - Publisher name shown instead of "Unknown publisher"
   - "Run anyway" option more prominent

**Note**: Even with a valid certificate, new publishers may still trigger SmartScreen until reputation is built.

## Understanding Timestamp URLs

The timestamp URL is critical:

```
http://timestamp.digicert.com
```

This ensures your signature remains valid even after your certificate expires. The timestamp proves the signature was created while the certificate was still valid.

Alternative timestamp servers:
- DigiCert: `http://timestamp.digicert.com`
- Sectigo: `http://timestamp.sectigo.com`
- GlobalSign: `http://timestamp.globalsign.com`

## Troubleshooting

### "Certificate not found"
```powershell
# List all certificates
Get-ChildItem -Path Cert:\CurrentUser\My

# Look for one with Enhanced Key Usage: Code Signing
```

### "SignTool not found"
Install the Windows SDK from Microsoft

### "Timestamp server unavailable"
Try a different timestamp URL or retry later

### Signature shows as invalid
- Certificate might not be trusted
- For self-signed: Install the certificate to Trusted Root on the test machine
- For CA certs: Ensure intermediate certificates are included

### SmartScreen still appears
- New publishers need to build reputation (can take weeks/months)
- Consider EV certificate for immediate reputation
- Ensure certificate is from a trusted CA

## For Self-Signed Certificates: Installing on Target Machines

If using self-signed for internal distribution:

```powershell
# On each target machine (Run as Administrator)
Import-Certificate `
    -FilePath "C:\path\to\MyCodeSigningCert.cer" `
    -CertStoreLocation Cert:\LocalMachine\Root
```

## Security Best Practices

1. **Protect your certificate**:
   - Never commit certificates to version control
   - Use hardware security modules (HSM) for EV certs
   - Restrict access to certificate files

2. **Use strong passwords**:
   - If exporting to `.pfx`, use a strong password
   - Store passwords securely (password manager)

3. **Rotate certificates**:
   - Monitor expiration dates
   - Renew before expiration
   - Update thumbprint in configuration

4. **Automate for CI/CD**:
   - Store certificate thumbprint in CI/CD secrets
   - Sign automatically in build pipeline
   - Use GitHub Actions, Azure DevOps, etc.

## Cost Summary

- **Self-signed**: Free (but doesn't eliminate SmartScreen)
- **Standard Code Signing**: $300-500/year
- **EV Code Signing**: $400-600/year + hardware token
- **Microsoft Store Distribution**: $19 one-time (alternative to signing)

## Recommended Approach

**For this application (Provider Enrollment Walkthrough)**:

1. **Short term**: Document the "More info → Run anyway" process for users
2. **Medium term**: If wide distribution needed, purchase a standard certificate
3. **Long term**: Consider EV certificate if budget allows and building reputation is critical

**For internal use only**: Self-signed certificate with installation instructions may be sufficient.

## Additional Resources

- [Tauri v2 Code Signing Docs](https://v2.tauri.app/distribute/sign/windows/)
- [Microsoft Docs: Code Signing](https://docs.microsoft.com/windows/win32/seccrypto/cryptography-tools)
- [DigiCert Code Signing Guide](https://www.digicert.com/kb/code-signing/windows-code-signing-guide.htm)
