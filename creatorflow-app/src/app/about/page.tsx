'use client';

import Link from 'next/link';
import { Users, Target, Heart, Zap, Shield, Globe } from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Empowering Creators Worldwide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            We're building the future of content creation, one creator at a time.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              To democratize content creation by providing creators with the tools, insights, and opportunities they need to succeed in the digital economy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Empower</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Give creators the tools and insights they need to grow their audience and income.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build a community where creators can learn, collaborate, and succeed together.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Innovate</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Continuously develop cutting-edge tools that adapt to the evolving creator economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Creator-First</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every decision we make is guided by what's best for creators and their communities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transparency</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe in open communication and clear, honest relationships with our users.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Inclusivity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We celebrate diversity and create tools that work for creators from all backgrounds.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We constantly push boundaries to deliver cutting-edge solutions for creators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A passionate group of creators, developers, and entrepreneurs building the future of content creation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                DM
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Derrell Kilo</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Founder & CEO</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Former creator turned entrepreneur, passionate about empowering the next generation of digital creators.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                SM
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Shawn Montgomery</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">CTO</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tech leader with 15+ years building scalable platforms for creators and businesses.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                LA
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Lloyd Alexander</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Head of Product</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Product strategist focused on creating intuitive experiences that creators love to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Creator Journey?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of creators who are already using CreatorFlow to grow their audience and income.
          </p>
          <Link 
            href="/auth" 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg px-8 py-3 shadow hover:from-blue-600 hover:to-purple-700 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
} 