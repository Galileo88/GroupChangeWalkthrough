/**
 * Download utility functions for generating and exporting notes
 */

export const handleDownloadNotes = (enrolledProviders, outreachNotes, providerManualNotes) => {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let textContent = `PROVIDER ENROLLMENT NOTES\n`;
  textContent += `Generated: ${dateStr}\n`;
  textContent += `${'='.repeat(80)}\n\n`;

  // Add enrolled providers section
  if (enrolledProviders.length > 0) {
    textContent += `ENROLLED PROVIDERS (${enrolledProviders.length} total)\n`;
    textContent += `${'-'.repeat(80)}\n\n`;

    enrolledProviders.forEach((provider, index) => {
      textContent += `PROVIDER ${index + 1}\n`;
      textContent += `Status: ${provider.status || 'Successfully Enrolled'}\n\n`;

      textContent += `Enrollment Details:\n`;
      textContent += `  • Enrollment Created: ${provider.createEnrollmentComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Info Complete: ${provider.providerInfoComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Group Specialties Checked: ${provider.groupSpecialtiesChecked ? 'Yes' : 'No'}\n`;
      textContent += `  • Enrollment Tab Complete: ${provider.enrollmentTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Name Correct: ${provider.providerNameCorrect ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Type Correct: ${provider.providerTypeCorrect ? 'Yes' : 'No'}\n`;
      textContent += `  • Application Date Added: ${provider.applicationDateAdded ? 'Yes' : 'No'}\n`;
      textContent += `  • Cancel Reason Code: ${provider.cancelReasonCode ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Address Complete: ${provider.providerAddressComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Payment/Mailing Address Complete: ${provider.paymentMailingAddressComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Info Tab Complete: ${provider.providerInfoTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • NPI Tab Complete: ${provider.npiTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Specialty Tab Complete: ${provider.specialtyTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Claim Type Tab Complete: ${provider.claimTypeTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • License/DEA Tab Complete: ${provider.licenseDeaTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Mainframe Enrollment Complete: ${provider.enrollOnMainframeComplete ? 'Yes' : 'No'}\n`;

      // Add manual notes if they exist
      if (providerManualNotes[index]) {
        textContent += `\nManual Notes:\n`;
        textContent += `  ${providerManualNotes[index].split('\n').join('\n  ')}\n`;
      }

      // Add outreach notes if they exist
      if (provider.outreachNotes && provider.outreachNotes.length > 0) {
        textContent += `\nOutreach Notes:\n`;
        provider.outreachNotes.forEach((note, noteIndex) => {
          textContent += `  ${noteIndex + 1}. ${note}\n`;
        });
      }

      textContent += `\n${'-'.repeat(80)}\n\n`;
    });
  } else {
    textContent += `No providers enrolled yet.\n\n`;
  }

  // Add current outreach notes section (if any are active)
  if (outreachNotes.length > 0) {
    textContent += `CURRENT OUTREACH NOTES (${outreachNotes.length})\n`;
    textContent += `${'-'.repeat(80)}\n`;
    outreachNotes.forEach((note, index) => {
      textContent += `${index + 1}. ${note}\n`;
    });
    textContent += `\n`;
  }

  textContent += `\n${'='.repeat(80)}\n`;
  textContent += `End of Report\n`;

  // Create a downloadable text file
  downloadTextFile(textContent, `provider-enrollment-notes-${new Date().toISOString().split('T')[0]}.txt`);
};

export const handleDownloadOutreachNotes = (outreachNotes) => {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let textContent = `OUTREACH NOTES\n`;
  textContent += `Generated: ${dateStr}\n`;
  textContent += `${'='.repeat(80)}\n\n`;

  if (outreachNotes.length > 0) {
    textContent += `CURRENT OUTREACH NOTES (${outreachNotes.length})\n`;
    textContent += `${'-'.repeat(80)}\n`;
    outreachNotes.forEach((note, index) => {
      textContent += `${index + 1}. ${note}\n`;
    });
    textContent += `\n`;
  } else {
    textContent += `No outreach notes yet.\n\n`;
  }

  textContent += `\n${'='.repeat(80)}\n`;
  textContent += `End of Report\n`;

  downloadTextFile(textContent, `outreach-notes-${new Date().toISOString().split('T')[0]}.txt`);
};

export const handleDownloadEnrolledProviders = (enrolledProviders, providerManualNotes) => {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let textContent = `ENROLLED PROVIDERS REPORT\n`;
  textContent += `Generated: ${dateStr}\n`;
  textContent += `${'='.repeat(80)}\n\n`;

  if (enrolledProviders.length > 0) {
    // SECTION 1: PROVIDER MANUAL NOTES
    textContent += `PROVIDER MANUAL NOTES\n`;
    textContent += `${'-'.repeat(80)}\n\n`;

    enrolledProviders.forEach((provider, index) => {
      textContent += `PROVIDER ${index + 1}\n`;
      textContent += `Status: ${provider.status || 'Successfully Enrolled'}\n\n`;

      textContent += `Enrollment Details:\n`;
      textContent += `  • Enrollment Created: ${provider.createEnrollmentComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Info Complete: ${provider.providerInfoComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Group Specialties Checked: ${provider.groupSpecialtiesChecked ? 'Yes' : 'No'}\n`;
      textContent += `  • Enrollment Tab Complete: ${provider.enrollmentTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Name Correct: ${provider.providerNameCorrect ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Type Correct: ${provider.providerTypeCorrect ? 'Yes' : 'No'}\n`;
      textContent += `  • Application Date Added: ${provider.applicationDateAdded ? 'Yes' : 'No'}\n`;
      textContent += `  • Cancel Reason Code: ${provider.cancelReasonCode ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Address Complete: ${provider.providerAddressComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Payment/Mailing Address Complete: ${provider.paymentMailingAddressComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Provider Info Tab Complete: ${provider.providerInfoTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • NPI Tab Complete: ${provider.npiTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Specialty Tab Complete: ${provider.specialtyTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Claim Type Tab Complete: ${provider.claimTypeTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • License/DEA Tab Complete: ${provider.licenseDeaTabComplete ? 'Yes' : 'No'}\n`;
      textContent += `  • Mainframe Enrollment Complete: ${provider.enrollOnMainframeComplete ? 'Yes' : 'No'}\n\n`;

      // Add manual notes if they exist
      if (providerManualNotes[index]) {
        textContent += `Manual Notes:\n`;
        textContent += `  ${providerManualNotes[index].split('\n').join('\n  ')}\n`;
      } else {
        textContent += `Manual Notes: None\n`;
      }

      textContent += `\n${'-'.repeat(80)}\n\n`;
    });
  } else {
    textContent += `No providers enrolled yet.\n\n`;
  }

  textContent += `\n${'='.repeat(80)}\n`;
  textContent += `End of Report\n`;

  downloadTextFile(textContent, `enrolled-providers-${new Date().toISOString().split('T')[0]}.txt`);
};

// Helper function to create and download a text file
function downloadTextFile(content, filename) {
  const dataBlob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
