import api from './api'
import { Document, IngestResponse } from '../types'

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

  getDocuments: async ({ page = 1, limit = 20, sort = 'created_at', order = 'desc', scope = 'all' }: { 
    page?: number; 
    limit?: number; 
    sort?: string; 
    order?: 'asc' | 'desc';
    scope?: 'mine' | 'others' | 'all';
  }) => {
    const response = await api.get(`/documents?page=${page}&limit=${limit}&sort=${sort}&order=${order}&scope=${scope}`)
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
