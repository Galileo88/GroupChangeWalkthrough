# Signing Troubleshooting Guide

## The Problem

You're getting "Signature not found for the updater JSON. Skipping upload..." because the GitHub Actions workflow cannot decrypt your private key.

## Why This Happens

Your private key is **password-encrypted** (you can tell because it says "rsign encrypted secret key" when decoded). The Tauri build process needs BOTH:

1. The encrypted private key itself
2. The password to decrypt it

## Required GitHub Secrets

You need to set **TWO** secrets in your GitHub repository settings:

### 1. TAURI_SIGNING_PRIVATE_KEY
This is the long base64 string starting with `dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5...`

**Current value:**
```
dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5bDF2MzQvdW1pd3c3Rm5HelZ6cHR0QTR2Q0J2ZFdNeXZCWjNIODNjOWF5WUFBQkFBQUFBQUFBQUFBQUlBQUFBQTA5VTFNSHpqRTF0MnZvckJRN0x3L1kzYkRldzF0dEQzOUNyaDdkMlJTc3dmNDRLd1dINjNGZnRISEtjWHJZMTlWMkg3R24vT1VlaUhUa2YrQXR6VTFSR3ZKMmVRcHZzQXpPdEZHbTVtbFpvYW9LdkdZL0ZFRGhJSDEzVDNOWlRGR2hMRUpsaEJTYW89Cg==
```

### 2. TAURI_SIGNING_PRIVATE_KEY_PASSWORD
This is the password YOU entered when you generated the signing keys with `npx @tauri-apps/cli signer generate`.

**You need to remember what password you typed when generating the keys.**

## How to Fix

### Option 1: Add the Missing Password Secret (Recommended if you remember the password)

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
5. Value: The password you entered when generating the keys
6. Click **Add secret**
7. Create a new release with tag `v1.0.3`

### Option 2: Generate New Keys (If you don't remember the password)

If you don't remember the password you used, you'll need to generate NEW keys:

1. Open PowerShell or Command Prompt
2. Run: `cd tauri-app`
3. Run: `npx @tauri-apps/cli signer generate -w ~/.tauri/provider-enrollment.key`
4. When prompted for a password, enter a SIMPLE password like: `tauri123`
5. Write down this password!
6. The command will output:
   - A new **private key** (long base64 string)
   - A new **public key** (shorter base64 string)

7. Update GitHub Secrets:
   - Set `TAURI_SIGNING_PRIVATE_KEY` to the **private key** output
   - Set `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` to the password you just used (`tauri123`)

8. Update the public key in `tauri-app/src-tauri/tauri.conf.json`:
   - Replace the current `pubkey` value with the new public key

9. Commit and push the change to the public key

10. Bump version to `1.0.3` in:
    - `tauri-app/src-tauri/Cargo.toml`
    - `tauri-app/package.json`
    - `tauri-app/src-tauri/tauri.conf.json`

11. Create a new release with tag `v1.0.3`

## Verifying Your Secrets

To verify your secrets are set correctly:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see BOTH:
   - `TAURI_SIGNING_PRIVATE_KEY`
   - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
3. You should also see `GITHUB_TOKEN` (this is automatic)

## After Fixing

Once both secrets are set correctly, create a new release:

1. Go to your repository on GitHub
2. Click **Releases** → **Create a new release**
3. Click **Choose a tag** → Type `v1.0.3` → Click **Create new tag**
4. Title: `Provider Enrollment Walkthrough v1.0.3`
5. Click **Publish release**

The workflow will run and should successfully generate signatures this time.
