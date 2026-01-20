'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function NavigationGuard({ hasChanges }: { hasChanges: boolean }) {
    const router = useRouter();
    const pathname = usePathname();

    const currentPathRef = useRef(pathname);

    useEffect(() => {
        currentPathRef.current = pathname;
    }, [pathname]);

    useEffect(() => {
        if (!hasChanges) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/') && href !== currentPathRef.current) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                        router.push(href);
                    }
                }
            }
        };

        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, [hasChanges, router]);

    return null;
}
