'use client';

import React, { useState } from 'react';
import { 
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  InputAdornment
} from '@mui/material';
import { FileText, Activity, Heart, Star, Image as ImageIcon, Sparkles, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dialog as MuiDialog, DialogContent as MuiDialogContent, DialogTitle as MuiDialogTitle } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Badge } from '@/components/ui/feedback/mui-badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'social' | 'marketing' | 'product' | 'event' | 'promotional';
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
  type: 'post' | 'story' | 'reel' | 'video' | 'carousel';
  tags: string[];
  preview: string;
  isPremium: boolean;
  isFavorite: boolean;
  usageCount: number;
  rating: number;
  variables: TemplateVariable[];
}

interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'number';
  defaultValue: string;
  required: boolean;
  placeholder: string;
}

interface UseTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onTemplateUsed?: (templateData: any) => void;
}

export function UseTemplateModal({ open, onClose, onTemplateUsed }: UseTemplateModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);

  // Sample templates
  const templates: Template[] = [
    {
      id: '1',
      name: 'Product Launch Announcement',
      description: 'Eye-catching template for announcing new products with compelling visuals and copy.',
      category: 'product',
      platform: 'instagram',
      type: 'post',
      tags: ['product', 'launch', 'announcement', 'marketing'],
      preview: '/api/templates/preview1.jpg',
      isPremium: false,
      isFavorite: true,
      usageCount: 1247,
      rating: 4.8,
      variables: [
        { id: 'product_name', name: 'Product Name', type: 'text', defaultValue: '', required: true, placeholder: 'Enter product name' },
        { id: 'product_description', name: 'Product Description', type: 'text', defaultValue: '', required: true, placeholder: 'Brief product description' },
        { id: 'product_image', name: 'Product Image', type: 'image', defaultValue: '', required: true, placeholder: 'Upload product image' },
        { id: 'cta_text', name: 'Call to Action', type: 'text', defaultValue: 'Shop Now', required: false, placeholder: 'Call to action text' },
        { id: 'brand_color', name: 'Brand Color', type: 'color', defaultValue: '#3B82F6', required: false, placeholder: 'Choose brand color' }
      ]
    },
    {
      id: '2',
      name: 'Behind the Scenes Story',
      description: 'Authentic template for sharing behind-the-scenes content that builds connection.',
      category: 'social',
      platform: 'instagram',
      type: 'story',
      tags: ['behind-scenes', 'authentic', 'connection', 'story'],
      preview: '/api/templates/preview2.jpg',
      isPremium: false,
      isFavorite: false,
      usageCount: 892,
      rating: 4.6,
      variables: [
        { id: 'behind_scenes_text', name: 'Behind the Scenes Text', type: 'text', defaultValue: '', required: true, placeholder: 'What\'s happening behind the scenes?' },
        { id: 'team_photo', name: 'Team Photo', type: 'image', defaultValue: '', required: true, placeholder: 'Upload team or process photo' },
        { id: 'emoji', name: 'Emoji', type: 'text', defaultValue: '✨', required: false, placeholder: 'Add relevant emoji' }
      ]
    },
    {
      id: '3',
      name: 'Event Promotion Video',
      description: 'Dynamic video template for promoting events with countdown and excitement.',
      category: 'event',
      platform: 'tiktok',
      type: 'video',
      tags: ['event', 'promotion', 'video', 'countdown'],
      preview: '/api/templates/preview3.jpg',
      isPremium: true,
      isFavorite: false,
      usageCount: 567,
      rating: 4.9,
      variables: [
        { id: 'event_name', name: 'Event Name', type: 'text', defaultValue: '', required: true, placeholder: 'Event name' },
        { id: 'event_date', name: 'Event Date', type: 'text', defaultValue: '', required: true, placeholder: 'Event date' },
        { id: 'event_location', name: 'Event Location', type: 'text', defaultValue: '', required: false, placeholder: 'Event location' },
        { id: 'event_image', name: 'Event Image', type: 'image', defaultValue: '', required: true, placeholder: 'Upload event image' },
        { id: 'ticket_link', name: 'Ticket Link', type: 'text', defaultValue: '', required: false, placeholder: 'Ticket purchase link' }
      ]
    },
    {
      id: '4',
      name: 'Customer Testimonial Post',
      description: 'Professional template for sharing customer testimonials and reviews.',
      category: 'marketing',
      platform: 'linkedin',
      type: 'post',
      tags: ['testimonial', 'customer', 'review', 'professional'],
      preview: '/api/templates/preview4.jpg',
      isPremium: false,
      isFavorite: true,
      usageCount: 2341,
      rating: 4.7,
      variables: [
        { id: 'customer_name', name: 'Customer Name', type: 'text', defaultValue: '', required: true, placeholder: 'Customer name' },
        { id: 'customer_title', name: 'Customer Title', type: 'text', defaultValue: '', required: false, placeholder: 'Customer job title' },
        { id: 'testimonial_text', name: 'Testimonial', type: 'text', defaultValue: '', required: true, placeholder: 'Customer testimonial' },
        { id: 'customer_photo', name: 'Customer Photo', type: 'image', defaultValue: '', required: false, placeholder: 'Customer photo' },
        { id: 'company_logo', name: 'Company Logo', type: 'image', defaultValue: '', required: false, placeholder: 'Customer company logo' }
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'social', label: 'Social' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'product', label: 'Product' },
    { value: 'event', label: 'Event' },
    { value: 'promotional', label: 'Promotional' }
  ];

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || template.platform === selectedPlatform;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesPlatform && matchesSearch;
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    // Initialize variables with default values
    const initialVariables: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialVariables[variable.id] = variable.defaultValue;
    });
    setTemplateVariables(initialVariables);
  };

  const handleVariableChange = (variableId: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variableId]: value
    }));
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplate) return;

    // Validate required variables
    const missingRequired = selectedTemplate.variables
      .filter(variable => variable.required && !templateVariables[variable.id])
      .map(variable => variable.name);

    if (missingRequired.length > 0) {
      toast.error(`Please fill in required fields: ${missingRequired.join(', ')}`);
      return;
    }

    setIsCreating(true);
    try {
      // Simulate template processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const templateData = {
        template: selectedTemplate,
        variables: templateVariables,
        createdAt: new Date().toISOString()
      };
      
      onTemplateUsed?.(templateData);
      toast.success(`Template "${selectedTemplate.name}" applied successfully!`);
      onClose();
    } catch (error) {
      toast.error('Failed to apply template');
    } finally {
      setIsCreating(false);
    }
  };

  const handleFavoriteToggle = (templateId: string) => {
    // In a real app, this would update the database
    toast.success('Favorite status updated');
  };

  return (
    <MuiDialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 1, sm: 2 },
          maxHeight: { xs: '95vh', sm: '90vh' },
          overflow: 'hidden'
        }
      }}
    >
      <MuiDialogTitle>Use Template</MuiDialogTitle>
      <MuiDialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: 3, 
          height: { xs: '85vh', sm: '80vh' },
          p: 3,
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {/* Template Browser */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            {/* Filters */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2, 
              mb: 3,
              width: '100%'
            }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TextField
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Activity />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <FormControl sx={{ minWidth: { xs: '100%', sm: 120 } }}>
                <InputLabel>Category</InputLabel>
                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  {categories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: { xs: '100%', sm: 120 } }}>
                <InputLabel>Platform</InputLabel>
                <Select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                  {platforms.map(platform => (
                    <MenuItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Template Grid */}
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto',
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
              <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
                {filteredTemplates.map(template => (
                  <Grid item xs={12} sm={6} key={template.id} sx={{ minWidth: 0 }}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-1px)'
                        },
                        border: selectedTemplate?.id === template.id ? 2 : 1,
                        borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'divider',
                        bgcolor: selectedTemplate?.id === template.id ? 'primary.50' : 'background.paper'
                      }}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        {/* Template Preview */}
                        <Box sx={{ 
                          aspectRatio: '16/9', 
                          bgcolor: 'grey.100', 
                          borderRadius: 1, 
                          mb: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Activity style={{ fontSize: 32, color: '#9e9e9e', marginBottom: 8 }} />
                            <Typography variant="body2" color="text.secondary">
                              Template Preview
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Template Info */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                                {template.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {template.description}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {template.isPremium && (
                                <Chip 
                                  label="PRO" 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              )}
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFavoriteToggle(template.id);
                                }}
                              >
                                <Heart style={{ 
                                  fontSize: 16, 
                                  color: template.isFavorite ? '#f44336' : '#9e9e9e',
                                  fill: template.isFavorite ? '#f44336' : 'none'
                                }} />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          {/* Tags and Stats */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              <Chip 
                                label={template.platform} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                              <Chip 
                                label={template.type} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Star style={{ fontSize: 12, color: '#ff9800' }} />
                              <Typography variant="caption" color="text.secondary">
                                {template.rating}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">•</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {template.usageCount} uses
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
          
          {/* Template Customization */}
          {selectedTemplate && (
            <Box sx={{ 
              width: { xs: '100%', lg: 384 }, 
              display: 'flex', 
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Customize Template
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Back to Browse
                </Button>
              </Box>
              
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto',
                maxWidth: '100%',
                overflow: 'hidden'
              }}>
                {/* Template Preview */}
                <Box sx={{ 
                  aspectRatio: '16/9', 
                  bgcolor: 'grey.100', 
                  borderRadius: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Activity style={{ fontSize: 32, color: '#9e9e9e', marginBottom: 8 }} />
                    <Typography variant="body2" color="text.secondary">
                      Live Preview
                    </Typography>
                  </Box>
                </Box>
                
                {/* Template Variables */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    Customize Content
                  </Typography>
                  
                  {selectedTemplate.variables.map(variable => (
                    <Box key={variable.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {variable.name}
                        {variable.required && <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>*</Typography>}
                      </Typography>
                      
                      {variable.type === 'text' && (
                        <TextField
                          value={templateVariables[variable.id] || ''}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          placeholder={variable.placeholder}
                          size="small"
                          fullWidth
                        />
                      )}
                      
                      {variable.type === 'textarea' && (
                        <TextField
                          value={templateVariables[variable.id] || ''}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          placeholder={variable.placeholder}
                          multiline
                          rows={3}
                          size="small"
                          fullWidth
                        />
                      )}
                      
                      {variable.type === 'color' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            type="color"
                            value={templateVariables[variable.id] || '#000000'}
                            onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                            size="small"
                            sx={{ width: 64, height: 40 }}
                          />
                          <TextField
                            value={templateVariables[variable.id] || ''}
                            onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                            placeholder={variable.placeholder}
                            size="small"
                            fullWidth
                          />
                        </Box>
                      )}
                      
                      {variable.type === 'image' && (
                        <Box sx={{ 
                          border: 2, 
                          borderColor: 'grey.300', 
                          borderStyle: 'dashed', 
                          borderRadius: 1, 
                          p: 2, 
                          textAlign: 'center' 
                        }}>
                          <ImageIcon style={{ fontSize: 32, color: '#9e9e9e', marginBottom: 8 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {variable.placeholder}
                          </Typography>
                          <Button variant="outlined" size="small">
                            Upload Image
                          </Button>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
              
              {/* Action Buttons */}
              <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  onClick={handleUseTemplate}
                  disabled={isCreating}
                  fullWidth
                  variant="contained"
                >
                  {isCreating ? (
                    <>
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        border: '2px solid', 
                        borderColor: 'white', 
                        borderTopColor: 'transparent', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite',
                        mr: 1 
                      }} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles style={{ fontSize: 16, marginRight: 8 }} />
                      Use Template
                    </>
                  )}
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" sx={{ flex: 1 }}>
                    <Copy style={{ fontSize: 16, marginRight: 8 }} />
                    Duplicate
                  </Button>
                  <Button variant="outlined" size="small" sx={{ flex: 1 }}>
                    <Download style={{ fontSize: 16, marginRight: 8 }} />
                    Download
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </MuiDialogContent>
    </MuiDialog>
  );
} 