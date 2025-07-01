import React, { useState, useEffect } from 'react';
import { FileText, Search, Upload, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formsApi } from '../services/api';
import { FormTemplate, FormCategory } from '../types/api';
import { useNotification } from '../components/ui/NotificationProvider';

export const FormsPage: React.FC = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [categories, setCategories] = useState<FormCategory[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesResponse, categoriesResponse] = await Promise.all([
          formsApi.getTemplates(),
          formsApi.getCategories()
        ]);
        
        setTemplates(templatesResponse.templates);
        setCategories(categoriesResponse.categories);
        setCountries(templatesResponse.countries);
      } catch (error) {
        console.error('Failed to fetch form data:', error);
        addNotification('error', 'Failed to load form templates');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    const matchesCountry = !selectedCountry || template.country === selectedCountry;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesCountry && matchesSearch;
  });

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'low':
        return 'bg-success-100 text-success-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'high':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-3">
          <div className="loading-spinner"></div>
          <span className="text-gray-600">Loading form templates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-orange-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Form Assistance
          </h1>
        </div>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get help with government forms and official documents. Browse templates 
          or upload your own form for detailed field-by-field guidance.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/forms/analyze"
          className="group card hover:shadow-md transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-primary-300"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Your Form
              </h3>
              <p className="text-gray-600 mb-4">
                Get instant analysis and step-by-step guidance for any government form or document
              </p>
              <div className="flex items-center justify-center space-x-2 text-primary-600 font-medium">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Browse Templates
              </h3>
              <p className="text-gray-600 mb-4">
                Explore pre-analyzed forms for common government processes and applications
              </p>
              <div className="text-secondary-600 font-medium">
                {templates.length} forms available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Form Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
              className={`card text-left hover:shadow-md transition-all duration-200 ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-primary-500 bg-primary-50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="space-y-3">
                <div className="text-2xl">
                  {category.icon === 'passport' && '🛂'}
                  {category.icon === 'briefcase' && '💼'}
                  {category.icon === 'heart' && '❤️'}
                  {category.icon === 'medical' && '🏥'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="select-field min-w-40"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {/* Form Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Forms
          </h2>
          <span className="text-gray-600">
            {filteredTemplates.length} of {templates.length} forms
          </span>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {template.country}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {template.difficulty && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {template.category}
                      </span>
                    </div>
                    
                    {template.estimated_time && (
                      <span className="text-xs text-gray-500">
                        ⏱️ {template.estimated_time}
                      </span>
                    )}
                  </div>

                  <button className="w-full btn-outline text-sm">
                    View Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 