# Fix Signing Issue - Simple Steps

## The Problem

Your private key is password-encrypted, but you set the password secret to blank in GitHub. This causes the signature generation to fail.

## The Solution

Generate new keys WITHOUT a password, then update GitHub Secrets.

---

## Step 1: Generate New Keys (2 minutes)

1. Open PowerShell
2. Navigate to this repository:
   ```powershell
   cd C:\path\to\GroupChangeWalkthrough
   ```
3. Run the key generation script:
   ```powershell
   .\generate-signing-keys.ps1
   ```
4. When prompted for a password: **Press ENTER twice** (no password)
5. **Copy the PUBLIC KEY** that appears (starts with `dW50cnVzdGVk...`)
6. **Copy the PRIVATE KEY** that appears next

---

## Step 2: Update GitHub Secrets (1 minute)

1. Go to: https://github.com/Galileo88/GroupChangeWalkthrough/settings/secrets/actions

2. Update `TAURI_SIGNING_PRIVATE_KEY`:
   - Click **Update** next to TAURI_SIGNING_PRIVATE_KEY
   - **Paste the PRIVATE KEY** from Step 1
   - Click **Update secret**

3. Update `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`:
   - Click **Update** next to TAURI_SIGNING_PRIVATE_KEY_PASSWORD
   - **DELETE everything** - leave it completely empty
   - Click **Update secret**

---

## Step 3: Send Me the Public Key

Reply with the PUBLIC KEY you copied in Step 1, and I'll update `tauri.conf.json` for you.

The public key looks like this:
```
dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IDVCMTNFMzdDMzAzNUQ1RDMKUldUVDFUVXdmT01UVy90SEhLY1hyWTE5VjJIN0duL09VZWlIVGtmK0F0elUxUkd2SjJlUXB2c0EK
```

---

## Step 4: Create Release (after I update the config)

After I update the public key and push the changes:

1. Go to: https://github.com/Galileo88/GroupChangeWalkthrough/releases/new
2. Click **Choose a tag** → Type `v1.0.3` → Click **Create new tag: v1.0.3**
3. Title: `Provider Enrollment Walkthrough v1.0.3`
4. Description: `Fixed auto-updater signing`
5. Click **Publish release**

The workflow will run and should generate signatures successfully this time!

---

## Why This Works

- **Old setup**: Encrypted key + blank password = ❌ signature fails
- **New setup**: Unencrypted key + blank password = ✅ signatures work
- The key is still secure because it's stored in GitHub Secrets

---

## Quick Reference

The issue was discovered here: [tauri-action issue #658](https://github.com/tauri-apps/tauri-action/issues/658)

I also updated the workflow to use `tauri-action@v1` (latest) instead of `v0`.

---

Ready? Run `.\generate-signing-keys.ps1` and let's get this working!
