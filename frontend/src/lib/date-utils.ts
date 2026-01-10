export const DATE_FORMATS = {
    DEFAULT: { day: '2-digit', month: '2-digit', year: 'numeric' } as const,

    LONG: { day: 'numeric', month: 'long', year: 'numeric' } as const,

    TIME_ONLY: { hour: '2-digit', minute: '2-digit' } as const,

    SHORT: { day: '2-digit', month: '2-digit' } as const,

    DATETIME_SHORT: { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' } as const,
} as const;

const DEFAULT_LOCALE = 'en-US';

/**
 * Formats a date for terminal-style display
 * @param date - ISO string or Date object
 * @param options - Intl.DateTimeFormat options
 * @param locale - Locale code
 * @returns Formatted date string or 'N/A'
 */
export function formatTerminalDate(
    date: string | Date | null | undefined,
    options: Intl.DateTimeFormatOptions = DATE_FORMATS.DEFAULT,
    locale: string = DEFAULT_LOCALE
): string {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
            return 'N/A';
        }

        return new Intl.DateTimeFormat(locale, options).format(dateObj);
    } catch {
        return 'N/A';
    }
}

/**
 * Formats date and time in [MM.DD HH:MM] format
 * @param date - ISO string or Date object
 */
export function formatTerminalDateTime(date: string | Date | null | undefined): string {
    if (!date) return '[N/A]';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
            return '[N/A]';
        }

        const shortDate = new Intl.DateTimeFormat(DEFAULT_LOCALE, DATE_FORMATS.SHORT).format(dateObj);
        const time = new Intl.DateTimeFormat(DEFAULT_LOCALE, DATE_FORMATS.TIME_ONLY).format(dateObj);

        return `[${shortDate} ${time}]`;
    } catch {
        return '[N/A]';
    }
}
