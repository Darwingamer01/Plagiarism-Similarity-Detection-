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
  summary?: string
  sentiment?: {
    label: string
    score: number
  }
    text: string
    score: number
  } | string>
  isOwner?: boolean
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
  threshold: number
  maxSimilarity: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH' | 'VERY LOW'
  status: string
  results: {
    summary?: string
    similar_documents: SimilarDocument[]
    sentiment?: {
      label: string
      score: number
    }
    context?: Array<{
      text: string
      score: number
    } | string>
    no_match_report?: {
      reasoning: string
      closest_match?: {
        similarity: number
        metadata?: {
          summary?: string
          sentiment?: {
            label: string
            score: number
          }
          context?: Array<{
            text: string
            score: number
          } | string>
          [key: string]: unknown
        }
      }
    }
    aggregate_score?: number
    overall_score?: number
  }
  createdAt: string
  completedAt: string
}

export interface IngestResponse {
  processedFiles: Array<{
    documentId?: string
    filename: string
    chunksAdded?: number
    status: string
    error?: string
  }>
}

export interface SimilarDocument {
  documentId: string
  filename: string
  max_similarity: number
  overall_score: number
  matched_chunks: number
  matches: Match[]
  summary?: string
  sentiment?: {
    label: string
    score: number
  }
  context?: Array<{
    text: string
    score: number
  } | string>
  match_unique_topics: string[]
  sentiment_contrast: {
    query: string
    match: string
    match_status: string
  }
  report?: {
    thought_process?: string
    reasoning?: string
    comparison: {
      query_unique_topics: string[]
      match_unique_topics: string[]
      common_topics: string[]
      sentiment_contrast: {
        query: string
        match: string
        match_status: string
      }
    }
  }
}

export interface Match {
  query_text: string
  matched_text: string
  similarity: number
  chunk_index: number
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

export interface OAuthLoginResponse {
  isNewUser: boolean
  data: {
    user?: User
    tokens?: AuthTokens
    profile?: {
      email: string
      name: string
      fullName?: string
      picture?: string
      providerId?: string
    }
  }
}

export interface BackendError {
  message: string;
  statusCode?: number;
}

export interface ApiResponseError {
  response?: {
    data?: {
      error?: BackendError;
    };
    status?: number;
    statusText?: string;
  };
  message?: string; // For network errors or other client-side errors not from the backend
}

