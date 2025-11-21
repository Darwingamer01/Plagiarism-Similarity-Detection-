export interface User {
  id: string
  email: string
  fullName: string
  role: string
  hasPassword?: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword?: string
  fullName: string
}

export interface Document {
  id: string
  filename: string
  fileType: string
  fileSize: number
  chunksCount: number
  status: 'pending' | 'processing' | 'indexed' | 'failed'
  createdAt: string
  processedAt?: string
}

export interface SimilarityCheck {
  id: string
  queryFilename: string
  threshold: number
  maxSimilarity: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
}

export interface SimilarityResult {
  checkId: string
  queryFilename: string
  maxSimilarity: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  similarDocuments: SimilarDocument[]
}

export interface SimilarDocument {
  documentId: string
  filename: string
  similarityScore: number
  matchedChunks: number
  matches: Match[]
}

export interface Match {
  queryText: string
  matchedText: string
  similarity: number
  chunkIndex: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: {
    message: string
    statusCode: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface DocumentsResponse {
  documents: Document[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SimilarityHistoryResponse {
  checks: SimilarityCheck[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
