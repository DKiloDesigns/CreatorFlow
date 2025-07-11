'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Heart, 
  Target,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'performance' | 'timing' | 'content' | 'engagement' | 'growth';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  data: Record<string, any>;
  recommendations: string[];
  createdAt: Date;
}

interface UserInsights {
  userId: string;
  insights: Insight[];
  lastGenerated: Date;
  nextUpdate: Date;
}

interface InsightsPanelProps {
  insights: UserInsights | null;
  onRefresh: () => void;
}

export function InsightsPanel({ insights, onRefresh }: InsightsPanelProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="h-5 w-5" />;
      case 'timing':
        return <Clock className="h-5 w-5" />;
      case 'content':
        return <MessageSquare className="h-5 w-5" />;
      case 'engagement':
        return <Heart className="h-5 w-5" />;
      case 'growth':
        return <Target className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!insights) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
        <p className="text-gray-500 mb-4">Generate AI-powered insights to get personalized recommendations.</p>
        <Button onClick={onRefresh}>
          <Lightbulb className="h-4 w-4 mr-2" />
          Generate Insights
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
          <p className="text-gray-600 mt-1">
            Last generated: {new Date(insights.lastGenerated).toLocaleString()}
          </p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.insights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                      <span className={`text-sm ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{insight.description}</p>
              
              {insight.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Recommendations:</h4>
                  <ul className="space-y-1">
                    {insight.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(insight.data).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Key Data:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(insight.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {insights.insights.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Generated</h3>
            <p className="text-gray-500 mb-4">
              We couldn't generate insights yet. This usually means you need more content data.
            </p>
            <Button onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Next Update Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Next insights update: {new Date(insights.nextUpdate).toLocaleString()}
              </p>
              <p className="text-xs text-blue-700">
                Insights are automatically updated every 24 hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 