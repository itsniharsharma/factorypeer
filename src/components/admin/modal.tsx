"use client";

import React from "react";

type AdminModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Wide layout for complex forms */
  wide?: boolean;
};

export function AdminModal({ open, title, onClose, children, footer, wide }: AdminModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="admin-modal-title"
    >
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-sm bg-white p-6 shadow-lg ${wide ? "max-w-3xl" : "max-w-lg"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="admin-modal-title" className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
        {footer ?? (
          <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              className="rounded-sm border border-slate-200 px-3 py-2 text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
