'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    // Redirect to admin if already authenticated (handles expired access token + valid refresh token case)
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/admin');
        }
    }, [isAuthenticated, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await authService.login({ email, password });

        if (result.isSuccess) {
            window.location.href = '/admin';
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-start justify-center pt-24 footer-grid-pattern">
            {/* Login Card */}
            <div className="w-full max-w-md mx-4">
                <div className="backdrop-blur-md bg-[#0a0118]/90 border border-primary/40 rounded-lg p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-heading text-3xl text-cyan-neon tracking-wider mb-2">
                            SYSTEM ACCESS
                        </h1>
                        <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-neon to-transparent" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                                EMAIL_ADDRESS
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@mustafaguler.me"
                                className="w-full bg-[#020103] border-b-2 border-primary/50 focus:border-cyan-neon px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors duration-300 font-mono text-sm"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                                ACCESS_KEY
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••••••"
                                className="w-full bg-[#020103] border-b-2 border-primary/50 focus:border-cyan-neon px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors duration-300 font-mono text-sm"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-3">
                                <p className="text-red-400 text-sm font-mono">
                                    <span className="text-red-500">&gt;</span> ERROR: {error.toUpperCase().replace(/ /g, '_')}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full py-4 overflow-hidden rounded bg-cyan-neon/5 border border-cyan-neon/30 hover:border-cyan-neon/60 transition-all duration-500 disabled:opacity-50 cursor-pointer"
                        >
                            <div className="absolute inset-0 w-1 bg-cyan-neon/20 transition-all duration-500 ease-out group-hover:w-full" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-cyan-neon/10 to-transparent" />
                            <span className="relative flex items-center justify-center gap-3 font-mono text-xs tracking-[0.5em] text-cyan-neon/80 group-hover:text-white transition-colors duration-300">
                                {loading ? 'CONNECTING...' : 'CONNECT'}
                            </span>
                        </button>

                    </form>


                </div>
            </div>
        </div>
    );
}
