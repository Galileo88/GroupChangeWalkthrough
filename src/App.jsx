import { useState } from 'react';
import { ChevronRight, ChevronLeft } from './components/icons/Icons';
import { renderField } from './components/form/FormFields';
import { ImageModal } from './components/modals/ImageModal';
import { OutreachNotesModal, ViewNotesModal } from './components/modals/NotesModals';
import { EnrolledProvidersModal } from './components/modals/EnrolledProvidersModal';
import { ConfirmDialog, AlertDialog } from './components/modals/DialogModals';
import { createDialogHelper } from './utils/dialogs';
import { handleDownloadNotes, handleDownloadOutreachNotes, handleDownloadEnrolledProviders } from './utils/downloads';
import { pages } from './config/pages';
import './App.css';

function App() {
  // State Management
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [showNextStepsModal, setShowNextStepsModal] = useState(false);
  const [outreachNotes, setOutreachNotes] = useState([]);
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [currentOutreachReason, setCurrentOutreachReason] = useState('');
  const [showViewNotesModal, setShowViewNotesModal] = useState(false);
  const [enrolledProviders, setEnrolledProviders] = useState([]);
  const [showEnrolledProvidersModal, setShowEnrolledProvidersModal] = useState(false);
  const [providerManualNotes, setProviderManualNotes] = useState({});
  const [currentEnrollingProviderIndex, setCurrentEnrollingProviderIndex] = useState(null);
  const [currentAddingProviderIndex, setCurrentAddingProviderIndex] = useState(null);
  const [visitedPages, setVisitedPages] = useState(new Set([0]));
  const [unableToVerifyFields, setUnableToVerifyFields] = useState(new Set());
  const [pendingUnableToVerifyField, setPendingUnableToVerifyField] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '', onConfirm: null, onCancel: null });
  const [alertDialog, setAlertDialog] = useState({ show: false, message: '', onClose: null });

  // Dialog helpers
  const { showConfirm, showAlert } = createDialogHelper(setConfirmDialog, setAlertDialog);

  // Current page data
  const currentPageData = pages[currentPage];
  const isLastPage = currentPage === pages.length - 1;

  // Page validation
  const isPageValid = () => {
    const page = pages[currentPage];
    return page.fields.every(field => {
      if (field.showWhen) {
        let conditionMet;
        if (typeof field.showWhen === 'function') {
          conditionMet = field.showWhen(formData);
        } else {
          conditionMet = formData[field.showWhen.field] === field.showWhen.value;
        }
        if (!conditionMet) return true;
      }
      if (!field.required) return true;

      // Skip validation for fields marked as unable to verify
      if (unableToVerifyFields.has(field.name)) return true;

      const value = formData[field.name];
      return field.validation ? field.validation(value) : !!value;
    });
  };

  const shouldShowPage = (pageIndex) => {
    const page = pages[pageIndex];
    if (!page.showWhen) return true;
    return formData[page.showWhen.field] === page.showWhen.value;
  };

  // Field change handler
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    // Update enrollment details for current provider in real-time
    const enrollmentFields = [
      'createEnrollmentComplete', 'providerInfoComplete', 'groupSpecialtiesChecked',
      'enrollmentTabComplete', 'providerNameCorrect', 'providerTypeCorrect',
      'applicationDateAdded', 'cancelReasonCode', 'providerAddressComplete',
      'paymentMailingAddressComplete', 'providerInfoTabComplete', 'npiTabComplete',
      'specialtyTabComplete', 'claimTypeTabComplete', 'licenseDeaTabComplete',
      'enrollOnMainframeComplete'
    ];

    if (currentEnrollingProviderIndex !== null && enrollmentFields.includes(fieldName)) {
      setEnrolledProviders(prev => {
        const updated = [...prev];
        if (updated[currentEnrollingProviderIndex]) {
          updated[currentEnrollingProviderIndex] = {
            ...updated[currentEnrollingProviderIndex],
            [fieldName]: value
          };
        }
        return updated;
      });
    }
  };

  // Unable to verify handler
  const handleUnableToVerify = async (field) => {
    const currentlyUnable = unableToVerifyFields.has(field.name);

    if (currentlyUnable) {
      // Remove from unable to verify set
      setUnableToVerifyFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(field.name);
        return newSet;
      });

      // Remove corresponding outreach note
      const noteText = `Unable to verify: ${field.label}`;
      setOutreachNotes(prev => prev.filter(note => note !== noteText));
    } else {
      // Add to unable to verify set
      setPendingUnableToVerifyField(field);
      const noteText = `Unable to verify: ${field.label}`;
      setCurrentOutreachReason(noteText);
      setShowOutreachModal(true);
    }
  };

  const confirmAddOutreachNote = () => {
    if (pendingUnableToVerifyField) {
      setUnableToVerifyFields(prev => new Set([...prev, pendingUnableToVerifyField.name]));
      setPendingUnableToVerifyField(null);
    }
    setOutreachNotes(prev => [...prev, currentOutreachReason]);
    setShowOutreachModal(false);
    setCurrentOutreachReason('');
  };

  const cancelAddOutreachNote = () => {
    setPendingUnableToVerifyField(null);
    setShowOutreachModal(false);
    setCurrentOutreachReason('');
  };

  const handleRemoveNote = (index) => {
    setOutreachNotes(prev => prev.filter((_, i) => i !== index));
  };

  const handleProviderManualNoteChange = (index, value) => {
    setProviderManualNotes(prev => ({ ...prev, [index]: value }));
  };

  // Navigation handlers - This is complex, extracted from original
  const handleNext = async () => {
    const currentPageData = pages[currentPage];

    // Handle question-20 page (Provider Info Verification)
    if (currentPageData.id === 'question-20') {
      const moreProviders = await showConfirm('Are there more providers to verify in this application?');
      const question20VerifyFields = ['ssnVerified', 'dexSanctionsCheck', 'dobVerified', 'npiVerified', 'licensesVerified', 'doctorLicenseVerified'];
      const hasUnableToVerify = question20VerifyFields.some(field => unableToVerifyFields.has(field));

      if (hasUnableToVerify || moreProviders) {
        let providerStatus = 'Verified - Ready to Enroll';
        if (formData.providerAlreadyEnrolled === 'Yes') {
          providerStatus = formData.providerInGroup === 'Yes'
            ? 'Verified - Already in the Group'
            : 'Verified - Ready to Add to Group';
        }
        if (hasUnableToVerify) {
          providerStatus = 'Unable to Verify - Requires Outreach';
        }

        const providerData = {
          status: providerStatus,
          ...formData,
          outreachNotes: [...outreachNotes]
        };

        setEnrolledProviders(prev => [...prev, providerData]);
      }

      if (moreProviders) {
        const clearedData = { ...formData };
        question20VerifyFields.forEach(field => delete clearedData[field]);
        delete clearedData.question20Answered;
        delete clearedData.providerAlreadyEnrolled;
        delete clearedData.providerInGroup;
        setFormData(clearedData);
        setUnableToVerifyFields(prev => {
          const newSet = new Set(prev);
          question20VerifyFields.forEach(field => newSet.delete(field));
          return newSet;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else if (hasUnableToVerify) {
        const completionIndex = pages.findIndex(page => page.id === 'question-20-unable-to-verify-completion');
        if (completionIndex !== -1) {
          setCurrentPage(completionIndex);
          setVisitedPages(prev => new Set([...prev, completionIndex]));
        }
        return;
      }
    }

    // Handle additional providers check for new providers
    if (currentPageData.id === 'additional-providers-check' && formData.additionalProvidersNeeded === 'Yes') {
      const nextReadyIndex = enrolledProviders.findIndex((p, idx) =>
        idx > currentEnrollingProviderIndex &&
        p.status === 'Verified - Ready to Enroll' &&
        p.providerAlreadyEnrolled === 'No'
      );

      if (nextReadyIndex !== -1) {
        setEnrolledProviders(prev => {
          const updated = [...prev];
          if (currentEnrollingProviderIndex !== null && updated[currentEnrollingProviderIndex]) {
            updated[currentEnrollingProviderIndex].status = 'Enrolled - Ready to be Added to Group';
          }
          updated[nextReadyIndex] = {
            ...updated[nextReadyIndex],
            createEnrollmentComplete: false,
            providerInfoComplete: false,
            groupSpecialtiesChecked: false
          };
          return updated;
        });

        setCurrentEnrollingProviderIndex(nextReadyIndex);
        const clearedData = { ...formData, providerEnrollmentType: 'New Provider' };
        ['createEnrollmentComplete', 'providerInfoComplete', 'groupSpecialtiesChecked', 'additionalProvidersNeeded'].forEach(
          field => delete clearedData[field]
        );
        setFormData(clearedData);

        const createEnrollmentIndex = pages.findIndex(page => page.id === 'create-enrollment');
        if (createEnrollmentIndex !== -1) {
          setCurrentPage(createEnrollmentIndex);
          setVisitedPages(prev => new Set([...prev, createEnrollmentIndex]));
        }
      }
      return;
    }

    if (isPageValid() && currentPage < pages.length - 1) {
      let nextPage = currentPage + 1;
      while (nextPage < pages.length && !shouldShowPage(nextPage)) {
        nextPage++;
      }
      if (nextPage < pages.length) {
        setCurrentPage(nextPage);
        setVisitedPages(prev => new Set([...prev, nextPage]));
      }
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      let prevPage = currentPage - 1;
      while (prevPage >= 0 && !shouldShowPage(prevPage)) {
        prevPage--;
      }
      if (prevPage >= 0) {
        setCurrentPage(prevPage);
      }
    }
  };

  const handleSubmit = async () => {
    if (isPageValid()) {
      console.log('Form submitted:', formData);
      await showAlert('Form submitted successfully! Check console for data.');
    }
  };

  // Button text logic
  const getNextButtonText = () => {
    if (currentPageData.id === 'next-provider-ready-check') {
      return 'Continue to Provider Type Selection';
    }
    if (isLastPage) {
      return 'Submit';
    }
    if (currentPageData.isCompletionPage) {
      return 'Complete';
    }
    return 'Next';
  };

  const canProceed = isPageValid();

  // Render visible fields
  const visibleFields = currentPageData.fields.filter(field => {
    if (!field.showWhen) return true;
    if (typeof field.showWhen === 'function') {
      return field.showWhen(formData);
    }
    return formData[field.showWhen.field] === field.showWhen.value;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Group Change Walkthrough
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Step {currentPage + 1} of {pages.length}</span>
            <span>•</span>
            <span className="font-medium">{currentPageData.title}</span>
          </div>
          <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-blue-600 h-full transition-all duration-300"
              style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentPageData.title}</h2>
          <p className="text-slate-600 mb-6">
            {typeof currentPageData.description === 'function'
              ? currentPageData.description(formData)
              : currentPageData.description}
          </p>

          {/* Instruction Text */}
          {currentPageData.instructionText && (
            <div className="mb-6 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r">
              <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                {currentPageData.instructionText}
              </p>
            </div>
          )}

          {/* Note Text */}
          {currentPageData.noteText && (
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r">
              <p className="text-slate-800 font-medium">{currentPageData.noteText}</p>
            </div>
          )}

          {/* Name Format Note */}
          {currentPageData.nameFormatNote && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
              <p className="text-slate-800 font-medium">{currentPageData.nameFormatNote}</p>
            </div>
          )}

          {/* Page Notes */}
          {currentPageData.pageNotes && currentPageData.pageNotes.length > 0 && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
              <ul className="space-y-2">
                {currentPageData.pageNotes.map((note, index) => (
                  <li key={index} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {currentPageData.resources && currentPageData.resources.length > 0 && (
            <div className="mb-6">
              {currentPageData.resourceText && (
                <p className="text-sm font-semibold text-slate-700 mb-2">{currentPageData.resourceText}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {currentPageData.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                  >
                    {resource.label}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Fields */}
          {visibleFields.length > 0 ? (
            <div className="space-y-6">
              {visibleFields.map(field => (
                <div key={field.name}>
                  {renderField(field, formData, handleFieldChange, unableToVerifyFields, handleUnableToVerify)}
                </div>
              ))}
            </div>
          ) : currentPageData.isCompletionPage ? (
            <div className="text-center py-12">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">All Set!</h3>
              <p className="text-slate-600">You can download your notes or start a new walkthrough.</p>
            </div>
          ) : null}

          {/* Display Image */}
          {currentPageData.displayImage && (
            <div className="mt-6">
              <button
                onClick={() => setShowImageModal(true)}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium underline"
              >
                View Reference Image →
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
            {currentPage > 0 && !currentPageData.isCompletionPage ? (
              <button
                onClick={handlePrevious}
                className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {currentPageData.isCompletionPage ? (
                <>
                  <button
                    onClick={() => handleDownloadNotes(enrolledProviders, outreachNotes, providerManualNotes)}
                    className="px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Notes
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Start New Walkthrough
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowViewNotesModal(true)}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Your Notes
                    {outreachNotes.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {outreachNotes.length}
                      </span>
                    )}
                  </button>

                  {enrolledProviders.length > 0 && (
                    <button
                      onClick={() => setShowEnrolledProvidersModal(true)}
                      className="relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Enrolled Providers
                      <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {enrolledProviders.length}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={isLastPage ? handleSubmit : handleNext}
                    disabled={!canProceed}
                    className={`btn-primary flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      canProceed
                        ? isLastPage
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {getNextButtonText()}
                    {!isLastPage && <ChevronRight className="w-4 h-4" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ImageModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        currentPageData={currentPageData}
      />
      <OutreachNotesModal
        show={showOutreachModal}
        onCancel={cancelAddOutreachNote}
        onConfirm={confirmAddOutreachNote}
        currentOutreachReason={currentOutreachReason}
      />
      <ViewNotesModal
        show={showViewNotesModal}
        onClose={() => setShowViewNotesModal(false)}
        outreachNotes={outreachNotes}
        onDownload={() => handleDownloadOutreachNotes(outreachNotes)}
        onRemoveNote={handleRemoveNote}
      />
      <EnrolledProvidersModal
        show={showEnrolledProvidersModal}
        onClose={() => setShowEnrolledProvidersModal(false)}
        enrolledProviders={enrolledProviders}
        currentEnrollingProviderIndex={currentEnrollingProviderIndex}
        currentAddingProviderIndex={currentAddingProviderIndex}
        providerManualNotes={providerManualNotes}
        onManualNoteChange={handleProviderManualNoteChange}
        onDownload={() => handleDownloadEnrolledProviders(enrolledProviders, providerManualNotes)}
      />
      <ConfirmDialog confirmDialog={confirmDialog} />
      <AlertDialog alertDialog={alertDialog} />
    </div>
  );
}

export default App;
