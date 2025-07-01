import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { formsApi, translationApi } from '../services/api';
import { FormAnalysisResponse, Language } from '../types/api';
import { useNotification } from '../components/ui/NotificationProvider';

export const FormAnalysisPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [documentType, setDocumentType] = useState('');
  const [country, setCountry] = useState('');
  const [analysis, setAnalysis] = useState<FormAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const { addNotification } = useNotification();

  React.useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await translationApi.getLanguages();
        setLanguages(response.languages);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setAnalysis(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleAnalyze = async () => {
    if (!file) {
      addNotification('error', 'Please select a file to analyze');
      return;
    }

    setLoading(true);
    try {
      const result = await formsApi.analyzeForm({
        document: file,
        target_language: targetLanguage,
        document_type: documentType || undefined,
        country: country || undefined,
      });
      
      setAnalysis(result);
      addNotification('success', 'Form analyzed successfully!');
    } catch (error: any) {
      addNotification('error', error.message || 'Failed to analyze form');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyIcon = (required: boolean) => {
    return required ? (
      <AlertCircle className="w-4 h-4 text-danger-500" />
    ) : (
      <CheckCircle className="w-4 h-4 text-success-500" />
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/forms"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Form Analysis
          </h1>
          <p className="text-gray-600">
            Upload your document to get detailed field-by-field guidance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Document
            </h2>
            
            {/* File Upload */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-primary-400 bg-primary-50'
                  : file
                  ? 'border-success-400 bg-success-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  file ? 'bg-success-100' : 'bg-gray-100'
                }`}>
                  {file ? (
                    <CheckCircle className="w-8 h-8 text-success-600" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
                {file ? (
                  <div>
                    <p className="font-medium text-success-700">
                      {file.name}
                    </p>
                    <p className="text-sm text-success-600">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-gray-700">
                      {isDragActive ? 'Drop your file here' : 'Choose a file or drag it here'}
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="card space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Analysis Options
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation Language
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="select-field"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.native_name} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Visa Application, Work Permit"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., US, UK, Germany"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Analyzing Form...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Analyze Form</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysis ? (
            <>
              {/* Form Overview */}
              <div className="card">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {analysis.title}
                    </h2>
                    <p className="text-gray-600">
                      {analysis.form_type}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">
                  {analysis.description}
                </p>

                {analysis.estimated_time && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Estimated completion time: {analysis.estimated_time}</span>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Step-by-Step Instructions
                </h3>
                <ol className="space-y-2">
                  {analysis.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Form Fields */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Field Explanations
                </h3>
                <div className="space-y-4">
                  {analysis.fields.map((field, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getDifficultyIcon(field.required)}
                          <h4 className="font-medium text-gray-900">
                            {field.label}
                          </h4>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {field.field_type}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">
                        {field.explanation}
                      </p>
                      
                      {field.example_value && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Example: </span>
                          <span className="text-gray-600">{field.example_value}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              {analysis.required_documents && analysis.required_documents.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Required Documents
                  </h3>
                  <ul className="space-y-2">
                    {analysis.required_documents.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        <span className="text-gray-700">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips */}
              {analysis.tips && analysis.tips.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Helpful Tips
                  </h3>
                  <ul className="space-y-2">
                    {analysis.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Analyze
              </h3>
              <p className="text-gray-600">
                Upload a form document to get detailed field-by-field guidance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 