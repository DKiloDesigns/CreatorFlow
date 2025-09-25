import { Metadata } from 'next';
import AdvancedROICalculator from '@/components/tools/advanced-roi-calculator';

export const metadata: Metadata = {
  title: 'Advanced ROI Calculator | CreatorFlow Pro',
  description: 'Detailed financial projections and business analysis. Calculate ROI, NPV, IRR, and make data-driven investment decisions for your creator business.',
};

export default function AdvancedROIPage() {
  return <AdvancedROICalculator />;
}
