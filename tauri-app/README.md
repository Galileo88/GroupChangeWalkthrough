# Provider Group Change Walkthrough

## What It Does

A step-by-step walkthrough tool for Gainwell provider group change processes. Guides users through the workflow - it's purely an interactive guide, not a data collection tool.

## Tech Stack

- **Frontend**: HTML, CSS (Tailwind), Vanilla JavaScript
- **Backend**: Rust (Tauri framework)
- **Storage**: File-based state persistence
- **Platform**: Desktop app (Windows, macOS, Linux)

## Flow Logic

1. **Steps 1-9**: Initial verification questions
2. **Branch Point**: Auto-routes based on provider enrollment status
   - **New Providers**: Enrollment workflow (Steps 24-37) → Existing provider workflow
   - **Existing Providers**: Group addition workflow (Steps 11-23)
3. **Looping**: Repeatable workflows for multiple providers
4. **Completion**: Tracks enrolled providers

## Impact

**Problem**: Provider group changes involve complex, multi-step processes across multiple systems (CICS, SNOW, mainframe). Staff can miss steps or perform them out of order.

**Solution**:
- Ensures all steps are completed in the correct order
- Eliminates need for external documentation
- Standardizes the process across all staff
- File-based storage allows resuming work after restarts
- Works offline

---

## Development

**Prerequisites**: Node.js, Rust, and system dependencies ([Tauri setup guide](https://tauri.app/start/prerequisites/))

**Commands**:
```bash
cd tauri-app
npm install        # Install dependencies
npm run dev        # Development mode
npm run build      # Build production app
```

**PWO state files** are saved to OS-specific app data directories.
