import React from 'react';
import AdminSidebar from './sidebar';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-[1200px]">
        <AdminSidebar />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminShell;
