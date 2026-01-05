// Auth related type definitions

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

export interface AuthResult {
    isSuccess: boolean;
    message: string;
    statusCode: number;
    errors: string[] | null;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}
