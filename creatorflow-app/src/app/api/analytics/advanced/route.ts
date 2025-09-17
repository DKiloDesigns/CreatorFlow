/**
 * Advanced Analytics API Endpoint
 * Handle advanced analytics operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedAnalytics } from '@/lib/analytics/advanced-analytics';

const analytics = new AdvancedAnalytics();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'metrics';
    const platform = searchParams.get('platform');
    const industry = searchParams.get('industry');
    const metric = searchParams.get('metric');

    let responseData: any = {};

    switch (action) {
      case 'metrics':
        const filter = {
          dateRange: {
            start: searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: searchParams.get('end') || new Date().toISOString()
          },
          platforms: platform ? [platform] : undefined,
          contentTypes: searchParams.get('contentTypes')?.split(','),
          minEngagement: searchParams.get('minEngagement') ? parseFloat(searchParams.get('minEngagement')!) : undefined,
          minReach: searchParams.get('minReach') ? parseFloat(searchParams.get('minReach')!) : undefined
        };

        responseData = {
          metrics: analytics.getMetrics(filter),
          insights: analytics.getInsights(filter)
        };
        break;

      case 'benchmark':
        if (!platform || !industry) {
          return NextResponse.json({
            success: false,
            message: 'Platform and industry are required for benchmark comparison'
          }, { status: 400 });
        }

        responseData = analytics.getBenchmarkComparison(platform, industry);
        break;

      case 'forecast':
        if (!metric) {
          return NextResponse.json({
            success: false,
            message: 'Metric is required for forecasting'
          }, { status: 400 });
        }

        const days = parseInt(searchParams.get('days') || '30');
        responseData = analytics.getPredictiveForecast(metric, days);
        break;

      case 'dashboard':
        const widgets = searchParams.get('widgets')?.split(',') || [
          'engagement_trend',
          'platform_comparison',
          'content_performance'
        ];

        const dashboardFilter = {
          dateRange: {
            start: searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: searchParams.get('end') || new Date().toISOString()
          },
          platforms: platform ? [platform] : undefined
        };

        responseData = analytics.generateCustomDashboard(widgets, dashboardFilter);
        break;

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Analytics data retrieved successfully'
    });

  } catch (error) {
    console.error('Advanced analytics error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve analytics data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'track_performance':
        if (!data) {
          return NextResponse.json({
            success: false,
            message: 'Performance data is required'
          }, { status: 400 });
        }

        analytics.trackPerformance(data);
        return NextResponse.json({
          success: true,
          message: 'Performance data tracked successfully'
        });

      case 'generate_insights':
        const filter = data?.filter;
        const insights = analytics.getInsights(filter);
        
        return NextResponse.json({
          success: true,
          insights,
          message: 'Insights generated successfully'
        });

      case 'custom_dashboard':
        const widgets = data?.widgets || [];
        const dashboardFilter = data?.filter;
        const dashboard = analytics.generateCustomDashboard(widgets, dashboardFilter);
        
        return NextResponse.json({
          success: true,
          dashboard,
          message: 'Custom dashboard generated successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Advanced analytics POST error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Analytics operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}