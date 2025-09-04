import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  TextField,
  Box,
  Typography,
  Chip
} from '@mui/material';
import { Mic } from 'lucide-react';

interface AIContentToneProps {
  onToneSelect?: (tone: string) => void;
  className?: string;
}

export function AIContentTone({ onToneSelect, className }: AIContentToneProps) {
  const [content, setContent] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toneOptions = [
    { value: 'professional', label: 'Professional', color: 'primary' },
    { value: 'casual', label: 'Casual', color: 'secondary' },
    { value: 'friendly', label: 'Friendly', color: 'success' },
    { value: 'authoritative', label: 'Authoritative', color: 'warning' },
    { value: 'creative', label: 'Creative', color: 'info' },
    { value: 'humorous', label: 'Humorous', color: 'default' }
  ];

  const analyzeTone = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    try {
      // Simulate AI tone analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just select a random tone
      const randomTone = toneOptions[Math.floor(Math.random() * toneOptions.length)];
      setSelectedTone(randomTone.value);
      onToneSelect?.(randomTone.value);
    } catch (error) {
      console.error('Error analyzing tone:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToneSelect = (tone: string) => {
    setSelectedTone(tone);
    onToneSelect?.(tone);
  };

  return (
    <Card sx={{ height: '100%' }} className={className}>
      <CardHeader
        title="AI Content Tone Analyzer"
        subheader="Analyze and adjust the tone of your content"
        avatar={<Mic style={{ width: 24, height: 24 }} />}
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Enter your content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here to analyze its tone..."
            variant="outlined"
          />
          
          <Button
            fullWidth
            variant="contained"
            onClick={analyzeTone}
            disabled={!content.trim() || isAnalyzing}
            startIcon={<Mic style={{ width: 20, height: 20 }} />}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Tone'}
          </Button>

          {selectedTone && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Detected Tone:
              </Typography>
              <Chip
                label={toneOptions.find(t => t.value === selectedTone)?.label}
                color="primary"
                variant="outlined"
              />
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Available Tones:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {toneOptions.map((tone) => (
                <Chip
                  key={tone.value}
                  label={tone.label}
                  variant={selectedTone === tone.value ? 'filled' : 'outlined'}
                  color={selectedTone === tone.value ? 'primary' : 'default'}
                  onClick={() => handleToneSelect(tone.value)}
                  clickable
                />
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 