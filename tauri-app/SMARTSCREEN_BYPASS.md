# Windows SmartScreen Warning - How to Bypass

## Why This Happens

When you download and run the Provider Enrollment Walkthrough installer, you may see a warning:

```
Windows Defender SmartScreen prevented an unrecognized app from starting.
Running this app might put your PC at risk.
```

**This is normal for unsigned applications.** The application is safe, but it's not digitally signed with an expensive code signing certificate.

## For Users: How to Install Despite the Warning

### Method 1: Click "More info" then "Run anyway"
1. When you see the SmartScreen warning, click **"More info"**
2. Click the **"Run anyway"** button that appears
3. The installer will proceed normally

### Method 2: Right-click Properties Method
1. Right-click the `.msi` installer file
2. Select **Properties**
3. Check the box that says **"Unblock"** at the bottom
4. Click **OK**
5. Now double-click the installer - it should run without the warning

### Method 3: PowerShell Unblock (Advanced)
Open PowerShell and run:
```powershell
Unblock-File -Path "path\to\Provider Enrollment Walkthrough_1.0.0_x64_en-US.msi"
```

## For Developers: Long-Term Solutions

### Solution 1: Code Signing Certificate (Recommended for Production)

To eliminate the SmartScreen warning, you need to digitally sign your application:

1. **Purchase a Code Signing Certificate** ($300-500/year):
   - [DigiCert](https://www.digicert.com/signing/code-signing-certificates)
   - [Sectigo](https://sectigo.com/ssl-certificates-tls/code-signing)
   - [SSL.com](https://www.ssl.com/certificates/code-signing/)

2. **Sign your executable** during the Tauri build process

3. **Build reputation**: Even with a certificate, new publishers may still trigger SmartScreen until they build reputation through downloads

### Solution 2: Extended Validation (EV) Code Signing Certificate

EV certificates ($400-600/year) provide:
- Immediate SmartScreen reputation
- No "unknown publisher" warnings
- Higher trust level
- Requires identity verification (company registration, business documents)

### Solution 3: Open Source Distribution

For free/open-source projects:
- Distribute through Microsoft Store (requires developer account: $19 one-time)
- Publish on GitHub Releases with clear instructions for users
- Build reputation over time as more users install

### Solution 4: Self-Signing (Not Recommended - Still Shows Warnings)

Self-signed certificates still trigger SmartScreen but allow you to verify authenticity:

```powershell
# Create self-signed certificate
$cert = New-SelfSignedCertificate -Subject "CN=Your Organization" -Type CodeSigning -CertStoreLocation Cert:\CurrentUser\My

# Sign the MSI
signtool sign /fd SHA256 /a /tr http://timestamp.digicert.com "path\to\installer.msi"
```

**Note**: This doesn't eliminate SmartScreen warnings but proves the file hasn't been tampered with.

## Configuring Tauri for Code Signing

If you obtain a certificate, update `tauri.conf.json`:

```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERT_THUMBPRINT_HERE",
      "digestAlgorithm": "sha256",
      "timestampUrl": "http://timestamp.digicert.com"
    }
  }
}
```

## What We Recommend

**For internal/small-scale distribution**:
- Add clear instructions in your README about clicking "More info" → "Run anyway"
- Include screenshots showing the process
- Explain that this is normal for unsigned software

**For public/commercial distribution**:
- Invest in an EV Code Signing Certificate
- Sign all releases
- Build reputation over time

## Additional Resources

- [Tauri Code Signing Documentation](https://tauri.app/v1/guides/distribution/sign-windows)
- [Microsoft SmartScreen Overview](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-smartscreen/microsoft-defender-smartscreen-overview)
- [Understanding Code Signing](https://www.ssl.com/article/what-is-code-signing/)

## Is This Application Safe?

Yes! The SmartScreen warning appears because:
1. The application isn't signed with an expensive certificate
2. Windows doesn't recognize the publisher
3. The file hasn't been downloaded by enough users to build reputation

The source code is available in this repository for inspection. The application does not:
- Connect to the internet (except for optional API calls you configure)
- Access sensitive system resources
- Contain malware or viruses
- Collect or transmit personal data

Users can review the code themselves before building and installing.
