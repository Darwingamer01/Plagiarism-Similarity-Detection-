import { http, HttpResponse } from 'msw'

// Use the same base URL as the actual API
const API_URL = '/api'

export const handlers = [
    // Auth endpoints
    http.post(`${API_URL}/auth/login`, () => {
        return HttpResponse.json({
            success: true,
            data: {
                user: {
                    id: '1',
                    email: 'test@example.com',
                    fullName: 'Test User',
                    hasPassword: true,
                },
                accessToken: 'mock-jwt-token',
                refreshToken: 'mock-refresh-token',
                expiresIn: 3600,
            },
        })
    }),

    http.post(`${API_URL}/auth/register`, () => {
        return HttpResponse.json({
            success: true,
            data: {
                user: {
                    id: '1',
                    email: 'test@example.com',
                    fullName: 'Test User',
                    hasPassword: true,
                },
                accessToken: 'mock-jwt-token',
                refreshToken: 'mock-refresh-token',
                expiresIn: 3600,
            },
        })
    }),

    http.post(`${API_URL}/auth/logout`, () => {
        return HttpResponse.json({
            success: true,
            data: { message: 'Logged out successfully' }
        })
    }),

    // User endpoints
    http.get(`${API_URL}/users/me`, () => {
        return HttpResponse.json({
            success: true,
            data: {
                user: {
                    id: '1',
                    email: 'test@example.com',
                    fullName: 'Test User',
                    hasPassword: true,
                },
            },
        })
    }),

    // Document endpoints
    http.get(`${API_URL}/documents`, () => {
        return HttpResponse.json({
            success: true,
            data: {
                documents: [],
                total: 0,
            },
        })
    }),

    // Similarity check endpoints
    http.get(`${API_URL}/similarity-checks`, () => {
        return HttpResponse.json({
            success: true,
            data: {
                checks: [],
                total: 0,
            },
        })
    }),
]
