/**
 * CreatorFlow Academy Dashboard
 * Main interface for course browsing, enrollment, and learning
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Avatar,
  Rating,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  School as SchoolIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  TrendingUp as TrendingUpIcon,
  NewReleases as NewReleasesIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  ExpandMore as ExpandMoreIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorAvatar: string;
  thumbnail: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'strategy' | 'content' | 'analytics' | 'platforms' | 'growth' | 'monetization';
  tags: string[];
  price: number;
  isFree: boolean;
  isPremium: boolean;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  lessons: Lesson[];
  prerequisites: string[];
  learningOutcomes: string[];
  createdAt: string;
  status: 'draft' | 'published' | 'archived';
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'resource';
  duration: number;
  order: number;
  isFree: boolean;
}

interface Enrollment {
  id: string;
  courseId: string;
  progress: number;
  currentLessonId?: string;
  completedAt?: string;
  certificateEarned: boolean;
}

export default function AcademyDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Load courses and enrollments
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Instagram Growth Masterclass',
          description: 'Learn the secrets to growing your Instagram following from 0 to 100K+',
          instructor: 'Sarah Johnson',
          instructorBio: 'Social media strategist with 500K+ followers',
          instructorAvatar: '/avatars/sarah.jpg',
          thumbnail: '/course-thumbnails/instagram-growth.jpg',
          duration: 120,
          difficulty: 'intermediate',
          category: 'growth',
          tags: ['instagram', 'growth', 'engagement', 'strategy'],
          price: 99,
          isFree: false,
          isPremium: true,
          rating: 4.8,
          reviewCount: 124,
          enrollmentCount: 1250,
          lessons: [
            { id: 'l1', title: 'Introduction to Instagram Growth', type: 'video', duration: 15, order: 1, isFree: true },
            { id: 'l2', title: 'Content Strategy Fundamentals', type: 'video', duration: 20, order: 2, isFree: false },
            { id: 'l3', title: 'Hashtag Research Mastery', type: 'video', duration: 18, order: 3, isFree: false },
            { id: 'l4', title: 'Engagement Strategies', type: 'video', duration: 25, order: 4, isFree: false },
            { id: 'l5', title: 'Analytics and Optimization', type: 'video', duration: 22, order: 5, isFree: false },
            { id: 'l6', title: 'Final Quiz', type: 'quiz', duration: 10, order: 6, isFree: false }
          ],
          prerequisites: ['Basic Instagram knowledge'],
          learningOutcomes: ['Grow Instagram following', 'Increase engagement rates', 'Master content strategy'],
          createdAt: new Date().toISOString(),
          status: 'published'
        },
        {
          id: '2',
          title: 'TikTok Content Creation',
          description: 'Create viral TikTok content that gets millions of views',
          instructor: 'Mike Chen',
          instructorBio: 'TikTok creator with 2M+ followers',
          instructorAvatar: '/avatars/mike.jpg',
          thumbnail: '/course-thumbnails/tiktok-content.jpg',
          duration: 90,
          difficulty: 'beginner',
          category: 'content',
          tags: ['tiktok', 'content', 'viral', 'creation'],
          price: 0,
          isFree: true,
          isPremium: false,
          rating: 4.6,
          reviewCount: 89,
          enrollmentCount: 2100,
          lessons: [
            { id: 'l1', title: 'TikTok Basics', type: 'video', duration: 12, order: 1, isFree: true },
            { id: 'l2', title: 'Content Ideas', type: 'video', duration: 18, order: 2, isFree: true },
            { id: 'l3', title: 'Editing Techniques', type: 'video', duration: 20, order: 3, isFree: true },
            { id: 'l4', title: 'Trending Sounds', type: 'video', duration: 15, order: 4, isFree: true },
            { id: 'l5', title: 'Posting Strategy', type: 'video', duration: 15, order: 5, isFree: true },
            { id: 'l6', title: 'Analytics Review', type: 'video', duration: 10, order: 6, isFree: true }
          ],
          prerequisites: ['TikTok account'],
          learningOutcomes: ['Create engaging TikTok content', 'Understand viral trends', 'Master TikTok analytics'],
          createdAt: new Date().toISOString(),
          status: 'published'
        },
        {
          id: '3',
          title: 'Social Media Analytics Deep Dive',
          description: 'Master social media analytics to optimize your content strategy',
          instructor: 'Dr. Lisa Wang',
          instructorBio: 'Data scientist specializing in social media analytics',
          instructorAvatar: '/avatars/lisa.jpg',
          thumbnail: '/course-thumbnails/analytics-deep-dive.jpg',
          duration: 150,
          difficulty: 'advanced',
          category: 'analytics',
          tags: ['analytics', 'data', 'optimization', 'strategy'],
          price: 149,
          isFree: false,
          isPremium: true,
          rating: 4.9,
          reviewCount: 67,
          enrollmentCount: 450,
          lessons: [
            { id: 'l1', title: 'Analytics Fundamentals', type: 'video', duration: 20, order: 1, isFree: false },
            { id: 'l2', title: 'Key Metrics Deep Dive', type: 'video', duration: 25, order: 2, isFree: false },
            { id: 'l3', title: 'Data Visualization', type: 'video', duration: 30, order: 3, isFree: false },
            { id: 'l4', title: 'ROI Calculation', type: 'video', duration: 25, order: 4, isFree: false },
            { id: 'l5', title: 'Advanced Reporting', type: 'video', duration: 30, order: 5, isFree: false },
            { id: 'l6', title: 'Case Study Analysis', type: 'video', duration: 20, order: 6, isFree: false }
          ],
          prerequisites: ['Basic analytics knowledge', 'Excel/Google Sheets'],
          learningOutcomes: ['Master social media analytics', 'Create advanced reports', 'Calculate ROI'],
          createdAt: new Date().toISOString(),
          status: 'published'
        }
      ];

      setCourses(mockCourses);
      setEnrollments([]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    const matchesPrice = selectedPrice === 'all' || 
      (selectedPrice === 'free' && course.isFree) ||
      (selectedPrice === 'paid' && !course.isFree);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.enrollmentCount - a.enrollmentCount;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strategy': return <AssignmentIcon />;
      case 'content': return <PlayCircleOutlineIcon />;
      case 'analytics': return <TrendingUpIcon />;
      case 'platforms': return <SchoolIcon />;
      case 'growth': return <TrendingUpIcon />;
      case 'monetization': return <StarIcon />;
      default: return <SchoolIcon />;
    }
  };

  // Get lesson icon
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayArrowIcon />;
      case 'quiz': return <QuizIcon />;
      case 'assignment': return <AssignmentIcon />;
      case 'resource': return <DescriptionIcon />;
      default: return <PlayArrowIcon />;
    }
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format price
  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree) return 'Free';
    return `$${price}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            CreatorFlow Academy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Master social media with expert-led courses and community-driven learning
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SchoolIcon />}
          onClick={() => {/* Navigate to create course */}}
        >
          Create Course
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Courses" icon={<SchoolIcon />} />
          <Tab label="My Learning" icon={<BookmarkIcon />} />
          <Tab label="Certificates" icon={<CheckCircleIcon />} />
        </Tabs>
      </Box>

      {/* All Courses Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Search and Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      <MenuItem value="strategy">Strategy</MenuItem>
                      <MenuItem value="content">Content</MenuItem>
                      <MenuItem value="analytics">Analytics</MenuItem>
                      <MenuItem value="platforms">Platforms</MenuItem>
                      <MenuItem value="growth">Growth</MenuItem>
                      <MenuItem value="monetization">Monetization</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      label="Difficulty"
                    >
                      <MenuItem value="all">All Levels</MenuItem>
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Price</InputLabel>
                    <Select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      label="Price"
                    >
                      <MenuItem value="all">All Prices</MenuItem>
                      <MenuItem value="free">Free</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Sort By"
                    >
                      <MenuItem value="popular">Popular</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="newest">Newest</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <Grid container spacing={3}>
            {sortedCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                  onClick={() => {
                    setSelectedCourse(course);
                    setCourseDialogOpen(true);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.thumbnail}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getCategoryIcon(course.category)}
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {course.category}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Chip
                        label={course.difficulty}
                        color={getDifficultyColor(course.difficulty)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {course.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={course.instructorAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {course.instructor}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={course.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        ({course.reviewCount})
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {course.enrollmentCount} students
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                        {formatDuration(course.duration)}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatPrice(course.price, course.isFree)}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={course.isFree ? <PlayArrowIcon /> : <LockIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle enrollment
                      }}
                    >
                      {course.isFree ? 'Start Free' : 'Enroll Now'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* My Learning Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            My Learning
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Continue your learning journey with enrolled courses.
          </Typography>

          {enrollments.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No enrolled courses yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start learning by enrolling in a course from our catalog.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setActiveTab(0)}
                >
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {enrollments.map((enrollment) => {
                const course = courses.find(c => c.id === enrollment.courseId);
                if (!course) return null;

                return (
                  <Grid item xs={12} md={6} key={enrollment.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {course.title}
                          </Typography>
                          <Chip
                            label={`${enrollment.progress}% Complete`}
                            color={enrollment.progress === 100 ? 'success' : 'primary'}
                            size="small"
                          />
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={enrollment.progress}
                          sx={{ mb: 2 }}
                        />

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {course.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDuration(course.duration)}
                          </Typography>
                          <Box sx={{ flexGrow: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {course.lessons.length} lessons
                          </Typography>
                        </Box>

                        <Button
                          variant="outlined"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => {
                            setSelectedCourse(course);
                            setCourseDialogOpen(true);
                          }}
                        >
                          {enrollment.progress === 100 ? 'Review Course' : 'Continue Learning'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {/* Certificates Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            My Certificates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            View and download your earned certificates.
          </Typography>

          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No certificates yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Complete courses to earn certificates and showcase your skills.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setActiveTab(0)}
              >
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Course Detail Dialog */}
      <Dialog
        open={courseDialogOpen}
        onClose={() => setCourseDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                  {selectedCourse.title}
                </Typography>
                <IconButton onClick={() => setCourseDialogOpen(false)}>
                  <ShareIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedCourse.instructorAvatar} />
                <Box>
                  <Typography variant="subtitle1">{selectedCourse.instructor}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedCourse.instructorBio}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="h6" color="primary">
                  {formatPrice(selectedCourse.price, selectedCourse.isFree)}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedCourse.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                What you'll learn
              </Typography>
              <List dense>
                {selectedCourse.learningOutcomes.map((outcome, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={outcome} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Course Content
              </Typography>
              {selectedCourse.lessons.map((lesson, index) => (
                <Accordion key={lesson.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {getLessonIcon(lesson.type)}
                      <Typography sx={{ ml: 1, flexGrow: 1 }}>
                        {lesson.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                        {formatDuration(lesson.duration)}
                      </Typography>
                      {lesson.isFree && (
                        <Chip label="Free" color="success" size="small" />
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {lesson.description}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCourseDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={selectedCourse.isFree ? <PlayArrowIcon /> : <LockIcon />}
                onClick={() => {
                  // Handle enrollment
                  setCourseDialogOpen(false);
                }}
              >
                {selectedCourse.isFree ? 'Start Free' : 'Enroll Now'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Loading */}
      {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} />}
    </Box>
  );
}
