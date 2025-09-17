'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  Chip,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Rating
} from '@mui/material';
import {
  Brain,
  Lightbulb,
  Hash,
  Calendar,
  Target,
  TrendingUp,
  Sparkles,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Save,
  Play,
  Settings,
  Eye,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { SmartCaptionGenerator } from '@/components/ui/smart-caption-generator';
import { AdvancedHashtagRecommender } from '@/components/ui/advanced-hashtag-recommender';

import { OptimalPostingTimePredictor } from '@/components/ui/optimal-posting-time-predictor';
import { ContentPerformancePredictor } from '@/components/ui/content-performance-predictor';

interface ContentWorkflowStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  optional?: boolean;
}

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  content: string;
  hashtags: string[];
  platforms: string[];
  predictedEngagement: number;
  bestPostingTime: string;
  aiScore: number;
}

interface ContentTemplate {
  id: string;
  name: string;
  content: string;
  hashtags: string[];
  platforms: string[];
  category: string;
  usageCount: number;
  lastUsed: string;
}

interface SmartContentWorkflowProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export default function SmartContentWorkflow({ activeStep, onStepChange }: SmartContentWorkflowProps) {
  const [workflowData, setWorkflowData] = useState({
    contentIdea: '',
    targetAudience: '',
    platforms: [] as string[],
    content: '',
    hashtags: [] as string[],
    caption: '',
    postingTime: '',
    predictedPerformance: null as any,
    aiOptimizations: [] as string[]
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [showPerformancePreview, setShowPerformancePreview] = useState(false);

  // Workflow steps
  const steps: ContentWorkflowStep[] = [
    {
      id: 'ideation',
      label: 'Content Ideation',
      description: 'Generate content ideas with AI',
      icon: <Lightbulb />,
      completed: false
    },
    {
      id: 'creation',
      label: 'Content Creation',
      description: 'Create and optimize your content',
      icon: <Brain />,
      completed: false
    },
    {
      id: 'optimization',
      label: 'AI Optimization',
      description: 'Optimize with AI tools',
      icon: <Sparkles />,
      completed: false
    },
    {
      id: 'scheduling',
      label: 'Smart Scheduling',
      description: 'Schedule with performance prediction',
      icon: <Calendar />,
      completed: false
    },
    {
      id: 'review',
      label: 'Review & Publish',
      description: 'Final review and publish',
      icon: <CheckCircle />,
      completed: false
    }
  ];

  // Step 1: Content Ideation
  const renderIdeationStep = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        🚀 AI-Powered Content Ideation
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Generate Content Ideas" />
            <CardContent>
              <TextField
                fullWidth
                label="Describe your content goal"
                placeholder="e.g., Promote our new product, Share company culture, Educational content about..."
                value={workflowData.contentIdea}
                onChange={(e) => setWorkflowData(prev => ({ ...prev, contentIdea: e.target.value }))}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Target Audience"
                placeholder="e.g., Young professionals, Tech enthusiasts, Small business owners"
                value={workflowData.targetAudience}
                onChange={(e) => setWorkflowData(prev => ({ ...prev, targetAudience: e.target.value }))}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                startIcon={<Brain />}
                onClick={generateContentIdeas}
                disabled={!workflowData.contentIdea || isGenerating}
                fullWidth
              >
                {isGenerating ? 'Generating Ideas...' : 'Generate Content Ideas'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Generated Ideas" />
            <CardContent>
              {contentIdeas.length === 0 ? (
                <Typography color="text.secondary" align="center">
                  Generate some content ideas to get started
                </Typography>
              ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {contentIdeas.map((idea, index) => (
                    <Paper
                      key={idea.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        cursor: 'pointer',
                        border: selectedIdea?.id === idea.id ? 2 : 1,
                        borderColor: selectedIdea?.id === idea.id ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        boxShadow: selectedIdea?.id === idea.id ? 2 : 1,
                        '&:hover': { 
                          borderColor: 'primary.main',
                          boxShadow: 2
                        }
                      }}
                      onClick={() => setSelectedIdea(idea)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {idea.title}
                        </Typography>
                        <Chip
                          icon={<TrendingUp />}
                          label={`${idea.predictedEngagement} engagement`}
                          size="small"
                          color="success"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {idea.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        {idea.platforms.slice(0, 3).map((platform) => (
                          <Chip key={platform} label={platform} size="small" variant="outlined" />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Rating value={idea.aiScore / 20} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          Best time: {idea.bestPostingTime}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {selectedIdea && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRight />}
            onClick={() => {
              setWorkflowData(prev => ({
                ...prev,
                content: selectedIdea.content,
                hashtags: selectedIdea.hashtags,
                platforms: selectedIdea.platforms
              }));
              onStepChange(1);
            }}
          >
            Use This Idea & Continue
          </Button>
        </Box>
      )}
    </Box>
  );

  // Step 2: Content Creation
  const renderCreationStep = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        ✍️ Content Creation & Optimization
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Content Editor" />
            <CardContent>
              <TextField
                fullWidth
                label="Content"
                placeholder="Write your content here..."
                value={workflowData.content}
                onChange={(e) => setWorkflowData(prev => ({ ...prev, content: e.target.value }))}
                multiline
                rows={6}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<Hash />}
                  onClick={() => {/* Open hashtag recommender */}}
                >
                  Get Hashtag Suggestions
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Brain />}
                  onClick={() => {/* Open caption generator */}}
                >
                  Generate Caption
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Target />}
                  onClick={() => {/* Open audience optimizer */}}
                >
                  Optimize for Audience
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Content Analysis" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Content Length
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {workflowData.content.length} characters
                </Typography>
                {workflowData.content.length < 100 && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Consider adding more detail for better engagement
                  </Alert>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Hashtags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {workflowData.hashtags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Target Platforms
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {workflowData.platforms.map((platform, index) => (
                    <Chip key={index} label={platform} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowRight />}
          onClick={() => onStepChange(2)}
          disabled={!workflowData.content.trim()}
        >
          Continue to AI Optimization
        </Button>
      </Box>
    </Box>
  );

  // Step 3: AI Optimization
  const renderOptimizationStep = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        🤖 AI-Powered Optimization
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Smart Caption Generator" />
            <CardContent>
              <SmartCaptionGenerator
                provider="openai"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Advanced Hashtag Recommender" />
            <CardContent>
              <AdvancedHashtagRecommender
                provider="openai"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Content Performance Predictor" />
            <CardContent>
              <ContentPerformancePredictor
                provider="openai"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowRight />}
          onClick={() => onStepChange(3)}
        >
          Continue to Smart Scheduling
        </Button>
      </Box>
    </Box>
  );

  // Step 4: Smart Scheduling
  const renderSchedulingStep = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        📅 Smart Scheduling & Performance Prediction
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Optimal Posting Time Predictor" />
            <CardContent>
              <OptimalPostingTimePredictor
                provider="openai"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Performance Preview" />
            <CardContent>
              {workflowData.predictedPerformance ? (
                <Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {workflowData.predictedPerformance.engagementScore}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Predicted Engagement Rate
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Key Insights:
                    </Typography>
                    <ul>
                      {workflowData.predictedPerformance.insights?.map((insight: string, index: number) => (
                        <li key={index}>
                          <Typography variant="body2">{insight}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary" align="center">
                  Generate performance prediction to see insights
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowRight />}
          onClick={() => onStepChange(4)}
        >
          Continue to Review & Publish
        </Button>
      </Box>
    </Box>
  );

  // Step 5: Review & Publish
  const renderReviewStep = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        ✅ Review & Publish
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Content Preview" />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Final Content:
                </Typography>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2
                }}>
                  <Typography variant="body1">
                    {workflowData.caption || workflowData.content}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Hashtags:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {workflowData.hashtags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Target Platforms:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {workflowData.platforms.map((platform, index) => (
                    <Chip key={index} label={platform} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>

              {workflowData.postingTime && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommended Posting Time:
                  </Typography>
                  <Chip
                    icon={<Clock />}
                    label={workflowData.postingTime}
                    color="primary"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Publishing Options" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Play />}
                  onClick={handlePublishNow}
                  sx={{ mb: 2 }}
                >
                  Publish Now
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Calendar />}
                  onClick={handleSchedulePost}
                  sx={{ mb: 2 }}
                >
                  Schedule Post
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Save />}
                  onClick={handleSaveAsTemplate}
                >
                  Save as Template
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  AI Optimization Score:
                </Typography>
                <Rating
                  value={workflowData.aiOptimizations.length / 2}
                  readOnly
                  size="large"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {workflowData.aiOptimizations.length} optimizations applied
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Helper functions
  const generateContentIdeas = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockIdeas: ContentIdea[] = [
        {
          id: '1',
          title: 'Product Showcase',
          description: 'Highlight key features and benefits of your product with engaging visuals',
          content: 'Discover how our latest innovation can transform your workflow. Packed with powerful features designed for modern professionals.',
          hashtags: ['#innovation', '#productivity', '#tech'],
          platforms: ['LinkedIn', 'Twitter', 'Instagram'],
          predictedEngagement: 85,
          bestPostingTime: '9:00 AM',
          aiScore: 92
        },
        {
          id: '2',
          title: 'Behind the Scenes',
          description: 'Share your company culture and team dynamics',
          content: 'Ever wonder what goes on behind the scenes? Here\'s a peek into our daily operations and the amazing team that makes it all happen.',
          hashtags: ['#companyculture', '#teamwork', '#behindthescenes'],
          platforms: ['Instagram', 'LinkedIn', 'TikTok'],
          predictedEngagement: 78,
          bestPostingTime: '12:00 PM',
          aiScore: 88
        }
      ];
      
      setContentIdeas(mockIdeas);
      toast.success('Generated 2 content ideas!');
    } catch (error) {
      toast.error('Failed to generate content ideas');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishNow = () => {
    toast.success('Content published successfully!');
    // Reset workflow
    onStepChange(0);
    setWorkflowData({
      contentIdea: '',
      targetAudience: '',
      platforms: [],
      content: '',
      hashtags: [],
      caption: '',
      postingTime: '',
      predictedPerformance: null,
      aiOptimizations: []
    });
  };

  const handleSchedulePost = () => {
    toast.success('Post scheduled successfully!');
  };

  const handleSaveAsTemplate = () => {
    toast.success('Template saved successfully!');
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderIdeationStep();
      case 1:
        return renderCreationStep();
      case 2:
        return renderOptimizationStep();
      case 3:
        return renderSchedulingStep();
      case 4:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ '& .MuiStepLabel-root': { py: 2 } }}>
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel
              icon={step.icon}
              optional={step.optional}
              sx={{
                '& .MuiStepLabel-labelContainer': {
                  '& .MuiTypography-h6': {
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'text.primary'
                  },
                  '& .MuiTypography-body2': {
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    mt: 0.5
                  }
                }
              }}
            >
              <Typography variant="h6">{step.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </StepLabel>
            <StepContent sx={{ pl: 4, pb: 3 }}>
              {getStepContent(index)}
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Paper sx={{ 
          p: 3, 
          mt: 3, 
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            All steps completed - you&apos;re finished!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can now publish your content or start a new workflow.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
