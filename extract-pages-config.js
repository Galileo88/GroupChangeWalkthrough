/**
 * Script to extract pages configuration from index.html
 * This extracts the large pages array and image constants
 */

import { readFileSync, writeFileSync } from 'fs';

// Read the index.html file
const html = readFileSync('./index.html', 'utf-8');

// Extract the pages array - find the start and end
const pagesStart = html.indexOf('// PAGES CONFIGURATION');
const pagesArrayStart = html.indexOf('const pages = [', pagesStart);
const pagesArrayEnd = html.indexOf('];', pagesArrayStart) + 2;

// Get the pages configuration
const pagesConfig = html.substring(pagesArrayStart, pagesArrayEnd);

// Clean up and format for export
const cleanedPages = pagesConfig
  .replace('const pages = ', 'export const pages = ')
  .replace(/paytoMailtoImage/g, "images.paytoMailto")
  .replace(/question6Image/g, "images.question6")
  .replace(/contactInfoImage/g, "images.contactInfo")
  .replace(/emailFieldImage/g, "images.emailField")
  .replace(/practitionersImage/g, "images.practitioners")
  .replace(/questions21to24Image/g, "images.questions21to24")
  .replace(/createEnrollmentImage/g, "images.createEnrollment")
  .replace(/newProviderWindowImage/g, "images.newProviderWindow")
  .replace(/groupSpecialtyImage/g, "images.groupSpecialty")
  .replace(/enrollmentTabImage/g, "images.enrollmentTab")
  .replace(/providerAddressImage/g, "images.providerAddress")
  .replace(/mailingAddressImage/g, "images.mailingAddress")
  .replace(/providerInfoTabImage/g, "images.providerInfoTab")
  .replace(/npiTabImage/g, "images.npiTab")
  .replace(/specTabImage/g, "images.specTab")
  .replace(/claimTabImage/g, "images.claimTab")
  .replace(/licenseDeaTabImage/g, "images.licenseDeaTab")
  .replace(/mainframeImage/g, "images.mainframe")
  .replace(/cicsImage/g, "images.cics")
  .replace(/addProvImage/g, "images.addProv")
  .replace(/enrollmentTaskImage/g, "images.enrollmentTask")
  .replace(/checklistImage/g, "images.checklist")
  .replace(/addToGroupImage/g, "images.addToGroup")
  .replace(/letterTaskImage/g, "images.letterTask")
  .replace(/letterSelectImage/g, "images.letterSelect")
  .replace(/letterProvImage/g, "images.letterProv")
  .replace(/generateLetterImage/g, "images.generateLetter")
  .replace(/closeLetterImage/g, "images.closeLetter");

// Create the full pages config file with import
const pagesConfigFile = `import { images } from './images.js';

${cleanedPages}
`;

// Write to file
writeFileSync('./src/config/pages.js', pagesConfigFile);

console.log('✅ Pages configuration extracted successfully!');
console.log('📄 File created: src/config/pages.js');
