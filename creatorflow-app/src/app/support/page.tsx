'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Shield, Mail, MessageCircle, HelpCircle, Users, BarChart3, Search, BookOpen, MessageSquare, Phone } from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';

const helpCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of CreatorFlow",
    icon: BookOpen,
    articles: 12
  },
  {
    title: "Account & Billing",
    description: "Manage your account and payments",
    icon: Users,
    articles: 8
  },
  {
    title: "Content Creation",
    description: "Tips for creating great content",
    icon: FileText,
    articles: 15
  },
  {
    title: "Analytics & Insights",
    description: "Understand your performance data",
    icon: BarChart3,
    articles: 10
  }
];

const contactMethods = [
  {
    title: "Email Support",
    description: "Get help via email",
    icon: Mail,
    contact: "support@creatorflow.com",
    response: "Within 24 hours"
  },
  {
    title: "Live Chat",
    description: "Chat with our team",
    icon: MessageSquare,
    contact: "Available 9AM-6PM PST",
    response: "Real-time"
  },
  {
    title: "Phone Support",
    description: "Call us directly",
    icon: Phone,
    contact: "+1 (555) 123-4567",
    response: "Mon-Fri 9AM-6PM PST"
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Find answers, get support, and learn how to make the most of CreatorFlow.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Help Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.title}
                  href={`/support/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {category.description}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.articles} articles
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Get in Touch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.title} className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {method.description}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {method.contact}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {method.response}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legal & Policies */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Legal & Policies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/terms" 
              className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Terms of Service
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Read our terms and conditions
                </p>
              </div>
            </Link>
            
            <Link 
              href="/privacy" 
              className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Privacy Policy
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Learn how we protect your data
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How do I get started with CreatorFlow?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up for a free account and connect your social media platforms. Our guided setup will help you get started in minutes.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What platforms does CreatorFlow support?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We support all major platforms including Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook, and more.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How much does CreatorFlow cost?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We offer a free plan to get started, with Pro plans starting at $12/month for advanced features and analytics.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we use industry-standard encryption and security measures to protect your data and account information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg px-8 py-3 shadow hover:from-blue-600 hover:to-purple-700 transition"
            >
              Contact Support
            </Link>
            <Link 
              href="/auth" 
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg px-8 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 