import React from 'react';
import { Heart, Globe, Shield, Users, Award, Target } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We believe everyone deserves dignity, understanding, and support when navigating 
            a new country. Our AI-powered platform breaks down language barriers and simplifies 
            complex bureaucratic processes.
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Heart className="w-6 h-6 text-red-500" />
          <span className="text-lg font-medium text-gray-700">
            Built with love for humanity
          </span>
        </div>
      </section>

      {/* Values Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Accessibility</h3>
          <p className="text-gray-600">
            Making information accessible in over 100 languages with cultural context 
            that helps people understand not just what to say, but how to say it.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Privacy</h3>
          <p className="text-gray-600">
            Your personal information and documents are processed securely. 
            We never store sensitive data and respect your privacy completely.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-success-500 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Empathy</h3>
          <p className="text-gray-600">
            Every feature is designed with deep understanding of the refugee experience 
            and the challenges of starting over in a new country.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Story
            </h2>
            <p className="text-lg text-gray-600">
              Born from real experiences and a desire to help
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-warning-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    The Problem
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every year, millions of people are forced to leave their homes and start new lives 
                    in foreign countries. They face an overwhelming maze of government forms, legal documents, 
                    and bureaucratic processes—all in languages they may not fully understand. Simple tasks 
                    like applying for benefits, finding housing, or getting work permits become insurmountable 
                    challenges.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Our Solution
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We harness the power of artificial intelligence to break down these barriers. 
                    Our platform doesn't just translate words—it provides cultural context, explains 
                    bureaucratic processes, and guides users through each step of complex forms. 
                    We make the system work for people, not against them.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Our Impact
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Since launch, we've helped over 100,000 people navigate their new countries with 
                    confidence. Our users report feeling more empowered, less anxious about bureaucratic 
                    processes, and better connected to their new communities. Every successful form 
                    submission, every understood document, every barrier broken is a victory for human dignity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-3xl md:text-4xl font-bold text-primary-600">
            100,000+
          </div>
          <p className="text-gray-600 font-medium">People Helped</p>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl md:text-4xl font-bold text-secondary-600">
            100+
          </div>
          <p className="text-gray-600 font-medium">Languages Supported</p>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl md:text-4xl font-bold text-success-600">
            50+
          </div>
          <p className="text-gray-600 font-medium">Countries Covered</p>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl md:text-4xl font-bold text-warning-600">
            1M+
          </div>
          <p className="text-gray-600 font-medium">Translations Completed</p>
        </div>
      </section>

      {/* Team Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Built by Humans, for Humans
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our diverse team includes refugees, immigrants, linguists, AI researchers, 
            and human rights advocates. We build this platform not just as technologists, 
            but as people who understand the struggle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card text-left">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recognition
                </h3>
                <p className="text-gray-600">
                  Winner of the UN Global Goals Innovation Challenge and 
                  recognized by the International Rescue Committee for our impact.
                </p>
              </div>
            </div>
          </div>

          <div className="card text-left">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-primary-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Community
                </h3>
                <p className="text-gray-600">
                  Working with refugee support organizations worldwide to ensure 
                  our platform meets real community needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Join Our Mission
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Whether you're someone who needs help navigating a new country, 
            or someone who wants to support this mission, you're welcome here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Get Help Now
            </button>
            <button className="border border-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Support Our Work
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}; 