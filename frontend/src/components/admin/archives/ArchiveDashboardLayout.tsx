import { ReactNode } from 'react';
import { AdminPageHeader } from '@/components/admin/layout';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberSaveButton } from '@/components/ui/cyber/CyberSaveButton';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { NavigationGuard } from '@/components/ui/cyber/NavigationGuard';

interface ArchiveDashboardLayoutProps {
    title: string;
    subtitle?: string;
    backHref: string;
    icon?: ReactNode;

    // Actions
    isLoading?: boolean;
    isPending?: boolean;
    onSubmit: () => void;
    onDelete?: () => void;
    isDeletePending?: boolean;
    submitLabel?: string;
    error?: Error | null;
    isDirty?: boolean;

    // Layout Slots
    stats?: ReactNode;
    sidebar?: ReactNode; // Left side (Image + Meta)
    children: ReactNode; // Right side (Main content)
    contentClassName?: string;
}

export function ArchiveDashboardLayout({
    title,
    subtitle,
    backHref,
    icon,
    isLoading,
    isPending,
    onSubmit,
    onDelete,
    isDeletePending,
    submitLabel = 'SAVE CHANGES',
    error,
    isDirty = false,
    stats,
    sidebar,
    children,
    contentClassName
}: ArchiveDashboardLayoutProps) {
    if (isLoading) {
        return <div className="p-8 text-cyan-500 animate-pulse font-mono">LOADING_ARCHIVE_DATA...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <NavigationGuard hasChanges={isDirty} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={backHref} className="text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-zinc-500 mb-1">
                            {icon}
                            <span className="text-xs font-mono uppercase tracking-widest">{title}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{subtitle}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {onDelete && (
                        <CyberButton
                            onClick={onDelete}
                            variant="danger"
                            disabled={isDeletePending}
                            className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                            size="lg"
                        >
                            <Trash2 size={16} />
                        </CyberButton>
                    )}
                    <CyberSaveButton
                        isDirty={isDirty}
                        isSaving={isPending || false}
                        onClick={onSubmit}
                        label={typeof submitLabel === 'string' ? submitLabel : 'SAVE CHANGES'}
                        savedLabel={typeof submitLabel === 'string' ? submitLabel : 'SAVE CHANGES'}
                        size="lg"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-950/30 border border-red-500/30 text-red-400 p-4 rounded-lg font-mono text-sm">
                    ERROR: {error.message}
                </div>
            )}

            {/* Stats Row */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats}
                </div>
            )}

            {/* Main Layout Split */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Sidebar (Image + Meta) */}
                <div className="md:col-span-4 space-y-6">
                    {sidebar}
                </div>

                {/* Right Content (Main Form) */}
                <div className={cn("md:col-span-8 bg-slate-900/40 border border-white/5 rounded-xl p-8 space-y-8", contentClassName)}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function DashboardStatCard({ label, value, icon, colorClass = "text-violet-400 bg-violet-400/10", className }: { label: string, value: string | number | undefined, icon: ReactNode, colorClass?: string, className?: string }) {
    return (
        <div className={cn("bg-slate-900/40 border border-white/5 rounded-lg p-5 flex items-center justify-between hover:border-white/10 transition-colors group", className)}>
            <div>
                <p className="text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-1 rounded w-fit font-mono tracking-widest uppercase mb-2 group-hover:text-violet-200 transition-colors">{label}</p>
                <p className="text-xl font-bold text-white">{value || '-'}</p>
            </div>
            <div className={cn("p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform duration-300", colorClass)}>
                {icon}
            </div>
        </div>
    );
}
