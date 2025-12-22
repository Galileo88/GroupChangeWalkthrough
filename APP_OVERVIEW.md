# Group Change Walkthrough Application - Overview

## Executive Summary

The Group Change Walkthrough Application is a comprehensive web and desktop solution designed for Gainwell Technologies to streamline the provider enrollment process for Full Group Change Applications (FD23). This application guides enrollment specialists through a complex, multi-step workflow that handles both new provider enrollments and existing provider group additions.

**Version:** 1.0.0
**Target Users:** Gainwell Provider Enrollment Specialists
**Primary Use Case:** Processing Full Group Change Applications (FD23)

---

## Table of Contents

1. [Application Purpose](#application-purpose)
2. [Key Features](#key-features)
3. [Application Architecture](#application-architecture)
4. [Platform Availability](#platform-availability)
5. [Workflow Overview](#workflow-overview)
6. [Technical Stack](#technical-stack)
7. [Data Management](#data-management)
8. [User Experience](#user-experience)
9. [Installation & Deployment](#installation--deployment)
10. [Future Roadmap](#future-roadmap)

---

## Application Purpose

The Group Change Walkthrough Application addresses a critical need in the provider enrollment process by providing:

- **Guided Workflow**: Step-by-step instructions for processing complex group change applications
- **Data Validation**: Ensures all required information is collected and verified
- **Reference Materials**: Embedded screenshots and documentation for each step
- **Progress Tracking**: Auto-save functionality with resume capability
- **Quality Assurance**: Built-in verification steps to reduce errors
- **Outreach Management**: Tracks providers requiring additional verification
- **Multi-Provider Support**: Handles enrollment of multiple providers in a single session

---

## Key Features

### 1. **Dual Platform Support**
- **Web Application**: Browser-based access via landing portal
- **Desktop Application**: Tauri-based standalone app with persistent file storage

### 2. **Intelligent Workflow Branching**
The application automatically routes users through different workflows based on provider enrollment status:
- **New Provider Path** (Steps 24-37): Complete enrollment process for providers not in the system
- **Existing Provider Path** (Steps 11-23): Simplified process for providers already enrolled
- **Auto-Branching Logic**: Prioritizes new provider enrollments before existing provider additions

### 3. **State Management & Persistence**
- **Web Version**: LocalStorage-based state persistence
- **Desktop Version**: File-based storage in OS-specific app data directories
- **Auto-Save**: Debounced auto-save (1-second delay) on all state changes
- **Resume Capability**: Users can exit and resume their work at any time

### 4. **Comprehensive Data Collection**
The application collects and manages:
- Provider information (name, NPI, specialty, license, DEA)
- Group practice details
- Pay To/Mail To addresses
- Contact information
- Enrollment verification data
- Outreach notes and tracking

### 5. **Reference Integration**
- **Visual Guides**: Screenshots for every step showing exactly what to do
- **Embedded PDFs**: Access to reference materials including:
  - 2025 Legal Quick Guide
  - Provider Types & Specialties guide
- **Contextual Help**: Instructions and notes specific to each workflow step

### 6. **Quality Control Features**
- **Verification Tracking**: "Unable to Verify" flags for data requiring outreach
- **Required Field Validation**: Prevents progression without completing critical fields
- **Enrolled Providers List**: Running summary of all providers processed
- **Manual Notes**: Provider-specific notes for special circumstances

### 7. **Outreach Management**
- **Outreach Reason Tracking**: Documents why providers require follow-up
- **Provider Status**: Marks providers as "Unable to Verify - Requires Outreach"
- **Notes History**: Comprehensive outreach notes with timestamps
- **View/Edit Capability**: Review and update outreach information

---

## Application Architecture

### Component Structure

```
Group Change Walkthrough Application
│
├── Web Portal (index.html)
│   ├── Landing Page
│   │   ├── Application Type Selection Grid (4x4)
│   │   └── Active: Full Group Change Application - FD23
│   └── Main Walkthrough (walkthrough.html)
│       ├── React-based Form System
│       ├── Page Navigation Engine
│       ├── State Management
│       └── LocalStorage Persistence
│
└── Desktop Application (Tauri)
    ├── Frontend (src/)
    │   ├── index.html (main walkthrough)
    │   └── images/
    └── Backend (src-tauri/)
        ├── Rust File Management
        ├── PWO-specific Storage
        └── Tauri Commands API
```

### Data Flow

```
User Input → Form State → Auto-Save (debounced)
                ↓
         State Validation
                ↓
    Web: LocalStorage | Desktop: File System
                ↓
         Resume on Load
                ↓
         Complete Workflow
```

---

## Platform Availability

### Web Application

**Access:** Via landing portal at `/index.html`

**Features:**
- No installation required
- Browser-based (Chrome, Firefox, Edge, Safari)
- LocalStorage persistence
- Responsive design (mobile, tablet, desktop)

**Limitations:**
- Data lost if browser cache cleared
- Requires internet connection for initial load
- Limited to single PWO per browser session

### Desktop Application

**Platforms:** Windows, macOS, Linux

**Storage Locations:**
- **Windows**: `C:\Users\<YourName>\AppData\Roaming\com.providerenrollment.walkthrough\PWO_<PWO#>\state.json`
- **macOS**: `~/Library/Application Support/com.providerenrollment.walkthrough/PWO_<PWO#>/state.json`
- **Linux**: `~/.local/share/com.providerenrollment.walkthrough/PWO_<PWO#>/state.json`

**Advantages:**
- Persistent file-based storage
- Survives browser cache clearing
- Standalone operation
- Multi-PWO support (separate folders per PWO)
- OS-native experience

---

## Workflow Overview

### Pre-Enrollment Steps (Steps 1-9)

**Common Steps for All Applications:**

| Step | Page ID | Description |
|------|---------|-------------|
| 1 | welcome | Collect user name and PWO number |
| 2 | group-practice | Verify Group Practice Application |
| 3 | question-6 | Verify Question 6 information |
| 4 | payto-mailto | Enter Pay To/Mail To information |
| 5 | questions-9-17 | Verify Questions 9-17 |
| 6 | email-to-snow | Email to SNOW system |
| 7 | question-20 | Verify Question 20 |
| 8 | questions-21-23 | Verify Questions 21-23 |
| 9 | provider-type-selection | **BRANCH POINT** - Auto-determine path |

### New Provider Path (Steps 24-37)

**For Providers Not Yet Enrolled:**

Guides users through complete enrollment process including:
- Creating enrollment record
- Entering provider demographics
- Verifying group specialties
- Processing enrollment application
- Managing addresses (provider, payment, mailing)
- Provider information verification
- NPI, specialty, claim type configuration
- License and DEA processing
- Mainframe enrollment

**Loop Feature:** After completing a new provider, users can:
- Add another new provider (loops back to Step 24)
- Proceed to existing provider workflow (advances to Step 11)

### Existing Provider Path (Steps 11-23)

**For Providers Already Enrolled:**

Streamlined process for adding existing providers to the group:
- Open CICS system
- Add provider to group
- Verify provider information
- Close enrollment task
- Finish group change
- Create checklist
- Approve group change
- Process approval letter

**Loop Feature:** After completing an existing provider, users can:
- Add another existing provider (loops back to Step 11)
- Complete the application (finish workflow)

### Workflow Logic

**Auto-Branching Priority:**
1. **New Providers First**: If any providers need enrollment, route to New Provider Path
2. **All New Enrolled**: After all new providers enrolled, transition to Existing Provider Path
3. **Multiple Iterations**: Support unlimited providers in both paths via loop mechanisms

---

## Technical Stack

### Frontend Technologies

**Core Framework:**
- **React 18.2.0**: UI component framework
- **React DOM 18.2.0**: DOM rendering
- **Babel Standalone**: JSX transpilation in browser

**Styling:**
- **Tailwind CSS 3.4.0**: Utility-first CSS framework
- **Custom CSS**: Gainwell brand styling (teal/cyan color scheme)
- **Responsive Design**: Mobile-first approach with breakpoints

**Build Tools:**
- **Vite 5.0.8**: Development server and build tool
- **PostCSS 8.4.32**: CSS processing
- **Autoprefixer 10.4.16**: CSS vendor prefixes

### Backend Technologies (Desktop App)

**Desktop Framework:**
- **Tauri 2.1.0**: Rust-based desktop application framework
- **Rust**: Backend logic and file system operations

**Tauri Commands:**
- `save_pwo_state`: Persist application state to file
- `load_pwo_state`: Load saved state from file
- `delete_pwo_state`: Remove saved state
- `get_save_location`: Retrieve file storage path

### Documentation Tools

**PDF Generation:**
- **marked 17.0.1**: Markdown parser
- **md-to-pdf 5.2.5**: Markdown to PDF conversion
- **Custom build-pdf.sh**: Automated PDF generation script

### Data Format

**State Structure:**
```javascript
{
  pwoNumber: string,
  userName: string,
  currentPage: number,
  formData: object,
  enrolledProviders: array,
  outreachNotes: array,
  providerManualNotes: object,
  unableToVerifyFields: array,
  visitedPages: array,
  currentEnrollingProviderIndex: number,
  currentAddingProviderIndex: number,
  lastSaved: ISO timestamp,
  hasOutreach: boolean
}
```

---

## Data Management

### State Persistence

**Auto-Save Mechanism:**
- **Trigger**: Any change to formData, enrolledProviders, outreachNotes, etc.
- **Debounce**: 1-second delay to batch rapid changes
- **Condition**: Only saves when PWO number exists and not on start/resume pages

**Storage Format:**
- **Web**: JSON stringified to LocalStorage with key `pwo-application-${pwoNumber}`
- **Desktop**: JSON file at `PWO_${pwoNumber}/state.json`

### Enrolled Providers Tracking

**Provider Record Structure:**
```javascript
{
  providerName: string,
  npi: string,
  specialty: string,
  status: string, // "Enrolled" or "Unable to Verify - Requires Outreach"
  enrollmentType: string, // "New Provider" or "Existing Provider"
  timestamp: ISO timestamp
}
```

**Features:**
- View all enrolled providers modal
- Delete provider from list
- Status tracking for quality control
- Enrollment type differentiation

### Outreach Notes System

**Note Structure:**
```javascript
{
  reason: string,
  providerInfo: string,
  timestamp: ISO timestamp,
  resolved: boolean
}
```

**Capabilities:**
- Add outreach note with reason
- View all notes chronologically
- Mark providers requiring follow-up
- Historical tracking of communication

---

## User Experience

### Visual Design

**Brand Identity:**
- **Primary Color**: Gainwell Teal (#3d5a66)
- **Accent Color**: Gainwell Cyan (#00e5b4)
- **Dark Variant**: #2a3f4a
- **Light Variant**: #527584

**Layout:**
- **Responsive Grid**: 4x4 tile layout on landing page
- **Form Pages**: Single-column layout with sidebar navigation
- **Progress Indicator**: Visual step counter with completion status
- **Modal Dialogs**: Confirmation, alerts, and information modals

### Navigation Features

**Navigation Controls:**
- **Next Button**: Advances to next step (with validation)
- **Back Button**: Returns to previous step
- **Progress Bar**: Shows current position in workflow
- **Breadcrumbs**: Visual step indicator

**Navigation State:**
- **Visited Pages**: Tracks completed steps
- **Current Page**: Highlights active step
- **Disabled Pages**: Prevents skipping required steps

### Accessibility

**Features:**
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG compliant color ratios
- **Responsive Text**: Scales appropriately on all devices
- **Alt Text**: Images include descriptive alt attributes

### Error Handling

**Validation:**
- **Required Fields**: Highlighted when missing
- **Format Validation**: Email, NPI, phone number formats
- **Confirmation Dialogs**: Prevent accidental data loss
- **Alert Messages**: Clear error descriptions

---

## Installation & Deployment

### Web Application Deployment

**Development:**
```bash
npm install
npm run dev
```

**Production Build:**
```bash
npm run build
```

**Deployment:**
- Build outputs to `dist/` directory
- Deploy to any static web hosting
- No server-side requirements

### Desktop Application Build

**Prerequisites:**
- Node.js (latest LTS)
- Rust (latest stable)
- Platform-specific dependencies:
  - **Windows**: WebView2
  - **macOS**: Xcode Command Line Tools
  - **Linux**: webkit2gtk-4.1, build-essential, etc.

**Build Process:**
```bash
cd tauri-app
npm install
npm run build
```

**Build Outputs:**
- **Windows**: `.msi` or `.exe` installers in `src-tauri/target/release/bundle/`
- **macOS**: `.dmg` in `src-tauri/target/release/bundle/dmg/`
- **Linux**: `.deb`, `.rpm`, or `.AppImage` in respective bundle folders

**Distribution:**
- Users install via platform-specific installer
- No dependencies required on user machines
- Auto-updates can be configured via Tauri

---

## Future Roadmap

### Planned Enhancements

**Additional Application Types:**
- Currently: Only Full Group Change Application (FD23)
- **Coming Soon**: 15 additional application types
- Grid layout supports 4x4 (16 total applications)

**Feature Enhancements:**
- **Advanced Search**: Search providers by name, NPI, status
- **Batch Operations**: Process multiple PWOs simultaneously
- **Reporting**: Generate completion reports and metrics
- **Export Functionality**: Export provider data to CSV/Excel
- **Integration**: Direct CICS/SNOW integration (reduce manual steps)
- **Audit Trail**: Comprehensive logging of all actions
- **User Roles**: Multi-user support with permissions

**Technical Improvements:**
- **Cloud Sync**: Sync state across devices (desktop + web)
- **Offline Mode**: Full offline capability for desktop app
- **Performance**: Optimize large provider lists (100+ providers)
- **Testing**: Comprehensive automated test suite
- **Documentation**: Interactive help system and video tutorials

### Scalability Considerations

**Current Capacity:**
- Tested with up to 50 providers per PWO
- Handles unlimited PWOs (desktop version)
- Single-user focused

**Future Scaling:**
- Multi-user concurrent editing
- Cloud-based state management
- Real-time collaboration features
- Advanced caching strategies
- Database backend (optional)

---

## Support & Resources

### Documentation Files

- **FLOW_MAPPING.md**: Detailed workflow and page index
- **README.md** (tauri-app): Desktop application setup
- **WINDOWS_QUICKSTART.md**: Windows-specific installation guide

### Reference Materials

- **2025LegalQuickGuide.pdf**: Legal compliance reference
- **ProviderTypesSpecialties.pdf**: Provider classification guide

### Technical Support

For issues or questions:
1. Check embedded documentation in application
2. Review FLOW_MAPPING.md for workflow clarification
3. Consult reference PDFs for provider data
4. Contact Gainwell IT support for technical issues

---

## Appendix: File Structure

```
GroupChangeWalkthrough/
├── index.html                      # Landing portal
├── walkthrough.html                # Main web application
├── APP_OVERVIEW.md                 # This document
├── FLOW_MAPPING.md                 # Workflow documentation
├── package.json                    # Web app dependencies
├── build-pdf.sh                    # PDF generation script
├── convert.js                      # Markdown to PDF converter
├── images/                         # Reference screenshots
│   ├── logo.png
│   ├── groupchange_application.jpg
│   ├── question6.jpg
│   └── ... (30+ reference images)
├── 2025LegalQuickGuide.pdf
├── ProviderTypesSpecialties.pdf
└── tauri-app/                      # Desktop application
    ├── src/
    │   ├── index.html              # Desktop app main page
    │   └── images/                 # Image assets
    ├── src-tauri/
    │   ├── src/
    │   │   ├── lib.rs              # Tauri commands
    │   │   └── main.rs             # App entry point
    │   ├── Cargo.toml              # Rust dependencies
    │   └── tauri.conf.json         # Tauri configuration
    ├── package.json                # Desktop app dependencies
    └── README.md                   # Desktop app documentation
```

---

## Conclusion

The Group Change Walkthrough Application represents a significant advancement in provider enrollment processing for Gainwell Technologies. By combining intuitive guided workflows, robust state management, and flexible platform support, it empowers enrollment specialists to process complex group change applications efficiently and accurately.

**Key Strengths:**
- Reduces processing time through guided workflow
- Minimizes errors via built-in validation
- Supports multiple providers in single session
- Provides persistent state across sessions
- Offers flexible deployment (web + desktop)

**Impact:**
- Improved accuracy in provider enrollment
- Faster processing of FD23 applications
- Better tracking of outreach requirements
- Enhanced user experience for specialists
- Scalable foundation for additional application types

---

**Document Version:** 1.0
**Last Updated:** December 2024
**Maintained By:** Gainwell Technologies
**Application Version:** 1.0.0

---

*For technical questions or feature requests, please contact the Gainwell Provider Enrollment Systems team.*
