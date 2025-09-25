import { Metadata } from 'next';
import TrendPredictionTool from '@/components/tools/trend-prediction-tool';

export const metadata: Metadata = {
  title: 'Trend Prediction Tool | CreatorFlow Pro',
  description: 'AI-powered trend forecasting and analysis. Stay ahead of the curve with intelligent predictions and strategic content recommendations.',
};

export default function TrendPredictionPage() {
  return <TrendPredictionTool />;
}
