'use server';

import { revalidateTag } from 'next/cache';

export async function refreshArchiveStats() {
    revalidateTag('archives-stats', 'default');
    return { success: true, timestamp: Date.now() };
}

export async function refreshHomepage() {
    revalidateTag('articles', 'default');
    revalidateTag('mindmap', 'default');
    revalidateTag('activities', 'default');
    return { success: true, timestamp: Date.now() };
}
