import React from 'react'
import { render, screen } from '@testing-library/react'
import { FeatureCard } from '@/components/FeatureCard'
import '@testing-library/jest-dom'

const mockPost = {
  id: '1',
  contentText: 'Test post content',
  platforms: ['instagram', 'twitter'],
  status: 'published' as const,
  publishedAt: new Date('2025-01-15T10:30:00Z'),
  engagement: {
    likes: 150,
    comments: 25,
    shares: 10,
  },
  hashtags: ['#test', '#social'],
  mentions: ['@testuser'],
  mediaUrls: ['https://example.com/image.jpg'],
  scheduledAt: null,
  createdAt: new Date('2025-01-15T10:00:00Z'),
  updatedAt: new Date('2025-01-15T10:30:00Z'),
}

describe('FeatureCard (stand-in for PostCard)', () => {
  it('renders without crashing', () => {
    render(
      <FeatureCard title={mockPost.contentText} description={mockPost.platforms.join(', ')} icon="🔥" />
    )
    expect(screen.getByText('Test post content')).toBeInTheDocument()
    expect(screen.getByText('instagram, twitter')).toBeInTheDocument()
  })
}) 