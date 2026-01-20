'use server';

import { revalidateTag } from 'next/cache';

export async function refreshArchiveStats() {
    revalidateTag('archives-stats', 'default');
    return { success: true, timestamp: Date.now() };
}
