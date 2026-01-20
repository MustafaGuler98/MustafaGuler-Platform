'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { ToastProvider } from '@/components/ui/cyber/Toast';

export default function AdminSubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <QueryProvider>
                <ToastProvider>
                    <AdminShell>
                        {children}
                    </AdminShell>
                </ToastProvider>
            </QueryProvider>
        </AuthProvider>
    );
}

