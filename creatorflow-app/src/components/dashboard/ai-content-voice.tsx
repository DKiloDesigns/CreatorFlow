import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Grid
} from '@mui/material';
import { User, Activity } from 'lucide-react';

interface AIContentVoiceProps {
  onVoiceSelect?: (voice: string) => void;
  className?: string;
}

export function AIContentVoice({ onVoiceSelect, className }: AIContentVoiceProps) {
  const [content, setContent] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const voiceOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
    { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and positive' },
    { value: 'calm', label: 'Calm', description: 'Relaxed and soothing' },
    { value: 'confident', label: 'Confident', description: 'Assured and bold' },
    { value: 'empathetic', label: 'Empathetic', description: 'Understanding and caring' }
  ];

  const generateVoice = async () => {
    if (!content.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate AI voice generation
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // For now, just select a random voice
      const randomVoice = voiceOptions[Math.floor(Math.random() * voiceOptions.length)];
      setSelectedVoice(randomVoice.value);
      onVoiceSelect?.(randomVoice.value);
    } catch (error) {
      console.error('Error generating voice:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceSelect = (voice: string) => {
    setSelectedVoice(voice);
    onVoiceSelect?.(voice);
  };

  return (
    <Card sx={{ height: '100%' }} className={className}>
      <CardHeader
        title="AI Content Voice Generator"
        subheader="Generate content with different voice styles"
        avatar={<User style={{ width: 24, height: 24 }} />}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Enter your content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here to generate different voices..."
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={generateVoice}
              disabled={!content.trim() || isGenerating}
              startIcon={<Activity style={{ width: 20, height: 20 }} />}
            >
              {isGenerating ? 'Generating...' : 'Generate Voice Variations'}
            </Button>
          </Grid>

          {selectedVoice && (
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Generated Voice:
                </Typography>
                <Chip
                  label={voiceOptions.find(v => v.value === selectedVoice)?.label}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {voiceOptions.find(v => v.value === selectedVoice)?.description}
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Available Voices:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {voiceOptions.map((voice) => (
                <Chip
                  key={voice.value}
                  label={voice.label}
                  variant={selectedVoice === voice.value ? 'filled' : 'outlined'}
                  color={selectedVoice === voice.value ? 'primary' : 'default'}
                  onClick={() => handleVoiceSelect(voice.value)}
                  clickable
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Select a voice style to see how your content would sound with that tone and personality.
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
} 