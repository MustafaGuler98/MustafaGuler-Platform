'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import {
    FileText,
    FolderTree,
    Image,
    LogOut,
    Grid,
    Mail,
    Users,
    Archive,
    Film,
    BookOpen,
    Quote,
    Tv,
    MonitorPlay,
    Gamepad2,
    Headphones,
    Dices,
    Star,
    ChevronLeft,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItemType {
    href: string;
    icon: React.ReactNode;
    label: string;
    children?: NavItemType[];
}

interface AdminSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

function NavItem({
    item,
    isActive,
    indent = false
}: {
    item: NavItemType;
    isActive: boolean;
    indent?: boolean;
}) {
    return (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors duration-200',
                'font-mono text-xs tracking-widest uppercase',
                indent && 'ml-8 text-[10px]',
                isActive
                    ? 'bg-violet-500/10 border-y border-r border-violet-500/20 border-l-2 border-l-violet-500 text-white shadow-[inset_10px_0_20px_-10px_rgba(139,92,246,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            )}
        >
            <span className={cn(isActive ? 'text-violet-400 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]' : 'text-slate-500')}>
                {item.icon}
            </span>
            <span>{item.label}</span>
        </Link>
    );
}

// Collapsible Nav Section
function NavSection({
    item,
    isActive
}: {
    item: NavItemType;
    isActive: (href: string) => boolean;
}) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isChildActive = hasChildren && item.children!.some(child => pathname.startsWith(child.href));

    useEffect(() => {
        if (active || isChildActive) {
            setIsOpen(true);
        }
    }, [active, isChildActive]);

    if (!hasChildren) {
        return <NavItem item={item} isActive={active} />;
    }

    return (
        <div className="space-y-1">
            <div className="flex items-center mx-2">
                <Link
                    href={item.href}
                    className={cn(
                        'flex-1 flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200',
                        'font-mono text-xs tracking-widest uppercase',
                        (active || isChildActive)
                            ? 'bg-violet-500/10 border-y border-r border-violet-500/20 border-l-2 border-l-violet-500 text-white shadow-[inset_10px_0_20px_-10px_rgba(139,92,246,0.3)]'
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    )}
                >
                    <span className={cn((active || isChildActive) ? 'text-violet-400 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]' : 'text-slate-500')}>
                        {item.icon}
                    </span>
                    <span>{item.label}</span>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
            </div>

            {isOpen && (
                <div className="space-y-1 ml-2">
                    {item.children!.map((child) => (
                        <NavItem
                            key={child.href}
                            item={child}
                            isActive={isActive(child.href)}
                            indent
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function AdminSidebar({ isCollapsed, toggleSidebar }: AdminSidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navItems: NavItemType[] = [
        { href: '/admin', icon: <Grid size={16} />, label: 'DASHBOARD' },
        { href: '/admin/articles', icon: <FileText size={16} />, label: 'ARTICLES' },
        { href: '/admin/categories', icon: <FolderTree size={16} />, label: 'CATEGORIES' },
        { href: '/admin/images', icon: <Image size={16} />, label: 'IMAGES' },
        { href: '/admin/activity', icon: <Star size={16} />, label: 'ACTIVITY' },
        {
            href: '/admin/archives',
            icon: <Archive size={16} />,
            label: 'ARCHIVES',
            children: [
                { href: '/admin/archives/movies', icon: <Film size={16} />, label: 'MOVIES' },
                { href: '/admin/archives/books', icon: <BookOpen size={16} />, label: 'BOOKS' },
                { href: '/admin/archives/quotes', icon: <Quote size={16} />, label: 'QUOTES' },
                { href: '/admin/archives/tvseries', icon: <Tv size={16} />, label: 'TV SERIES' },
                { href: '/admin/archives/anime', icon: <MonitorPlay size={16} />, label: 'ANIME' },
                { href: '/admin/archives/games', icon: <Gamepad2 size={16} />, label: 'GAMES' },
                { href: '/admin/archives/music', icon: <Headphones size={16} />, label: 'MUSIC' },
                { href: '/admin/archives/ttrpg', icon: <Dices size={16} />, label: 'TTRPG' },
            ]
        },
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
        <aside
            className={cn(
                // Solid background to avoid overlay issues
                "fixed left-0 top-0 h-screen z-[99] transition-[width] duration-300 flex flex-col",
                "bg-slate-950 border-r border-white/10",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className={cn(
                "flex items-center h-16 border-b border-white/10",
                isCollapsed ? "justify-center px-2" : "justify-between px-5"
            )}>
                {!isCollapsed && (
                    <Link href="/admin" className="group flex items-center gap-3">
                        {/* Logo Icon */}
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                            <span className="font-mono text-violet-400 font-bold text-sm">T</span>
                        </div>
                        {/* Title */}
                        <div>
                            <h1 className="font-mono text-sm font-medium tracking-wider text-white group-hover:text-violet-300 transition-colors">
                                ADMIN PANEL
                            </h1>
                            <p className="font-mono text-[9px] text-slate-500 tracking-widest">TERMINAL V1</p>
                        </div>
                    </Link>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-slate-500 hover:text-violet-400 transition-colors rounded-lg hover:bg-violet-500/10"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto space-y-1">
                {!isCollapsed ? (
                    navItems.map((item) => (
                        <NavSection key={item.href} item={item} isActive={isActive} />
                    ))
                ) : (
                    navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg transition-all duration-200',
                                isActive(item.href)
                                    ? 'text-violet-400 bg-violet-500/10 border border-violet-500/20'
                                    : 'text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 border border-transparent'
                            )}
                            title={item.label}
                        >
                            {item.icon}
                        </Link>
                    ))
                )}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                {isCollapsed ? (
                    <button
                        onClick={logout}
                        className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                ) : (
                    <CyberButton variant="danger" size="sm" fullWidth onClick={logout}>
                        <LogOut size={14} className="mr-2" />
                        LOGOUT
                    </CyberButton>
                )}
            </div>
        </aside>
    );
}
