# Code Signing Setup Guide

For the auto-updater to work securely, you need to set up code signing with public/private keys. This ensures updates are authentic and haven't been tampered with.

## Step 1: Generate Signing Keys

Run this command **on your local development machine**:

```bash
cd tauri-app
npx @tauri-apps/cli signer generate -w ~/.tauri/myapp.key
```

You'll be prompted to enter a password (press Enter for no password, or create one for extra security).

### Output Example:

```
Generating new signing key...

Your keypair was generated successfully
Private: /Users/yourname/.tauri/myapp.key (Keep this private!)
Public: dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo=

IMPORTANT: Keep your private key secure! Add it to .gitignore
```

## Step 2: Add Public Key to tauri.conf.json

Copy the **public key** from the output and add it to `tauri-app/src-tauri/tauri.conf.json`:

```json
{
  "plugins": {
    "updater": {
      "endpoints": [
        "https://github.com/Galileo88/GroupChangeWalkthrough/releases/latest/download/latest.json"
      ],
      "pubkey": "YOUR_PUBLIC_KEY_HERE",
      "windows": {
        "installMode": "passive"
      }
    }
  }
}
```

**Example:**
```json
{
  "plugins": {
    "updater": {
      "endpoints": [
        "https://github.com/Galileo88/GroupChangeWalkthrough/releases/latest/download/latest.json"
      ],
      "pubkey": "dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo=",
      "windows": {
        "installMode": "passive"
      }
    }
  }
}
```

## Step 3: Add Private Key to GitHub Secrets

The **private key** must be kept secret and added to GitHub:

### Get Your Private Key:

```bash
cat ~/.tauri/myapp.key
```

This will output something like:
```
untrusted comment: minisign private key
RWRTY6Xe3kKBRF5qKBmYLjl6qHLdcNDfHNOPQQQPQQPQQ...
```

### Add to GitHub:

1. Go to your repository: `https://github.com/Galileo88/GroupChangeWalkthrough`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `TAURI_SIGNING_PRIVATE_KEY`
5. Value: Paste the entire contents of your private key file
6. Click **Add secret**

## Step 4: Update .gitignore

**CRITICAL**: Ensure your private key is never committed to git:

Add to `.gitignore`:
```
# Tauri signing keys
*.key
.tauri/
```

## Step 5: Verify GitHub Actions Workflow

The workflow at `.github/workflows/release.yml` is already configured to use the `TAURI_SIGNING_PRIVATE_KEY` secret. It will:

1. Read the secret during the build
2. Sign the installer with your private key
3. Generate `latest.json` with the signature
4. Upload everything to the release

## Step 6: Test the Setup

After completing steps 1-4:

1. **Commit the public key**:
   ```bash
   git add tauri-app/src-tauri/tauri.conf.json
   git commit -m "Add updater public key for code signing"
   git push
   ```

2. **Create a test release**:
   ```bash
   # Update version to 1.0.1 in Cargo.toml and package.json
   git add tauri-app/src-tauri/Cargo.toml tauri-app/package.json
   git commit -m "Bump version to 1.0.1"
   git tag v1.0.1
   git push origin v1.0.1
   ```

3. **Check the Actions tab** - The workflow should:
   - Build successfully
   - Sign the installer
   - Create a release with `latest.json` containing a signature

## Security Best Practices

✅ **DO:**
- Keep your private key file secure
- Never commit the private key to git
- Use a password for the private key (optional but recommended)
- Rotate keys if they're ever compromised

❌ **DON'T:**
- Share your private key with anyone
- Commit `.key` files to version control
- Use the same key across multiple projects
- Hardcode the private key in your code

## Troubleshooting

### Update Fails with "Invalid Signature"

**Cause**: The public key in `tauri.conf.json` doesn't match the private key used for signing.

**Fix**: Regenerate keys and update both the config file and GitHub secret.

### Build Fails with "Missing TAURI_SIGNING_PRIVATE_KEY"

**Cause**: GitHub secret not set up correctly.

**Fix**: Verify the secret exists in Settings → Secrets → Actions with exact name `TAURI_SIGNING_PRIVATE_KEY`.

### "Failed to verify update signature"

**Cause**: The app was built without signing, or with a different key.

**Fix**: Ensure the public key in the installed app matches the key used to sign new releases.

## Key Files Reference

| File | Purpose | Keep Secret? |
|------|---------|--------------|
| `~/.tauri/myapp.key` | Private signing key | ✅ YES - Never commit |
| `tauri.conf.json` | Public key config | ❌ NO - Safe to commit |
| GitHub Secret | Private key for CI | ✅ YES - GitHub secure storage |

## Quick Checklist

Before creating your first signed release:

- [ ] Generate keypair with `npx @tauri-apps/cli signer generate`
- [ ] Add public key to `tauri.conf.json`
- [ ] Add private key to GitHub Secrets as `TAURI_SIGNING_PRIVATE_KEY`
- [ ] Update `.gitignore` to exclude `*.key` files
- [ ] Commit and push the config with public key
- [ ] Create a test release to verify signing works
- [ ] Test update from old version to new version

---

**Need Help?**
- [Tauri Updater Docs](https://v2.tauri.app/plugin/updater/)
- [Tauri Signing Guide](https://v2.tauri.app/reference/cli/#signer)
