// Translation Types
export interface TranslationRequest {
  text: string;
  source_language?: string;
  target_language: string;
  context?: string;
}

export interface ImageTranslationRequest {
  target_language: string;
  source_language?: string;
  context?: string;
  image: File;
}

export interface TranslationResponse {
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  context_explanation?: string;
  confidence?: number;
  detected_objects?: string[];
}

export interface Language {
  code: string;
  name: string;
  native_name: string;
}

export interface LanguagesResponse {
  languages: Language[];
}

// Form Analysis Types
export interface FormField {
  field_name: string;
  field_type: string;
  label: string;
  explanation: string;
  required: boolean;
  example_value?: string;
  validation_rules?: string[];
}

export interface FormAnalysisResponse {
  form_type: string;
  title: string;
  description: string;
  fields: FormField[];
  instructions: string[];
  required_documents?: string[];
  estimated_time?: string;
  tips?: string[];
}

export interface FormAnalysisRequest {
  target_language: string;
  document_type?: string;
  country?: string;
  document: File;
}

export interface FormExplanationRequest {
  field_name: string;
  field_context: string;
  form_type: string;
  target_language: string;
  user_situation?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  country: string;
  category: string;
  description: string;
  difficulty?: string;
  estimated_time?: string;
}

export interface FormTemplatesResponse {
  templates: FormTemplate[];
  categories: string[];
  countries: string[];
}

export interface FormCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// API Response Types
export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  version?: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface NotificationState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  id: string;
} 