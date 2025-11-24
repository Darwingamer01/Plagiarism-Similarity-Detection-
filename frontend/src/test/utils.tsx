import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    })

interface AllTheProvidersProps {
    children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
    const testQueryClient = createTestQueryClient()
    // Use a dummy client ID for testing
    const testClientId = 'test-client-id.apps.googleusercontent.com'
    return (
        <GoogleOAuthProvider clientId={testClientId}>
            <QueryClientProvider client={testQueryClient}>
                <BrowserRouter>{children}</BrowserRouter>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    )
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
