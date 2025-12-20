# Application Flow Mapping

This document maps the flowchart to the actual implementation in index.html.

**Code Organization:** The index.html file has been organized with clear section headers and cleaned of verbose inline comments. All functionality remains intact, with improved readability through structured sections (see Code Organization section below).

**Note:** The flowchart does not include a Step 10. The flow goes directly from Step 9 (provider-type-selection) to either:
- Step 11 (existing-provider-open-cics) for Existing Provider path
- Step 24 (create-enrollment) for New Provider path

A previously existing Step 10 (existing-provider-questions-21-23) has been removed to match the flowchart exactly.

## Page Index Reference

| Step # | Page ID | Array Index | Description |
|--------|---------|-------------|-------------|
| 1 | welcome | 0 | Welcome page with user name and PWO # |
| 2 | group-practice | 1 | Group Practice Application verification |
| 3 | question-6 | 2 | Question 6 verification |
| 4 | payto-mailto | 3 | Pay To/Mail To information |
| 5 | questions-9-17 | 4 | Questions 9-17 verification |
| 6 | email-to-snow | 5 | Email to SNOW |
| 7 | question-20 | 6 | Question 20 verification |
| 8 | questions-21-23 | 7 | Questions 21-23 verification |
| 9 | provider-type-selection | 8 | **BRANCH POINT**: Auto-determined based on provider enrollment status |

### Existing Provider Path (Steps 11-23)

| Step # | Page ID | Array Index | Description |
|--------|---------|-------------|-------------|
| 11 | existing-provider-open-cics | 9 | Open CICS |
| 12 | existing-provider-add-to-group | 10 | Add provider to group |
| 13 | existing-provider-verify-info | 11 | Verify provider information |
| 14 | existing-provider-close-enrollment | 12 | Close enrollment task |
| 15 | existing-provider-finish-group-change | 13 | Finish group change |
| 16 | existing-provider-create-checklist | 14 | Create checklist |
| 17 | existing-provider-approve-group-change | 15 | Approve group change |
| 18 | existing-provider-open-letter-task | 16 | Open letter task |
| 19 | existing-provider-select-letter | 17 | Select letter |
| 20 | existing-provider-add-to-letter | 18 | Add provider to letter |
| 21 | existing-provider-finish-letter | 19 | Finish letter |
| 22 | existing-provider-close-letter-task | 20 | Close letter task |
| 23 | existing-provider-completion | 21 | Completion page |

### New Provider Path (Steps 24-37)

| Step # | Page ID | Array Index | Description |
|--------|---------|-------------|-------------|
| 24 | create-enrollment | 22 | Create new enrollment |
| 25 | fill-provider-info | 23 | Fill provider information |
| 26 | check-group-specialties | 24 | Check group specialties |
| 27 | enrollment-applications-tab | 25 | Enrollment applications tab |
| 28 | verify-enrollment-application | 26 | Verify enrollment application |
| 29 | provider-address-tab | 27 | Provider address tab |
| 30 | payment-mailing-address-tab | 28 | Payment/Mailing address tab |
| 31 | provider-information-tab | 29 | Provider information tab |
| 32 | npi-tab | 30 | NPI tab |
| 33 | specialty-tab | 31 | Specialty tab |
| 34 | claim-type-tab | 32 | Claim type tab |
| 35 | license-dea-tab | 33 | License/DEA tab |
| 36 | enroll-on-mainframe | 34 | Enroll on mainframe |
| 37 | additional-providers-check | 35 | **DECISION POINT**: Additional providers needed? |

### Additional Pages

| Page ID | Array Index | Description | Usage |
|---------|-------------|-------------|-------|
| next-provider-ready-check | 36 | Next provider verification checklist | Currently unused in main flow |

## Flow Logic

### Main Flow (Steps 1-9)
1. User completes Steps 1-8 sequentially
2. At Step 9 (provider-type-selection), the system automatically determines the workflow based on provider enrollment status:
   - **New Provider** (if any providers need enrollment) → Navigate to Step 24 (index 22)
   - **Existing Provider** (if all providers are already enrolled) → Navigate to Step 11 (index 9)
   - **Mixed Status**: If there's a mix of new and existing providers, the system prioritizes the New Provider workflow first, enrolling all new providers before adding existing providers

### Existing Provider Flow (Steps 11-23)
- Conditional display based on: `providerEnrollmentType === 'Existing Provider'`
- All pages from index 9-21 are shown when this condition is met
- Flow ends at Step 23 (existing-provider-completion)

### New Provider Flow (Steps 24-37)
- Conditional display based on: `providerEnrollmentType === 'New Provider'`
- All pages from index 22-35 are shown when this condition is met
- At Step 37 (additional-providers-check), user decides:
  - **Yes** → Save current provider, loop back to Step 24 (create-enrollment, index 22)
  - **No** → Save current provider, navigate to Step 11 (existing-provider-add-to-group, index 10)

### Additional Provider Loop
When "Yes" is selected at Step 37:
1. Current provider data is saved to `enrolledProviders` array
2. Provider-specific form data is cleared
3. `providerEnrollmentType` is set to `'New Provider'`
4. Navigate directly back to Step 24 (create-enrollment, index 22)
5. Loop repeats: User goes through Steps 24-37 again for each additional provider

### Completion Flow
When "No" is selected at Step 37:
1. Final provider data is saved to `enrolledProviders` array
2. `providerEnrollmentType` is set to `'Existing Provider'` to enable access to completion steps
3. Navigate directly to Step 11 (existing-provider-add-to-group, index 10)
4. Continue through Steps 11-23 to complete the workflow

## Code Organization

The implementation in index.html is organized into clearly labeled sections:
- **ICON COMPONENTS** - SVG icon components used throughout the UI
- **MAIN FORM COMPONENT** - Main WalkthroughForm with state variables, reference images, and helper functions
- **PAGES CONFIGURATION (44 Pages)** - All walkthrough pages organized by workflow section
- **VALIDATION & PAGE LOGIC** - Page validation and conditional display functions
- **EVENT HANDLERS** - Navigation and form event handling functions
- **COMPONENT RENDERING** - Main JSX rendering logic
- **MODAL COMPONENTS** - All modal dialogs (Image, Outreach Notes, Enrolled Providers, etc.)
- **APPLICATION INITIALIZATION** - Root DOM rendering

## Key Navigation Points

The main navigation logic is located in the **EVENT HANDLERS** section of index.html:

1. **Step 37 "Yes" Handler** (additional-providers-check with "Yes")
   - Saves provider data to enrolledProviders
   - Clears provider-specific form fields
   - Sets `providerEnrollmentType` to `'New Provider'`
   - Navigates directly to create-enrollment (Step 24, index 22)
   - This implements the "Repeat Steps 24-36" loop shown in the flowchart

2. **Step 37 "No" Handler** (additional-providers-check with "No")
   - Saves final provider data to enrolledProviders
   - Sets `providerEnrollmentType` to `'Existing Provider'`
   - Navigates to existing-provider-add-to-group (Step 12, index 10)
   - Enables access to completion steps (Steps 11-23)

## Flowchart Alignment

The implementation correctly matches the flowchart:
- Steps 1-9: Sequential initial steps ✅
- Step 9: Branch to "New Provider" or "Existing Provider" ✅
- New Provider: Steps 24-37 ✅
- Existing Provider: Steps 11-23 ✅
- Step 37 Decision:
  - **Yes** → "Repeat Steps 24-36" (loop back to Step 24) ✅
  - **No** → "Step 11" (navigate to existing-provider-add-to-group) ✅

### Implementation Details

The implementation correctly handles the flowchart's loop behavior with prioritized workflow:
1. **Priority Logic**: If providers need enrollment, the system automatically routes to New Provider workflow first
2. When "Yes" is selected at Step 37, the flow loops directly back to Step 24 (create-enrollment)
3. All new providers are enrolled through the New Provider flow (Steps 24-37) before any existing providers are added
4. Provider data is saved before looping, allowing multiple providers to be enrolled
5. When "No" is selected at Step 37, the system transitions to Existing Provider workflow (Steps 11-23) to add all providers (both newly enrolled and pre-existing) to the group

**Step 37 "Yes" Loop:**
When "Yes" is selected at Step 37, the code:
1. Sets `providerEnrollmentType` to `'New Provider'` in the cleared form data
2. Navigates directly to Step 24 (create-enrollment) instead of going through intermediate pages
3. This ensures the flowchart's "Repeat Steps 24-36" instruction is followed exactly

**Step 37 "No" Transition:**
When transitioning from New Provider path (Step 37 "No") to existing provider completion steps, the code updates `providerEnrollmentType` to `'Existing Provider'` before navigation.

This is critical because:
1. All existing provider pages (indices 9-21) have `showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' }`
2. Without updating this field, users coming from the New Provider path would be blocked from accessing these pages
3. The existing provider completion steps (adding to group, creating checklist, generating letters, etc.) are shared final steps regardless of enrollment type

### Flow Validation

The implementation correctly handles:
- ✅ Sequential flow through Steps 1-9
- ✅ Auto-branching at Step 9 based on provider enrollment status with priority logic:
  - New Provider workflow takes priority if any providers need enrollment
  - All new providers are enrolled before existing providers are added
- ✅ Existing Provider path (Steps 11-23)
- ✅ New Provider path (Steps 24-37)
- ✅ Loop back for additional providers (Step 37 "Yes" → Step 24)
- ✅ Transition to completion steps (Step 37 "No" → Step 11)
- ✅ Provider enrollment data tracking in `enrolledProviders` array
- ✅ Proper `providerEnrollmentType` management for conditional page display
