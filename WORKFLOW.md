# Provider Group Change Walkthrough - Complete Workflow Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Complete Page Flow](#complete-page-flow)
3. [User Journey & Decision Points](#user-journey--decision-points)
4. [Key Functionalities](#key-functionalities)
5. [Recent Updates & Features](#recent-updates--features)
6. [Technical Features](#technical-features)
7. [Data Management](#data-management)

---

## Application Overview

**Provider Group Change Walkthrough** is a desktop application (Tauri) that guides Gainwell enrollment specialists through the complex process of adding healthcare providers to group practices. The application provides step-by-step instructions across multiple systems (CICS, SNOW, Mainframe) with intelligent workflow routing and persistent state management.

### Core Purpose
- **NOT a data collection tool** - Purely an interactive guide
- Ensures all steps are completed in the correct order
- Automatically routes users through appropriate workflows
- Tracks progress and allows resuming mid-workflow
- Eliminates need for external documentation during processing

### Technology Stack
- **Frontend**: React 18 + Vite
- **Desktop Framework**: Tauri 2.1.0
- **Styling**: Tailwind CSS 3.4.0
- **Storage**: File-based persistence (AppData directory)
- **Platform**: Cross-platform (Windows, macOS, Linux)

---

## Complete Page Flow

### Application Entry Points

#### Start Choice (Index: start-choice)
**Purpose**: Choose between starting a new application or resuming a saved one
- **New Application** → Proceeds to Welcome page
- **Resume Saved Application** → Proceeds to Resume Lookup page

#### Resume Lookup (Index: resume-lookup)
**Purpose**: Look up and load a previously saved application by PWO number
- Enter PWO number to search for saved state
- Loads complete application state if found
- Returns to where user left off

---

### Initial Verification Steps (Steps 1-9)

| Step | Page ID | Array Index | Description | Key Actions |
|------|---------|-------------|-------------|-------------|
| 1 | welcome | 0 | Welcome & identification | Enter user name and PWO number |
| 2 | group-practice | 1 | Group Practice Application verification | Verify group practice application is attached to SNOW task |
| 3 | question-6 | 2 | Question 6 verification | Verify practice address information |
| 4 | payto-mailto | 3 | Pay To/Mail To information | Verify payment and mailing address details |
| 5 | questions-9-17 | 4 | Questions 9-17 verification | Verify contact details (phone, email, contact person) |
| 6 | email-to-snow | 5 | Email to SNOW | Verify group practice application email has been sent to SNOW |
| 7 | question-20 | 6 | Question 20 verification | Verify requested effective date |
| 8 | questions-21-23 | 7 | Questions 21-23 verification | Verify practitioner/provider details |
| 9 | provider-type-selection | 8 | **AUTOMATIC BRANCH POINT** | System determines workflow path based on enrollment status |

**Important Notes**:
- All fields include "Unable to Verify" option for tracking outreach requirements
- Each step includes visual reference images showing exact locations in SNOW/CICS
- Progress is auto-saved after each step completion
- Users can navigate backward through completed steps

---

### Alternative/Rejection Paths

#### Question 20 Rejection (Index: question-20-unable-to-verify-completion)
**Trigger**: User marks Question 20 as "Unable to Verify"
**Purpose**: Completion page indicating outreach required for effective date
**Next Steps**:
- Review outreach notes
- Export current state
- Close application (manual outreach required)

#### Duplicate Provider Rejection (Index: duplicate-rejection-completion)
**Trigger**: Provider already exists in enrolled providers list
**Purpose**: Prevents duplicate provider enrollment
**Implementation**: Recent fix (PR #84) ensures proper rejection when using Previous button
**Next Steps**:
- Review enrolled providers list
- Continue with different provider
- Complete workflow

---

### Documentation Pages (Step 10)

These pages display embedded documentation and provide access to reference materials:

| Page ID | Purpose | Resources |
|---------|---------|-----------|
| signature-authorization-form | Display signature authorization form requirements | Form template reference |
| agreement-of-understanding | Agreement of Understanding requirements | Legal document reference |
| provider-agreement | Provider agreement details | Contract reference |
| disclosure-of-ownership | Ownership disclosure requirements | Compliance document |
| w9-or-irs-letter | W-9 or IRS letter requirements | Tax document reference |
| authorization-agreement-ach | ACH authorization requirements | Payment setup document |
| request-for-paper-updates | Paper update request process | Communication template |

**Key Features**:
- Full-screen PDF modal viewer with Gainwell branding
- Embedded PDFs (2025 Legal Quick Guide, Provider Types & Specialties)
- External links to verification systems (e.g., Miami FRP for license verification)
- Access to FLOW_MAPPING reference guide

---

### Existing Provider Path (Steps 11-23)

**Workflow Purpose**: Add providers who are already enrolled in the system to a group practice

| Step | Page ID | Array Index | Description | System | Key Actions |
|------|---------|-------------|-------------|--------|-------------|
| 11 | existing-provider-open-cics | 9 | Open CICS interface | CICS | Navigate to CICS system and access provider records |
| 12 | existing-provider-add-to-group | 10 | Add provider to group | CICS | Execute group addition transaction |
| 13 | existing-provider-verify-info | 11 | Verify provider information | CICS | Confirm provider details match application |
| 14 | existing-provider-close-enrollment | 12 | Close enrollment task | SNOW | Mark enrollment task as complete in ServiceNow |
| 15 | existing-provider-finish-group-change | 13 | Finish group change | SNOW | Complete group change transaction |
| 16 | existing-provider-create-checklist | 14 | Create verification checklist | SNOW | Generate checklist for approval workflow |
| 17 | existing-provider-approve-group-change | 15 | Approve group change | SNOW | Submit for approval or approve (based on permissions) |
| 18 | existing-provider-open-letter-task | 16 | Open letter task | SNOW | Access letter generation system |
| 19 | existing-provider-select-letter | 17 | Select letter template | SNOW | Choose appropriate correspondence template |
| 20 | existing-provider-add-to-letter | 18 | Add provider to letter | SNOW | Include provider in notification letter |
| 21 | existing-provider-finish-letter | 19 | Finish letter generation | SNOW | Complete letter creation |
| 22 | existing-provider-close-letter-task | 20 | Close letter task | SNOW | Mark letter task as complete |
| 23 | existing-provider-completion | 21 | **DECISION POINT** | Application | Additional existing providers? |

**Step 23 Decision Logic**:
- **"Yes" Selection**:
  - Saves current provider to `enrolledProviders` array
  - Clears existing provider-specific form fields
  - Maintains `providerEnrollmentType = 'Existing Provider'`
  - **LOOPS BACK** to Step 11 (existing-provider-open-cics)
  - Allows adding multiple existing providers sequentially

- **"No" Selection**:
  - Saves final provider to `enrolledProviders` array
  - Proceeds to **final-completion** page
  - Completes entire workflow
  - Enables export of complete application data

---

### New Provider Path (Steps 24-37)

**Workflow Purpose**: Enroll providers who are not yet in the system, then add them to group practice

| Step | Page ID | Array Index | Description | System | Key Actions |
|------|---------|-------------|-------------|--------|-------------|
| 24 | create-enrollment | 22 | Create new enrollment | SNOW | Initiate new provider enrollment record |
| 25 | fill-provider-info | 23 | Fill provider information | SNOW | Enter basic provider demographics |
| 26 | check-group-specialties | 24 | Check group specialties | SNOW | Verify specialty alignment with group |
| 27 | enrollment-applications-tab | 25 | Navigate to enrollment applications | SNOW | Access enrollment applications section |
| 28 | verify-enrollment-application | 26 | Verify enrollment application | SNOW | Confirm application details are correct |
| 29 | provider-address-tab | 27 | Provider address tab | SNOW | Enter provider practice address |
| 30 | payment-mailing-address-tab | 28 | Payment/Mailing address | SNOW | Configure payment and mailing addresses |
| 31 | provider-information-tab | 29 | Provider information | SNOW | Eligibility dates, Medicare info |
| 32 | npi-tab | 30 | NPI number | SNOW | Enter and verify National Provider Identifier |
| 33 | specialty-tab | 31 | Specialty information | SNOW | Provider specialty and effective dates |
| 34 | claim-type-tab | 32 | Claim types | SNOW | Configure claim submission types (uses Provider Types & Specialties PDF) |
| 35 | license-dea-tab | 33 | License and DEA | SNOW | Enter license numbers, DEA (if applicable) |
| 36 | enroll-on-mainframe | 34 | Enroll on mainframe | Mainframe | Complete mainframe enrollment transaction |
| 37 | additional-providers-check | 35 | **DECISION POINT** | Application | Additional new providers needed? |

**Step 37 Decision Logic**:
- **"Yes" Selection**:
  - Saves current provider to `enrolledProviders` array
  - Clears new provider-specific form fields
  - Maintains `providerEnrollmentType = 'New Provider'`
  - **LOOPS BACK** to Step 24 (create-enrollment)
  - Allows enrolling multiple new providers sequentially

- **"No" Selection**:
  - Saves final new provider to `enrolledProviders` array
  - Sets `providerEnrollmentType = 'Existing Provider'`
  - **TRANSITIONS** to Step 11 (existing-provider-open-cics)
  - Enables adding newly enrolled providers to the group
  - **Important**: All new providers must be enrolled before existing provider workflow begins

---

### Final Completion Pages

#### Next Provider Ready Check (Index: next-provider-ready-check)
**Purpose**: Internal workflow routing page
**Logic**: Determines whether to route to new provider or existing provider workflow based on current state

#### Final Completion (Index: final-completion)
**Purpose**: Workflow completion and export
**Features**:
- Display summary of all enrolled providers
- Export application data (includes PWO number in filename)
- Review outreach notes (if any)
- Application state saved automatically

---

## User Journey & Decision Points

### Complete User Flow Diagram

```
┌─────────────────────────────────────┐
│      Application Launch             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Start Choice                      │
│   • New Application                 │
│   • Resume Saved Application        │
└──────┬─────────────────┬────────────┘
       │                 │
  [New]│            [Resume]
       │                 │
       ▼                 ▼
┌─────────────┐   ┌──────────────────┐
│  Welcome    │   │  Resume Lookup   │
│  (Step 1)   │   │  (Enter PWO #)   │
└──────┬──────┘   └────────┬─────────┘
       │                   │
       │    [Load State]   │
       └─────────┬─────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │  Steps 2-8           │
      │  (Verification)      │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────────────┐
      │  Step 9: Provider Type       │
      │  AUTOMATIC BRANCH POINT      │
      │  (Based on enrollment status)│
      └──────┬──────────────┬────────┘
             │              │
   [New Provider]    [Existing Provider]
             │              │
             │              │ [If all providers
             │              │  already enrolled]
             │              │
             ▼              ▼
   ┌─────────────────┐  ┌────────────────────┐
   │ Steps 24-36     │  │ Steps 11-23        │
   │ New Provider    │  │ Existing Provider  │
   │ Enrollment      │  │ Group Addition     │
   └────────┬────────┘  └─────────┬──────────┘
            │                     │
            ▼                     │
   ┌─────────────────────────┐   │
   │ Step 37: Additional     │   │
   │ New Providers?          │   │
   └──────┬──────────┬───────┘   │
          │          │            │
     [Yes]│      [No]│            │
          │          │            │
    [Loop │          └────────────┤
     Back]│                       │
          │                       ▼
          │            ┌──────────────────────┐
          │            │ Steps 11-23          │
          │            │ Existing Provider    │
          │            │ (Add to Group)       │
          │            └──────────┬───────────┘
          │                       │
          │                       ▼
          │            ┌──────────────────────┐
          │            │ Step 23: Additional  │
          │            │ Existing Providers?  │
          │            └──────┬───────┬───────┘
          │                   │       │
          │              [Yes]│   [No]│
          │                   │       │
          │             [Loop │       │
          │              Back]│       │
          │                   │       │
          └───────────────────┘       │
                                      ▼
                           ┌──────────────────┐
                           │ Final Completion │
                           │ • Export Data    │
                           │ • Review Summary │
                           └──────────────────┘
```

### Workflow Priority Rules

1. **New Provider First**: If ANY providers need enrollment, new provider workflow executes first
2. **Complete All New**: All new provider enrollments must be completed before existing provider additions
3. **Sequential Processing**: One provider at a time through each workflow
4. **Automatic Transitions**: System automatically transitions from new → existing provider workflows
5. **No Mixing**: Cannot interleave new and existing provider workflows

---

## Key Functionalities

### 1. Multi-Provider Enrollment Management

**Purpose**: Track and manage multiple provider enrollments in a single application session

**Features**:
- `enrolledProviders` array stores all completed provider records
- Each provider record includes:
  - Enrollment type (New vs. Existing)
  - All form data specific to that provider
  - Timestamp of enrollment completion
- View enrolled providers modal shows summary list
- Duplicate detection prevents re-enrolling same provider (PR #83, #84)

**Implementation**:
```javascript
// Provider saved when "Yes" or "No" selected at decision points
enrolledProviders.push({
  type: 'New Provider' | 'Existing Provider',
  data: { /* all provider-specific form fields */ },
  timestamp: new Date().toISOString()
});
```

---

### 2. Intelligent Workflow Routing

**Purpose**: Automatically route users through appropriate workflows without manual selection

**Auto-Detection Logic**:
- Step 9 (provider-type-selection) analyzes form data
- Checks `providerEnrollmentType` state variable
- Routes to appropriate first step:
  - `'New Provider'` → Step 24 (create-enrollment)
  - `'Existing Provider'` → Step 11 (existing-provider-open-cics)

**Priority System**:
- New provider workflow takes precedence
- Only after all new providers enrolled does system allow existing provider workflow
- Prevents incomplete enrollments

**Dynamic Page Skipping**:
- Pages conditionally rendered based on `providerEnrollmentType`
- Previous button intelligently skips inapplicable pages
- Ensures navigation always lands on valid pages for current workflow

---

### 3. Form Validation & Field Management

**Validation System**:
- **78 validation rules** across all form fields
- Field-level validation functions
- Form-level validation before page progression
- Visual feedback for invalid fields

**Field Types**:
- **Radio Buttons** (15+ groups): Binary decisions, workflow routing
- **Checkboxes** (35+ fields): Task completion confirmations
- **Text Inputs** (3 fields): User name, PWO number, reference IDs
- **Textareas** (2 fields): Notes and additional comments

**Conditional Fields**:
- Fields shown/hidden based on form state
- "Unable to Verify" options for all verification fields
- Dynamic required field enforcement

**Next Button Logic**:
```javascript
// Next button appears only when all required fields are valid
const isFormValid = validateCurrentPageFields(formData);
if (isFormValid) {
  showNextButton();
}
```

---

### 4. Data Persistence & Resume Functionality

**Auto-Save System**:
- **3-second debounced auto-save** to file system
- Triggers on:
  - Form field changes
  - Page navigation
  - Provider enrollment completion
- No manual "save" button required

**File Structure**:
```
AppData/Roaming/com.providerenrollment.walkthrough/
  └── PWO_12345/
      └── state.json  (complete application state)
  └── PWO_67890/
      └── state.json
```

**Saved State Includes**:
- Current page index
- All form data
- Enrolled providers array
- Visited pages set
- Outreach notes
- Unable-to-verify fields
- Provider enrollment type

**Resume Functionality**:
- Search by PWO number
- Load complete state from file
- Return to exact page where user left off
- Maintain all enrolled provider records

**Persistence Benefits**:
- Survives browser crashes
- Survives system restarts
- Independent of browser cache/localStorage
- Each PWO has dedicated file

---

### 5. Outreach Management System

**Purpose**: Track verification issues requiring manual outreach to providers

**Unable to Verify Tracking**:
- Each verification field has "Unable to Verify" option
- Selecting "Unable to Verify" triggers outreach note creation
- Fields tracked in `unableToVerifyFields` Set

**Outreach Notes Structure**:
```javascript
{
  field: 'question20', // field identifier
  reason: 'Requested effective date not provided in application',
  timestamp: '2025-01-15T10:30:00.000Z',
  page: 'question-20' // page where issue occurred
}
```

**Outreach Badge**:
- Visual indicator showing count of outreach items
- Displayed in header throughout workflow
- Click to view detailed outreach notes modal

**Outreach Notes Modal**:
- List all fields requiring outreach
- Display reason for each outreach item
- Show timestamp of when issue identified
- Link to source page

**Workflow Integration**:
- Question 20 unable to verify → immediate rejection completion page
- Other unable to verify fields → track but allow workflow continuation
- Export includes complete outreach notes for follow-up

---

### 6. Visual Reference System

**Purpose**: Provide contextual visual guidance showing exactly where to perform actions

**Screenshot Library**:
- **30+ embedded images** (4.1 MB total)
- Coverage:
  - SNOW interface screenshots
  - CICS system screens
  - Mainframe terminal views
  - Form section highlights
- Image loading optimized per page

**Reference Display**:
- Images shown contextually on relevant pages
- Arrows and highlights indicate exact UI locations
- Step-by-step visual progression

**Benefits**:
- Eliminates ambiguity about where to click/enter data
- Reduces training time for new users
- Standardizes process across staff members
- Works offline (images embedded in application)

---

### 7. PDF Resource Management

**Embedded PDFs**:
1. **2025 Legal Quick Guide** (202.8 KB)
   - Legal and compliance reference
   - Provider agreement requirements
   - Disclosure regulations

2. **Provider Types & Specialties** (35.9 KB)
   - Claim type determination guide
   - Specialty code reference
   - Used during Step 34 (claim-type-tab)

3. **FLOW_MAPPING.pdf** (72.8 KB)
   - Complete workflow reference
   - Page index and navigation guide
   - Loop handler documentation

**PDF Viewer Modal**:
- Full-screen modal display
- Gainwell brand colors (PR #80)
- Zoom and navigation controls
- Close/minimize functionality
- Recent update: PDFs bundled with build (PR #82)

**Access Points**:
- Documentation pages (Step 10)
- Contextual access during workflow steps
- Help menu/resource section

---

### 8. Navigation & Progress Tracking

**Navigation Controls**:

**Next Button**:
- Appears only when current page form is valid
- Advances to next applicable page
- Saves state before navigation
- Handles loop transitions automatically

**Previous Button**:
- Returns to last visited applicable page
- Skips pages not relevant to current workflow (PR #84 fix)
- Maintains form state
- Smart routing around conditional pages

**Direct Navigation** (Future Feature):
- Page index in sidebar
- Click to jump to specific steps
- Disabled for unvisited/inapplicable pages

**Progress Indicators**:
- Current step number displayed
- Total steps shown (varies by workflow)
- Visited pages tracking
- Visual progress bar (implementation varies)

**Visited Pages Set**:
```javascript
// Tracks which pages user has completed
visitedPages: Set {0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23}
```

---

### 9. Export & Reporting

**Export Functionality**:
- Export complete application data as JSON
- Filename includes PWO number (PR #78)
- Export format:
  ```
  GroupChange_PWO_12345_2025-01-15.json
  ```

**Exported Data**:
- All form fields
- Complete enrolled providers array
- Outreach notes
- Timestamps
- Workflow path taken
- User information

**Use Cases**:
- Audit trail
- Manual processing of outreach items
- Data migration
- Quality assurance review
- Training and documentation

---

### 10. Duplicate Provider Prevention

**Purpose**: Prevent enrolling the same provider multiple times in one application

**Implementation** (Recent updates PR #83, #84):

**Detection Logic**:
```javascript
// Check if provider already in enrolledProviders array
const isDuplicate = enrolledProviders.some(p =>
  p.data.npiNumber === currentProviderNPI
);

if (isDuplicate) {
  navigateTo('duplicate-rejection-completion');
}
```

**Rejection Flow**:
1. User attempts to enroll duplicate provider
2. System detects match in `enrolledProviders`
3. Immediate redirect to `duplicate-rejection-completion` page
4. Display rejection message with enrolled providers list
5. Options:
   - Review enrolled providers
   - Continue with different provider
   - Complete workflow

**Bug Fix** (PR #84 - Commit 707b123):
- **Issue**: Previous button from Questions 21-23 allowed bypassing duplicate check
- **Fix**: Added duplicate check validation in Previous button navigation logic
- **Impact**: Ensures duplicate rejection occurs regardless of navigation direction

**User Messaging**:
- Clear indication of which provider is duplicate
- Show NPI or identifying information
- Guide user to next steps

---

## Recent Updates & Features

### 2025 Recent Development (Last 10 Commits)

#### PR #84: Fix Duplicate Rejection Bug (Merged)
**Commit**: 707b123
**Date**: Recent
**Changes**:
- Fixed bug where Previous button from Questions 21-23 bypassed duplicate provider check
- Enhanced navigation validation to ensure duplicate rejection occurs
- Improved state management for rejection workflow

**Impact**: Critical bug fix preventing duplicate enrollments through navigation edge case

---

#### PR #83: Redirect Duplicate Providers to Rejection Screen (Merged)
**Commit**: bdc7d93
**Date**: Recent
**Changes**:
- Implemented duplicate provider detection logic
- Created `duplicate-rejection-completion` page
- Added NPI/provider identifier comparison in enrolledProviders array
- Redirect flow instead of allowing Questions 21-23 & 25 progression

**Impact**: Major feature preventing duplicate provider enrollments

---

#### PR #82: Bundle PDF with Build (Merged)
**Commit**: 52a5b61 (and related commits 71f8205, 8f5ec77, bb0cba7)
**Date**: Recent
**Changes**:
- PDFs now bundled with Tauri application binary
- Embedded in `src-tauri/resources/` directory
- Accessible offline without external dependencies
- Build script updated to include PDFs in compilation

**Impact**: Improved offline functionality and distribution simplicity

---

#### Other Recent Features

**PR #80: Gainwell Branding for PDF Modal** (Commit e5ee59c)
- Updated PDF modal with Gainwell brand colors
- Enhanced visual consistency with corporate identity
- Improved modal styling and user experience

**PR #78: Export Filename Includes PWO Number** (Commits b4d2fe1, 2e0744f)
- Export files now include PWO number in filename
- Format: `GroupChange_PWO_12345_2025-01-15.json`
- Easier file management and organization
- Improved audit trail

**PR #76: Full-Screen PDF Modal** (Commit f695030)
- Changed PDF display from external viewer to full-screen modal
- Integrated PDF viewer within application
- Better user experience (no external application switching)
- Consistent interface

---

## Technical Features

### State Management

**React State Variables** (10+ state hooks):

```javascript
// Navigation & Progress
const [currentPage, setCurrentPage] = useState(0);
const [visitedPages, setVisitedPages] = useState(new Set());

// Form Data
const [formData, setFormData] = useState({});

// Provider Tracking
const [enrolledProviders, setEnrolledProviders] = useState([]);
const [currentEnrollingProviderIndex, setCurrentEnrollingProviderIndex] = useState(0);
const [currentAddingProviderIndex, setCurrentAddingProviderIndex] = useState(0);

// Workflow Control
const [providerEnrollmentType, setProviderEnrollmentType] = useState('New Provider');

// Outreach Management
const [unableToVerifyFields, setUnableToVerifyFields] = useState(new Set());
const [outreachNotes, setOutreachNotes] = useState([]);

// Manual Tracking
const [manualProviderData, setManualProviderData] = useState([]);
const [manualOutreachNotes, setManualOutreachNotes] = useState([]);
```

**State Persistence**:
- All state serialized to JSON
- Saved to file system via Tauri IPC
- 3-second debounced auto-save
- Loaded on resume

---

### Page Definition Structure

Each page defined with:

```javascript
{
  id: 'create-enrollment',
  title: 'Create New Enrollment',
  description: 'Instructions for creating enrollment in SNOW',
  content: <FormComponent />,
  validationFunction: validateCreateEnrollment,
  nextPage: 'fill-provider-info',
  previousPage: 'provider-type-selection',
  conditionalDisplay: (formData) => formData.providerEnrollmentType === 'New Provider',
  images: ['enrollment_create_step1.jpg', 'enrollment_create_step2.jpg'],
  resources: ['2025LegalQuickGuide.pdf']
}
```

**Conditional Display**:
- Pages shown/hidden based on workflow state
- Navigation automatically skips hidden pages
- Ensures users only see relevant steps

---

### Validation System

**Field-Level Validation**:
```javascript
function validateField(fieldName, value) {
  const rules = validationRules[fieldName];

  // Check required
  if (rules.required && !value) {
    return { valid: false, error: 'This field is required' };
  }

  // Check format
  if (rules.pattern && !rules.pattern.test(value)) {
    return { valid: false, error: 'Invalid format' };
  }

  return { valid: true };
}
```

**Page-Level Validation**:
```javascript
function validatePage(pageId, formData) {
  const pageFields = getPageFields(pageId);
  const errors = [];

  pageFields.forEach(field => {
    const validation = validateField(field, formData[field]);
    if (!validation.valid) {
      errors.push(validation.error);
    }
  });

  return errors.length === 0;
}
```

**Next Button State**:
```javascript
const canProceed = validatePage(pages[currentPage].id, formData);
// Next button enabled only when canProceed === true
```

---

### Modal System

**Active Modals**:
1. **Next Steps Modal**: Shows upcoming steps preview
2. **Outreach Notes Modal**: Manage unable-to-verify items
3. **View Notes Modal**: Display all outreach notes
4. **Enrolled Providers Modal**: Show list of completed providers
5. **PDF Viewer Modal**: Full-screen PDF display
6. **Confirmation Dialog**: Custom confirm prompts
7. **Alert Dialog**: Custom alert messages

**Modal Management**:
```javascript
const [showModal, setShowModal] = useState(false);
const [modalContent, setModalContent] = useState(null);

function openModal(content) {
  setModalContent(content);
  setShowModal(true);
}
```

---

### Image Loading & Optimization

**Dynamic Image Loading**:
```javascript
function loadPageImages(pageId) {
  const pageImages = imageMap[pageId];
  return pageImages.map(img => ({
    src: `./images/${img}`,
    alt: `${pageId} reference`,
    loading: 'lazy'
  }));
}
```

**Image Optimization**:
- Lazy loading for images below the fold
- Optimized file sizes (4.1 MB total for 30+ images)
- Embedded in build for offline access

---

### Error Handling

**Custom Dialog System**:
```javascript
function customConfirm(message, onConfirm, onCancel) {
  return {
    message,
    confirmCallback: onConfirm,
    cancelCallback: onCancel,
    buttons: ['Confirm', 'Cancel']
  };
}

function customAlert(message, onOk) {
  return {
    message,
    okCallback: onOk,
    buttons: ['OK']
  };
}
```

**Error Scenarios**:
- Invalid form data submission
- Failed file save operations
- Missing required fields
- Duplicate provider detection
- Navigation validation failures

---

## Data Management

### Application State Schema

```json
{
  "currentPage": 0,
  "formData": {
    "userName": "John Smith",
    "pwoNumber": "12345",
    "groupPracticeAttached": "yes",
    "question20Answered": "yes",
    "providerAlreadyEnrolled": "no",
    // ... 70+ additional fields
  },
  "enrolledProviders": [
    {
      "type": "New Provider",
      "data": {
        "npiNumber": "1234567890",
        "providerName": "Dr. Jane Doe",
        "specialty": "Family Medicine",
        // ... provider-specific fields
      },
      "timestamp": "2025-01-15T10:30:00.000Z"
    }
  ],
  "visitedPages": [0, 1, 2, 3, 4, 5, 6, 7, 8, 22],
  "unableToVerifyFields": ["question20"],
  "outreachNotes": [
    {
      "field": "question20",
      "reason": "Effective date not provided",
      "timestamp": "2025-01-15T10:25:00.000Z",
      "page": "question-20"
    }
  ],
  "providerEnrollmentType": "New Provider",
  "currentEnrollingProviderIndex": 0,
  "currentAddingProviderIndex": 0
}
```

### File System Structure

```
%APPDATA%\com.providerenrollment.walkthrough\
├── PWO_12345\
│   └── state.json (2-50 KB depending on enrolled providers)
├── PWO_67890\
│   └── state.json
└── PWO_11111\
    └── state.json
```

**File Characteristics**:
- One directory per PWO number
- Single `state.json` file per PWO
- JSON format for easy parsing
- Auto-created on first save
- Updated on every state change (debounced)

---

## Summary

The **Provider Group Change Walkthrough** application is a comprehensive desktop tool designed to guide Gainwell enrollment specialists through complex provider enrollment and group change workflows. With intelligent routing, persistent state management, visual guidance, duplicate prevention, and robust error handling, the application ensures consistent, accurate, and efficient processing of provider group changes.

**Key Achievements**:
- ✅ 48 distinct pages covering all workflow scenarios
- ✅ Intelligent auto-routing based on provider enrollment status
- ✅ Multi-provider support with loop handling
- ✅ Persistent state surviving crashes and restarts
- ✅ Visual reference system with 30+ screenshots
- ✅ Embedded PDF documentation
- ✅ Duplicate provider prevention
- ✅ Comprehensive outreach tracking
- ✅ Offline-capable desktop application
- ✅ Export functionality with audit trail

**Recent Improvements**:
- Duplicate provider detection and rejection
- Previous button navigation bug fixes
- PDF bundling for offline access
- Enhanced export with PWO number in filename
- Gainwell branding consistency

This application standardizes provider group change processes, reduces errors, eliminates manual tracking, and ensures compliance with all procedural requirements.
