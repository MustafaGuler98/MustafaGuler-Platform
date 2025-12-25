'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// API URL for login requests (uses Next.js proxy)
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

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

    const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', fontSize: '14px' };
    const btnStyle = { padding: '6px 12px', cursor: 'pointer', border: 'none', borderRadius: '4px' };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed');
            } else {
                // Force full page reload to re-run middleware
                window.location.href = '/admin';
            }
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px' }}>
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />
                {error && <div style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</div>}
                <button
                    type="submit"
                    disabled={loading}
                    style={{ ...btnStyle, width: '100%', backgroundColor: '#3b82f6', color: 'white' }}
                >
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
