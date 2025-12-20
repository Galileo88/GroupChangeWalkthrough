# Application Flow Mapping

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
- At Step 23 (existing-provider-completion), user decides:
  - **Yes** → Save current provider, loop back to Step 11 (existing-provider-open-cics, index 9)
  - **No** → Navigate to final completion page

### New Provider Flow (Steps 24-37)
- Conditional display based on: `providerEnrollmentType === 'New Provider'`
- All pages from index 22-35 are shown when this condition is met
- At Step 37 (additional-providers-check), user decides:
  - **Yes** → Save current provider, loop back to Step 24 (create-enrollment, index 22)
  - **No** → Save current provider, navigate to Step 11 (existing-provider-open-cics, index 9)

### New Provider Loop (Step 37 "Yes")
When "Yes" is selected at Step 37:
1. Current provider data is saved to `enrolledProviders` array
2. Provider-specific form data is cleared
3. `providerEnrollmentType` is set to `'New Provider'`
4. Navigate directly back to Step 24 (create-enrollment, index 22)
5. Loop repeats: User goes through Steps 24-37 again for each additional new provider

### Existing Provider Loop (Step 23 "Yes")
When "Yes" is selected at Step 23:
1. Current provider data is saved to `enrolledProviders` array
2. Existing provider-specific form data is cleared
3. `providerEnrollmentType` remains `'Existing Provider'`
4. Navigate directly back to Step 11 (existing-provider-open-cics, index 9)
5. Loop repeats: User goes through Steps 11-23 again for each additional existing provider

### Completion Flow (Step 37 "No" or Step 23 "No")
**From Step 37 "No" (New Provider path):**
1. Final provider data is saved to `enrolledProviders` array
2. `providerEnrollmentType` is set to `'Existing Provider'` to enable access to completion steps
3. Navigate directly to Step 11 (existing-provider-open-cics, index 9)
4. Continue through Steps 11-23 to add all providers to the group

**From Step 23 "No" (Existing Provider path):**
1. Final provider data is saved to `enrolledProviders` array
2. Navigate to final completion page
3. Workflow complete

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

### New Provider Loop Handlers

1. **Step 37 "Yes" Handler** (additional-providers-check with "Yes")
   - Saves provider data to enrolledProviders
   - Clears provider-specific form fields
   - Sets `providerEnrollmentType` to `'New Provider'`
   - Navigates directly to create-enrollment (Step 24, index 22)
   - This implements the "Repeat Steps 24-36" loop for additional new providers

2. **Step 37 "No" Handler** (additional-providers-check with "No")
   - Saves final provider data to enrolledProviders
   - Sets `providerEnrollmentType` to `'Existing Provider'`
   - Navigates to existing-provider-open-cics (Step 11, index 9)
   - Enables access to completion steps (Steps 11-23)

### Existing Provider Loop Handlers

3. **Step 23 "Yes" Handler** (existing-provider-completion with "Yes")
   - Saves provider data to enrolledProviders
   - Clears existing provider-specific form fields
   - Keeps `providerEnrollmentType` as `'Existing Provider'`
   - Navigates directly to existing-provider-open-cics (Step 11, index 9)
   - This implements the loop for adding multiple existing providers to the group

4. **Step 23 "No" Handler** (existing-provider-completion with "No")
   - Saves final provider data to enrolledProviders
   - Navigates to final completion page
   - Completes the entire workflow

### Flow Validation

The implementation correctly handles:
- ✅ Sequential flow through Steps 1-9
- ✅ Auto-branching at Step 9 based on provider enrollment status with priority logic:
  - New Provider workflow takes priority if any providers need enrollment
  - All new providers are enrolled before existing providers are added
- ✅ Existing Provider path (Steps 11-23)
- ✅ New Provider path (Steps 24-37)
- ✅ New Provider loop (Step 37 "Yes" → Step 24)
- ✅ Existing Provider loop (Step 23 "Yes" → Step 11)
- ✅ Transition from New Provider to Existing Provider workflow (Step 37 "No" → Step 11)
- ✅ Final completion from Existing Provider workflow (Step 23 "No" → Final completion)
- ✅ Provider enrollment data tracking in `enrolledProviders` array
- ✅ Proper `providerEnrollmentType` management for conditional page display
