'use client';

import { useEffect, useState } from 'react';
import { Quote, Book, Film, Music, RefreshCw } from 'lucide-react';
import type { Quote as QuoteType } from '@/types/archives';
import { fetchApi } from '@/lib/api-client';

interface SidebarWidgetProps {
    className?: string;
}

// Random Quote Widget for Blog Sidebar
export function BlogQuoteWidget({ className }: SidebarWidgetProps) {
    const [quote, setQuote] = useState<QuoteType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchQuote = async () => {
        setIsLoading(true);
        try {
            const response = await fetchApi<QuoteType>('/archives/quotes/random');
            if (response?.isSuccess && response?.data) {
                setQuote(response.data);
            }
        } catch { /* silent */ }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchQuote(); }, []);

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 tracking-widest uppercase">
                    <Quote className="w-3 h-3" />
                    <span>Quote</span>
                </div>
                <button onClick={fetchQuote} disabled={isLoading} className="text-slate-500 hover:text-cyan-neon transition-colors">
                    <RefreshCw size={10} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>
            <div className="p-4 rounded-lg border border-cyan-500/30 bg-slate-900/40 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.08)]">
                {quote ? (
                    <>
                        <p className="font-mono text-[11px] text-gray-300 leading-relaxed italic">
                            "{quote.content}"
                        </p>
                        <p className="font-mono text-[9px] text-slate-400/60 mt-2 text-right">
                            — {quote.author}
                        </p>
                    </>
                ) : (
                    <p className="font-mono text-[11px] text-gray-500 italic">No quotes yet...</p>
                )}
            </div>
        </div>
    );
}

// Book Widget
export function BlogBookWidget({ className }: SidebarWidgetProps) {
    const [book, setBook] = useState<{ title: string; author: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetchApi<{ title: string; subtitle?: string }>('/archives/spotlight/public/Book');
                if (response?.isSuccess && response?.data) {
                    setBook({
                        title: response.data.title,
                        author: response.data.subtitle || ''
                    });
                }
            } catch { /* silent */ }
            finally { setIsLoading(false); }
        };
        fetchBook();
    }, []);

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-widest uppercase">
                <Book className="w-3 h-3" />
                <span>Book of the Month</span>
            </div>
            <div className="p-3 rounded-lg border border-amber-500/15 bg-amber-950/10">
                {book ? (
                    <>
                        <p className="font-mono text-[11px] text-gray-200 font-medium">{book.title}</p>
                        <p className="font-mono text-[9px] text-amber-400/60">{book.author}</p>
                    </>
                ) : (
                    <p className="font-mono text-[11px] text-gray-500 italic">{isLoading ? 'Loading...' : 'Coming soon...'}</p>
                )}
            </div>
        </div>
    );
}

// Film Widget
export function BlogFilmWidget({ className }: SidebarWidgetProps) {
    const [movie, setMovie] = useState<{ title: string; year?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetchApi<{ title: string; subtitle?: string }>('/archives/spotlight/public/Movie');
                if (response?.isSuccess && response?.data) {
                    setMovie({ title: response.data.title, year: response.data.subtitle });
                }
            } catch { /* silent */ }
            finally { setIsLoading(false); }
        };
        fetchMovie();
    }, []);

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 tracking-widest uppercase">
                <Film className="w-3 h-3" />
                <span>Film of the Week</span>
            </div>
            <div className="p-3 rounded-lg border border-purple-500/15 bg-purple-950/10">
                {movie ? (
                    <>
                        <p className="font-mono text-[11px] text-gray-200 font-medium">{movie.title}</p>
                        {movie.year && <p className="font-mono text-[9px] text-purple-400/60">{movie.year}</p>}
                    </>
                ) : (
                    <p className="font-mono text-[11px] text-gray-500 italic">{isLoading ? 'Loading...' : 'Coming soon...'}</p>
                )}
            </div>
        </div>
    );
}

// Music Widget
export function BlogMusicWidget({ className }: SidebarWidgetProps) {
    const [music, setMusic] = useState<{ title: string; artist: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await fetchApi<{ title: string; subtitle?: string }>('/archives/spotlight/public/Music');
                if (response?.isSuccess && response?.data) {
                    setMusic({ title: response.data.title, artist: response.data.subtitle || '' });
                }
            } catch { /* silent */ }
            finally { setIsLoading(false); }
        };
        fetchMusic();
    }, []);

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center gap-2 text-xs font-mono text-pink-400 tracking-widest uppercase">
                <Music className="w-3 h-3" />
                <span>Song of the Day</span>
            </div>
            <div className="p-3 rounded-lg border border-pink-500/15 bg-pink-950/10">
                {music ? (
                    <>
                        <p className="font-mono text-[11px] text-gray-200 font-medium">{music.title}</p>
                        <p className="font-mono text-[9px] text-pink-400/60">{music.artist}</p>
                    </>
                ) : (
                    <p className="font-mono text-[11px] text-gray-500 italic">{isLoading ? 'Loading...' : 'Coming soon...'}</p>
                )}
            </div>
        </div>
    );
}
