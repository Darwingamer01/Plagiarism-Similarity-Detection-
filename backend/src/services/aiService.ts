import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

export interface SimilarityResult {
  success: boolean;
  query_filename: string;
  sentiment: {
    label: string;
    score: number;
  };
  context: Array<{
    text: string;
    score: number;
  }>;
  max_similarity: number;
  similar_documents: Array<{
    document_id: string;
    max_similarity: number;
    matched_chunks: number;
    matches: Array<{
      query_text: string;
      matched_text: string;
      similarity: number;
      chunk_index: number;
    }>;
    report: {
      reasoning: string;
      comparison: {
        common_topics: string[];
        query_unique_topics: string[];
        match_unique_topics: string[];
        sentiment_contrast: {
          query: string;
          match: string;
          match_status: string;
        }
      }
    };
  }>;
  aggregate_score?: number;
  overall_score?: number;
}

class AIService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = config.aiService.url;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: config.aiService.timeout,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async ingestDocument(filePath: string, filename: string, userId: string, documentId?: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('filename', filename);
      formData.append('user_id', userId);
      if (documentId) {
        formData.append('document_id', documentId);
      }

      logger.info(`Ingesting document: ${filename} for user: ${userId}`);

      const response = await this.client.post('/ingest', formData, {
        headers: formData.getHeaders()
      });

      logger.info(`Document ingested successfully: ${filename}`);

      return response.data;
    } catch (error: any) {
      logger.error('AI Service ingest error:', error.message);
      if (error.response) {
        throw new AppError(`AI Service error: ${error.response.data.detail || error.message}`, 500);
      }
      throw new AppError('Failed to communicate with AI service', 500);
    }
  }

  async checkSimilarity(
    filePath: string,
    filename: string,
    userId: string,
    threshold: number = 0.70,
    topK: number = 5
  ): Promise<SimilarityResult> {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('filename', filename);
      formData.append('user_id', userId);
      formData.append('threshold', threshold.toString());
      formData.append('top_k', topK.toString());

      logger.info(`Checking similarity for: ${filename}, threshold: ${threshold}, topK: ${topK}`);

      const response = await this.client.post('/check-similarity', formData, {
        headers: formData.getHeaders()
      });

      logger.info(`Similarity check completed for: ${filename}`);

      return response.data;
    } catch (error: any) {
      logger.error('AI Service similarity check error:', error.message);
      if (error.response) {
        throw new AppError(`AI Service error: ${error.response.data.detail || error.message}`, 500);
      }
      throw new AppError('Failed to communicate with AI service', 500);
    }
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      await this.client.delete(`/documents/${documentId}`, {
        params: { user_id: userId }
      });

      logger.info(`Document deleted from AI service: ${documentId}`);
    } catch (error: any) {
      logger.error('AI Service delete error:', error.message);
      // Don't throw error if AI service fails, continue with database cleanup
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      logger.error('AI Service health check failed');
      return false;
    }
  }

  async getStats(): Promise<any> {
    try {
      const response = await this.client.get('/stats');
      return response.data;
    } catch (error: any) {
      logger.error('AI Service stats error:', error.message);
      throw new AppError('Failed to get AI service stats', 500);
    }
  }
  async clearVectorIndex(): Promise<any> {
    try {
      logger.info('Sending request to clear AI Service vector index');
      const response = await this.client.post('/admin/clear-index');
      logger.info('AI Service vector index cleared successfully');
      return response.data;
    } catch (error: any) {
      logger.error('AI Service clear index error:', error.message);
      if (error.response) {
        throw new AppError(`AI Service error: ${error.response.data.detail || error.message}`, 500);
      }
      throw new AppError('Failed to communicate with AI service', 500);
    }
  }
}

export const aiService = new AIService();
