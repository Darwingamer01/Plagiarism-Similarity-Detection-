import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// Mock dependencies before imports
jest.mock('../config/database', () => ({
    db: {
        query: jest.fn(),
    },
}))

jest.mock('../services/aiService', () => ({
    aiService: {
        ingestDocument: jest.fn(),
        deleteDocument: jest.fn(),
    },
}))

jest.mock('../utils/fileUpload', () => ({
    deleteFile: jest.fn(),
}))

import { DocumentService } from '../services/documentService'
import { db } from '../config/database'
import { aiService } from '../services/aiService'
import { deleteFile } from '../utils/fileUpload'

describe('DocumentService', () => {
    let documentService: DocumentService
    let mockDb: any
    let mockAiService: any
    let mockDeleteFile: any

    beforeEach(() => {
        jest.clearAllMocks()
        documentService = new DocumentService()
        mockDb = db as any
        mockAiService = aiService as any
        mockDeleteFile = deleteFile as any
    })

    describe('getDocuments', () => {
        it('should return paginated documents', async () => {
            const userId = 'user-123'
            const page = 1
            const limit = 10

            mockDb.query
                .mockResolvedValueOnce({
                    rows: [{ count: '2' }],
                })
                .mockResolvedValueOnce({
                    rows: [
                        { id: '1', original_filename: 'Doc 1', chunks_count: 5 },
                        { id: '2', original_filename: 'Doc 2', chunks_count: 3 },
                    ],
                })

            const result = await documentService.getDocuments(userId, page, limit)

            expect(result.documents).toHaveLength(2)
            expect(result.pagination.total).toBe(2)
            expect(result.pagination.totalPages).toBe(1)
        })

        it('should handle empty document list', async () => {
            const userId = 'user-123'

            mockDb.query
                .mockResolvedValueOnce({
                    rows: [{ count: '0' }],
                })
                .mockResolvedValueOnce({
                    rows: [],
                })

            const result = await documentService.getDocuments(userId)

            expect(result.documents).toHaveLength(0)
            expect(result.pagination.total).toBe(0)
        })
    })

    describe('getDocumentById', () => {
        it('should return document by id', async () => {
            const userId = 'user-123'
            const documentId = 'doc-1'

            mockDb.query.mockResolvedValueOnce({
                rows: [
                    {
                        id: documentId,
                        original_filename: 'Doc 1',
                        user_id: userId,
                        chunks: [],
                    },
                ],
            })

            const result = await documentService.getDocumentById(documentId, userId)

            expect(result.id).toBe(documentId)
        })

        it('should throw error if document not found', async () => {
            const userId = 'user-123'
            const documentId = 'nonexistent'

            mockDb.query.mockResolvedValueOnce({ rows: [] })

            await expect(
                documentService.getDocumentById(documentId, userId)
            ).rejects.toThrow('Document not found')
        })
    })

    describe('deleteDocument', () => {
        it('should delete document successfully', async () => {
            const userId = 'user-123'
            const documentId = 'doc-1'

            mockDb.query
                .mockResolvedValueOnce({
                    rows: [{ id: documentId, user_id: userId, file_path: 'path/to/file' }],
                })
                .mockResolvedValueOnce({}) // DELETE query

            mockAiService.deleteDocument.mockResolvedValue({})

            await documentService.deleteDocument(documentId, userId)

            expect(mockDb.query).toHaveBeenCalledTimes(2)
            expect(mockAiService.deleteDocument).toHaveBeenCalledWith(documentId, userId)
            expect(mockDeleteFile).toHaveBeenCalledWith('path/to/file')
        })

        it('should throw error if document not found', async () => {
            const userId = 'user-123'
            const documentId = 'nonexistent'

            mockDb.query.mockResolvedValueOnce({ rows: [] })

            await expect(
                documentService.deleteDocument(documentId, userId)
            ).rejects.toThrow('Document not found')
        })
    })

    describe('deleteAllDocuments', () => {
        it('should delete all user documents', async () => {
            const userId = 'user-123'

            mockDb.query
                .mockResolvedValueOnce({
                    rows: [
                        { id: '1', user_id: userId, file_path: 'path/1' },
                        { id: '2', user_id: userId, file_path: 'path/2' },
                    ],
                })
                .mockResolvedValueOnce({}) // DELETE query

            mockAiService.deleteDocument.mockResolvedValue({})

            const result = await documentService.deleteAllDocuments(userId)

            expect(result.deletedCount).toBe(2)
            expect(mockDb.query).toHaveBeenCalledTimes(2)
            expect(mockAiService.deleteDocument).toHaveBeenCalledTimes(2)
            expect(mockDeleteFile).toHaveBeenCalledTimes(2)
        })

        it('should handle partial failures in AI service deletion', async () => {
            const userId = 'user-123'

            mockDb.query
                .mockResolvedValueOnce({
                    rows: [
                        { id: '1', user_id: userId, file_path: 'path/1' },
                        { id: '2', user_id: userId, file_path: 'path/2' },
                    ],
                })
                .mockResolvedValueOnce({})

            mockAiService.deleteDocument
                .mockResolvedValueOnce({})
                .mockRejectedValueOnce(new Error('AI Service Error'))

            const result = await documentService.deleteAllDocuments(userId)

            expect(result.deletedCount).toBe(2)
            // Should still proceed with DB deletion even if AI service fails for some
            expect(mockDb.query).toHaveBeenCalledTimes(2)
        })

        it('should return 0 count if no documents found', async () => {
            const userId = 'user-123'

            mockDb.query.mockResolvedValueOnce({ rows: [] })

            const result = await documentService.deleteAllDocuments(userId)

            expect(result.deletedCount).toBe(0)
            expect(mockDb.query).toHaveBeenCalledTimes(1)
            expect(mockAiService.deleteDocument).not.toHaveBeenCalled()
        })
    })
})
