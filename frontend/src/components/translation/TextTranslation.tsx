import React, { useState } from 'react';
import { Copy, Volume2, RotateCcw, Check, Lightbulb } from 'lucide-react';
import { translationApi } from '../../services/api';
import { Language, TranslationResponse } from '../../types/api';
import { useNotification } from '../ui/NotificationProvider';

interface TextTranslationProps {
  languages: Language[];
}

export const TextTranslation: React.FC<TextTranslationProps> = ({ languages }) => {
  const [inputText, setInputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotification();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      addNotification('error', 'Please enter some text to translate');
      return;
    }

    setLoading(true);
    try {
      const response = await translationApi.translateText({
        text: inputText,
        source_language: sourceLanguage || undefined,
        target_language: targetLanguage,
        context: context || undefined,
      });
      
      setResult(response);
      addNotification('success', 'Translation completed successfully!');
    } catch (error: any) {
      addNotification('error', error.message || 'Translation failed');
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

  const handleClear = () => {
    setInputText('');
    setContext('');
    setResult(null);
  };

  const handleSwapLanguages = () => {
    if (result && sourceLanguage) {
      setSourceLanguage(targetLanguage);
      setTargetLanguage(result.source_language);
      setInputText(result.translated_text);
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Language */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              From
            </h3>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="select-field min-w-40"
            >
              <option value="">Auto-detect</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native_name}
                </option>
              ))}
            </select>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            className="textarea-field h-32 resize-none"
            maxLength={5000}
          />
          
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            <span>{inputText.length}/5000 characters</span>
            {inputText && (
              <button
                onClick={handleClear}
                className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Target Language */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              To
            </h3>
            <div className="flex items-center space-x-2">
              {result && sourceLanguage && (
                <button
                  onClick={handleSwapLanguages}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  title="Swap languages"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="select-field min-w-40"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="h-32 bg-gray-50 rounded-lg p-4 flex items-center justify-center relative">
            {loading ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="loading-spinner"></div>
                <span>Translating...</span>
              </div>
            ) : result ? (
              <div className="w-full">
                <p className="text-gray-900 font-medium mb-2">
                  {result.translated_text}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-success-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                      <Volume2 className="w-4 h-4" />
                      <span>Listen</span>
                    </button>
                  </div>
                  {result.confidence && (
                    <span className="text-xs text-gray-500">
                      {Math.round(result.confidence * 100)}% confidence
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-gray-400">Translation will appear here</span>
            )}
          </div>
        </div>
      </div>

      {/* Context Input */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Context (Optional)
        </label>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., Medical appointment, job interview, emergency..."
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">
          Providing context helps us give more accurate cultural explanations
        </p>
      </div>

      {/* Translate Button */}
      <div className="text-center">
        <button
          onClick={handleTranslate}
          disabled={!inputText.trim() || loading}
          className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="loading-spinner"></div>
              <span>Translating...</span>
            </div>
          ) : (
            'Translate'
          )}
        </button>
      </div>

      {/* Cultural Context */}
      {result?.context_explanation && (
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

      {/* Language Detection */}
      {result && (
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <span>Detected: {result.source_language}</span>
          <span>→</span>
          <span>Translated to: {result.target_language}</span>
        </div>
      )}
    </div>
  );
}; 