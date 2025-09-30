"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Skeleton,
  Divider,
  Stack,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  ContentCopy,
  Schedule,
  Analytics,
  Settings,
  Refresh,
  CheckCircle,
  Warning,
  Info,
  Lightbulb,
  Add,
  Edit,
  Delete,
  Visibility,
  ThumbUp,
  Share,
  Message,
  CalendarToday,
  AccessTime,
  TrendingFlat,
  Rocket,
  Monitor,
  BarChart,
  Language,
  TrackChanges,
  Insights,
  GpsFixed as Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  PlayArrow,
  Pause,
  Stop,
  Save,
  Send,
  Image,
  VideoFile,
  Description,
  Tag,
  Event,
  Public,
  Lock,
  Group,
  Person,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  AutoAwesome,
  Palette,
  Tune,
  Compare,
  Assessment,
  Speed as SpeedIcon,
  EmojiEmotions,
  RecordVoiceOver,
  TextFields,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

// Voice analysis interfaces
interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  tone: string;
  formality: number;
  enthusiasm: number;
  professionalism: number;
  friendliness: number;
  confidence: number;
  creativity: number;
  keywords: string[];
  phrases: string[];
  avoidWords: string[];
  brandColors: string[];
  createdAt: string;
  updatedAt: string;
}

interface ContentAnalysis {
  id: string;
  content: string;
  platform: string;
  voiceMatch: number;
  toneScore: number;
  formalityScore: number;
  enthusiasmScore: number;
  professionalismScore: number;
  friendlinessScore: number;
  confidenceScore: number;
  creativityScore: number;
  suggestions: string[];
  improvements: string[];
  overallScore: number;
  analyzedAt: string;
}

interface VoiceToneAnalyzerProps {
  onSave?: (analysis: ContentAnalysis) => void;
  onExport?: (profile: VoiceProfile) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function VoiceToneAnalyzer({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: VoiceToneAnalyzerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [contentText, setContentText] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<VoiceProfile | null>(null);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfile, setNewProfile] = useState<Partial<VoiceProfile>>({
    name: '',
    description: '',
    tone: 'professional',
    formality: 7,
    enthusiasm: 6,
    professionalism: 8,
    friendliness: 7,
    confidence: 7,
    creativity: 6,
    keywords: [],
    phrases: [],
    avoidWords: [],
    brandColors: ['#1976d2', '#dc004e']
  });

  // Mock data for platforms
  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' }
  ];

  // Mock voice profiles
  useEffect(() => {
    const mockProfiles: VoiceProfile[] = [
      {
        id: '1',
        name: 'Professional Brand',
        description: 'Corporate, authoritative, trustworthy',
        tone: 'professional',
        formality: 8,
        enthusiasm: 5,
        professionalism: 9,
        friendliness: 6,
        confidence: 8,
        creativity: 4,
        keywords: ['innovative', 'solutions', 'expertise', 'quality'],
        phrases: ['We are committed to', 'Our team of experts', 'Proven results'],
        avoidWords: ['awesome', 'cool', 'amazing'],
        brandColors: ['#1976d2', '#dc004e'],
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Creative Influencer',
        description: 'Fun, engaging, authentic',
        tone: 'casual',
        formality: 3,
        enthusiasm: 9,
        professionalism: 4,
        friendliness: 9,
        confidence: 7,
        creativity: 9,
        keywords: ['amazing', 'incredible', 'love', 'obsessed'],
        phrases: ['You guys', 'OMG', 'This is everything'],
        avoidWords: ['utilize', 'leverage', 'synergy'],
        brandColors: ['#ff6b6b', '#4ecdc4'],
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }
    ];
    setVoiceProfiles(mockProfiles);
    setSelectedProfile(mockProfiles[0]);
  }, []);

  const handleAnalyze = async () => {
    if (!contentText.trim() || !selectedProfile) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockAnalysis: ContentAnalysis = {
      id: Date.now().toString(),
      content: contentText,
      platform: selectedPlatform,
      voiceMatch: Math.floor(Math.random() * 30) + 70, // 70-100
      toneScore: Math.floor(Math.random() * 20) + 80,
      formalityScore: Math.floor(Math.random() * 20) + 80,
      enthusiasmScore: Math.floor(Math.random() * 20) + 80,
      professionalismScore: Math.floor(Math.random() * 20) + 80,
      friendlinessScore: Math.floor(Math.random() * 20) + 80,
      confidenceScore: Math.floor(Math.random() * 20) + 80,
      creativityScore: Math.floor(Math.random() * 20) + 80,
      suggestions: [
        'Consider adding more emotional language',
        'Include a call-to-action',
        'Use more active voice'
      ],
      improvements: [
        'Replace "utilize" with "use" for better readability',
        'Add an emoji to increase engagement',
        'Shorten sentences for better flow'
      ],
      overallScore: Math.floor(Math.random() * 20) + 80,
      analyzedAt: new Date().toISOString()
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleCreateProfile = () => {
    if (!newProfile.name || !newProfile.description) return;

    const profile: VoiceProfile = {
      id: Date.now().toString(),
      name: newProfile.name,
      description: newProfile.description,
      tone: newProfile.tone || 'professional',
      formality: newProfile.formality || 7,
      enthusiasm: newProfile.enthusiasm || 6,
      professionalism: newProfile.professionalism || 8,
      friendliness: newProfile.friendliness || 7,
      confidence: newProfile.confidence || 7,
      creativity: newProfile.creativity || 6,
      keywords: newProfile.keywords || [],
      phrases: newProfile.phrases || [],
      avoidWords: newProfile.avoidWords || [],
      brandColors: newProfile.brandColors || ['#1976d2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setVoiceProfiles([...voiceProfiles, profile]);
    setSelectedProfile(profile);
    setShowCreateProfile(false);
    setNewProfile({
      name: '',
      description: '',
      tone: 'professional',
      formality: 7,
      enthusiasm: 6,
      professionalism: 8,
      friendliness: 7,
      confidence: 7,
      creativity: 6,
      keywords: [],
      phrases: [],
      avoidWords: [],
      brandColors: ['#1976d2', '#dc004e']
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        🎭 Voice & Tone Analyzer
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Analyze your content's voice and tone to ensure it matches your brand personality. 
        Get AI-powered suggestions to improve consistency and engagement.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Analyze Content" icon={<Psychology />} />
        <Tab label="Voice Profiles" icon={<Palette />} />
        <Tab label="Results" icon={<Analytics />} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Content to Analyze
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Paste your content here to analyze its voice and tone..."
                  variant="outlined"
                  sx={{ mb: 3 }}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Platform</InputLabel>
                      <Select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                      >
                        {platforms.map((platform) => (
                          <MenuItem key={platform.id} value={platform.id}>
                            {platform.icon} {platform.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Voice Profile</InputLabel>
                      <Select
                        value={selectedProfile?.id || ''}
                        onChange={(e) => {
                          const profile = voiceProfiles.find(p => p.id === e.target.value);
                          setSelectedProfile(profile || null);
                        }}
                      >
                        {voiceProfiles.map((profile) => (
                          <MenuItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnalyze}
                  disabled={!contentText.trim() || !selectedProfile || isAnalyzing}
                  startIcon={isAnalyzing ? <CircularProgress size={20} /> : <Psychology />}
                  sx={{ mt: 2 }}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Voice & Tone'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Selected Profile
                </Typography>
                {selectedProfile ? (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {selectedProfile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedProfile.description}
                    </Typography>
                    
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Formality</Typography>
                        <Typography variant="body2">{selectedProfile.formality}/10</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedProfile.formality * 10} 
                        color="primary"
                      />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Enthusiasm</Typography>
                        <Typography variant="body2">{selectedProfile.enthusiasm}/10</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedProfile.enthusiasm * 10} 
                        color="secondary"
                      />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Professionalism</Typography>
                        <Typography variant="body2">{selectedProfile.professionalism}/10</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedProfile.professionalism * 10} 
                        color="success"
                      />
                    </Stack>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Select a voice profile to analyze against
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Voice Profiles</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowCreateProfile(true)}
              >
                Create New Profile
              </Button>
            </Box>
          </Grid>

          {voiceProfiles.map((profile) => (
            <Grid item xs={12} md={6} key={profile.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">{profile.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={profile.tone} 
                      color="primary" 
                      size="small"
                    />
                  </Box>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Formality</Typography>
                      <Typography variant="body2">{profile.formality}/10</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={profile.formality * 10} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Enthusiasm</Typography>
                      <Typography variant="body2">{profile.enthusiasm}/10</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={profile.enthusiasm * 10} />
                  </Stack>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {profile.keywords.slice(0, 3).map((keyword, index) => (
                      <Chip key={index} label={keyword} size="small" />
                    ))}
                    {profile.keywords.length > 3 && (
                      <Chip label={`+${profile.keywords.length - 3} more`} size="small" variant="outlined" />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<Edit />}>Edit</Button>
                    <Button size="small" startIcon={<Delete />} color="error">Delete</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && analysis && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Analysis Results
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h2" sx={{ fontWeight: 'bold', color: `${getScoreColor(analysis.overallScore)}.main` }}>
                        {analysis.overallScore}
                      </Typography>
                      <Typography variant="h6" color={`${getScoreColor(analysis.overallScore)}.main`}>
                        {getScoreLabel(analysis.overallScore)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overall Voice Match
                      </Typography>
                    </Box>

                    <Stack spacing={2}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Voice Match</Typography>
                          <Typography variant="body2">{analysis.voiceMatch}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={analysis.voiceMatch} 
                          color={getScoreColor(analysis.voiceMatch)}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Tone Score</Typography>
                          <Typography variant="body2">{analysis.toneScore}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={analysis.toneScore} 
                          color={getScoreColor(analysis.toneScore)}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Formality</Typography>
                          <Typography variant="body2">{analysis.formalityScore}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={analysis.formalityScore} 
                          color={getScoreColor(analysis.formalityScore)}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Enthusiasm</Typography>
                          <Typography variant="body2">{analysis.enthusiasmScore}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={analysis.enthusiasmScore} 
                          color={getScoreColor(analysis.enthusiasmScore)}
                        />
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Suggestions
                    </Typography>
                    <List>
                      {analysis.suggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Lightbulb color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={suggestion} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                      Improvements
                    </Typography>
                    <List>
                      {analysis.improvements.map((improvement, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Edit color="secondary" />
                          </ListItemIcon>
                          <ListItemText primary={improvement} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Create Profile Dialog */}
      <Dialog open={showCreateProfile} onClose={() => setShowCreateProfile(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Voice Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Profile Name"
                value={newProfile.name}
                onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={newProfile.tone}
                  onChange={(e) => setNewProfile({...newProfile, tone: e.target.value})}
                >
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="authoritative">Authoritative</MenuItem>
                  <MenuItem value="creative">Creative</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newProfile.description}
                onChange={(e) => setNewProfile({...newProfile, description: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Voice Characteristics</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>Formality: {newProfile.formality}/10</Typography>
              <Slider
                value={newProfile.formality}
                onChange={(e, value) => setNewProfile({...newProfile, formality: value as number})}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>Enthusiasm: {newProfile.enthusiasm}/10</Typography>
              <Slider
                value={newProfile.enthusiasm}
                onChange={(e, value) => setNewProfile({...newProfile, enthusiasm: value as number})}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>Professionalism: {newProfile.professionalism}/10</Typography>
              <Slider
                value={newProfile.professionalism}
                onChange={(e, value) => setNewProfile({...newProfile, professionalism: value as number})}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>Friendliness: {newProfile.friendliness}/10</Typography>
              <Slider
                value={newProfile.friendliness}
                onChange={(e, value) => setNewProfile({...newProfile, friendliness: value as number})}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateProfile(false)}>Cancel</Button>
          <Button onClick={handleCreateProfile} variant="contained">Create Profile</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
