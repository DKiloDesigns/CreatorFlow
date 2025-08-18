"use client";

import React, { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import SacaCompliantContentTable from './SacaCompliantContentTable';

// Example data structure for integration
const exampleContentItems = [
  {
    id: '1',
    title: 'AI-powered content creation strategies for modern marketers',
    status: 'DRAFT' as const,
    platforms: ['LinkedIn', 'Twitter'],
    content: 'AI-powered content creation strategies for modern marketers'
  },
  {
    id: '2',
    title: 'How to optimize your social media presence in 2025',
    status: 'SCHEDULED' as const,
    platforms: ['Instagram', 'LinkedIn'],
    scheduledDate: '2025-08-16T00:00:00.000Z',
    content: 'How to optimize your social media presence in 2025'
  },
  {
    id: '3',
    title: 'The future of content marketing: AI and automation',
    status: 'PUBLISHED' as const,
    platforms: ['LinkedIn', 'Twitter', 'Facebook'],
    publishedDate: '2025-08-14T00:00:00.000Z',
    content: 'The future of content marketing: AI and automation'
  }
];

export default function SacaTableIntegrationExample() {
  const [items, setItems] = useState(exampleContentItems);
  const [lastAction, setLastAction] = useState<string>('');

  const handleEdit = (id: string) => {
    const item = items.find(item => item.id === id);
    setLastAction(`Edit requested for: ${item?.title}`);
    console.log('Edit item:', id);
  };

  const handleDuplicate = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newItem = {
        ...item,
        id: Date.now().toString(),
        title: `${item.title} (Copy)`,
        status: 'DRAFT' as const
      };
      setItems(prev => [...prev, newItem]);
      setLastAction(`Duplicated: ${item.title}`);
    }
  };

  const handleDelete = (id: string) => {
    const item = items.find(item => item.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    setLastAction(`Deleted: ${item?.title}`);
  };

  const handleView = (id: string) => {
    const item = items.find(item => item.id === id);
    setLastAction(`View requested for: ${item?.title}`);
    console.log('View item:', id);
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: `New Content Item ${items.length + 1}`,
      status: 'DRAFT' as const,
      platforms: ['LinkedIn'],
      content: 'New content item'
    };
    setItems(prev => [...prev, newItem]);
    setLastAction(`Added new item: ${newItem.title}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        SACA Table Integration Example
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        This component demonstrates how to integrate the SACA-compliant table into other parts of your application.
      </Typography>

      {lastAction && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Last Action: {lastAction}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={addNewItem}
          sx={{ mb: 2 }}
        >
          Add New Content Item
        </Button>
      </Box>

      <SacaCompliantContentTable
        items={items}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Integration Benefits:</strong>
          <br />• Drop-in replacement for existing tables
          <br />• Automatic mobile responsiveness
          <br />• Full SACA compliance out of the box
          <br />• Consistent with CreatorFlow design system
        </Typography>
      </Box>
    </Box>
  );
}
