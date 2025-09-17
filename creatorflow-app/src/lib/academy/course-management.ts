/**
 * CreatorFlow Academy Course Management System
 * Handle course creation, enrollment, and progress tracking
 */

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorAvatar: string;
  thumbnail: string;
  duration: number; // in minutes
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
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'resource';
  content: string; // Video URL, text content, or quiz data
  duration: number; // in minutes
  order: number;
  isFree: boolean;
  resources: Resource[];
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'image' | 'link' | 'template';
  url: string;
  size?: number;
  description?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number; // 0-100
  currentLessonId?: string;
  lastAccessedAt: string;
  certificateEarned: boolean;
  certificateUrl?: string;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  timeSpent: number; // in minutes
  lastLessonId: string;
  completedAt?: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  helpful: number;
  createdAt: string;
}

export interface CourseAnalytics {
  courseId: string;
  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
  totalRevenue: number;
  averageTimeToComplete: number;
  dropOffPoints: Array<{
    lessonId: string;
    dropOffRate: number;
  }>;
  popularLessons: string[];
  userFeedback: string[];
}

export class CourseManagement {
  private courses: Map<string, Course> = new Map();
  private enrollments: Map<string, Enrollment> = new Map();
  private reviews: Map<string, CourseReview> = new Map();
  private progress: Map<string, CourseProgress> = new Map();

  // Create a new course
  createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'enrollmentCount'>): Course {
    const course: Course = {
      ...courseData,
      id: `course_${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      enrollmentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };

    this.courses.set(course.id, course);
    return course;
  }

  // Update course
  updateCourse(courseId: string, updates: Partial<Course>): Course | null {
    const course = this.courses.get(courseId);
    if (!course) return null;

    const updatedCourse = {
      ...course,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.courses.set(courseId, updatedCourse);
    return updatedCourse;
  }

  // Publish course
  publishCourse(courseId: string): boolean {
    const course = this.courses.get(courseId);
    if (!course) return false;

    course.status = 'published';
    course.updatedAt = new Date().toISOString();
    this.courses.set(courseId, course);
    return true;
  }

  // Get course by ID
  getCourse(courseId: string): Course | null {
    return this.courses.get(courseId) || null;
  }

  // Get courses with filters
  getCourses(filters?: {
    category?: string;
    difficulty?: string;
    isFree?: boolean;
    isPremium?: boolean;
    search?: string;
    sortBy?: 'rating' | 'enrollmentCount' | 'createdAt' | 'price';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): { courses: Course[]; total: number } {
    let courses = Array.from(this.courses.values());

    // Apply filters
    if (filters) {
      if (filters.category) {
        courses = courses.filter(c => c.category === filters.category);
      }
      if (filters.difficulty) {
        courses = courses.filter(c => c.difficulty === filters.difficulty);
      }
      if (filters.isFree !== undefined) {
        courses = courses.filter(c => c.isFree === filters.isFree);
      }
      if (filters.isPremium !== undefined) {
        courses = courses.filter(c => c.isPremium === filters.isPremium);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        courses = courses.filter(c => 
          c.title.toLowerCase().includes(searchTerm) ||
          c.description.toLowerCase().includes(searchTerm) ||
          c.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        courses.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (filters.sortBy) {
            case 'rating':
              aValue = a.rating;
              bValue = b.rating;
              break;
            case 'enrollmentCount':
              aValue = a.enrollmentCount;
              bValue = b.enrollmentCount;
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            default:
              return 0;
          }

          if (filters.sortOrder === 'desc') {
            return bValue - aValue;
          } else {
            return aValue - bValue;
          }
        });
      }

      // Apply pagination
      const total = courses.length;
      if (filters.offset) {
        courses = courses.slice(filters.offset);
      }
      if (filters.limit) {
        courses = courses.slice(0, filters.limit);
      }

      return { courses, total };
    }

    return { courses, total: courses.length };
  }

  // Enroll user in course
  enrollUser(userId: string, courseId: string): Enrollment | null {
    const course = this.courses.get(courseId);
    if (!course) return null;

    // Check if already enrolled
    const existingEnrollment = Array.from(this.enrollments.values())
      .find(e => e.userId === userId && e.courseId === courseId);
    
    if (existingEnrollment) return existingEnrollment;

    const enrollment: Enrollment = {
      id: `enrollment_${Date.now()}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      lastAccessedAt: new Date().toISOString(),
      certificateEarned: false
    };

    this.enrollments.set(enrollment.id, enrollment);

    // Update course enrollment count
    course.enrollmentCount++;
    this.courses.set(courseId, course);

    // Initialize progress tracking
    this.initializeProgress(userId, courseId);

    return enrollment;
  }

  // Update lesson progress
  updateLessonProgress(userId: string, courseId: string, lessonId: string): boolean {
    const enrollment = Array.from(this.enrollments.values())
      .find(e => e.userId === userId && e.courseId === courseId);
    
    if (!enrollment) return false;

    const course = this.courses.get(courseId);
    if (!course) return false;

    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson) return false;

    // Update progress
    const totalLessons = course.lessons.length;
    const completedLessons = this.getCompletedLessons(userId, courseId).length;
    const progress = Math.round((completedLessons / totalLessons) * 100);

    enrollment.progress = progress;
    enrollment.currentLessonId = lessonId;
    enrollment.lastAccessedAt = new Date().toISOString();

    // Check if course is completed
    if (progress === 100) {
      enrollment.completedAt = new Date().toISOString();
      enrollment.certificateEarned = true;
      enrollment.certificateUrl = this.generateCertificate(userId, courseId);
    }

    this.enrollments.set(enrollment.id, enrollment);

    // Update progress tracking
    this.updateProgress(userId, courseId, lessonId);

    return true;
  }

  // Get user's enrolled courses
  getUserEnrollments(userId: string): Enrollment[] {
    return Array.from(this.enrollments.values())
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());
  }

  // Get course progress
  getCourseProgress(userId: string, courseId: string): CourseProgress | null {
    return this.progress.get(`${userId}_${courseId}`) || null;
  }

  // Add course review
  addReview(reviewData: Omit<CourseReview, 'id' | 'createdAt' | 'helpful'>): CourseReview {
    const review: CourseReview = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpful: 0
    };

    this.reviews.set(review.id, review);

    // Update course rating
    this.updateCourseRating(review.courseId);

    return review;
  }

  // Get course reviews
  getCourseReviews(courseId: string, limit: number = 10, offset: number = 0): CourseReview[] {
    return Array.from(this.reviews.values())
      .filter(r => r.courseId === courseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  // Get course analytics
  getCourseAnalytics(courseId: string): CourseAnalytics | null {
    const course = this.courses.get(courseId);
    if (!course) return null;

    const courseEnrollments = Array.from(this.enrollments.values())
      .filter(e => e.courseId === courseId);

    const courseReviews = Array.from(this.reviews.values())
      .filter(r => r.courseId === courseId);

    const completedEnrollments = courseEnrollments.filter(e => e.completedAt);
    const completionRate = courseEnrollments.length > 0 
      ? (completedEnrollments.length / courseEnrollments.length) * 100 
      : 0;

    const averageRating = courseReviews.length > 0
      ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length
      : 0;

    const totalRevenue = courseEnrollments.length * course.price;

    return {
      courseId,
      totalEnrollments: courseEnrollments.length,
      completionRate,
      averageRating,
      totalRevenue,
      averageTimeToComplete: 0, // Would need to calculate from actual data
      dropOffPoints: [],
      popularLessons: [],
      userFeedback: courseReviews.map(r => r.comment)
    };
  }

  // Private helper methods
  private initializeProgress(userId: string, courseId: string): void {
    const course = this.courses.get(courseId);
    if (!course) return;

    const courseProgress: CourseProgress = {
      courseId,
      userId,
      totalLessons: course.lessons.length,
      completedLessons: 0,
      progress: 0,
      timeSpent: 0,
      lastLessonId: course.lessons[0]?.id || ''
    };

    this.progress.set(`${userId}_${courseId}`, courseProgress);
  }

  private updateProgress(userId: string, courseId: string, lessonId: string): void {
    const progress = this.progress.get(`${userId}_${courseId}`);
    if (!progress) return;

    const course = this.courses.get(courseId);
    if (!course) return;

    const completedLessons = this.getCompletedLessons(userId, courseId);
    progress.completedLessons = completedLessons.length;
    progress.progress = Math.round((completedLessons.length / course.lessons.length) * 100);
    progress.lastLessonId = lessonId;

    this.progress.set(`${userId}_${courseId}`, progress);
  }

  private getCompletedLessons(userId: string, courseId: string): string[] {
    // This would typically query a database for completed lessons
    // For now, return empty array
    return [];
  }

  private updateCourseRating(courseId: string): void {
    const course = this.courses.get(courseId);
    if (!course) return;

    const reviews = Array.from(this.reviews.values())
      .filter(r => r.courseId === courseId);

    if (reviews.length > 0) {
      course.rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      course.reviewCount = reviews.length;
      course.updatedAt = new Date().toISOString();
      this.courses.set(courseId, course);
    }
  }

  private generateCertificate(userId: string, courseId: string): string {
    // Generate certificate URL
    return `/certificates/${userId}_${courseId}.pdf`;
  }
}
