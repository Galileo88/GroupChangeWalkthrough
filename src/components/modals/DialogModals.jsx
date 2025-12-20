/**
 * Custom Confirmation and Alert Dialog Modals
 */

export const ConfirmDialog = ({ confirmDialog }) => {
  if (!confirmDialog.show) return null;

  return (
    <div className="modal-overlay" onClick={confirmDialog.onCancel}>
      <div className="relative max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-slate-800 text-white rounded-xl p-6 shadow-2xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">This page says</h3>
          <p className="text-slate-200 mb-6 whitespace-pre-line leading-relaxed">
            {confirmDialog.message}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={confirmDialog.onCancel}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors font-medium"
            >
              No
            </button>
            <button
              onClick={confirmDialog.onConfirm}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
              autoFocus
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AlertDialog = ({ alertDialog }) => {
  if (!alertDialog.show) return null;

  return (
    <div className="modal-overlay" onClick={alertDialog.onClose}>
      <div className="relative max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-slate-800 text-white rounded-xl p-6 shadow-2xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">This page says</h3>
          <p className="text-slate-200 mb-6 whitespace-pre-line leading-relaxed">
            {alertDialog.message}
          </p>
          <div className="flex justify-end">
            <button
              onClick={alertDialog.onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
              autoFocus
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
