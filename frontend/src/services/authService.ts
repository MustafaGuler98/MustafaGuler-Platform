import { LoginRequest, AuthResult } from '@/types/auth';

// API URL for login requests (uses Next.js proxy to circumvent CORS and handle HttpOnly cookies)
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResult> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            return {
                isSuccess: response.ok,
                message: data.message || (response.ok ? 'Login successful' : 'Login failed'),
                statusCode: response.status,
                errors: data.errors || null,
            };
        } catch {
            return {
                isSuccess: false,
                message: 'Network error - Connection lost',
                statusCode: 0,
                errors: ['NETWORK_ERROR'],
            };
        }
    },
};
