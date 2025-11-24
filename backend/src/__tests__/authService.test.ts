import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Mock dependencies before imports
jest.mock('../config/database', () => ({
    db: {
        query: jest.fn(),
    },
}))

jest.mock('../config/redis', () => ({
    redis: {
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
        setJSON: jest.fn(),
        getJSON: jest.fn(),
    },
}))

jest.mock('../services/emailService', () => ({
    emailService: {
        sendVerificationEmail: jest.fn(),
        sendResetPasswordEmail: jest.fn(),
        sendEmailChangeOTP: jest.fn(),
    },
}))

jest.mock('bcrypt')
jest.mock('jsonwebtoken')

// Import mocked modules to access their mock functions
import { AuthService } from '../services/authService'
import { db } from '../config/database'
import { redis } from '../config/redis'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

describe('AuthService', () => {
    let authService: AuthService
    let mockDb: any
    let mockRedis: any
    let mockBcrypt: any
    let mockJwt: any

    beforeEach(() => {
        jest.clearAllMocks()
        authService = new AuthService()
        mockDb = db as any
        mockRedis = redis as any
        mockBcrypt = bcrypt as any
        mockJwt = jwt as any
    })

    describe('register', () => {
        it('should successfully register a new user', async () => {
            const registerData = {
                email: 'test@example.com',
                password: 'password123',
                fullName: 'Test User',
            }

            // Mock database responses
            mockDb.query
                .mockResolvedValueOnce({ rows: [] }) // No existing user
                .mockResolvedValueOnce({
                    // Insert user
                    rows: [
                        {
                            id: 'user-123',
                            email: registerData.email,
                            full_name: registerData.fullName,
                            role: 'user',
                            created_at: new Date(),
                        },
                    ],
                })

            // Mock bcrypt
            mockBcrypt.hash.mockResolvedValue('hashed_password')

            const result = await authService.register(registerData)

            expect(result).toHaveProperty('userId')
            expect(result).toHaveProperty('email', registerData.email)
            expect(result).toHaveProperty('fullName', registerData.fullName)
            expect(mockDb.query).toHaveBeenCalledTimes(2)
        })

        it('should throw error if user already exists', async () => {
            const registerData = {
                email: 'existing@example.com',
                password: 'password123',
                fullName: 'Existing User',
            }

            // Mock existing user
            mockDb.query.mockResolvedValueOnce({
                rows: [{ id: 'existing-user-id' }],
            })

            await expect(authService.register(registerData)).rejects.toThrow(
                'User with this email already exists'
            )
        })
    })

    describe('login', () => {
        it('should successfully login with valid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            }

            const mockUser = {
                id: 'user-123',
                email: loginData.email,
                password_hash: 'hashed_password',
                full_name: 'Test User',
                role: 'user',
                google_id: null,
                apple_id: null,
            }

            // Mock database response
            mockDb.query
                .mockResolvedValueOnce({ rows: [mockUser] }) // Find user
                .mockResolvedValueOnce({}) // Update last login

            // Mock bcrypt
            mockBcrypt.compare.mockResolvedValue(true)

            // Mock JWT
            mockJwt.sign.mockReturnValue('mock_token')

            const result = await authService.login(loginData)

            expect(result).toHaveProperty('accessToken')
            expect(result).toHaveProperty('refreshToken')
            expect(result).toHaveProperty('user')
            expect(result.user.email).toBe(loginData.email)
            expect(mockRedis.set).toHaveBeenCalled()
        })

        it('should throw error for invalid email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123',
            }

            // Mock no user found
            mockDb.query.mockResolvedValueOnce({ rows: [] })

            await expect(authService.login(loginData)).rejects.toThrow(
                'Invalid email or password'
            )
        })

        it('should throw error for invalid password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword',
            }

            const mockUser = {
                id: 'user-123',
                email: loginData.email,
                password_hash: 'hashed_password',
                full_name: 'Test User',
                role: 'user',
                google_id: null,
                apple_id: null,
            }

            mockDb.query.mockResolvedValueOnce({ rows: [mockUser] })
            mockBcrypt.compare.mockResolvedValue(false)

            await expect(authService.login(loginData)).rejects.toThrow(
                'Invalid email or password'
            )
        })

        it('should throw error for OAuth user without password', async () => {
            const loginData = {
                email: 'oauth@example.com',
                password: 'password123',
            }

            const mockUser = {
                id: 'user-123',
                email: loginData.email,
                password_hash: null,
                full_name: 'OAuth User',
                role: 'user',
                google_id: 'google-123',
                apple_id: null,
            }

            mockDb.query.mockResolvedValueOnce({ rows: [mockUser] })

            await expect(authService.login(loginData)).rejects.toThrow(
                'This account was created using Google Sign-In'
            )
        })
    })

    describe('logout', () => {
        it('should successfully logout user', async () => {
            const userId = 'user-123'

            await authService.logout(userId)

            expect(mockRedis.del).toHaveBeenCalledWith(`refresh_token:${userId}`)
        })
    })

    describe('generateApiKey', () => {
        it('should generate and store API key', async () => {
            const userId = 'user-123'

            mockDb.query.mockResolvedValueOnce({})

            const apiKey = await authService.generateApiKey(userId)

            expect(apiKey).toMatch(/^pk_[a-f0-9]{32}$/)
            expect(mockDb.query).toHaveBeenCalledWith(
                'UPDATE users SET api_key = $1 WHERE id = $2',
                [apiKey, userId]
            )
        })
    })

    describe('forgotPassword', () => {
        it('should send reset email for existing user', async () => {
            const email = 'test@example.com'

            mockDb.query.mockResolvedValueOnce({
                rows: [{ id: 'user-123', email }],
            })

            await authService.forgotPassword(email)

            expect(mockRedis.set).toHaveBeenCalled()
        })

        it('should not throw error for non-existent user', async () => {
            const email = 'nonexistent@example.com'

            mockDb.query.mockResolvedValueOnce({ rows: [] })

            // Should not throw
            await expect(authService.forgotPassword(email)).resolves.toBeUndefined()
        })
    })

    describe('resetPassword', () => {
        it('should successfully reset password with valid token', async () => {
            const token = 'valid-reset-token'
            const newPassword = 'newpassword123'
            const userId = 'user-123'

            mockRedis.get.mockResolvedValueOnce(userId)
            mockDb.query.mockResolvedValueOnce({})
            mockBcrypt.hash.mockResolvedValue('new_hashed_password')

            await authService.resetPassword(token, newPassword)

            expect(mockDb.query).toHaveBeenCalledWith(
                'UPDATE users SET password_hash = $1 WHERE id = $2',
                ['new_hashed_password', userId]
            )
            expect(mockRedis.del).toHaveBeenCalledWith(`reset_token:${token}`)
        })

        it('should throw error for invalid token', async () => {
            const token = 'invalid-token'
            const newPassword = 'newpassword123'

            mockRedis.get.mockResolvedValueOnce(null)

            await expect(
                authService.resetPassword(token, newPassword)
            ).rejects.toThrow('Invalid or expired reset token')
        })
    })
})
