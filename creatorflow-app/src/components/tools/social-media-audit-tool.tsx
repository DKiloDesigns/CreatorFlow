/**
 * Social Media Audit Tool
 * Free tool for comprehensive social media strategy analysis
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Analytics as AnalyticsIcon,
  Flag as TargetIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Image as ImageIcon,
  Chat as MessageSquareIcon,
  BarChart as BarChart3Icon,
  Star as StarIcon,
  ThumbUp as ThumbsUpIcon,
  ThumbDown as ThumbsDownIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface AuditQuestion {
  id: string;
  question: string;
  category: string;
  type: 'multiple-choice' | 'scale' | 'text' | 'checkbox';
  options?: string[];
  scale?: { min: number; max: number; labels: string[] };
  weight: number;
}

interface AuditResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  platformAnalysis: Record<string, {
    score: number;
    issues: string[];
    opportunities: string[];
  }>;
}

const AUDIT_CATEGORIES = [
  { id: 'strategy', name: 'Strategy & Planning', icon: <TargetIcon />, color: '#2196F3' },
  { id: 'content', name: 'Content Quality', icon: <ImageIcon />, color: '#E91E63' },
  { id: 'engagement', name: 'Engagement', icon: <ThumbsUpIcon />, color: '#4CAF50' },
  { id: 'consistency', name: 'Consistency', icon: <ScheduleIcon />, color: '#FF9800' },
  { id: 'analytics', name: 'Analytics & Tracking', icon: <AnalyticsIcon />, color: '#9C27B0' },
  { id: 'branding', name: 'Branding', icon: <StarIcon />, color: '#FF5722' },
];

const PLATFORMS = [
  'Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube',
  'Pinterest', 'Snapchat', 'Reddit', 'Discord', 'Twitch', 'Vimeo'
];

const AUDIT_QUESTIONS: AuditQuestion[] = [
  // Strategy & Planning
  {
    id: 'strategy-1',
    question: 'Do you have a clear social media strategy?',
    category: 'strategy',
    type: 'multiple-choice',
    options: ['Yes, well documented', 'Yes, but not documented', 'Somewhat', 'No'],
    weight: 3
  },
  {
    id: 'strategy-2',
    question: 'How often do you post content?',
    category: 'strategy',
    type: 'multiple-choice',
    options: ['Multiple times daily', 'Daily', '3-4 times per week', 'Weekly', 'Less than weekly'],
    weight: 2
  },
  {
    id: 'strategy-3',
    question: 'Do you plan your content in advance?',
    category: 'strategy',
    type: 'multiple-choice',
    options: ['Yes, months ahead', 'Yes, weeks ahead', 'Yes, days ahead', 'Sometimes', 'No'],
    weight: 2
  },
  
  // Content Quality
  {
    id: 'content-1',
    question: 'How would you rate your content quality?',
    category: 'content',
    type: 'scale',
    scale: { min: 1, max: 5, labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] },
    weight: 3
  },
  {
    id: 'content-2',
    question: 'Do you use high-quality images and videos?',
    category: 'content',
    type: 'multiple-choice',
    options: ['Always', 'Mostly', 'Sometimes', 'Rarely', 'Never'],
    weight: 2
  },
  {
    id: 'content-3',
    question: 'Is your content original and unique?',
    category: 'content',
    type: 'multiple-choice',
    options: ['Always', 'Mostly', 'Sometimes', 'Rarely', 'Never'],
    weight: 2
  },
  
  // Engagement
  {
    id: 'engagement-1',
    question: 'How would you rate your engagement rate?',
    category: 'engagement',
    type: 'scale',
    scale: { min: 1, max: 5, labels: ['Very Low', 'Low', 'Average', 'High', 'Very High'] },
    weight: 3
  },
  {
    id: 'engagement-2',
    question: 'Do you respond to comments and messages?',
    category: 'engagement',
    type: 'multiple-choice',
    options: ['Always', 'Mostly', 'Sometimes', 'Rarely', 'Never'],
    weight: 2
  },
  {
    id: 'engagement-3',
    question: 'Do you actively engage with other accounts?',
    category: 'engagement',
    type: 'multiple-choice',
    options: ['Always', 'Mostly', 'Sometimes', 'Rarely', 'Never'],
    weight: 2
  },
  
  // Consistency
  {
    id: 'consistency-1',
    question: 'How consistent is your posting schedule?',
    category: 'consistency',
    type: 'scale',
    scale: { min: 1, max: 5, labels: ['Very Inconsistent', 'Inconsistent', 'Somewhat Consistent', 'Consistent', 'Very Consistent'] },
    weight: 2
  },
  {
    id: 'consistency-2',
    question: 'Is your brand voice consistent across platforms?',
    category: 'consistency',
    type: 'multiple-choice',
    options: ['Always', 'Mostly', 'Sometimes', 'Rarely', 'Never'],
    weight: 2
  },
  
  // Analytics & Tracking
  {
    id: 'analytics-1',
    question: 'Do you track your social media metrics?',
    category: 'analytics',
    type: 'multiple-choice',
    options: ['Yes, comprehensively', 'Yes, basic metrics', 'Sometimes', 'Rarely', 'No'],
    weight: 3
  },
  {
    id: 'analytics-2',
    question: 'Do you analyze your performance regularly?',
    category: 'analytics',
    type: 'multiple-choice',
    options: ['Weekly', 'Monthly', 'Quarterly', 'Rarely', 'Never'],
    weight: 2
  },
  
  // Branding
  {
    id: 'branding-1',
    question: 'Is your visual branding consistent?',
    category: 'branding',
    type: 'scale',
    scale: { min: 1, max: 5, labels: ['Very Inconsistent', 'Inconsistent', 'Somewhat Consistent', 'Consistent', 'Very Consistent'] },
    weight: 2
  },
  {
    id: 'branding-2',
    question: 'Do you have a clear brand identity?',
    category: 'branding',
    type: 'multiple-choice',
    options: ['Yes, very clear', 'Yes, somewhat clear', 'Somewhat', 'Not really', 'No'],
    weight: 2
  }
];

export default function SocialMediaAuditTool() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<AuditResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    'Strategy & Planning',
    'Content Quality',
    'Engagement',
    'Consistency',
    'Analytics & Tracking',
    'Branding',
    'Results & Recommendations'
  ];

  const getCategoryQuestions = (category: string) => {
    return AUDIT_QUESTIONS.filter(q => q.category === category);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResults = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Calculate category scores
    const categoryScores: Record<string, number> = {};
    const categoryWeights: Record<string, number> = {};
    
    AUDIT_CATEGORIES.forEach(category => {
      categoryScores[category.id] = 0;
      categoryWeights[category.id] = 0;
    });
    
    AUDIT_QUESTIONS.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        let score = 0;
        
        if (question.type === 'multiple-choice') {
          const optionIndex = question.options?.indexOf(answer) || 0;
          score = (optionIndex + 1) / (question.options?.length || 1) * 5;
        } else if (question.type === 'scale') {
          score = answer;
        } else if (question.type === 'checkbox') {
          score = answer ? 5 : 1;
        }
        
        categoryScores[question.category] += score * question.weight;
        categoryWeights[question.category] += question.weight;
      }
    });
    
    // Normalize scores
    Object.keys(categoryScores).forEach(category => {
      if (categoryWeights[category] > 0) {
        categoryScores[category] = (categoryScores[category] / categoryWeights[category]) * 20; // Scale to 100
      }
    });
    
    // Calculate overall score
    const overallScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / Object.keys(categoryScores).length;
    
    // Generate recommendations
    const recommendations = [];
    const strengths = [];
    const weaknesses = [];
    
    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score >= 80) {
        strengths.push(`${AUDIT_CATEGORIES.find(c => c.id === category)?.name} is a strength`);
      } else if (score < 60) {
        weaknesses.push(`${AUDIT_CATEGORIES.find(c => c.id === category)?.name} needs improvement`);
        recommendations.push(`Focus on improving your ${AUDIT_CATEGORIES.find(c => c.id === category)?.name.toLowerCase()}`);
      }
    });
    
    // Generate action plan
    const actionPlan = {
      immediate: [
        'Review and update your social media strategy',
        'Audit your current content for quality and consistency',
        'Set up proper analytics tracking'
      ],
      shortTerm: [
        'Create a content calendar',
        'Develop a consistent posting schedule',
        'Improve your visual branding'
      ],
      longTerm: [
        'Build a comprehensive social media strategy',
        'Develop advanced analytics and reporting',
        'Create a strong brand identity'
      ]
    };
    
    // Platform analysis
    const platformAnalysis: Record<string, any> = {};
    PLATFORMS.forEach(platform => {
      platformAnalysis[platform] = {
        score: Math.floor(Math.random() * 40) + 60,
        issues: ['Inconsistent posting', 'Low engagement'],
        opportunities: ['Increase posting frequency', 'Improve content quality']
      };
    });
    
    setResults({
      overallScore,
      categoryScores,
      recommendations,
      strengths,
      weaknesses,
      actionPlan,
      platformAnalysis
    });
    
    setIsCalculating(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSubmitted(true);
    }
  };

  const downloadReport = () => {
    if (!results) return;
    
    const report = {
      overallScore: results.overallScore,
      categoryScores: results.categoryScores,
      recommendations: results.recommendations,
      strengths: results.strengths,
      weaknesses: results.weaknesses,
      actionPlan: results.actionPlan,
      platformAnalysis: results.platformAnalysis,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'social-media-audit-report.json';
    a.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
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
            background: 'linear-gradient(45deg, #0066CC, #00CC66)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Social Media Audit Tool
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Get a comprehensive analysis of your social media strategy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Answer a few questions to receive personalized recommendations and an action plan
          </Typography>
        </Box>
      </motion.div>

      {/* Progress Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </motion.div>

      {/* Questions */}
      {!results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssessmentIcon color="primary" />
                {steps[currentStep]}
              </Typography>

              <Box sx={{ mt: 3 }}>
                {getCategoryQuestions(AUDIT_CATEGORIES[currentStep]?.id).map((question, index) => (
                  <Box key={question.id} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      {question.question}
                    </Typography>

                    {question.type === 'multiple-choice' && (
                      <RadioGroup
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      >
                        {question.options?.map((option) => (
                          <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    )}

                    {question.type === 'scale' && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Rate from {question.scale?.min} to {question.scale?.max}
                        </Typography>
                        <RadioGroup
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                          row
                        >
                          {Array.from({ length: (question.scale?.max || 5) - (question.scale?.min || 1) + 1 }, (_, i) => {
                            const value = (question.scale?.min || 1) + i;
                            return (
                              <FormControlLabel
                                key={value}
                                value={value.toString()}
                                control={<Radio />}
                                label={value}
                              />
                            );
                          })}
                        </RadioGroup>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {question.scale?.labels[0]}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {question.scale?.labels[question.scale.labels.length - 1]}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {question.type === 'checkbox' && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={answers[question.id] || false}
                            onChange={(e) => handleAnswerChange(question.id, e.target.checked)}
                          />
                        }
                        label="Yes"
                      />
                    )}

                    {question.type === 'text' && (
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Enter your answer..."
                      />
                    )}
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isCalculating}
                  startIcon={isCalculating ? <LinearProgress size={20} /> : <AssessmentIcon />}
                  sx={{ 
                    background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0052A3, #00B359)',
                    }
                  }}
                >
                  {isCalculating ? 'Calculating...' : currentStep === steps.length - 1 ? 'Get Results' : 'Next'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon color="primary" />
                  Your Social Media Audit Results
                </Typography>

                {/* Overall Score */}
                <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                      {results.overallScore.toFixed(0)}/100
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      {getScoreLabel(results.overallScore)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={results.overallScore}
                      sx={{ 
                        height: 20, 
                        borderRadius: 10,
                        backgroundColor: 'grey.300',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getScoreColor(results.overallScore) === 'success' ? 'success.main' : 
                                          getScoreColor(results.overallScore) === 'warning' ? 'warning.main' : 'error.main'
                        }
                      }}
                    />
                  </Box>
                </Paper>

                {/* Category Scores */}
                <Typography variant="h6" gutterBottom>
                  Category Breakdown
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {AUDIT_CATEGORIES.map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category.id}>
                      <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box sx={{ color: category.color }}>
                            {category.icon}
                          </Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {category.name}
                          </Typography>
                        </Box>
                        <Typography variant="h4" color="primary">
                          {results.categoryScores[category.id]?.toFixed(0) || 0}/100
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={results.categoryScores[category.id] || 0}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'grey.300',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getScoreColor(results.categoryScores[category.id] || 0) === 'success' ? 'success.main' : 
                                              getScoreColor(results.categoryScores[category.id] || 0) === 'warning' ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Tabs */}
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                  <Tab label="Strengths & Weaknesses" />
                  <Tab label="Recommendations" />
                  <Tab label="Action Plan" />
                  <Tab label="Platform Analysis" />
                </Tabs>

                {/* Strengths & Weaknesses Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, backgroundColor: 'success.light', color: 'success.contrastText' }}>
                          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon />
                            Strengths
                          </Typography>
                          <List>
                            {results.strengths.map((strength, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemIcon>
                                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                                </ListItemIcon>
                                <ListItemText primary={strength} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, backgroundColor: 'error.light', color: 'error.contrastText' }}>
                          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WarningIcon />
                            Areas for Improvement
                          </Typography>
                          <List>
                            {results.weaknesses.map((weakness, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemIcon>
                                  <WarningIcon sx={{ fontSize: 16 }} />
                                </ListItemIcon>
                                <ListItemText primary={weakness} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Recommendations Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Personalized Recommendations
                    </Typography>
                    <List>
                      {results.recommendations.map((recommendation, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <InfoIcon color="info" />
                          </ListItemIcon>
                          <ListItemText primary={recommendation} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Action Plan Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
                            Immediate (0-30 days)
                          </Typography>
                          <List>
                            {results.actionPlan.immediate.map((action, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemIcon>
                                  <ErrorIcon color="error" />
                                </ListItemIcon>
                                <ListItemText primary={action} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
                            Short Term (1-3 months)
                          </Typography>
                          <List>
                            {results.actionPlan.shortTerm.map((action, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemIcon>
                                  <WarningIcon color="warning" />
                                </ListItemIcon>
                                <ListItemText primary={action} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
                            Long Term (3+ months)
                          </Typography>
                          <List>
                            {results.actionPlan.longTerm.map((action, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemIcon>
                                  <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary={action} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Platform Analysis Tab */}
                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Platform Performance
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(results.platformAnalysis).map(([platform, analysis]) => (
                        <Grid item xs={12} sm={6} md={4} key={platform}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              {platform}
                            </Typography>
                            <Typography variant="h4" color="primary">
                              {analysis.score}/100
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={analysis.score}
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: 'grey.300',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getScoreColor(analysis.score) === 'success' ? 'success.main' : 
                                                  getScoreColor(analysis.score) === 'warning' ? 'warning.main' : 'error.main'
                                }
                              }}
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Download Report */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadReport}
                    sx={{ 
                      background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0052A3, #00B359)',
                      }
                    }}
                  >
                    Download Full Report
                  </Button>
                </Box>

                {/* Email Capture */}
                {!emailSubmitted ? (
                  <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Get More Insights
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Enter your email to receive additional recommendations and updates
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
                      <Typography>Subscribed! Check your email for more insights.</Typography>
                    </Box>
                  </Alert>
                )}

                {/* Pro Features CTA */}
                <Paper sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <Typography variant="h6" gutterBottom>
                    Take Your Social Media to the Next Level
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    CreatorFlow Pro gives you:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Advanced analytics and reporting
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      AI-powered content optimization
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Automated posting and scheduling
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
        )}
      </AnimatePresence>
    </Box>
  );
}
