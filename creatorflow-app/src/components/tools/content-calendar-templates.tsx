/**
 * Content Calendar Template Generator
 * Free tool for downloading professional content calendar templates
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Badge,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Description as FileTextIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  MusicNote as MusicIcon,
  ShoppingCart as ShoppingCartIcon,
  Code as CodeIcon,
  Favorite as HeartIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Preview as PreviewIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Template {
  id: string;
  name: string;
  industry: string;
  description: string;
  features: string[];
  preview: string;
  formats: string[];
  color: string;
  icon: React.ReactNode;
  downloadCount: number;
  rating: number;
}

interface TemplateCustomization {
  industry: string;
  format: string;
  branding: {
    companyName: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
  };
  content: {
    includeHolidays: boolean;
    includeTrends: boolean;
    includeHashtags: boolean;
    includeImages: boolean;
  };
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    platforms: string[];
    timeSlots: string[];
  };
}

const INDUSTRIES = [
  { value: 'technology', label: 'Technology', icon: <CodeIcon />, color: '#2196F3' },
  { value: 'fashion', label: 'Fashion', icon: <ImageIcon />, color: '#E91E63' },
  { value: 'food', label: 'Food & Beverage', icon: <HeartIcon />, color: '#FF9800' },
  { value: 'fitness', label: 'Fitness & Health', icon: <TrendingUpIcon />, color: '#4CAF50' },
  { value: 'music', label: 'Music & Entertainment', icon: <MusicIcon />, color: '#9C27B0' },
  { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCartIcon />, color: '#FF5722' },
  { value: 'education', label: 'Education', icon: <FileTextIcon />, color: '#607D8B' },
  { value: 'travel', label: 'Travel & Tourism', icon: <ImageIcon />, color: '#00BCD4' },
];

const TEMPLATE_FORMATS = [
  { value: 'excel', label: 'Excel (.xlsx)', icon: <FileTextIcon /> },
  { value: 'pdf', label: 'PDF', icon: <FileTextIcon /> },
  { value: 'google-sheets', label: 'Google Sheets', icon: <FileTextIcon /> },
  { value: 'notion', label: 'Notion Template', icon: <FileTextIcon /> },
];

const PLATFORMS = [
  'Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube',
  'Pinterest', 'Snapchat', 'Reddit', 'Discord', 'Twitch', 'Vimeo'
];

const TEMPLATES: Template[] = [
  {
    id: 'tech-startup',
    name: 'Tech Startup Calendar',
    industry: 'technology',
    description: 'Perfect for tech startups and SaaS companies',
    features: ['Product launches', 'Tech trends', 'Industry events', 'Developer content'],
    preview: '/api/templates/preview/tech-startup',
    formats: ['excel', 'pdf', 'google-sheets'],
    color: '#2196F3',
    icon: <CodeIcon />,
    downloadCount: 1250,
    rating: 4.8
  },
  {
    id: 'fashion-brand',
    name: 'Fashion Brand Calendar',
    industry: 'fashion',
    description: 'Designed for fashion brands and influencers',
    features: ['Seasonal collections', 'Fashion weeks', 'Style trends', 'Outfit posts'],
    preview: '/api/templates/preview/fashion-brand',
    formats: ['excel', 'pdf', 'google-sheets'],
    color: '#E91E63',
    icon: <ImageIcon />,
    downloadCount: 2100,
    rating: 4.9
  },
  {
    id: 'food-blog',
    name: 'Food Blog Calendar',
    industry: 'food',
    description: 'Ideal for food bloggers and restaurants',
    features: ['Recipe posts', 'Food holidays', 'Seasonal ingredients', 'Restaurant features'],
    preview: '/api/templates/preview/food-blog',
    formats: ['excel', 'pdf', 'google-sheets'],
    color: '#FF9800',
    icon: <HeartIcon />,
    downloadCount: 1800,
    rating: 4.7
  },
  {
    id: 'fitness-coach',
    name: 'Fitness Coach Calendar',
    industry: 'fitness',
    description: 'Built for fitness coaches and gyms',
    features: ['Workout plans', 'Nutrition tips', 'Motivation posts', 'Client success stories'],
    preview: '/api/templates/preview/fitness-coach',
    formats: ['excel', 'pdf', 'google-sheets'],
    color: '#4CAF50',
    icon: <TrendingUpIcon />,
    downloadCount: 1650,
    rating: 4.6
  },
  {
    id: 'music-artist',
    name: 'Music Artist Calendar',
    industry: 'music',
    description: 'Created for musicians and music labels',
    features: ['Album releases', 'Concert dates', 'Behind the scenes', 'Fan engagement'],
    preview: '/api/templates/preview/music-artist',
    formats: ['excel', 'pdf', 'google-sheets'],
    color: '#9C27B0',
    icon: <MusicIcon />,
    downloadCount: 950,
    rating: 4.8
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store Calendar',
    industry: 'ecommerce',
    description: 'Perfect for online stores and retailers',
    features: ['Product launches', 'Sales events', 'Customer testimonials', 'Shopping guides'],
    preview: '/api/templates/preview/ecommerce-store',
    formats: ['excel', 'pdf', 'google-sheets'],
    color: '#FF5722',
    icon: <ShoppingCartIcon />,
    downloadCount: 2200,
    rating: 4.9
  }
];

export default function ContentCalendarTemplates() {
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [customization, setCustomization] = useState<TemplateCustomization>({
    industry: 'technology',
    format: 'excel',
    branding: {
      companyName: '',
      logo: '',
      primaryColor: '#0066CC',
      secondaryColor: '#00CC66'
    },
    content: {
      includeHolidays: true,
      includeTrends: true,
      includeHashtags: true,
      includeImages: true
    },
    schedule: {
      frequency: 'weekly',
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      timeSlots: ['9:00 AM', '1:00 PM', '5:00 PM']
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const filteredTemplates = TEMPLATES.filter(template => 
    template.industry === selectedIndustry
  );

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    setCustomization(prev => ({ ...prev, industry }));
  };

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
    setCustomization(prev => ({ ...prev, format }));
  };

  const handleCustomizationChange = (field: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedCustomizationChange = (parent: string, field: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof TemplateCustomization],
        [field]: value
      }
    }));
  };

  const generateTemplate = async () => {
    setIsGenerating(true);
    
    // Simulate template generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const templateId = `custom-${customization.industry}-${Date.now()}`;
    setGeneratedTemplate(templateId);
    setIsGenerating(false);
  };

  const downloadTemplate = async (templateId: string, format: string) => {
    // Simulate download
    const data = {
      templateId,
      format,
      customization,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-calendar-${templateId}.${format === 'excel' ? 'xlsx' : format}`;
    a.click();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSubmitted(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ 
            color: 'primary.main',
            background: 'linear-gradient(45deg, #0066CC, #00CC66)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Content Calendar Templates
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Download professional content calendar templates for your industry
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get started with our free templates, then upgrade to CreatorFlow Pro for dynamic, smart calendars
          </Typography>
        </Box>
      </motion.div>

      {/* Industry Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon color="primary" />
              Choose Your Industry
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {INDUSTRIES.map((industry) => (
                <Grid item xs={12} sm={6} md={3} key={industry.value}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: selectedIndustry === industry.value ? 2 : 1,
                      borderColor: selectedIndustry === industry.value ? industry.color : 'divider',
                      backgroundColor: selectedIndustry === industry.value ? `${industry.color}10` : 'background.paper',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: industry.color,
                        backgroundColor: `${industry.color}10`
                      }
                    }}
                    onClick={() => handleIndustryChange(industry.value)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ color: industry.color }}>
                        {industry.icon}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {industry.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {TEMPLATES.filter(t => t.industry === industry.value).length} templates available
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Templates Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="primary" />
              Available Templates
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {filteredTemplates.map((template, index) => (
                <Grid item xs={12} md={6} key={template.id}>
                  <Card sx={{ height: '100%', position: 'relative' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ color: template.color }}>
                          {template.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {template.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {template.description}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" color="text.secondary">
                            {template.downloadCount.toLocaleString()} downloads
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              ⭐ {template.rating}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        Features:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {template.features.map((feature, featureIndex) => (
                          <Chip
                            key={featureIndex}
                            label={feature}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        Available Formats:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {template.formats.map((format) => (
                          <Chip
                            key={format}
                            label={format.toUpperCase()}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          startIcon={<DownloadIcon />}
                          onClick={() => downloadTemplate(template.id, 'excel')}
                          sx={{ 
                            background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #0052A3, #00B359)',
                            }
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<PreviewIcon />}
                          onClick={() => window.open(template.preview, '_blank')}
                        >
                          Preview
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Custom Template Builder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon color="primary" />
              Custom Template Builder
            </Typography>

            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
              <Tab label="Basic Settings" />
              <Tab label="Branding" />
              <Tab label="Content" />
              <Tab label="Schedule" />
            </Tabs>

            {/* Basic Settings Tab */}
            {activeTab === 0 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Industry</InputLabel>
                      <Select
                        value={customization.industry}
                        onChange={(e) => handleCustomizationChange('industry', e.target.value)}
                      >
                        {INDUSTRIES.map((industry) => (
                          <MenuItem key={industry.value} value={industry.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {industry.icon}
                              {industry.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Format</InputLabel>
                      <Select
                        value={customization.format}
                        onChange={(e) => handleCustomizationChange('format', e.target.value)}
                      >
                        {TEMPLATE_FORMATS.map((format) => (
                          <MenuItem key={format.value} value={format.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {format.icon}
                              {format.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Branding Tab */}
            {activeTab === 1 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Company Name"
                      value={customization.branding.companyName}
                      onChange={(e) => handleNestedCustomizationChange('branding', 'companyName', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Logo URL"
                      value={customization.branding.logo}
                      onChange={(e) => handleNestedCustomizationChange('branding', 'logo', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Primary Color"
                      type="color"
                      value={customization.branding.primaryColor}
                      onChange={(e) => handleNestedCustomizationChange('branding', 'primaryColor', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Secondary Color"
                      type="color"
                      value={customization.branding.secondaryColor}
                      onChange={(e) => handleNestedCustomizationChange('branding', 'secondaryColor', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Content Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Content Features
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={customization.content.includeHolidays}
                          onChange={(e) => handleNestedCustomizationChange('content', 'includeHolidays', e.target.checked)}
                        />
                      }
                      label="Include Holidays"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={customization.content.includeTrends}
                          onChange={(e) => handleNestedCustomizationChange('content', 'includeTrends', e.target.checked)}
                        />
                      }
                      label="Include Trends"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={customization.content.includeHashtags}
                          onChange={(e) => handleNestedCustomizationChange('content', 'includeHashtags', e.target.checked)}
                        />
                      }
                      label="Include Hashtags"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={customization.content.includeImages}
                          onChange={(e) => handleNestedCustomizationChange('content', 'includeImages', e.target.checked)}
                        />
                      }
                      label="Include Images"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Schedule Tab */}
            {activeTab === 3 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Posting Frequency</FormLabel>
                      <RadioGroup
                        value={customization.schedule.frequency}
                        onChange={(e) => handleNestedCustomizationChange('schedule', 'frequency', e.target.value)}
                      >
                        <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                        <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
                        <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Platforms</InputLabel>
                      <Select
                        multiple
                        value={customization.schedule.platforms}
                        onChange={(e) => handleNestedCustomizationChange('schedule', 'platforms', e.target.value)}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {PLATFORMS.map((platform) => (
                          <MenuItem key={platform} value={platform}>
                            {platform}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Generate Button */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={generateTemplate}
                disabled={isGenerating}
                startIcon={isGenerating ? <LinearProgress size={20} /> : <DownloadIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0052A3, #00B359)',
                  }
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate Custom Template'}
              </Button>
            </Box>

            {/* Generated Template */}
            <AnimatePresence>
              {generatedTemplate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Alert severity="success" sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Template Generated Successfully!
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Your custom template is ready for download.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => downloadTemplate(generatedTemplate, customization.format)}
                    >
                      Download Template
                    </Button>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Capture */}
            {!emailSubmitted ? (
              <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Get More Templates
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enter your email to receive additional templates and updates
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<EmailIcon />}
                    disabled={!email}
                  >
                    Subscribe
                  </Button>
                </Box>
              </Box>
            ) : (
              <Alert severity="success" sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon />
                  <Typography>Subscribed! Check your email for more templates.</Typography>
                </Box>
              </Alert>
            )}

            {/* Pro Features CTA */}
            <Paper sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Typography variant="h6" gutterBottom>
                Upgrade to Dynamic Calendars
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                CreatorFlow Pro gives you:
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                  Dynamic calendars that update automatically
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                  AI-powered content suggestions
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                  Team collaboration and approval workflows
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="inherit"
                fullWidth
                startIcon={<ShareIcon />}
                sx={{ 
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100'
                  }
                }}
              >
                Try CreatorFlow Pro Free
              </Button>
            </Paper>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
