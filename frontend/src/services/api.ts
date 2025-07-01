import axios, { AxiosResponse } from 'axios';
import {
  TranslationRequest,
  ImageTranslationRequest,
  TranslationResponse,
  LanguagesResponse,
  FormAnalysisRequest,
  FormAnalysisResponse,
  FormExplanationRequest,
  FormTemplatesResponse,
  FormCategory,
  HealthStatus,
} from '../types/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle common errors
    if (error.response?.status === 413) {
      throw new Error('File too large. Please choose a smaller file.');
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.detail || 'Invalid request');
    }
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    throw new Error(error.response?.data?.detail || 'An unexpected error occurred');
  }
);

// Translation API
export const translationApi = {
  // Translate text
  translateText: async (request: TranslationRequest): Promise<TranslationResponse> => {
    const response: AxiosResponse<TranslationResponse> = await api.post(
      '/api/v1/translate/text',
      request
    );
    return response.data;
  },

  // Translate image
  translateImage: async (request: ImageTranslationRequest): Promise<TranslationResponse> => {
    const formData = new FormData();
    formData.append('image', request.image);
    formData.append('target_language', request.target_language);
    
    if (request.source_language) {
      formData.append('source_language', request.source_language);
    }
    
    if (request.context) {
      formData.append('context', request.context);
    }

    const response: AxiosResponse<TranslationResponse> = await api.post(
      '/api/v1/translate/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get supported languages
  getLanguages: async (): Promise<LanguagesResponse> => {
    const response: AxiosResponse<LanguagesResponse> = await api.get(
      '/api/v1/translate/languages'
    );
    return response.data;
  },
};

// Forms API
export const formsApi = {
  // Analyze form document
  analyzeForm: async (request: FormAnalysisRequest): Promise<FormAnalysisResponse> => {
    const formData = new FormData();
    formData.append('document', request.document);
    formData.append('target_language', request.target_language);
    
    if (request.document_type) {
      formData.append('document_type', request.document_type);
    }
    
    if (request.country) {
      formData.append('country', request.country);
    }

    const response: AxiosResponse<FormAnalysisResponse> = await api.post(
      '/api/v1/forms/analyze',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Explain form field
  explainField: async (request: FormExplanationRequest): Promise<any> => {
    const response = await api.post('/api/v1/forms/explain', request);
    return response.data;
  },

  // Get form templates
  getTemplates: async (country?: string, category?: string, language?: string): Promise<FormTemplatesResponse> => {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (category) params.append('category', category);
    if (language) params.append('language', language);

    const response: AxiosResponse<FormTemplatesResponse> = await api.get(
      `/api/v1/forms/templates?${params.toString()}`
    );
    return response.data;
  },

  // Get form categories
  getCategories: async (): Promise<{ categories: FormCategory[] }> => {
    const response = await api.get('/api/v1/forms/categories');
    return response.data;
  },
};

// Health API
export const healthApi = {
  // Basic health check
  getHealth: async (): Promise<HealthStatus> => {
    const response: AxiosResponse<HealthStatus> = await api.get('/health');
    return response.data;
  },

  // Detailed status
  getStatus: async (): Promise<HealthStatus> => {
    const response: AxiosResponse<HealthStatus> = await api.get('/api/v1/health/status');
    return response.data;
  },

  // Readiness check
  getReadiness: async (): Promise<HealthStatus> => {
    const response: AxiosResponse<HealthStatus> = await api.get('/api/v1/health/readiness');
    return response.data;
  },

  // Liveness check
  getLiveness: async (): Promise<HealthStatus> => {
    const response: AxiosResponse<HealthStatus> = await api.get('/api/v1/health/liveness');
    return response.data;
  },
};

export default api; 