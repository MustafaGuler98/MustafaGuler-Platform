'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { CyberButton } from '../ui/CyberButton';
import {
    FileText,
    FolderTree,
    Image,
    LogOut,
    ChevronDown,
    ChevronRight,
    Grid,
    Settings,
    Mail,
    Users
} from 'lucide-react';

interface NavItemType {
    href: string;
    icon: React.ReactNode;
    label: string;
    children?: NavItemType[];
}

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    indent?: boolean;
}

function NavItem({ href, icon, label, isActive, indent }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded transition-all duration-100',
                'font-mono text-xs tracking-widest uppercase',
                indent && 'ml-4 text-[10px]',
                isActive
                    ? 'text-cyan-neon border-l-2 border-cyan-neon bg-gradient-to-r from-cyan-neon/15 via-transparent to-transparent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50 hover:border-l-2 hover:border-primary/50'
            )}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

interface NavSectionProps {
    item: NavItemType;
    isActive: (href: string) => boolean;
}

function NavSection({ item, isActive }: NavSectionProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;

    useEffect(() => {
        if (hasChildren) {
            const isChildActive = item.children!.some(child => pathname.startsWith(child.href));
            if (active || isChildActive) {
                setIsOpen(true);
            }
        }
    }, [active, hasChildren, item.children, pathname]);

    if (!hasChildren) {
        return (
            <NavItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={active}
            />
        );
    }

    return (
        <div>
            <div className="flex items-center">
                <Link
                    href={item.href}
                    className={cn(
                        'flex-1 flex items-center gap-3 px-4 py-3 rounded-l transition-all duration-100',
                        'font-mono text-xs tracking-widest uppercase',
                        active
                            ? 'text-cyan-neon border-l-2 border-cyan-neon bg-gradient-to-r from-cyan-neon/15 via-transparent to-transparent'
                            : 'text-muted-foreground hover:text-foreground hover:bg-card/50 hover:border-l-2 hover:border-primary/50'
                    )}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'p-3 rounded-r transition-all duration-100',
                        'text-muted-foreground hover:text-cyan-neon hover:bg-card/50'
                    )}
                    aria-label={isOpen ? 'Collapse submenu' : 'Expand submenu'}
                >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
            </div>
            {isOpen && (
                <div className="mt-1 space-y-1">
                    {item.children!.map((child) => (
                        <NavItem
                            key={child.href}
                            href={child.href}
                            icon={child.icon}
                            label={child.label}
                            isActive={isActive(child.href)}
                            indent
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const navItems: NavItemType[] = [
        { href: '/admin', icon: <Grid size={16} />, label: 'DASHBOARD' },
        { href: '/admin/articles', icon: <FileText size={16} />, label: 'ARTICLES' },
        { href: '/admin/categories', icon: <FolderTree size={16} />, label: 'CATEGORIES' },
        { href: '/admin/images', icon: <Image size={16} />, label: 'IMAGES' },
        {
            href: '/admin/contact',
            icon: <Mail size={16} />,
            label: 'CONTACT',
            children: [
                { href: '/admin/contact/subscribers', icon: <Users size={16} />, label: 'SUBSCRIBERS' },
            ]
        },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname === href || pathname.startsWith(href + '/');
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
                    <NavSection
                        key={item.href}
                        item={item}
                        isActive={isActive}
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
