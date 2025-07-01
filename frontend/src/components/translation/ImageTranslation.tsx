import React, { useState } from 'react';
import { Camera, Upload, X, Copy, Volume2, Check, Lightbulb, Eye } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { translationApi } from '../../services/api';
import { Language, TranslationResponse } from '../../types/api';
import { useNotification } from '../ui/NotificationProvider';

interface ImageTranslationProps {
  languages: Language[];
}

export const ImageTranslation: React.FC<ImageTranslationProps> = ({ languages }) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotification();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage(file);
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleTranslate = async () => {
    if (!image) {
      addNotification('error', 'Please select an image to translate');
      return;
    }

    setLoading(true);
    try {
      const response = await translationApi.translateImage({
        image,
        source_language: sourceLanguage || undefined,
        target_language: targetLanguage,
        context: context || undefined,
      });
      
      setResult(response);
      addNotification('success', 'Image translated successfully!');
    } catch (error: any) {
      addNotification('error', error.message || 'Image translation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result.translated_text);
        setCopied(true);
        addNotification('success', 'Translation copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        addNotification('error', 'Failed to copy to clipboard');
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
  };

  const handleCameraCapture = () => {
    // In a real app, this would open camera
    addNotification('info', 'Camera feature coming soon! Please upload an image for now.');
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Upload or Capture Image
          </h3>
          <button
            onClick={handleCameraCapture}
            className="btn-outline flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Camera</span>
          </button>
        </div>

        {!image ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-primary-400 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              
              <div>
                <p className="font-medium text-gray-700">
                  {isDragActive ? 'Drop your image here' : 'Choose an image or drag it here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={imagePreview!}
                  alt="Document to translate"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Image Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Image Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Name:</span> {image.name}</p>
                    <p><span className="font-medium">Size:</span> {(image.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><span className="font-medium">Type:</span> {image.type}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source Language
                    </label>
                    <select
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
                      className="select-field"
                    >
                      <option value="">Auto-detect</option>
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.native_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Language
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="select-field"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.native_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Context Input */}
      {image && (
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Context (Optional)
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Street sign, menu, document, prescription..."
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1">
            Help us understand what type of text this is for better translation
          </p>
        </div>
      )}

      {/* Translate Button */}
      {image && (
        <div className="text-center">
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="loading-spinner"></div>
                <span>Analyzing Image...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Translate Image</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Detected Text */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detected Text
              </h3>
              <span className="text-sm text-gray-500">
                {result.source_language}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900">{result.original_text}</p>
            </div>
          </div>

          {/* Translation */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Translation
              </h3>
              <span className="text-sm text-gray-500">
                {result.target_language}
              </span>
            </div>
            <div className="bg-primary-50 rounded-lg p-4">
              <p className="text-gray-900 font-medium mb-3">
                {result.translated_text}
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200">
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detected Objects */}
          {result.detected_objects && result.detected_objects.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detected Objects
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.detected_objects.map((object, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm"
                  >
                    {object}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cultural Context */}
          {result.context_explanation && (
            <div className="card border-l-4 border-primary-500">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cultural Context & Tips
                  </h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {result.context_explanation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confidence Score */}
          {result.confidence && (
            <div className="text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                Translation Confidence: {Math.round(result.confidence * 100)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 