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
