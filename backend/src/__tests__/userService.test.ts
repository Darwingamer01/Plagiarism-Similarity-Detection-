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
        sendEmailChangeOTP: jest.fn(),
    },
}))

jest.mock('bcrypt')

import { UserService } from '../services/userService'
import { db } from '../config/database'
import { redis } from '../config/redis'
import bcrypt from 'bcrypt'

describe('UserService', () => {
    let userService: UserService
    let mockDb: any
    let mockRedis: any
    let mockBcrypt: any

    beforeEach(() => {
        jest.clearAllMocks()
        userService = new UserService()
        mockDb = db as any
        mockRedis = redis as any
        mockBcrypt = bcrypt as any
    })

    describe('getThreshold', () => {
        it('should return user threshold', async () => {
            const userId = 'user-123'
            mockDb.query.mockResolvedValueOnce({
                rows: [{ similarity_threshold: '0.85' }],
            })

            const threshold = await userService.getThreshold(userId)

            expect(threshold).toBe(0.85)
        })

        it('should return default threshold if not set', async () => {
            const userId = 'user-123'
            mockDb.query.mockResolvedValueOnce({
                rows: [{ similarity_threshold: null }],
            })

            const threshold = await userService.getThreshold(userId)

            expect(threshold).toBe(0.88)
        })
    })

    describe('setThreshold', () => {
        it('should update user threshold', async () => {
            const userId = 'user-123'
            const newThreshold = 0.9

            mockDb.query.mockResolvedValueOnce({
                rows: [{ similarity_threshold: '0.9' }],
            })

            const result = await userService.setThreshold(userId, newThreshold)

            expect(result).toBe(0.9)
            expect(mockDb.query).toHaveBeenCalledWith(
                'UPDATE users SET similarity_threshold = $1 WHERE id = $2 RETURNING similarity_threshold',
                [newThreshold, userId]
            )
        })

        it('should throw error if user not found', async () => {
            const userId = 'nonexistent'
            const newThreshold = 0.9

            mockDb.query.mockResolvedValueOnce({ rows: [] })

            await expect(
                userService.setThreshold(userId, newThreshold)
            ).rejects.toThrow('User not found')
        })
    })

    describe('updateProfile', () => {
        it('should update user full name', async () => {
            const userId = 'user-123'
            const fullName = 'Updated Name'

            mockDb.query.mockResolvedValueOnce({
                rows: [
                    {
                        id: userId,
                        email: 'test@example.com',
                        full_name: fullName,
                        role: 'user',
                    },
                ],
            })

            const result = await userService.updateProfile(userId, fullName)

            expect(result.fullName).toBe(fullName)
            expect(result.id).toBe(userId)
        })

        it('should throw error if user not found', async () => {
            const userId = 'nonexistent'
            const fullName = 'Updated Name'

            mockDb.query.mockResolvedValueOnce({ rows: [] })

            await expect(
                userService.updateProfile(userId, fullName)
            ).rejects.toThrow('User not found')
        })
    })

    describe('changePassword', () => {
        it('should successfully change password', async () => {
            const userId = 'user-123'
            const oldPassword = 'oldpass123'
            const newPassword = 'newpass123'

            mockDb.query
                .mockResolvedValueOnce({
                    rows: [{ password_hash: 'old_hashed_password' }],
                })
                .mockResolvedValueOnce({})

            mockBcrypt.compare.mockResolvedValue(true)
            mockBcrypt.hash.mockResolvedValue('new_hashed_password')

            const result = await userService.changePassword(
                userId,
                oldPassword,
                newPassword
            )

            expect(result.message).toBe('Password changed successfully')
            expect(mockDb.query).toHaveBeenCalledWith(
                'UPDATE users SET password_hash = $1 WHERE id = $2',
                ['new_hashed_password', userId]
            )
        })

        it('should throw error for incorrect old password', async () => {
            const userId = 'user-123'
            const oldPassword = 'wrongpass'
            const newPassword = 'newpass123'

            mockDb.query.mockResolvedValueOnce({
                rows: [{ password_hash: 'old_hashed_password' }],
            })

            mockBcrypt.compare.mockResolvedValue(false)

            await expect(
                userService.changePassword(userId, oldPassword, newPassword)
            ).rejects.toThrow('Current password is incorrect')
        })

        it('should throw error if no password set', async () => {
            const userId = 'user-123'
            const oldPassword = 'oldpass'
            const newPassword = 'newpass123'

            mockDb.query.mockResolvedValueOnce({
                rows: [{ password_hash: null }],
            })

            await expect(
                userService.changePassword(userId, oldPassword, newPassword)
            ).rejects.toThrow('No password set')
        })
    })

    describe('setPassword', () => {
        it('should successfully set password for OAuth user', async () => {
            const userId = 'user-123'
            const newPassword = 'newpass123'

            mockDb.query
                .mockResolvedValueOnce({
                    rows: [{ password_hash: null }],
                })
                .mockResolvedValueOnce({})

            mockBcrypt.hash.mockResolvedValue('new_hashed_password')

            const result = await userService.setPassword(userId, newPassword)

            expect(result.message).toBe('Password set successfully')
        })

        it('should throw error if password already set', async () => {
            const userId = 'user-123'
            const newPassword = 'newpass123'

            mockDb.query.mockResolvedValueOnce({
                rows: [{ password_hash: 'existing_hash' }],
            })

            await expect(userService.setPassword(userId, newPassword)).rejects.toThrow(
                'Password already set'
            )
        })
    })

    describe('requestEmailChange', () => {
        it('should send OTP for email change', async () => {
            const userId = 'user-123'
            const newEmail = 'newemail@example.com'

            mockDb.query.mockResolvedValueOnce({ rows: [] }) // No existing user with new email

            const result = await userService.requestEmailChange(userId, newEmail)

            expect(result.message).toContain('Verification code sent')
            expect(mockRedis.setJSON).toHaveBeenCalled()
        })

        it('should throw error if email already in use', async () => {
            const userId = 'user-123'
            const newEmail = 'existing@example.com'

            mockDb.query.mockResolvedValueOnce({
                rows: [{ id: 'other-user-id' }],
            })

            await expect(
                userService.requestEmailChange(userId, newEmail)
            ).rejects.toThrow('Email already in use')
        })
    })

    describe('verifyEmailChange', () => {
        it('should successfully verify and update email', async () => {
            const userId = 'user-123'
            const newEmail = 'newemail@example.com'
            const otp = '123456'

            mockRedis.getJSON.mockResolvedValueOnce({
                userId,
                newEmail,
                otp,
            })

            mockDb.query.mockResolvedValueOnce({
                rows: [
                    {
                        id: userId,
                        email: newEmail,
                        full_name: 'Test User',
                        role: 'user',
                    },
                ],
            })

            const result = await userService.verifyEmailChange(userId, newEmail, otp)

            expect(result.email).toBe(newEmail)
            expect(mockRedis.del).toHaveBeenCalledWith(`email_change:${userId}`)
        })

        it('should throw error for invalid OTP', async () => {
            const userId = 'user-123'
            const newEmail = 'newemail@example.com'
            const otp = '123456'

            mockRedis.getJSON.mockResolvedValueOnce({
                userId,
                newEmail,
                otp: '654321', // Different OTP
            })

            await expect(
                userService.verifyEmailChange(userId, newEmail, otp)
            ).rejects.toThrow('Invalid verification code')
        })

        it('should throw error if session expired', async () => {
            const userId = 'user-123'
            const newEmail = 'newemail@example.com'
            const otp = '123456'

            mockRedis.getJSON.mockResolvedValueOnce(null)

            await expect(
                userService.verifyEmailChange(userId, newEmail, otp)
            ).rejects.toThrow('Verification session expired')
        })
    })
})
