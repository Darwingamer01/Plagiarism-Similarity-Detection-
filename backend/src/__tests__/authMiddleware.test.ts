import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Mock dependencies before imports
jest.mock('../config/database', () => ({
    db: {
        query: jest.fn(),
    },
}))

jest.mock('jsonwebtoken')

import { authenticate, authorize } from '../middleware/authMiddleware'
import { db } from '../config/database'
import jwt from 'jsonwebtoken'

describe('Auth Middleware', () => {
    let mockReq: any
    let mockRes: any
    let mockNext: any
    let mockDb: any
    let mockJwt: any

    beforeEach(() => {
        jest.clearAllMocks()
        mockReq = {
            headers: {},
            user: undefined,
        }
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        mockNext = jest.fn()
        mockDb = db as any
        mockJwt = jwt as any
    })

    describe('authenticate', () => {
        it('should authenticate with valid JWT token', async () => {
            const token = 'valid-token'
            const decoded = { userId: 'user-123', role: 'user' }
            mockReq.headers = { authorization: `Bearer ${token}` }

            mockJwt.verify.mockReturnValue(decoded)
            mockDb.query.mockResolvedValueOnce({
                rows: [
                    {
                        id: 'user-123',
                        email: 'test@example.com',
                        role: 'user',
                    },
                ],
            })

            await authenticate(mockReq, mockRes, mockNext)

            expect(mockNext).toHaveBeenCalledWith()
            expect(mockReq.user).toBeDefined()
            expect(mockReq.user?.id).toBe('user-123')
        })

        it('should authenticate with valid API key', async () => {
            const apiKey = 'pk_validapikey'
            mockReq.headers = { 'x-api-key': apiKey }

            mockDb.query.mockResolvedValueOnce({
                rows: [
                    {
                        id: 'user-123',
                        email: 'test@example.com',
                        role: 'user',
                    },
                ],
            })

            await authenticate(mockReq, mockRes, mockNext)

            expect(mockNext).toHaveBeenCalledWith()
            expect(mockReq.user).toBeDefined()
        })

        it('should return 401 if no token or API key provided', async () => {
            await authenticate(mockReq, mockRes, mockNext)

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 401,
                    message: 'No authentication token provided',
                })
            )
        })

        it('should return 401 for invalid JWT token', async () => {
            mockReq.headers = { authorization: 'Bearer invalid-token' }
            const error = new Error('Invalid token')
            error.name = 'JsonWebTokenError'
            mockJwt.verify.mockImplementation(() => {
                throw error
            })

            await authenticate(mockReq, mockRes, mockNext)

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 401,
                    message: 'Invalid token',
                })
            )
        })

        it('should return 401 for invalid API key', async () => {
            mockReq.headers = { 'x-api-key': 'invalid-key' }
            mockDb.query.mockResolvedValueOnce({ rows: [] })

            await authenticate(mockReq, mockRes, mockNext)

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 401,
                    message: 'Invalid API key',
                })
            )
        })

        it('should return 401 if user not found', async () => {
            mockReq.headers = { authorization: 'Bearer valid-token' }
            mockJwt.verify.mockReturnValue({ userId: 'user-123' })
            mockDb.query.mockResolvedValueOnce({ rows: [] })

            await authenticate(mockReq, mockRes, mockNext)

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 401,
                    message: 'User not found',
                })
            )
        })
    })

    describe('authorize', () => {
        it('should allow access for authorized role', () => {
            mockReq.user = { id: '1', role: 'admin' }
            const middleware = authorize('admin')

            middleware(mockReq, mockRes, mockNext)

            expect(mockNext).toHaveBeenCalledWith()
        })

        it('should deny access for unauthorized role', () => {
            mockReq.user = { id: '1', role: 'user' }
            const middleware = authorize('admin')

            middleware(mockReq, mockRes, mockNext)

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 403,
                    message: 'Not authorized to access this resource',
                })
            )
        })

        it('should allow access if multiple roles allowed', () => {
            mockReq.user = { id: '1', role: 'editor' }
            const middleware = authorize('admin', 'editor')

            middleware(mockReq, mockRes, mockNext)

            expect(mockNext).toHaveBeenCalledWith()
        })
    })
})
