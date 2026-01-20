import { LoginRequest, AuthResult } from '@/types/auth';
import { apiClient } from '@/lib/api-client';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResult> {
        try {
            const response = await apiClient.post<AuthResult>('/auth/login', credentials);

            return {
                isSuccess: response.isSuccess,
                message: response.message,
                statusCode: response.statusCode,
                errors: response.errors,
            } as AuthResult;

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
