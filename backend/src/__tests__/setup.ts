/**
 * Test setup and utilities
 */

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key-for-testing-only'
process.env.JWT_EXPIRES_IN = '1h'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.REDIS_URL = 'redis://localhost:6379'
process.env.AI_SERVICE_URL = 'http://localhost:8000'

// Mock logger to suppress logs during tests
jest.mock('../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}))

// Helper function to create mock request
export const mockRequest = (data: any = {}) => ({
    body: data.body || {},
    params: data.params || {},
    query: data.query || {},
    headers: data.headers || {},
    user: data.user || null,
    file: data.file || null,
    files: data.files || null,
})

// Helper function to create mock response
export const mockResponse = () => {
    const res: any = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    res.sendStatus = jest.fn().mockReturnValue(res)
    return res
}

// Helper function to create mock next
export const mockNext = () => jest.fn()

// Sample test data
export const testUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    role: 'user' as const,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const testDocument = {
    id: 'test-doc-id-123',
    userId: 'test-user-id-123',
    filename: 'test-document.pdf',
    originalName: 'Test Document.pdf',
    fileSize: 1024,
    mimeType: 'application/pdf',
    uploadedAt: new Date(),
}

export const testSimilarityCheck = {
    id: 'test-similarity-id-123',
    userId: 'test-user-id-123',
    filename: 'query-document.pdf',
    maxSimilarity: 0.85,
    checkedAt: new Date(),
}
