import React from 'react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'キャンセル'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3 className="dialog-title">{title}</h3>
        </div>
        <div className="dialog-body">
          <p className="dialog-message">{message}</p>
        </div>
        <div className="dialog-footer">
          <button className="dialog-button cancel-button" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="dialog-button confirm-button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
