'use client';

import React, { useState } from 'react';
import { useUserSupport } from '@/hooks/useUserSupport';
import Link from 'next/link';
import { FileText, Shield, Mail, MessageCircle, HelpCircle, Users, BarChart3 } from 'lucide-react';

export default function SupportPage() {
  const { loading, error, success, submitFeedback, setSuccess, setError } = useUserSupport();
  const [feedback, setFeedback] = useState('');

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    await submitFeedback(feedback);
    setFeedback('');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Support & Help Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resources Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Resources
            </h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  <FileText className="h-4 w-4" />
                  FAQ / Knowledge Base
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  <BarChart3 className="h-4 w-4" />
                  System Status
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  <Users className="h-4 w-4" />
                  Community / Forum
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Support Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Contact Support
            </h2>
            <div className="space-y-3">
              <a 
                href="mailto:support@creatorflow.com" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </a>
              <button 
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors ml-2" 
                disabled
              >
                <MessageCircle className="h-4 w-4" />
                Live Chat (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Feedback Section */}
        <div className="space-y-6">
          {/* Legal & Policies Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Legal & Policies
            </h2>
            <div className="space-y-3">
              <Link 
                href="/terms" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Terms of Service
              </Link>
              <Link 
                href="/privacy" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <Shield className="h-4 w-4" />
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Feedback</h2>
            <form className="space-y-4" onSubmit={handleFeedback}>
              <textarea 
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                placeholder="Your feedback helps us improve CreatorFlow..." 
                rows={4} 
                value={feedback} 
                onChange={e => setFeedback(e.target.value)} 
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50" 
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
              {success && <div className="text-green-600 dark:text-green-400 text-sm">{success}</div>}
              {error && <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 