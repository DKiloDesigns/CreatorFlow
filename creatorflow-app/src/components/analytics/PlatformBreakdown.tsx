'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PlatformData {
  posts: number;
  engagement: number;
}

interface PlatformBreakdownProps {
  data: Record<string, PlatformData>;
}

export function PlatformBreakdown({ data }: PlatformBreakdownProps) {
  const platforms = Object.keys(data);
  const engagementData = platforms.map(platform => data[platform].engagement);
  const postData = platforms.map(platform => data[platform].posts);

  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
  ];

  const chartData = {
    labels: platforms.map(platform => platform.charAt(0).toUpperCase() + platform.slice(1)),
    datasets: [
      {
        data: engagementData,
        backgroundColor: colors.slice(0, platforms.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const platform = platforms[context.dataIndex];
            const engagement = context.parsed;
            const posts = postData[context.dataIndex];
            return `${platform}: ${engagement} engagement (${posts} posts)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
} 