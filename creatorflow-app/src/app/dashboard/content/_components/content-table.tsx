import React, { useState, useRef, useEffect } from 'react';
import { Edit, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';

interface Post {
  id: string;
  contentText?: string;
  status: string;
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContentTableProps {
  posts: Post[];
  loading: boolean;
  error: any;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onDuplicate: (post: Post) => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-gray-200', text: 'text-gray-700' },
  SCHEDULED: { bg: 'bg-blue-100', text: 'text-blue-700' },
  PUBLISHING: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  PUBLISHED: { bg: 'bg-green-100', text: 'text-green-700' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function ContentTable({ posts, loading, error, onEdit, onDelete, onDuplicate }: ContentTableProps) {
  console.log('🎠 ContentTable component called with:', { posts, loading, error });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Post | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);



  // Auto-advance carousel
  useEffect(() => {
    if (!autoPlay || posts.length <= 3) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 4000); // Change card every 4 seconds

    return () => clearInterval(interval);
  }, [autoPlay, posts.length]);

  if (loading) return (
    <div className="py-8 text-center text-gray-500">
      Loading content...
    </div>
  );
  
  if (error) return (
    <div className="py-8 text-center text-red-500">
      Error loading content: {error}
    </div>
  );
  
  if (!posts || posts.length === 0) return (
    <div className="py-8 text-center text-gray-500">
      No content found. Posts array: {JSON.stringify(posts)}
    </div>
  );

  const handleCardClick = (post: Post) => {
    setSelectedItem(post);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedItem(null);
  };

  const getStatusConfig = (status: string) => {
    return statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  // Calculate which cards to show based on current index
  const getVisibleCards = () => {
    const cards = [];
    const totalCards = posts.length;
    
    if (totalCards <= 3) {
      // Show all cards if 3 or fewer
      return posts.map((post, index) => ({ post, index, isMain: index === currentIndex }));
    }
    
    // Show 3 cards with current card in center
    for (let i = -1; i <= 1; i++) {
      const cardIndex = (currentIndex + i + totalCards) % totalCards;
      const isMain = i === 0;
      cards.push({ post: posts[cardIndex], index: cardIndex, isMain });
    }
    
    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <div className="mb-20 sm:mb-8"> {/* Bottom margin to clear bottom navigation */}
      {/* Carousel Container */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '100%', // Full width on mobile
        margin: '0 auto', 
        padding: '8px' // Reduced padding for mobile
      }}>
        
        {/* Navigation Arrows */}
        {posts.length > 3 && (
          <>
            <button
              onClick={prevCard}
              style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%', padding: '8px', color: '#374151', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              aria-label="Previous card"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextCard}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%', padding: '8px', color: '#374151', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              aria-label="Next card"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Scroll Indicator */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#6b7280', 
          marginBottom: '8px',
          padding: '0 16px'
        }}>
          ← Swipe left/right to see more content →
        </div>
        
        {/* Cards Container - Horizontal Scrollable */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '16px 16px',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          {/* Custom scrollbar styling */}
          <style jsx>{`
            div::-webkit-scrollbar {
              height: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>
          
          {visibleCards.map(({ post, index, isMain }) => {
            const statusConfig = getStatusConfig(post.status);
            return (
              <div
                key={`${post.id}-${index}`}
                style={{
                  width: isMain ? '260px' : '180px', // Even smaller for mobile
                  minWidth: isMain ? '260px' : '180px', // Ensure minimum width
                  flexShrink: 0,
                  transform: isMain ? 'scale(1)' : 'scale(0.95)',
                  opacity: isMain ? 1 : 0.8,
                  zIndex: isMain ? 20 : 10,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  scrollSnapAlign: 'center'
                }}
                onClick={() => handleCardClick(post)}
              >
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: isMain ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease-in-out'
                }}>
                  <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Title and Actions Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h6 style={{ 
                        fontWeight: '600',
                        color: '#111827',
                        flex: 1,
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        fontSize: isMain ? '16px' : '14px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                    {post.contentText || 'No content'}
                      </h6>
                      {isMain && (
                        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
                          <button
                            style={{ padding: '4px', color: '#2563eb', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(post);
                            }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            style={{ padding: '4px', color: '#4b5563', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicate(post);
                            }}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      )}
                </div>

                    {/* Status */}
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: statusConfig.bg === 'bg-green-100' ? '#dcfce7' : 
                                       statusConfig.bg === 'bg-yellow-100' ? '#fef3c7' : 
                                       statusConfig.bg === 'bg-blue-100' ? '#dbeafe' : '#f3f4f6',
                        color: statusConfig.bg === 'bg-green-100' ? '#166534' : 
                               statusConfig.bg === 'bg-yellow-100' ? '#92400e' : 
                               statusConfig.bg === 'bg-blue-100' ? '#1e40af' : '#374151'
                      }}>
                  {post.status}
                </span>
                    </div>

                    {/* Platforms */}
                    <div style={{ marginTop: 'auto' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '8px' }}>Platforms:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {post.platforms.map((platform) => (
                          <span
                            key={platform}
                            style={{
                              display: 'inline-flex',
                              padding: '4px 8px',
                              fontSize: '12px',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                      {platform}
                    </span>
                  ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot Indicators */}
        {posts.length > 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToCard(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: index === currentIndex ? '#2563eb' : '#d1d5db',
                  transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s ease-in-out'
                }}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Auto-play Toggle */}
        {posts.length > 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: autoPlay ? '#2563eb' : '#e5e7eb',
                color: autoPlay ? 'white' : '#374151',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {autoPlay ? '⏸️ Pause Auto-advance' : '▶️ Resume Auto-advance'}
            </button>
          </div>
        )}
        
        {/* Bottom Spacer to Clear Bottom Navigation */}
        <div style={{
          height: '120px',
          width: '100%'
        }} />
      </div>

      {/* Detail Modal */}
      {detailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Details</h3>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Title</h4>
                  <p className="text-gray-700">{selectedItem.contentText || 'No content'}</p>
                </div>

                {/* Status and Platforms */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusConfig(selectedItem.status).bg} ${getStatusConfig(selectedItem.status).text}`}>
                    {selectedItem.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Platforms</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Schedule Information */}
                {selectedItem.scheduledAt && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Scheduled</h4>
                    <p className="text-gray-700">{new Date(selectedItem.scheduledAt).toLocaleDateString()}</p>
                  </div>
                )}

                {selectedItem.publishedAt && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Published</h4>
                    <p className="text-gray-700">{new Date(selectedItem.publishedAt).toLocaleDateString()}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => {
                      onEdit(selectedItem);
                      closeDetailModal();
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate(selectedItem);
                      closeDetailModal();
                    }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      onDelete(selectedItem);
                      closeDetailModal();
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <div className="h-32 sm:h-10 w-full"></div>
    </div>
  );
} 