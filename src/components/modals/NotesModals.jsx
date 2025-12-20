import { X } from '../icons/Icons';

export const OutreachNotesModal = ({ show, onCancel, onConfirm, currentOutreachReason }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="relative max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onCancel}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <span>Close</span>
          <X className="w-6 h-6" />
        </button>
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Add Outreach Note</h2>
              <p className="text-slate-600 text-sm">This outreach reason will be added to your notes list.</p>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-slate-800 font-medium leading-relaxed">{currentOutreachReason}</p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-lg"
            >
              Add to Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ViewNotesModal = ({ show, onClose, outreachNotes, onDownload, onRemoveNote }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="relative max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <span>Close</span>
          <X className="w-6 h-6" />
        </button>
        <div className="bg-white rounded-xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-amber-100 rounded-full p-3">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Outreach Notes</h2>
              <p className="text-slate-600">Review and manage your accumulated outreach reasons.</p>
            </div>
          </div>

          {outreachNotes.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Notes Yet</h3>
              <p className="text-slate-500">
                When you encounter outreach messages, click "Add to Notes" to track them here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {outreachNotes.map((note, index) => (
                <div key={index} className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start gap-3 group hover:border-blue-300 transition-all">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <p className="flex-1 text-slate-800 font-medium leading-relaxed">{note}</p>
                  <button
                    onClick={() => onRemoveNote(index)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg p-2 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove this note"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={onDownload}
              className="px-6 py-3 rounded-lg font-semibold text-amber-700 bg-white border-2 border-amber-500 hover:bg-amber-50 transition-all hover:shadow-lg flex items-center gap-2"
              disabled={outreachNotes.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Notes
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
