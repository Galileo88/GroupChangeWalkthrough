/**
 * Dialog utility functions for custom confirm and alert dialogs
 */

export const createDialogHelper = (setConfirmDialog, setAlertDialog) => {
  const showConfirm = (message) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        show: true,
        message,
        onConfirm: () => {
          setConfirmDialog({ show: false, message: '', onConfirm: null, onCancel: null });
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog({ show: false, message: '', onConfirm: null, onCancel: null });
          resolve(false);
        }
      });
    });
  };

  const showAlert = (message) => {
    return new Promise((resolve) => {
      setAlertDialog({
        show: true,
        message,
        onClose: () => {
          setAlertDialog({ show: false, message: '', onClose: null });
          resolve();
        }
      });
    });
  };

  return { showConfirm, showAlert };
};
