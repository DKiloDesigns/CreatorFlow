'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as Volume2Icon,
  VolumeOff as VolumeXIcon,
  Fullscreen as MaximizeIcon,
  FullscreenExit as MinimizeIcon,
  FastRewind as SkipBackIcon,
  FastForward as SkipForwardIcon,
  Download as DownloadIcon,
  Share as Share2Icon,
  Bookmark as BookmarkIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortAscIcon,
  AccessTime as ClockIcon,
  Visibility as EyeIcon,
  ThumbUp as ThumbsUpIcon
} from '@mui/icons-material';

interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number; // in seconds
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  author: string;
  views: number;
  likes: number;
  createdAt: string;
  featured: boolean;
  transcript?: string;
  chapters?: Array<{
    title: string;
    startTime: number;
    endTime: number;
  }>;
}

interface VideoLibraryProps {
  videos: VideoMetadata[];
  onVideoSelect?: (video: VideoMetadata) => void;
  onVideoComplete?: (videoId: string) => void;
  className?: string;
}

export function VideoLibrary({ videos, onVideoSelect, onVideoComplete, className }: VideoLibraryProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filter and sort videos
  const filteredVideos = videos
    .filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || video.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

  // Video controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Check for chapter changes
      if (selectedVideo?.chapters) {
        const currentChapterIndex = selectedVideo.chapters.findIndex(
          chapter => currentTime >= chapter.startTime && currentTime < chapter.endTime
        );
        if (currentChapterIndex !== -1 && currentChapterIndex !== currentChapter) {
          setCurrentChapter(currentChapterIndex);
        }
      }
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const skipToChapter = (chapterIndex: number) => {
    if (selectedVideo?.chapters && videoRef.current) {
      const chapter = selectedVideo.chapters[chapterIndex];
      videoRef.current.currentTime = chapter.startTime;
      setCurrentChapter(chapterIndex);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoSelect = (video: VideoMetadata) => {
    setSelectedVideo(video);
    setCurrentTime(0);
    setCurrentChapter(0);
    setIsPlaying(false);
    onVideoSelect?.(video);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onVideoComplete?.(selectedVideo!.id);
  };

  // Auto-play next video
  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      const video = videoRef.current;
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleVideoEnd);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [selectedVideo]);

  return (
    <Box className={className}>
      {/* Search and Filter Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {[...new Set(videos.map(v => v.category))].map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="likes">Most Liked</MenuItem>
            <MenuItem value="duration">Duration</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Video Grid */}
      <Grid container spacing={3}>
        {filteredVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { 
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
              onClick={() => handleVideoSelect(video)}
            >
              <Box sx={{ position: 'relative', height: 200 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <IconButton sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}>
                    <PlayIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                </Box>
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem'
                  }}
                >
                  {formatTime(video.duration)}
                </Box>
              </Box>
              
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.2 }}>
                  {video.title}
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.4 }}>
                  {video.description.substring(0, 100)}...
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip 
                    label={video.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={video.difficulty} 
                    size="small" 
                    color={video.difficulty === 'beginner' ? 'success' : video.difficulty === 'intermediate' ? 'warning' : 'error'}
                    variant="outlined" 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EyeIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{video.views}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ThumbsUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{video.likes}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ClockIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{formatTime(video.duration)}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Video Player Modal */}
      <Dialog
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            bgcolor: 'black',
            color: 'white'
          }
        }}
      >
        {selectedVideo && (
          <>
            <DialogTitle sx={{ pb: 1, bgcolor: 'black', color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {selectedVideo.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => setShowTranscript(!showTranscript)} size="small">
                    <FilterIcon />
                  </IconButton>
                  <IconButton onClick={() => setSelectedVideo(null)} size="small">
                    <MinimizeIcon />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
              <Box sx={{ position: 'relative', bgcolor: 'black' }}>
                <video
                  ref={videoRef}
                  src={selectedVideo.url}
                  poster={selectedVideo.thumbnail}
                  style={{
                    width: '100%',
                    height: isMobile ? 'auto' : '500px',
                    objectFit: 'contain'
                  }}
                  onClick={togglePlayPause}
                />
                
                {/* Video Controls Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {/* Progress Bar */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ minWidth: 40 }}>
                      {formatTime(currentTime)}
                    </Typography>
                    <Slider
                      value={currentTime}
                      min={0}
                      max={selectedVideo.duration}
                      onChange={(_, value) => handleSeek(value as number)}
                      sx={{ flex: 1 }}
                    />
                    <Typography variant="caption" sx={{ minWidth: 40 }}>
                      {formatTime(selectedVideo.duration)}
                    </Typography>
                  </Box>
                  
                  {/* Control Buttons */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={togglePlayPause} sx={{ color: 'white' }}>
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </IconButton>
                    
                    <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                      {isMuted ? <VolumeXIcon /> : <Volume2Icon />}
                    </IconButton>
                    
                    <Slider
                      value={volume}
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={(_, value) => handleVolumeChange(value as number)}
                      sx={{ width: 100 }}
                    />
                    
                    <Box sx={{ flex: 1 }} />
                    
                    <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                      <MaximizeIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              
              {/* Video Info and Chapters */}
              <Box sx={{ p: 3, bgcolor: 'black' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedVideo.title}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  {selectedVideo.description}
                </Typography>
                
                {/* Chapters */}
                {selectedVideo.chapters && selectedVideo.chapters.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Chapters
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {selectedVideo.chapters.map((chapter, index) => (
                        <Button
                          key={index}
                          variant={currentChapter === index ? 'contained' : 'outlined'}
                          onClick={() => skipToChapter(index)}
                          sx={{ 
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            color: currentChapter === index ? 'black' : 'white',
                            borderColor: 'white'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption">
                              {formatTime(chapter.startTime)}
                            </Typography>
                            <Typography variant="body2">
                              {chapter.title}
                            </Typography>
                          </Box>
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Transcript */}
                {showTranscript && selectedVideo.transcript && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Transcript
                    </Typography>
                    <Box
                      sx={{
                        maxHeight: 200,
                        overflow: 'auto',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        p: 2,
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {selectedVideo.transcript}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
