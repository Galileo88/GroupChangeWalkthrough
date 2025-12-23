# Practitioner Group Change Walkthrough

## What It Does

A step-by-step walkthrough tool for Gainwell practitioner group change processes. This application guides users through complex workflows across multiple systems (CICS, SNOW, mainframe) without gathering any practitioner information - it's purely an interactive guide showing what steps to take and in what order.

The app provides a structured walkthrough for adding practitioners to groups with intelligent branching:
- **Existing Practitioner Path**: For practitioners already enrolled in the system who need to be added to a group
- **New Practitioner Path**: For practitioners who need to be enrolled first, then added to a group
- **Auto-detection**: Automatically routes users through the correct workflow based on practitioner enrollment status
- **State Persistence**: Tracks progress through the workflow and allows resuming exactly where you left off, even after system restarts

## Tech Stack

**Desktop Application (Tauri)**:
- **Frontend**: HTML, CSS (Tailwind CSS), Vanilla JavaScript for the interactive walkthrough UI
- **Backend**: Rust with Tauri framework for native OS integration and file system operations
- **Storage**: File-based state persistence using Tauri's filesystem API (no databases, no browser localStorage)
- **Platform**: Cross-platform desktop application supporting Windows, macOS, and Linux
- **Architecture**: Frontend-backend communication via Tauri's IPC bridge using `window.__TAURI__.invoke()`

## Flow Logic

### Sequential Steps (1-9)
Initial verification and data gathering phase:
- Welcome page with user name and PWO# entry
- Group Practice Application verification
- Question 6 verification
- Pay To/Mail To information
- Questions 9-17 verification
- Email to SNOW
- Question 20 verification
- Questions 21-23 verification
- Practitioner type selection (automatic branch point)

### Branch Point (Step 9)
System automatically determines the workflow path based on practitioner enrollment status:

**New Practitioner Path (Steps 24-37)**:
- Create new enrollment in the system
- Fill complete practitioner information across multiple tabs (address, payment/mailing, NPI, specialty, license/DEA, claim types)
- Verify enrollment application
- Enroll on mainframe
- Decision point: Additional new practitioners needed?
  - **Yes**: Loop back to Step 24 for next practitioner
  - **No**: Transition to existing practitioner workflow

**Existing Practitioner Path (Steps 11-23)**:
- Open CICS and add practitioner to group
- Verify practitioner information
- Close enrollment task and finish group change
- Create checklist and approve group change
- Complete letter generation workflow (open task, select letter, add practitioner, finish letter, close task)
- Completion page with decision: Additional existing practitioners?
  - **Yes**: Loop back to Step 11 for next practitioner
  - **No**: Final completion

### Workflow Priority
The system enforces a specific order:
1. All new practitioners must be enrolled first (Steps 24-37 loop)
2. Only after new practitioner enrollment is complete, existing practitioners are added to the group (Steps 11-23 loop)
3. Final completion when all practitioners (new and existing) have been processed

## Impact

### Problem Statement
Practitioner group changes involve complex, multi-step processes spanning multiple disconnected systems:
- **CICS**: Legacy mainframe system for practitioner enrollment
- **SNOW**: ServiceNow for task and checklist management
- **Mainframe**: Core enrollment database
- **Letter Generation System**: Practitioner correspondence

Without structured guidance, staff frequently:
- Miss critical steps in the process
- Perform steps out of order, causing errors
- Lose progress when systems disconnect or browsers crash
- Struggle to remember which practitioners have been processed
- Require constant reference to external documentation

### Solution Benefits

**Operational Excellence**:
- Ensures all steps are completed in the correct order, every time
- Eliminates manual tracking of which practitioners have been processed
- Standardizes the process across all staff members
- Reduces training time for new employees

**Reliability**:
- File-based storage survives browser crashes and system restarts
- Each PWO# gets its own dedicated save file
- Auto-save functionality means no manual "save" required
- Can resume mid-workflow without losing any progress

**Efficiency**:
- No need to reference external documentation during processing
- Clear visual indicators of current step and progress
- Intelligent branching eliminates unnecessary steps
- Works completely offline - no internet connection required
