import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Mock dependencies before imports
jest.mock('../config/database', () => ({
    db: {
        query: jest.fn(),
    },
}))

jest.mock('../services/aiService', () => ({
    aiService: {
        checkSimilarity: jest.fn(),
    },
}))

jest.mock('../utils/fileUpload', () => ({
    deleteFile: jest.fn(),
}))

import { SimilarityService } from '../services/similarityService'
import { db } from '../config/database'
import { aiService } from '../services/aiService'
import { deleteFile } from '../utils/fileUpload'

describe('SimilarityService', () => {
    let similarityService: SimilarityService
    let mockDb: any
    let mockAiService: any
    let mockDeleteFile: any

    beforeEach(() => {
        jest.clearAllMocks()
        similarityService = new SimilarityService()
        mockDb = db as any
        mockAiService = aiService as any
        mockDeleteFile = deleteFile as any
    })

    describe('checkSimilarity', () => {
        it('should perform similarity check successfully', async () => {
            const userId = 'user-123'
            const file = {
                path: 'path/to/file',
                originalname: 'test.pdf',
            } as any

            // Mock total docs count
            mockDb.query
                .mockResolvedValueOnce({
                    rows: [{ count: '5' }],
                })
                // Mock insert check
                .mockResolvedValueOnce({
                    rows: [{ id: 'check-1' }],
                })
                // Mock get document details for formatting
                .mockResolvedValueOnce({
                    rows: [{ id: 'doc-1', original_filename: 'Doc 1' }],
                })
                // Mock update check
                .mockResolvedValueOnce({})

            mockAiService.checkSimilarity.mockResolvedValue({
                similar_documents: [
                    {
                        document_id: '00000000-0000-0000-0000-000000000001',
                        max_similarity: 0.9,
                    },
                ],
            })

            const result = await similarityService.checkSimilarity(file, userId)

            expect(result.checkId).toBe('check-1')
            expect(result.maxSimilarity).toBe(0.9) // Average of single doc is same as max
            expect(result.similarDocuments).toHaveLength(1)
            expect(mockDeleteFile).toHaveBeenCalledWith(file.path)
        })

        it('should return early if no documents in database', async () => {
            const userId = 'user-123'
            const file = {
                path: 'path/to/file',
                originalname: 'test.pdf',
            } as any

            mockDb.query.mockResolvedValueOnce({
                rows: [{ count: '0' }],
            })

            const result = await similarityService.checkSimilarity(file, userId) as any

            expect(result.checkId).toBeDefined() // It is now defined but we can check it exists
            expect(result.message).toContain('No documents')
            expect(mockDeleteFile).toHaveBeenCalledWith(file.path)
        })

        it('should handle errors during check', async () => {
            const userId = 'user-123'
            const file = {
                path: 'path/to/file',
                originalname: 'test.pdf',
            } as any

            mockDb.query.mockRejectedValue(new Error('DB Error'))

            await expect(
                similarityService.checkSimilarity(file, userId)
            ).rejects.toThrow('DB Error')

            expect(mockDeleteFile).toHaveBeenCalledWith(file.path)
        })
    })

    describe('getSimilarityResult', () => {
        it('should return result by id', async () => {
            const userId = 'user-123'
            const checkId = 'check-1'

            mockDb.query.mockResolvedValueOnce({
                rows: [
                    {
                        id: checkId,
                        query_filename: 'test.pdf',
                        max_similarity_score: 0.85,
                        status: 'completed',
                    },
                ],
            })

            const result = await similarityService.getSimilarityResult(checkId, userId)

            expect(result.checkId).toBe(checkId)
            expect(result.maxSimilarity).toBe(0.85)
            expect(result.riskLevel).toBe('VERY HIGH')
        })

        it('should throw error if check not found', async () => {
            const userId = 'user-123'
            const checkId = 'nonexistent'

            mockDb.query.mockResolvedValueOnce({ rows: [] })

            await expect(
                similarityService.getSimilarityResult(checkId, userId)
            ).rejects.toThrow('Similarity check not found')
        })
    })

    describe('getSimilarityHistory', () => {
        it('should return paginated history', async () => {
            const userId = 'user-123'

            mockDb.query
                .mockResolvedValueOnce({
                    rows: [{ count: '2' }],
                })
                .mockResolvedValueOnce({
                    rows: [
                        { id: '1', max_similarity_score: 0.9 },
                        { id: '2', max_similarity_score: 0.5 },
                    ],
                })

            const result = await similarityService.getSimilarityHistory(userId)

            expect(result.checks).toHaveLength(2)
            expect(result.pagination.total).toBe(2)
        })
    })

    describe('deleteCheck', () => {
        it('should delete check successfully', async () => {
            const userId = 'user-123'
            const checkId = 'check-1'

            mockDb.query
                .mockResolvedValueOnce({
                    rows: [{ id: checkId }],
                })
                .mockResolvedValueOnce({})

            await similarityService.deleteCheck(checkId, userId)

            expect(mockDb.query).toHaveBeenCalledTimes(2)
        })

        it('should throw error if check not found', async () => {
            const userId = 'user-123'
            const checkId = 'nonexistent'

            mockDb.query.mockResolvedValueOnce({ rows: [] })

            await expect(
                similarityService.deleteCheck(checkId, userId)
            ).rejects.toThrow('Similarity check not found')
        })
    })

    describe('clearHistory', () => {
        it('should clear all history', async () => {
            const userId = 'user-123'

            mockDb.query.mockResolvedValueOnce({ rowCount: 5 })

            const result = await similarityService.clearHistory(userId)

            expect(result.deletedCount).toBe(5)
            expect(mockDb.query).toHaveBeenCalledWith(
                'DELETE FROM similarity_checks WHERE user_id = $1 RETURNING id',
                [userId]
            )
        })
    })
})
