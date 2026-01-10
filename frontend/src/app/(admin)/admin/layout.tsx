'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { AdminShell } from '@/components/admin/layout/AdminShell';

export default function AdminSubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <QueryProvider>
                <AdminShell>
                    {children}
                </AdminShell>
            </QueryProvider>
        </AuthProvider>
    );
}
