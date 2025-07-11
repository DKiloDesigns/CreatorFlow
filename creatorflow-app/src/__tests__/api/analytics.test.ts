import { NextRequest } from 'next/server';
import { GET as getAnalytics } from '@/app/api/analytics/route';
import { GET as getInsights, POST as generateInsights } from '@/app/api/analytics/insights/route';

// Mock the auth module
jest.mock('@/auth', () => ({
  getSession: jest.fn(),
}));

// Mock the monitoring module
jest.mock('@/lib/monitoring', () => ({
  monitoring: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock the insights generator
jest.mock('@/lib/analytics/insights-generator', () => ({
  insightsGenerator: {
    getInsights: jest.fn(),
    generateInsights: jest.fn(),
  },
}));

describe('Analytics API', () => {
  let mockGetSession: jest.MockedFunction<any>;
  let mockGetInsights: jest.MockedFunction<any>;
  let mockGenerateInsights: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    const { getSession } = require('@/auth');
    const { insightsGenerator } = require('@/lib/analytics/insights-generator');
    
    mockGetSession = getSession;
    mockGetInsights = insightsGenerator.getInsights;
    mockGenerateInsights = insightsGenerator.generateInsights;
  });

  describe('GET /api/analytics', () => {
    it('should return analytics data for authenticated user', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      mockGetSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/analytics');
      const response = await getAnalytics(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it('should return 401 for unauthenticated user', async () => {
      mockGetSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/analytics');
      const response = await getAnalytics(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle errors gracefully', async () => {
      mockGetSession.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/analytics');
      const response = await getAnalytics(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('GET /api/analytics/insights', () => {
    it('should return insights for authenticated user', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      const mockInsights = {
        userId: 'user-123',
        insights: [
          {
            id: 'insight-1',
            type: 'performance',
            title: 'Strong Engagement',
            description: 'Your posts are performing well',
            impact: 'high',
            confidence: 85,
            data: {},
            recommendations: ['Keep it up!'],
            createdAt: new Date(),
          },
        ],
        lastGenerated: new Date(),
        nextUpdate: new Date(),
      };

      mockGetSession.mockResolvedValue(mockSession);
      mockGetInsights.mockResolvedValue(mockInsights);

      const request = new NextRequest('http://localhost:3000/api/analytics/insights');
      const response = await getInsights(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockInsights);
      expect(mockGetInsights).toHaveBeenCalledWith('user-123');
    });

    it('should return 401 for unauthenticated user', async () => {
      mockGetSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/analytics/insights');
      const response = await getInsights(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle insights generation failure', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      mockGetSession.mockResolvedValue(mockSession);
      mockGetInsights.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/analytics/insights');
      const response = await getInsights(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to generate insights');
    });

    it('should handle errors gracefully', async () => {
      mockGetSession.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/analytics/insights');
      const response = await getInsights(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/analytics/insights', () => {
    it('should generate insights for authenticated user', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      const mockInsights = {
        userId: 'user-123',
        insights: [
          {
            id: 'insight-1',
            type: 'performance',
            title: 'Strong Engagement',
            description: 'Your posts are performing well',
            impact: 'high',
            confidence: 85,
            data: {},
            recommendations: ['Keep it up!'],
            createdAt: new Date(),
          },
        ],
        lastGenerated: new Date(),
        nextUpdate: new Date(),
      };

      mockGetSession.mockResolvedValue(mockSession);
      mockGenerateInsights.mockResolvedValue(mockInsights);

      const request = new NextRequest('http://localhost:3000/api/analytics/insights', {
        method: 'POST',
      });
      const response = await generateInsights(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockInsights);
      expect(mockGenerateInsights).toHaveBeenCalledWith('user-123');
    });

    it('should return 401 for unauthenticated user', async () => {
      mockGetSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/analytics/insights', {
        method: 'POST',
      });
      const response = await generateInsights(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle errors gracefully', async () => {
      mockGetSession.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/analytics/insights', {
        method: 'POST',
      });
      const response = await generateInsights(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
}); 