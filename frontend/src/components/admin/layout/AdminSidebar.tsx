'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { CyberButton } from '../ui/CyberButton';
import {
    LayoutDashboard,
    FileText,
    FolderTree,
    Image,
    LogOut,
    ChevronRight,
    Grid,
    Settings
} from 'lucide-react';

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded transition-all duration-300',
                'font-mono text-xs tracking-widest uppercase',
                isActive
                    ? 'bg-cyan-neon/10 text-cyan-neon border-l-2 border-cyan-neon shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50 hover:border-l-2 hover:border-primary/50'
            )}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const navItems = [
        { href: '/admin', icon: <Grid size={16} />, label: 'DASHBOARD' },
        { href: '/admin/articles', icon: <FileText size={16} />, label: 'ARTICLES' },
        { href: '/admin/categories', icon: <FolderTree size={16} />, label: 'CATEGORIES' },
        { href: '/admin/images', icon: <Image size={16} />, label: 'IMAGES' },
    ];

    const footerItems = [
        { href: '/admin/settings', icon: <Settings size={16} />, label: 'SETTINGS' },
        {
            onClick: async () => {
                await logout();
                router.push('/admin/login');
            },
            icon: <LogOut size={16} />,
            label: 'LOGOUT',
            variant: 'danger',
        },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0118]/95 border-r border-primary/40 backdrop-blur-md z-40">
            {/* Logo / Title */}
            <div className="p-6 border-b border-primary/40">
                <Link href="/admin" className="block">
                    <h1 className="font-heading text-xl text-cyan-neon tracking-wider">
                        ADMIN_PANEL
                    </h1>
                    <p className="font-mono text-[10px] text-muted-foreground tracking-widest mt-1 uppercase">
                        TERMINAL v1
                    </p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        isActive={isActive(item.href)}
                    />
                ))}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 w-full p-4 border-t border-primary/40">
                <CyberButton
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={logout}
                >
                    <LogOut size={14} className="mr-2" />
                    LOGOUT
                </CyberButton>
            </div>
        </aside>
    );
}
