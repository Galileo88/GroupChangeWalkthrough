import { X } from '../icons/Icons';

export const EnrolledProvidersModal = ({
  show,
  onClose,
  enrolledProviders,
  currentEnrollingProviderIndex,
  currentAddingProviderIndex,
  providerManualNotes,
  onManualNoteChange,
  onDownload
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <span>Close</span>
          <X className="w-6 h-6" />
        </button>
        <div className="bg-white rounded-xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Enrolled Providers</h2>
              <p className="text-slate-600">Review the providers you have successfully enrolled ({enrolledProviders.length} total).</p>
            </div>
          </div>

          <div className="space-y-4">
            {enrolledProviders.map((provider, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${
                  index === currentEnrollingProviderIndex
                    ? 'from-blue-50 to-indigo-50 border-2 border-blue-400 ring-2 ring-blue-300'
                    : 'from-green-50 to-emerald-50 border-2 border-green-200'
                } rounded-lg p-6 hover:border-green-300 transition-all`}
              >
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`${
                        index === currentEnrollingProviderIndex ? 'bg-blue-500' : 'bg-green-500'
                      } text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold`}
                    >
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Provider {index + 1}
                      {index === currentEnrollingProviderIndex && (
                        <span className="ml-2 text-sm font-normal text-blue-600">(Currently Enrolling)</span>
                      )}
                      {index === currentAddingProviderIndex && (
                        <span className="ml-2 text-sm font-normal text-green-600">(Currently Being Added to Group)</span>
                      )}
                    </h3>
                  </div>
                  <div className="ml-11">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                        provider.status === 'Complete - Enrolled and Added to Group'
                          ? 'bg-emerald-600 text-white'
                          : provider.status === 'Enrolled - Ready to be Added to Group'
                          ? 'bg-green-500 text-white'
                          : provider.status === 'Verified - Ready to Enroll'
                          ? 'bg-blue-500 text-white'
                          : provider.status === 'Verified - Ready to Add to Group'
                          ? 'bg-indigo-500 text-white'
                          : provider.status === 'Verified - Already in the Group'
                          ? 'bg-gray-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}
                    >
                      {provider.status || 'Verified - Ready to Enroll'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-700">
                      <span className="font-semibold">Enrollment Created:</span> {provider.createEnrollmentComplete ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-700">
                      <span className="font-semibold">Provider Info:</span> {provider.providerInfoComplete ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-700">
                      <span className="font-semibold">Group Specialties:</span> {provider.groupSpecialtiesChecked ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-700">
                      <span className="font-semibold">Mainframe Enrollment:</span> {provider.enrollOnMainframeComplete ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-green-200">
                  <details className="cursor-pointer">
                    <summary className="text-sm font-semibold text-green-700 hover:text-green-800">
                      View All Details
                    </summary>
                    <div className="mt-3 pl-4 space-y-2 text-sm text-slate-600">
                      <div>• Enrollment Tab: {provider.enrollmentTabComplete ? '✓' : '✗'}</div>
                      <div>• Provider Name: {provider.providerNameCorrect ? '✓' : '✗'}</div>
                      <div>• Provider Type: {provider.providerTypeCorrect ? '✓' : '✗'}</div>
                      <div>• Application Date: {provider.applicationDateAdded ? '✓' : '✗'}</div>
                      <div>• Cancel Reason Code: {provider.cancelReasonCode ? '✓' : '✗'}</div>
                      <div>• Provider Address: {provider.providerAddressComplete ? '✓' : '✗'}</div>
                      <div>• Payment/Mailing Address: {provider.paymentMailingAddressComplete ? '✓' : '✗'}</div>
                      <div>• Provider Info Tab: {provider.providerInfoTabComplete ? '✓' : '✗'}</div>
                      <div>• NPI Tab: {provider.npiTabComplete ? '✓' : '✗'}</div>
                      <div>• Specialty Tab: {provider.specialtyTabComplete ? '✓' : '✗'}</div>
                      <div>• Claim Type Tab: {provider.claimTypeTabComplete ? '✓' : '✗'}</div>
                      <div>• License/DEA Tab: {provider.licenseDeaTabComplete ? '✓' : '✗'}</div>
                    </div>
                  </details>
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <label htmlFor={`manual-note-${index}`} className="text-sm font-semibold text-indigo-800">
                      Manual Notes
                    </label>
                  </div>
                  <textarea
                    id={`manual-note-${index}`}
                    value={providerManualNotes[index] || ''}
                    onChange={(e) => onManualNoteChange(index, e.target.value)}
                    placeholder="Add any additional notes about this provider..."
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm text-slate-700 placeholder-slate-400 resize-none"
                    rows="3"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={onDownload}
              className="px-6 py-3 rounded-lg font-semibold text-green-700 bg-white border-2 border-green-500 hover:bg-green-50 transition-all hover:shadow-lg flex items-center gap-2"
              disabled={enrolledProviders.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Providers
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
