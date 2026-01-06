'use client';

import { AuthProvider } from '@/contexts/AuthContext';

export default function AdminSubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider>{children}</AuthProvider>;
}
