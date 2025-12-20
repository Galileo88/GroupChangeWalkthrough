import { images } from './images.js';

      export const pages = [
        {
          id: 'welcome',
          title: 'Welcome',
          description: 'Let\'s get started with your walkthrough',
          fields: [
            {
              name: 'userName',
              label: 'Your Name',
              type: 'text',
              required: true,
              placeholder: 'Enter your full name',
              validation: (value) => value && value.length >= 2
            },
            {
              name: 'pwoNumber',
              label: 'PWO #',
              type: 'text',
              required: true,
              placeholder: 'Enter PWO number',
              validation: (value) => value && value.trim().length > 0
            }
          ]
        },
        {
          id: 'group-practice',
          title: 'Group Practice Application',
          description: 'Please confirm the application details',
          fields: [
            {
              name: 'groupPracticeAttached',
              label: 'Does the application have the Group Practice Application attached?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No'
            },
            {
              name: 'questionsAnswered',
              label: 'Are questions 2, 4, 5 and 5C answered on the Group Change Practice Application?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              showWhen: { field: 'groupPracticeAttached', value: 'Yes' },
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'Questions 2, 4, 5, 5C are required to be answered. Compare the list from question 5 and 5C to CICS pg13.',
                'If the group is a non-profit, they will not have owners. They will have "controlling interests" and will have an ownership type of "C" on the ownership page in CICS. Controlling interests can be treated like managing employees and can be added at any time.',
                'If they are not a non-profit, and question 5 includes an owner that is not listed on the ownership file on pg13 in CICS, this may be a CHOW. Please let leadership know so they can advise you on next steps.',
                'Individuals list under question 5C should also be listed on the ownership file on pg13 in CICS. If an individual is not listed in CICS on pg13, we will add them with a status of "S" indicated they are managing staff.'
              ]
            }
          ]
        },
        {
          id: 'question-6',
          title: 'Practice Address Verification',
          description: 'Verify practice address information',
          fields: [
            {
              name: 'question6Answered',
              label: 'Is question 6 answered on the Group Practice Application?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'Check the groups addresses to ensure this practice address exists. The 09 page in CICS shows a list of 8 practice addresses.',
                'If you cannot locate the address on the 09 page or in the event the 09 page is full, navigate to the notes page (F6) and look through the notes to see if the address can be found there.',
                'If not, you will add the new practice address to the notes screen.'
              ]
            }
          ]
        },
        {
          id: 'payto-mailto',
          title: 'Pay To / Mail To Address',
          description: 'Verify Pay To and Mail To address information',
          fields: [
            {
              name: 'paytoMailtoMatch',
              label: 'Does the pay-to and mail-to address on questions 7 and 8 in the Group Practice Application match what we have in CICS for the group?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No'
            },
            {
              name: 'paytoMailtoComplete',			
              label: 'Complete: Update the mail-to and pay-to addresses in CICS to match the application.',
              type: 'checkbox',
              required: true,
              showWhen: { field: 'paytoMailtoMatch', value: 'No' },
              validation: (value) => value === true,
              helperNotes: [
                'Update the mail-to and pay-to addresses in CICS to match the application.',
                'From the 02 screen in CICS, hit F5 three times to reach the Pay To and Mail To addresses.'
              ]
            }
          ],
          displayImage: images.paytoMailto
        },
        {
          id: 'questions-9-17',
          title: 'Additional Questions Verification',
          description: 'Verify required questions are answered',
          fields: [
            {
              name: 'questions9to17Answered',
              label: 'Are questions 9, 11, 12, 16 and 17 are answered?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No'
            }
          ],
          pageNotes: [
            'If questions 10, 13, 14, 15, 18 or 19 are answered and are different than what we have in CICS, we can add or update the information.',
            'If these optional questions are blank, it is ok and does not stop us from moving forward.',
            'If the group answers 18 and 19 provides a CLIA# or a Mammography Cert#, they should include a copy of the certificates attached to the application. If they do not include a copy of certificate, we cannot add it to CICS until they do.'
          ],
          displayImage: images.contactInfo
        },
        {
          id: 'email-to-snow',
          title: 'Add contact E-Mail to SNOW',
          description: 'Add contact email information to SNOW',
          fields: [
            {
              name: 'emailAddedToSNOW',
              label: 'Add the contact email information to the email field in SNOW.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          pageNotes: [
            'If no contact email is provided, you will need to manually send out the letter by placing it in the S-Drive at the end.'
          ],
          displayImage: images.emailField
        },
        {
          id: 'question-20',
          title: 'Provider Info Verification',
          description: 'Verify provider information from Question 20',
          fields: [
            {
              name: 'question20Answered',
              label: 'Is question 20 answered on the Group Practice Application?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'Practitioner Name, SSN, NPI and DOB are required.',
                'There may be multiple providers the group is trying to add, and they will all be listed within question 20 in sections A-H. If there are more providers than what the application can fit, additional pages will be attached.'
              ]
            },
            {
              name: 'providerAlreadyEnrolled',
              label: 'Is the provider already enrolled?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              showWhen: { field: 'question20Answered', value: 'Yes' },
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'If Yes, this will be noted for the provider and you will proceed to the next question.',
                'If No, the checklist will be displayed.'
              ]
            },
            {
              name: 'providerInGroup',
              label: 'Is the provider already in the group?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              showWhen: { field: 'providerAlreadyEnrolled', value: 'Yes' },
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'If Yes, you will be given the option to reject this as a duplicate application.',
                'If No, this will be noted for the provider and the checklist will be displayed.'
              ]
            },
            {
              name: 'ssnVerified',
              label: 'SSN - Verify SSN using SOVOS if a Social Security Card is not attached to the application',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.question20Answered === 'Yes' && (formData.providerAlreadyEnrolled === 'No' || (formData.providerAlreadyEnrolled === 'Yes' && formData.providerInGroup === 'No')),
              validation: (value) => value === true,
              sovosUrl: 'https://taxport.sovos.com/login'
            },
            {
              name: 'dexSanctionsCheck',
              label: 'DEX and Sanctions in WVT - Check all providers being added',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.question20Answered === 'Yes' && (formData.providerAlreadyEnrolled === 'No' || (formData.providerAlreadyEnrolled === 'Yes' && formData.providerInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'dobVerified',
              label: 'DOB - Verify DOB in PECOS (new providers may not be in PECOS, so just use their DOB on the application)',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.question20Answered === 'Yes' && (formData.providerAlreadyEnrolled === 'No' || (formData.providerAlreadyEnrolled === 'Yes' && formData.providerInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'npiVerified',
              label: 'NPI - Verify in either the WVT or at npiregistry.cms.hhs.gov to ensure the NPI belongs to the provider',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.question20Answered === 'Yes' && (formData.providerAlreadyEnrolled === 'No' || (formData.providerAlreadyEnrolled === 'Yes' && formData.providerInGroup === 'No')),
              validation: (value) => value === true,
              npiRegistryUrl: 'https://npiregistry.cms.hhs.gov'
            },
            {
              name: 'licensesVerified',
              label: 'Licenses and Board Certificates - APN, CRNA, CNM require RN license, APN license, and board certification',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.question20Answered === 'Yes' && (formData.providerAlreadyEnrolled === 'No' || (formData.providerAlreadyEnrolled === 'Yes' && formData.providerInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'doctorLicenseVerified',
              label: 'Doctors are required to have a copy of their license (Board Certification is not required, but can be updated if included)',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.question20Answered === 'Yes' && (formData.providerAlreadyEnrolled === 'No' || (formData.providerAlreadyEnrolled === 'Yes' && formData.providerInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'deaEffectiveDates',
              label: 'DEA effective dates - Compare expiration dates and update if newer. Add DEA information for new providers if attached',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.question20Answered === 'Yes' && (formData.providerAlreadyEnrolled === 'No' || (formData.providerAlreadyEnrolled === 'Yes' && formData.providerInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'effectiveDatesChecked',
              label: 'Effective Dates - If no Requested Effective Date is provided, effective date goes one year back from stamped date (as long as license covers it)',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.question20Answered === 'Yes' && (formData.providerAlreadyEnrolled === 'No' || (formData.providerAlreadyEnrolled === 'Yes' && formData.providerInGroup === 'No')),
              validation: (value) => value === true
            }
          ]
        },
        {
          id: 'question-20-unable-to-verify-completion',
          title: 'UNABLE TO VERIFY - OUTREACH REQUIRED',
          description: 'Providers with unverifiable items require outreach',
          instructionText: 'You have finished processing all providers in this application. Some providers have items that could not be verified and require outreach.\n\nPlease download your notes to review all providers and the items requiring verification, then reach out to gather the missing information.\n\nOnce you have the required information, you can start a new application to complete the enrollment process.',
          isCompletionPage: true,
          fields: []
        },
        {
          id: 'duplicate-rejection-completion',
          title: 'APPLICATION REJECTED',
          description: 'Duplicate provider application rejected',
          instructionText: 'Application rejected as duplicate. The rejection has been added to the notes.\n\nYou can now:\n- Download the notes using the button below\n- Start a new application for another provider',
          isCompletionPage: true,
          isDuplicateRejection: true,
          fields: []
        },
        {
          id: 'questions-21-23',
          title: 'Additional Questions (21-23) Verification',
          description: 'Verify questions 21, 22 and 23 are answered correctly',
          fields: [
            {
              name: 'question21Answered',
              label: 'Are questions 21 a-e completed and further explained if necessary on the Group Practice Application?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'Questions 21 a-e must be completed and further explained, if necessary.',
                'If a question is answered "yes" and includes further explanation, it could be an Adverse Action situation and will need to be forwarded to the state. Please reach out to leadership to determine next steps.'
              ]
            },
            {
              name: 'question22Answered',
              label: 'Is question 22 answered on the Group Practice Application?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'Question 22 needs to be answered.',
                'If "Yes" is selected, an explanation is required.',
                'If they are currently employed, a list of hours and days of employment is needed.'
              ]
            },
            {
              name: 'question23Answered',
              label: 'Is question 23 answered on the Group Practice Application?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'Question 23 needs to be answered.',
                'If "Yes" is selected, an explanation is required.'
              ]
            }
          ]
        },
        {
          id: 'provider-type-selection',
          title: 'Provider Enrollment Type',
          description: (formData) => {
            // Check if provider is already enrolled from any of the previous steps
            const isAlreadyEnrolled =
              formData.nextProviderAlreadyEnrolled === 'Yes' ||
              formData.finalProviderAlreadyEnrolled === 'Yes' ||
              formData.providerAlreadyEnrolled === 'Yes';

            // Dynamic description based on enrollment status
            const providerType = isAlreadyEnrolled ? 'Existing Provider' : 'New Provider';
            return `Based on previous answers, you are adding a${providerType === 'New Provider' ? '' : 'n'} ${providerType}`;
          },
          fields: [
            {
              name: 'providerEnrollmentType',
              label: (formData) => {
                // Check if provider is already enrolled from any of the previous steps
                const isAlreadyEnrolled =
                  formData.nextProviderAlreadyEnrolled === 'Yes' ||
                  formData.finalProviderAlreadyEnrolled === 'Yes' ||
                  formData.providerAlreadyEnrolled === 'Yes';

                // Dynamic label based on enrollment status
                const providerType = isAlreadyEnrolled ? 'Existing Provider' : 'New Provider';
                return `Based on previous answers, you are adding a${providerType === 'New Provider' ? '' : 'n'} ${providerType}`;
              },
              type: 'radio',
              required: true,
              options: (formData) => {
                // Check if provider is already enrolled from any of the previous steps
                const isAlreadyEnrolled =
                  formData.nextProviderAlreadyEnrolled === 'Yes' ||
                  formData.finalProviderAlreadyEnrolled === 'Yes' ||
                  formData.providerAlreadyEnrolled === 'Yes';

                // If already enrolled, only show "Existing Provider"
                // If not enrolled, only show "New Provider"
                return isAlreadyEnrolled ? ['Existing Provider'] : ['New Provider'];
              },
              validation: (value) => value === 'New Provider' || value === 'Existing Provider'
            }
          ]
        },
        {
          id: 'existing-provider-open-cics',
          title: 'OPEN CICS',
          description: 'Access the provider in CICS',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderOpenCicsComplete',
              label: 'Complete: Access the provider in CICS.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'In CICS, set the OPTION # to 12, the TRANS. TYPE to "U" and enter the groups provider number and press enter.',
          displayImage: images.cics
        },
        {
          id: 'existing-provider-add-to-group',
          title: 'ADDING A PROVIDER TO THE GROUP',
          description: 'Add the provider to the group in CICS',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderAddToGroupComplete',
              label: 'Complete: Add the provider to the group in CICS.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'You will see list of all of the individual providers in the group.\n\nOne the first line, you will add a letter "A" to let CICS know you intend to Add a provider to this group.\n\nNext, tab over to the provider number and overwrite it with the new provider number that was just generated. (don\'t worry, you are not overwriting an existing provider).\n\nNext, tab over to the BEGIN DATE, and enter the begin date for the new provider.\nYou can get the BEGIN DATE by looking at Eligibility Begin in the Provider Information tab in SNOW.\n\nFinally, tab over to the END DATE and add 12319999 as the end date. If the date is already 12319999, you can leave it.\n\nOnce you hit ENTER, the provider will be added to the group.\n\nYou can check to see if the provider was successfully added by searching for their provider number where it says "NEXT MEMBER" and hitting enter. This will show you the provider you just added.\n\nAdditionally, check the notes page F6 to make sure a note was added stating you added the provider to the group.\n\nYou will do this for each provider you are adding',
          displayImage: images.addProv
        },
        {
          id: 'existing-provider-verify-info',
          title: 'VERIFYING PROVIDER INFO IS CORRECT',
          description: 'Verify all provider information in CICS',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          pageNotes: [
            'Board Certification Indicators:',
            'APN, CRNA, CNM will always remain a 0',
            'Doctors, and PA\'s will get a 1 if they provided a board eligibility letter',
            'Doctors, and PA\'s will get a 2 if they provided a board certificate',
            'Otherwise they will remain a 0'
          ],
          fields: [
            {
              name: 'providerNameFormatting02',
              label: 'Check the formatting of the providers name on 02 page',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            },
            {
              name: 'mailToPayToAddresses',
              label: 'Update the Mail To and Pay To addresses, and make sure the providers name is also formatted correctly there as well',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            },
            {
              name: 'cancelCodes',
              label: 'Check Cancel codes',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            },
            {
              name: 'effectiveDates',
              label: 'Check the effective dates for the DEA, Licenses, Specialties, Claim Types',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            },
            {
              name: 'boardCertificationIndicators',
              label: 'Check Board Certification Indicators',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            },
            {
              name: 'programCode54PA',
              label: 'Program Code 54 for PA on 04 page',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ]
        },
        {
          id: 'existing-provider-close-enrollment',
          title: 'CLOSING THE ENROLLMENT TASK',
          description: 'Close the enrollment task in SNOW',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderCloseEnrollmentComplete',
              label: 'Complete: Close the enrollment task in SNOW.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'In the Enrollment work object, once you refresh the screen, you should see an Enrollment Task titled "Verify CICS".\n\nClick the PWT number and close the task. Work notes can state that you are just "closing to task".\n\nThis will close the enrollment.\n\nNavigate back to the Group Change work object.',
          displayImage: images.enrollmentTask
        },
        {
          id: 'existing-provider-finish-group-change',
          title: 'FINISHING UP THE GROUP CHANGE',
          description: 'Complete the group change process in SNOW',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderFinishGroupChangeComplete',
              label: 'Complete: Input the email address into the email field in SNOW.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Back in the Group Change work object, Open the application, and find question 17 in the Group Practice Application to find the email address for the group.\n\nInput that email address into the email field in SNOW.',
          displayImage: images.emailField
        },
        {
          id: 'existing-provider-create-checklist',
          title: 'CREATE A CHECKLIST',
          description: 'Add verification checklist in SNOW',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderCreateChecklistComplete',
              label: 'Complete: Add verification checklist in SNOW.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Add a checklist and check off everything that you verified.\n\nIf you did not use part of the checklist, do not mark it off. Only mark off what was verified.',
          displayImage: images.checklist
        },
        {
          id: 'existing-provider-approve-group-change',
          title: 'APPROVING THE GROUP CHANGE',
          description: 'Approve the group change in SNOW',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderApproveGroupChangeComplete',
              label: 'Complete: Approve the group change in SNOW.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Click one the approve button and make a comment stating the provider(s) has been added to the group.\n\nClick Approve.',
          displayImage: images.addToGroup
        },
        {
          id: 'existing-provider-open-letter-task',
          title: 'OPENING THE LETTER TASK',
          description: 'Navigate to the letter task in SNOW',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderOpenLetterTaskComplete',
              label: 'Complete: Navigate to the letter task in SNOW.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Once you have clicked approve, a new task will generate in the Group Change Task tab.\n\nClick the PWT number to go to the letter task.',
          displayImage: images.letterTask
        },
        {
          id: 'existing-provider-select-letter',
          title: 'SELECTING THE LETTER',
          description: 'Select the group change letter and enter effective date',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderSelectLetterComplete',
              label: 'Complete: Select the group change letter and enter effective date.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Once in the letter task, click on the blue Select Letter button and select GroupChangeAdd\n\nAlso enter the effective date that was given to the provider.',
          displayImage: images.letterSelect
        },
        {
          id: 'existing-provider-add-to-letter',
          title: 'ADDING THE PROVIDER TO THE LETTER',
          description: 'Add provider details to the letter',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderAddToLetterComplete',
              label: 'Complete: Add provider details to the letter.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Near the bottom of the letter task, click on the blue "New" button.\n\nIn the Provider field, enter the provider number of the individual we just added to the group.\n\nIn the Effective Date field, enter the effective date given to the provider.\n\nHit Submit.\n\nYou will do this for each provider you added to the group.',
          displayImage: images.letterProv
        },
        {
          id: 'existing-provider-finish-letter',
          title: 'FINISHING THE LETTER',
          description: 'Create, verify, and save the approval letter',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderFinishLetterComplete',
              label: 'Complete: Create, verify, and save the approval letter.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'IMPORTANT: Before creating the letter, verify the address matches the groups Mail To address on CICS. From the 02 screen in CICS, hit F5 3 times to view the Mail To address.\n\nOnce the letter has been selected, the effective date entered, and the provider(s) are added to the letter, click on the "Create Letter" button at the top right.\n\nThis will create an approval letter, and it will be attached to the top of the page.\n\nOpen the letter by clicking "view" next to the attached letter and verify that all the information on the letter is correct.\n\nDownload the letter by clicking directly on the letter attachment.\nIn your Downloads folder, locate the letter and rename it to the following format:\n\nGroupChangeAdd_GroupName_ICN#_Date\n\nExample:\nGroupChangeAdd_CMC DEPT OF MEDICINE GRP_24226304109_2024-08-20\n\nOnce renamed place the letter into the SDRIVE folder:\n\\\\192.60.36.175\\shared\\Provider Services\\Enrollment\\2-PE Letters',
          displayImage: images.generateLetter
        },
        {
          id: 'existing-provider-close-letter-task',
          title: 'CLOSING THE LETTER TASK',
          description: 'Close the letter task and complete the group change',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'existingProviderCloseLetterTaskComplete',
              label: 'Complete: Close the letter task and complete the group change.',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Add a work note stating you have "Generated the approval letter"\n\nChange the Group Change Task State to Closed\n\nClick on the "Save" button\n\nThis will close the letter task and the Group Change work object all at one.',
          displayImage: images.closeLetter
        },
        {
          id: 'existing-provider-completion',
          title: 'Provider Added to Group',
          description: 'Check if there are more providers to add to the group',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [
            {
              name: 'additionalExistingProvidersNeeded',
              label: 'Are there additional providers that need to be added to the group?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No'
            }
          ],
          instructionText: 'If you have more providers to add to this group, select "Yes" to continue adding another provider. The current provider information will be saved.\n\nIf you have finished adding all providers to the group, select "No" to complete the walkthrough.',
          isCompletionPage: false
        },
        {
          id: 'final-completion',
          title: 'Walkthrough Complete!',
          description: 'ALL PROVIDERS HAVE BEEN ENROLLED AND ADDED TO THE GROUP',
          showWhen: { field: 'providerEnrollmentType', value: 'Existing Provider' },
          fields: [],
          instructionText: 'Congratulations! You have successfully completed the group change walkthrough.\n\nAll providers have been enrolled and added to the group.\n\nYou can now:\n- Download your notes and answers\n- Start a new application',
          isCompletionPage: true
        },
        {
          id: 'create-enrollment',
          title: 'Create Enrollment in SNOW',
          description: 'Begin the new provider enrollment process',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'createEnrollmentComplete',
              label: 'Complete: Clicked the "Create Enrollment" button in SNOW',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Begin enrolling a new provider by clicking on the blue "Create Enrollment" button within your work object in SNOW.',
          noteText: 'NOTE: You will do this for each new provider that needs to be enrolled into CICS, but do it one at a time to avoid making a mistake.',
          displayImage: images.createEnrollment
        },
        {
          id: 'fill-provider-info',
          title: 'Fill in Provider Information',
          description: 'Enter the provider details in the enrollment window',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'providerInfoComplete',
              label: 'Complete: Filled in the provider information',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Fill in the information for the individual provider you are enrolling into the window that pops up.',
          nameFormatNote: 'When entering the providers name, it should be in all CAPS and the format should be LAST FIRST MI and the professional title. ex: SMITH JOHN J. MD',
          displayImage: images.newProviderWindow,
          resourceText: 'Be sure to check the individual providers license and utilize the links below to help determine the provider type and specialty:',
          resources: [
            { label: '2025 Legal Quick Guide', url: './2025LegalQuickGuide.pdf', type: 'pdf' },
            { label: 'Provider Types and Specialties', url: './ProviderTypesSpecialties.pdf', type: 'pdf' }
          ]
        },
        {
          id: 'check-group-specialties',
          title: 'Check Group Specialties',
          description: 'Verify the group can accept the provider specialty',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'groupSpecialtiesChecked',
              label: 'Complete: Verified the group specialties',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Back in CICS, under the group, be sure to check what kind of specialties the group can take. From the 02 page in CICS, press F5 and take a look at the specialties that are already added to the group. If you do not see the providers specialty, check to see if the specialty is covered under another specialty, e.g. 420, 110, 750 etc.\n\nIf necessary, add the specialty to the group. The specialty will get the same effective date as the provider you are adding.',
          displayImage: images.groupSpecialty,
          pageNotes: [
            'If you are still unsure, please reach out in the chat, or to leadership so that you can get the answer you need.'
          ]
        },
        {
          id: 'enrollment-applications-tab',
          title: 'Enrollment Applications Tab',
          description: 'Navigate to the Enrollment Applications tab in SNOW',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'enrollmentTabComplete',
              label: 'Complete: Navigate to the enrollment application you just created',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Back in SNOW, navigate to the bottom of the PWO and locate the "Enrollment Applications" tab.\n\nYou will see a new Enrollment Application associated with the provider information you just entered.\n\nClick on the PWO to take you to the enrollment application.',
          displayImage: images.enrollmentTab
        },
        {
          id: 'verify-enrollment-application',
          title: 'Verify Enrollment Application',
          description: 'Verify and complete the enrollment application information',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'providerNameCorrect',
              label: 'Complete: Check the provider\'s name is correct',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            },
            {
              name: 'providerTypeCorrect',
              label: 'Complete: Check the provider type is correct',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            },
            {
              name: 'applicationDateAdded',
              label: 'Complete: Add the Application Date -- This is the stamped date on the application',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            },
            {
              name: 'cancelReasonCode',
              label: 'Complete: Cancel Reason Code should remain 00',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Once you are in the Enrollment Application, check the name, provider type, application date and cancel reason code to ensure you entered the providers data correctly.'
        },
        {
          id: 'provider-address-tab',
          title: 'Provider Address Tab',
          description: 'Enter the provider address information',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'providerAddressComplete',
              label: 'Complete: Enter the provider address information',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'The street address will be the practice address found on question 6 of the Group Practice Application.\n\nThe phone number, and fax number can be found on questions 11 and 14 in the Group Practice Application',
          displayImage: images.providerAddress
        },
        {
          id: 'payment-mailing-address-tab',
          title: 'Payment Address and Mailing Address Tab',
          description: 'Review payment and mailing address settings',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'paymentMailingAddressComplete',
              label: 'Complete: Review payment and mailing address settings',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'By default these inherit the street address from the Provider Address tab. These do not need to be changed in SNOW, but will need to be updated in CICS once the provider is added to the group.',
          displayImage: images.mailingAddress
        },
        {
          id: 'provider-information-tab',
          title: 'Provider Information Tab',
          description: 'Set eligibility dates and Medicare information',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'providerInfoTabComplete',
              label: 'Complete: Set eligibility dates and Medicare information',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'The Eligibility Begin date will be the Requested Effective Date on question 20 of the Group Practice Application.\n\nA Requested Effective Date might not be provided. If that is the case, The effective date will go one year back from the stamped date as long as the license can cover it.\n\nIf the Requested Effective Date is further than a year back, we will go back 1 year from the stamped date on the application, as long as the individual providers license covers that far back. If the license does not cover that far back, you can only go as far back as the issue date of the license.\n\nThe Eligibility End date will remain blank.\n\nIf the provider has a Medicare Number, you can enter it in the Medicare Number field.',
          displayImage: images.providerInfoTab
        },
        {
          id: 'npi-tab',
          title: 'NPI Tab',
          description: 'Verify or enter the NPI number',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'npiTabComplete',
              label: 'Complete: Verify or enter the NPI number',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'The NPI number for the individual provider should already be populated into this tab. If it is not, you will enter it here.',
          displayImage: images.npiTab
        },
        {
          id: 'specialty-tab',
          title: 'Specialty Tab',
          description: 'Set specialty dates for the provider',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'specialtyTabComplete',
              label: 'Complete: Set specialty and specialty effective dates for the provider',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'This is a good time to triple check the specialty.\n\nSpecialty 1 Begin Date will be the same as the Eligibility Begin date as on the Provider Information tab.\n\nFor NURSES, Specialty 1 End Date will be the date their Board Certificate expires\n\nFor DOCTORS & PAs, Specialty 1 End Date will remain blank',
          displayImage: images.specTab
        },
        {
          id: 'claim-type-tab',
          title: 'Claim Type Tab',
          description: 'Set claim types for the provider',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'claimTypeTabComplete',
              label: 'Complete: Set claim types for the provider',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Claim Types can be determined by using the resource below.',
          resourceText: 'Use this resource to determine claim types:',
          resources: [
            { label: 'Provider Types and Specialties', url: './ProviderTypesSpecialties.pdf', type: 'pdf' }
          ],
          displayImage: images.claimTab,
          pageNotes: [
            'Example: A Provider Type 70 with a Specialty of 190 will get Claim Types 13, 15, 22',
            'Claim Type 1 Begin Date will be the same as the Eligibility Begin date as on the Provider Information tab.',
            'Claim Type 1 End Date will remain blank.',
            'NOTE: Not all specialties have 3 claim types like this example. Some will have 1 and some will have 2. The begin dates for each claim type will be the same date.'
          ]
        },
        {
          id: 'license-dea-tab',
          title: 'License and DEA Tab',
          description: 'Enter license and DEA information',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'licenseDeaTabComplete',
              label: 'Complete: Enter license and DEA information',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'License information can be pulled from the license provided in the application, or from the verification site. If the license is not in the application, and you have not obtained a screenshot of the license from the verification site, do so now.',
          resourceText: 'Use this resource to verify license:',
          resources: [
            { label: 'Verify License', url: 'https://miamifrp.com/verification/', type: 'link' }
          ],
          displayImage: images.licenseDeaTab,
          pageNotes: [
            'Input the License Number along with the License Effective Date and License Expiration Date.',
            'The License Effective Date is the issue date of the license',
            'The License Expiration Date is the Expiration Date of the License',
            'The DEA Number is listed on question 20 of the Group Practice Application but should also be attached to the application. If not, DEA can be validated using DEA lookup in the West Virginia Tool. Take a screenshot of the validated DEA and attach it to the work object.',
            'DEA Effective Date is the issue date of the DEA',
            'DEA End Date is the expiration date of the DEA'
          ]
        },
        {
          id: 'enroll-on-mainframe',
          title: 'Enrolling on Mainframe',
          description: 'Complete the enrollment process on the mainframe',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'enrollOnMainframeComplete',
              label: 'Complete: Complete the enrollment process on the mainframe',
              type: 'checkbox',
              required: true,
              validation: (value) => value === true
            }
          ],
          instructionText: 'Once all of the information has been filled out accurately, click "Save" at the top of the screen and then you can proceed to click on "Enroll On Mainframe".\n\nThis may take a moment to process, but eventually you should see a blue banner stating "PROVIDER XXXXXXX SUCCESSFULLY ADDED"\n\nThe provider now has a provider ID.',
          displayImage: images.mainframe
        },
        {
          id: 'additional-providers-check',
          title: 'Additional Provider Enrollment',
          description: 'Check if there are more providers to enroll',
          showWhen: { field: 'providerEnrollmentType', value: 'New Provider' },
          fields: [
            {
              name: 'additionalProvidersNeeded',
              label: 'Are there additional providers that need to be enrolled?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No'
            }
          ],
          instructionText: 'If you have more providers to enroll for this group change, select "Yes" to continue enrolling another provider. Your previous enrollment information will be saved.\n\nIf you have finished enrolling all providers, select "No" to continue to the next step.'
        },
        {
          id: 'next-provider-ready-check',
          title: 'Final Provider Verification',
          description: 'Last chance to verify all provider information before enrollment',
          showWhen: { field: 'additionalProvidersNeeded', value: 'Yes' },
          fields: [
            {
              name: 'nextProviderFinalVerificationConfirm',
              label: 'Is question 20 answered on the Group Practice Application?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'Practitioner Name, SSN, NPI and DOB are required.',
                'There may be multiple providers the group is trying to add, and they will all be listed within question 20 in sections A-H. If there are more providers than what the application can fit, additional pages will be attached.'
              ]
            },
            {
              name: 'nextProviderAlreadyEnrolled',
              label: 'Is the provider already enrolled?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              showWhen: { field: 'nextProviderFinalVerificationConfirm', value: 'Yes' },
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'If Yes, this will be noted for the provider and you will proceed to the next question.',
                'If No, the checklist will be displayed.'
              ]
            },
            {
              name: 'nextProviderInGroup',
              label: 'Is the provider already in the group?',
              type: 'radio',
              required: true,
              options: ['Yes', 'No'],
              showWhen: { field: 'nextProviderAlreadyEnrolled', value: 'Yes' },
              validation: (value) => value === 'Yes' || value === 'No',
              helperNotes: [
                'If Yes, you will be given the option to reject this as a duplicate application.',
                'If No, this will be noted for the provider and the checklist will be displayed.'
              ]
            },
            {
              name: 'nextProviderFinalSsnVerified',
              label: 'SSN - Verify SSN using SOVOS if a Social Security Card is not attached to the application',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.nextProviderFinalVerificationConfirm === 'Yes' && (formData.nextProviderAlreadyEnrolled === 'No' || (formData.nextProviderAlreadyEnrolled === 'Yes' && formData.nextProviderInGroup === 'No')),
              validation: (value) => value === true,
              sovosUrl: 'https://taxport.sovos.com/login'
            },
            {
              name: 'nextProviderFinalDexSanctionsCheck',
              label: 'DEX and Sanctions in WVT - Check all providers being added',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.nextProviderFinalVerificationConfirm === 'Yes' && (formData.nextProviderAlreadyEnrolled === 'No' || (formData.nextProviderAlreadyEnrolled === 'Yes' && formData.nextProviderInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'nextProviderFinalDobVerified',
              label: 'DOB - Verify DOB in PECOS (new providers may not be in PECOS, so just use their DOB on the application)',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.nextProviderFinalVerificationConfirm === 'Yes' && (formData.nextProviderAlreadyEnrolled === 'No' || (formData.nextProviderAlreadyEnrolled === 'Yes' && formData.nextProviderInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'nextProviderFinalNpiVerified',
              label: 'NPI - Verify in either the WVT or at npiregistry.cms.hhs.gov to ensure the NPI belongs to the provider',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.nextProviderFinalVerificationConfirm === 'Yes' && (formData.nextProviderAlreadyEnrolled === 'No' || (formData.nextProviderAlreadyEnrolled === 'Yes' && formData.nextProviderInGroup === 'No')),
              validation: (value) => value === true,
              npiRegistryUrl: 'https://npiregistry.cms.hhs.gov'
            },
            {
              name: 'nextProviderFinalLicensesVerified',
              label: 'Licenses and Board Certificates - APN, CRNA, CNM require RN license, APN license, and board certification',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.nextProviderFinalVerificationConfirm === 'Yes' && (formData.nextProviderAlreadyEnrolled === 'No' || (formData.nextProviderAlreadyEnrolled === 'Yes' && formData.nextProviderInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'nextProviderFinalDoctorLicenseVerified',
              label: 'Doctors are required to have a copy of their license (Board Certification is not required, but can be updated if included)',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.nextProviderFinalVerificationConfirm === 'Yes' && (formData.nextProviderAlreadyEnrolled === 'No' || (formData.nextProviderAlreadyEnrolled === 'Yes' && formData.nextProviderInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'nextProviderFinalDeaEffectiveDates',
              label: 'DEA effective dates - Compare expiration dates and update if newer. Add DEA information for new providers if attached',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.nextProviderFinalVerificationConfirm === 'Yes' && (formData.nextProviderAlreadyEnrolled === 'No' || (formData.nextProviderAlreadyEnrolled === 'Yes' && formData.nextProviderInGroup === 'No')),
              validation: (value) => value === true
            },
            {
              name: 'nextProviderFinalEffectiveDatesChecked',
              label: 'Effective Dates - If no Requested Effective Date is provided, effective date goes one year back from stamped date (as long as license covers it)',
              type: 'checkbox',
              required: true,
              showWhen: (formData) => formData.nextProviderFinalVerificationConfirm === 'Yes' && (formData.nextProviderAlreadyEnrolled === 'No' || (formData.nextProviderAlreadyEnrolled === 'Yes' && formData.nextProviderInGroup === 'No')),
              validation: (value) => value === true
            }
          ]
        }
      ];

