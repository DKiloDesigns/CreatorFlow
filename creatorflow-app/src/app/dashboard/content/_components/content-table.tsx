import React, { useState, useRef, useEffect } from 'react';
import { Edit, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  IconButton,
  Chip
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

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

const statusColors: Record<string, { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
  DRAFT: { color: 'default' },
  SCHEDULED: { color: 'info' },
  PUBLISHING: { color: 'warning' },
  PUBLISHED: { color: 'success' },
  FAILED: { color: 'error' },
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
    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
      Loading content...
    </Box>
  );

  if (error) return (
    <Box sx={{ py: 4, textAlign: 'center', color: 'error.main' }}>
      Error loading content: {error}
    </Box>
  );

  if (!posts || posts.length === 0) return (
    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
      No content found. Posts array: {JSON.stringify(posts)}
    </Box>
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
    return statusColors[status] || { color: 'default' };
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
    <Box sx={{ mb: { xs: 20, sm: 8 } }}> {/* Bottom margin to clear bottom navigation */}
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
                        color: 'var(--mui-palette-text-primary)',
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
                        backgroundColor: statusConfig.color === 'success' ? '#dcfce7' : 
                                       statusConfig.color === 'warning' ? '#fef3c7' : 
                                       statusConfig.color === 'info' ? '#dbeafe' : '#f3f4f6',
                        color: statusConfig.color === 'success' ? '#166534' : 
                               statusConfig.color === 'warning' ? '#92400e' : 
                               statusConfig.color === 'info' ? '#1e40af' : '#374151'
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
        <Dialog
          open={detailModalOpen}
          onClose={closeDetailModal}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              m: { xs: 1, sm: 2 },
              maxHeight: { xs: '95vh', sm: '90vh' },
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>Content Details</Typography>
              <IconButton onClick={closeDetailModal}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ 
            p: { xs: 2, sm: 3 }, 
            pb: { xs: 6, sm: 3 },
            maxWidth: '100%',
            overflow: 'hidden',
            '& *': { maxWidth: '100%' }
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '100%', overflow: 'hidden' }}>
              {/* Title */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, wordBreak: 'break-word' }}>Title</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                  {selectedItem.contentText || 'No content'}
                </Typography>
              </Box>

              {/* Status and Platforms */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Status</Typography>
                <Chip
                  label={selectedItem.status}
                  color={getStatusConfig(selectedItem.status).color as any}
                  size="small"
                  variant="filled"
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Platforms</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedItem.platforms.map((platform) => (
                    <Chip
                      key={platform}
                      label={platform}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Schedule Information */}
              {selectedItem.scheduledAt && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Scheduled</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedItem.scheduledAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {selectedItem.publishedAt && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Published</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedItem.publishedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {/* Actions */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                pt: 2, 
                borderTop: 1, 
                borderColor: 'divider',
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  onClick={() => {
                    onEdit(selectedItem);
                    closeDetailModal();
                  }}
                  variant="contained"
                  fullWidth
                  sx={{ flex: 1 }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    onDuplicate(selectedItem);
                    closeDetailModal();
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{ flex: 1 }}
                >
                  Duplicate
                </Button>
                <Button
                  onClick={() => {
                    onDelete(selectedItem);
                    closeDetailModal();
                  }}
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{ flex: 1 }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{ height: { xs: 32, sm: 10 }, width: '100%' }} />
    </Box>
  );
} 