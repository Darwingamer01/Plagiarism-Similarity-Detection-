import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RegisterPage from '../RegisterPage'

// Mock the hooks and services
vi.mock('../../stores/authStore', () => ({
    useAuthStore: () => ({
        setUser: vi.fn(),
        setTokens: vi.fn(),
    }),
}))

vi.mock('@react-oauth/google', () => ({
    useGoogleLogin: () => vi.fn(),
}))

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

describe('RegisterPage', () => {
    it('renders registration form', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <RegisterPage />
                </BrowserRouter>
            </QueryClientProvider>
        )

        expect(screen.getByText('Create an account')).toBeDefined()
        expect(screen.getByLabelText('Full Name')).toBeDefined()
        expect(screen.getByLabelText('Email address')).toBeDefined()
    })
})
