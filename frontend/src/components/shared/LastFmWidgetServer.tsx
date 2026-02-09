import { LastFmWidget } from "./LastFmWidget";
import type { MusicStatus } from "./lastfm-types";

function isMusicStatus(value: unknown): value is MusicStatus {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Partial<MusicStatus>;
    return typeof candidate.isPlaying === "boolean"
        && typeof candidate.title === "string"
        && candidate.title.length > 0
        && typeof candidate.artist === "string"
        && candidate.artist.length > 0
        && typeof candidate.lastPlayedAt === "string";
}

function getBaseCandidates(): string[] {
    const raw = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5281";
    const base = raw.endsWith("/") ? raw.slice(0, -1) : raw;

    return [
        `${base}/music-status.json`,
        `${base}/live-status/music-status.json`,
    ];
}

async function fetchInitialStatus(): Promise<MusicStatus | null> {
    const candidates = getBaseCandidates();

    for (const url of candidates) {
        try {
            const response = await fetch(url, {
                next: { revalidate: 60, tags: ["lastfm-status"] },
            });

            if (!response.ok) continue;

            const data = (await response.json()) as unknown;
            if (!isMusicStatus(data)) continue;
            return data;
        } catch {
            // Try next candidate.
        }
    }

    return null;
}

export async function LastFmWidgetServer() {
    const initialStatus = await fetchInitialStatus();

    return <LastFmWidget initialStatus={initialStatus} />;
}
