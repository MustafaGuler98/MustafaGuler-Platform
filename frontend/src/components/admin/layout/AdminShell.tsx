'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { cn } from '@/lib/utils';

interface AdminShellProps {
    children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Sidebar */}
            <AdminSidebar
                isCollapsed={isCollapsed}
                toggleSidebar={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Main Content Area */}
            <div className={cn(
                "transition-all duration-300",
                isCollapsed ? "ml-20" : "ml-64"
            )}>
                <AdminHeader />
                <main className="px-6 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
