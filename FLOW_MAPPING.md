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
| 9 | practitioner-type-selection | 8 | **BRANCH POINT**: Auto-determined based on practitioner enrollment status |

### Existing Practitioner Path (Steps 11-23)

| Step # | Page ID | Array Index | Description |
|--------|---------|-------------|-------------|
| 11 | existing-practitioner-open-cics | 9 | Open CICS |
| 12 | existing-practitioner-add-to-group | 10 | Add practitioner to group |
| 13 | existing-practitioner-verify-info | 11 | Verify practitioner information |
| 14 | existing-practitioner-close-enrollment | 12 | Close enrollment task |
| 15 | existing-practitioner-finish-group-change | 13 | Finish group change |
| 16 | existing-practitioner-create-checklist | 14 | Create checklist |
| 17 | existing-practitioner-approve-group-change | 15 | Approve group change |
| 18 | existing-practitioner-open-letter-task | 16 | Open letter task |
| 19 | existing-practitioner-select-letter | 17 | Select letter |
| 20 | existing-practitioner-add-to-letter | 18 | Add practitioner to letter |
| 21 | existing-practitioner-finish-letter | 19 | Finish letter |
| 22 | existing-practitioner-close-letter-task | 20 | Close letter task |
| 23 | existing-practitioner-completion | 21 | Completion page |

### New Practitioner Path (Steps 24-37)

| Step # | Page ID | Array Index | Description |
|--------|---------|-------------|-------------|
| 24 | create-enrollment | 22 | Create new enrollment |
| 25 | fill-practitioner-info | 23 | Fill practitioner information |
| 26 | check-group-specialties | 24 | Check group specialties |
| 27 | enrollment-applications-tab | 25 | Enrollment applications tab |
| 28 | verify-enrollment-application | 26 | Verify enrollment application |
| 29 | practitioner-address-tab | 27 | Practitioner address tab |
| 30 | payment-mailing-address-tab | 28 | Payment/Mailing address tab |
| 31 | practitioner-information-tab | 29 | Practitioner information tab |
| 32 | npi-tab | 30 | NPI tab |
| 33 | specialty-tab | 31 | Specialty tab |
| 34 | claim-type-tab | 32 | Claim type tab |
| 35 | license-dea-tab | 33 | License/DEA tab |
| 36 | enroll-on-mainframe | 34 | Enroll on mainframe |
| 37 | additional-practitioners-check | 35 | **DECISION POINT**: Additional practitioners needed? |

### New Practitioner Loop Handlers

1. **Step 37 "Yes" Handler** (additional-practitioners-check with "Yes")
   - Saves practitioner data to enrolledPractitioners
   - Clears practitioner-specific form fields
   - Sets `practitionerEnrollmentType` to `'New Practitioner'`
   - Navigates directly to create-enrollment (Step 24, index 22)
   - This implements the "Repeat Steps 24-36" loop for additional new practitioners

2. **Step 37 "No" Handler** (additional-practitioners-check with "No")
   - Saves final practitioner data to enrolledPractitioners
   - Sets `practitionerEnrollmentType` to `'Existing Practitioner'`
   - Navigates to existing-practitioner-open-cics (Step 11, index 9)
   - Enables access to completion steps (Steps 11-23)

### Existing Practitioner Loop Handlers

3. **Step 23 "Yes" Handler** (existing-practitioner-completion with "Yes")
   - Saves practitioner data to enrolledPractitioners
   - Clears existing practitioner-specific form fields
   - Keeps `practitionerEnrollmentType` as `'Existing Practitioner'`
   - Navigates directly to existing-practitioner-open-cics (Step 11, index 9)
   - This implements the loop for adding multiple existing practitioners to the group

4. **Step 23 "No" Handler** (existing-practitioner-completion with "No")
   - Saves final practitioner data to enrolledPractitioners
   - Navigates to final completion page
   - Completes the entire workflow

### Flow Validation

The implementation correctly handles:
- ✅ Sequential flow through Steps 1-9
- ✅ Auto-branching at Step 9 based on practitioner enrollment status with priority logic:
  - New Practitioner workflow takes priority if any practitioners need enrollment
  - All new practitioners are enrolled before existing practitioners are added
- ✅ Existing Practitioner path (Steps 11-23)
- ✅ New Practitioner path (Steps 24-37)
- ✅ New Practitioner loop (Step 37 "Yes" → Step 24)
- ✅ Existing Practitioner loop (Step 23 "Yes" → Step 11)
- ✅ Transition from New Practitioner to Existing Practitioner workflow (Step 37 "No" → Step 11)
- ✅ Final completion from Existing Practitioner workflow (Step 23 "No" → Final completion)
- ✅ Practitioner enrollment data tracking in `enrolledPractitioners` array
- ✅ Proper `practitionerEnrollmentType` management for conditional page display
