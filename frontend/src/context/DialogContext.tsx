import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface DialogConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'confirm';
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogContextValue {
  showAlert: (message: string, title?: string, type?: 'info' | 'warning' | 'error') => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    title?: string,
    confirmText?: string,
    cancelText?: string
  ) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: 'Cancel',
  });

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback(
    (message: string, title = 'Notice', type: 'info' | 'warning' | 'error' = 'info') => {
      setDialog({
        isOpen: true,
        title,
        message,
        type,
        confirmText: 'Dismiss',
        cancelText: '',
        onConfirm: () => closeDialog(),
      });
    },
    [closeDialog]
  );

  const showConfirm = useCallback(
    (
      message: string,
      onConfirm: () => void,
      title = 'Confirm Action',
      confirmText = 'Confirm',
      cancelText = 'Cancel'
    ) => {
      setDialog({
        isOpen: true,
        title,
        message,
        type: 'confirm',
        confirmText,
        cancelText,
        onConfirm: () => {
          onConfirm();
          closeDialog();
        },
        onCancel: () => closeDialog(),
      });
    },
    [closeDialog]
  );

  const getIcon = () => {
    switch (dialog.type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-700" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-700" />;
      case 'confirm':
        return <AlertCircle className="w-5 h-5 text-stone-700" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-stone-700" />;
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, closeDialog }}>
      {children}

      {/* Custom Notion-Styled Modal Dialog */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={closeDialog}
          />

          {/* Dialog Container */}
          <div className="relative bg-white rounded-xl shadow-xl border border-stone-200 max-w-md w-full p-4 sm:p-6 animate-in zoom-in-95 duration-150 flex flex-col space-y-3.5 sm:space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200/80">
                  {getIcon()}
                </div>
                <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 tracking-tight truncate">
                  {dialog.title}
                </h3>
              </div>
              <button
                onClick={closeDialog}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-md transition-colors shrink-0"
                title="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans whitespace-pre-line">
              {dialog.message}
            </p>

            <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5">
              {dialog.cancelText && (
                <button
                  type="button"
                  onClick={() => {
                    dialog.onCancel?.();
                    closeDialog();
                  }}
                  className="w-full sm:w-auto px-4 py-2 sm:py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors text-center justify-center"
                >
                  {dialog.cancelText}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  dialog.onConfirm?.();
                  closeDialog();
                }}
                className={`w-full sm:w-auto px-4 py-2 sm:py-1.5 text-xs font-medium text-white rounded-lg transition-colors shadow-2xs text-center justify-center ${
                  dialog.type === 'error' || dialog.confirmText.toLowerCase() === 'delete'
                    ? 'bg-rose-700 hover:bg-rose-800'
                    : 'bg-stone-900 hover:bg-stone-800'
                }`}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextValue => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
