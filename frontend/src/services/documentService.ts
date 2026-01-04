import api from './api'
import { Document, PaginationParams, DocumentsResponse, IngestResponse } from '../types'

export const documentService = {
  async ingestDocuments(files: File[]): Promise<IngestResponse> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await api.post('/documents/ingest', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  async getDocuments(params: PaginationParams = {}): Promise<DocumentsResponse> {
    const response = await api.get('/documents', { params })
    return response.data.data
  },

  async getDocument(id: string): Promise<Document> {
    const response = await api.get(`/documents/${id}`)
    return response.data.data
  },

  async deleteDocument(id: string): Promise<void> {
    await api.delete(`/documents/${id}`)
  },

  async deleteAllDocuments() {
    return api.delete('/documents').then(res => res.data.data)
  },
}
