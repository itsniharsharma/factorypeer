import React from 'react';

interface PlaceholderModalProps {
  title?: string;
  children?: React.ReactNode;
}

export function PlaceholderModal({ title = 'Modal', children }: PlaceholderModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[700px] max-w-full rounded-sm bg-white p-6">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="mt-4">{children ?? <p className="text-sm text-slate-600">Form placeholder</p>}</div>
        <div className="mt-6 flex justify-end">
          <button className="mr-2 rounded-sm border px-3 py-2">Cancel</button>
          <button className="rounded-sm bg-brand px-3 py-2 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderModal;
