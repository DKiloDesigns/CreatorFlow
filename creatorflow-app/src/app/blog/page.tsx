'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  TextField,
  Grid,
  Container
} from '@mui/material';
import { Person as PersonIcon, CalendarToday as CalendarTodayIcon, AccessTime as AccessTimeIcon, ArrowRight as ArrowRightIcon, MailOutline as MailOutlineIcon } from '@mui/icons-material';
import Link from 'next/link';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';

const featuredPosts = [
  {
    id: 1,
    title: "10 Ways to Grow Your Social Media Following in 2025",
    excerpt: "Discover the latest strategies that successful creators are using to build engaged audiences across all platforms.",
    author: "Derrell Kilo",
    date: "January 15, 2025",
    readTime: "5 min read",
    category: "Growth",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "The Complete Guide to TikTok Monetization",
    excerpt: "From Creator Fund to brand partnerships, learn how to turn your TikTok content into a sustainable income stream.",
    author: "Shawn Montgomery",
    date: "January 12, 2025",
    readTime: "8 min read",
    category: "Monetization",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "AI Tools Every Creator Should Know About",
    excerpt: "Explore the latest AI-powered tools that can help you create better content, faster, and with less effort.",
    author: "Lloyd Alexander",
    date: "January 10, 2025",
    readTime: "6 min read",
    category: "Tools",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecadf41?w=400&h=250&fit=crop"
  }
];

const categories = [
  { name: "Growth", count: 12 },
  { name: "Monetization", count: 8 },
  { name: "Tools", count: 15 },
  { name: "Strategy", count: 10 },
  { name: "Platform Updates", count: 6 },
  { name: "Creator Stories", count: 4 }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            CreatorFlow Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Insights, strategies, and stories to help you succeed in the creator economy.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured Posts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h3" sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary', 
                    mb: 1.5, 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'text.secondary', 
                    mb: 2, 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {post.excerpt}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ width: 16, height: 16 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {post.author}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ width: 16, height: 16 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {post.date}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ width: 16, height: 16 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {post.readTime}
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      href={`/blog/${post.id}`}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { color: 'primary.dark' },
                        fontWeight: 500,
                        p: 0,
                        minHeight: 'auto',
                        textTransform: 'none'
                      }}
                    >
                      Read More
                      <ArrowRightIcon sx={{ width: 16, height: 16 }} className="ml-2" />
                    </Button>
                  </Box>
                </CardContent>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Categories */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Categories</h2>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/blog/category/${category.name.toLowerCase()}`}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{category.count} posts</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-8 border border-gray-200 dark:border-gray-600">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get the latest creator tips, platform updates, and success stories delivered to your inbox.
              </p>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition flex items-center justify-center gap-2"
                >
                  <MailOutlineIcon sx={{ width: 16, height: 16 }} />
                  Subscribe to Newsletter
                </button>
              </form>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Recent Posts</h2>
          
          <div className="space-y-6">
            {featuredPosts.slice(0, 3).map((post) => (
              <article key={post.id} className="flex gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-32 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
      {/* Bottom Spacer to Clear Bottom Navigation */}
      <div className="h-32 sm:h-10 w-full"></div>
} 