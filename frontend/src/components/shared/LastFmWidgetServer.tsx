import { cookies } from "next/headers";
import { LastFmWidget } from "./LastFmWidget";
import type { MusicStatus } from "./lastfm-types";

const LASTFM_STATUS_COOKIE = "lastfm_status_v1";
const COOKIE_TTL_MS = 2 * 60 * 1000;

type LastFmCookiePayload = {
    cachedAt: number;
    status: MusicStatus;
};

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

function parseCookiePayload(raw: string | undefined): LastFmCookiePayload | null {
    if (!raw) return null;
    try {
        const decoded = decodeURIComponent(raw);
        const parsed = JSON.parse(decoded) as Partial<LastFmCookiePayload>;
        if (typeof parsed.cachedAt !== "number") return null;
        if (!isMusicStatus(parsed.status)) return null;
        return { cachedAt: parsed.cachedAt, status: parsed.status };
    } catch {
        return null;
    }
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
    const cookieStore = await cookies();
    const payload = parseCookiePayload(cookieStore.get(LASTFM_STATUS_COOKIE)?.value);
    const now = Date.now();
    const cachedStatus = payload && (now - payload.cachedAt) < COOKIE_TTL_MS ? payload.status : null;

    const fetchedStatus = await fetchInitialStatus();

    const initialStatus = cachedStatus ?? fetchedStatus;

    return <LastFmWidget initialStatus={initialStatus} />;
}
