import React, { useState, useEffect } from 'react';
import { Globe, Camera, Type, Mic, Volume2 } from 'lucide-react';
import { translationApi } from '../services/api';
import { Language } from '../types/api';
import { useNotification } from '../components/ui/NotificationProvider';
import { TextTranslation } from '../components/translation/TextTranslation';
import { ImageTranslation } from '../components/translation/ImageTranslation';

export const TranslationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await translationApi.getLanguages();
        setLanguages(response.languages);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        addNotification('error', 'Failed to load supported languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [addNotification]);

  const tabs = [
    {
      id: 'text' as const,
      name: 'Text Translation',
      icon: Type,
      description: 'Translate text with cultural context'
    },
    {
      id: 'image' as const,
      name: 'Image Translation',
      icon: Camera,
      description: 'Translate text from photos and documents'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-3">
          <div className="loading-spinner"></div>
          <span className="text-gray-600">Loading translation service...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            AI Translation
          </h1>
        </div>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get instant translations with cultural context and pronunciation guides 
          to help you communicate effectively in your new environment.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 p-1 bg-gray-100 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-primary-700 border border-primary-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">{tab.name}</div>
                <div className="text-sm opacity-75">{tab.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'text' && (
          <TextTranslation languages={languages} />
        )}
        
        {activeTab === 'image' && (
          <ImageTranslation languages={languages} />
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Why Our Translation is Different
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Cultural Context</h3>
              <p className="text-sm text-gray-600">
                Learn not just what to say, but how to say it appropriately in different situations
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center mx-auto">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Pronunciation Help</h3>
              <p className="text-sm text-gray-600">
                Get phonetic guides and audio pronunciations to speak with confidence
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center mx-auto">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Regional Variations</h3>
              <p className="text-sm text-gray-600">
                Understand local expressions and variations specific to your region
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 