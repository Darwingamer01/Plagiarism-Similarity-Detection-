import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
    beforeEach(() => {
        // Reset store before each test
        useAuthStore.getState().logout()
    })

    it('initializes with default state', () => {
        const { result } = renderHook(() => useAuthStore())

        expect(result.current.user).toBeNull()
        expect(result.current.accessToken).toBeNull()
        expect(result.current.refreshToken).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })

    it('sets user correctly', () => {
        const { result } = renderHook(() => useAuthStore())
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
            role: 'user',
            hasPassword: true,
        }

        act(() => {
            result.current.setUser(mockUser)
        })

        expect(result.current.user).toEqual(mockUser)
        expect(result.current.isAuthenticated).toBe(true)
    })

    it('sets tokens correctly', () => {
        const { result } = renderHook(() => useAuthStore())

        act(() => {
            result.current.setTokens('access-token', 'refresh-token')
        })

        expect(result.current.accessToken).toBe('access-token')
        expect(result.current.refreshToken).toBe('refresh-token')
    })

    it('sets auth (user and tokens) correctly', () => {
        const { result } = renderHook(() => useAuthStore())
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
            role: 'user',
            hasPassword: true,
        }

        act(() => {
            result.current.setAuth(mockUser, 'access-token', 'refresh-token')
        })

        expect(result.current.user).toEqual(mockUser)
        expect(result.current.accessToken).toBe('access-token')
        expect(result.current.refreshToken).toBe('refresh-token')
        expect(result.current.isAuthenticated).toBe(true)
    })

    it('logs out correctly', () => {
        const { result } = renderHook(() => useAuthStore())
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
            role: 'user',
            hasPassword: true,
        }

        // First set auth
        act(() => {
            result.current.setAuth(mockUser, 'access-token', 'refresh-token')
        })

        // Then logout
        act(() => {
            result.current.logout()
        })

        expect(result.current.user).toBeNull()
        expect(result.current.accessToken).toBeNull()
        expect(result.current.refreshToken).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })
})
