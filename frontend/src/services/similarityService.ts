import api from './api'
import { SimilarityResult, PaginationParams, SimilarityHistoryResponse } from '../types'

export const similarityService = {
  async checkSimilarity(
    file: File,
    threshold: number = 0.88,
    topK: number = 5
  ): Promise<SimilarityResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('threshold', threshold.toString())
    formData.append('topK', topK.toString())

    const response = await api.post('/similarity/check', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  async getResult(id: string): Promise<SimilarityResult> {
    const response = await api.get(`/similarity/results/${id}`)
    return response.data.data
  },

  async getHistory(params: PaginationParams = {}): Promise<SimilarityHistoryResponse> {
    const response = await api.get('/similarity/history', { params })
    return response.data.data
  },

  async deleteCheck(id: string): Promise<void> {
    await api.delete(`/similarity/history/${id}`)
  },

  async clearHistory(): Promise<{ deletedCount: number }> {
    const response = await api.delete('/similarity/history')
    return response.data.data
  },
}
