import type { AnalyticsOverview, GrowthData, TopPost, PlatformBreakdown } from './mockData';

export interface TimeRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsResponse<T> {
  data: T;
  timestamp: string;
  cached: boolean;
}

export type {
  AnalyticsOverview,
  GrowthData,
  TopPost,
  PlatformBreakdown
}; 