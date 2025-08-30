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
import { Globe, Activity } from 'lucide-react';

interface AIContentTranslatorProps {
  onTranslation?: (translation: string, targetLanguage: string) => void;
  className?: string;
}

export function AIContentTranslator({ onTranslation, className }: AIContentTranslatorProps) {
  const [content, setContent] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [translatedContent, setTranslatedContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { value: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
    { value: 'French', label: 'French', flag: '🇫🇷' },
    { value: 'German', label: 'German', flag: '🇩🇪' },
    { value: 'Italian', label: 'Italian', flag: '🇮🇹' },
    { value: 'Portuguese', label: 'Portuguese', flag: '🇵🇹' },
    { value: 'Japanese', label: 'Japanese', flag: '🇯🇵' },
    { value: 'Korean', label: 'Korean', flag: '🇰🇷' },
    { value: 'Chinese', label: 'Chinese', flag: '🇨🇳' },
    { value: 'Arabic', label: 'Arabic', flag: '🇸🇦' },
    { value: 'Russian', label: 'Russian', flag: '🇷🇺' }
  ];

  const translateContent = async () => {
    if (!content.trim()) return;

    setIsTranslating(true);
    try {
      // Simulate AI translation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just add a placeholder translation
      const mockTranslation = `[Translated to ${targetLanguage}]: ${content}`;
      setTranslatedContent(mockTranslation);
      onTranslation?.(mockTranslation, targetLanguage);
    } catch (error) {
      console.error('Error translating content:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageSelect = (language: string) => {
    setTargetLanguage(language);
    setTranslatedContent(''); // Clear previous translation
  };

  const copyTranslation = async () => {
    try {
      await navigator.clipboard.writeText(translatedContent);
    } catch (error) {
      console.error('Failed to copy translation:', error);
    }
  };

  return (
    <Card className={className} sx={{ height: '100%' }}>
      <CardHeader
        title="AI Content Translator"
        subheader="Translate your content to multiple languages"
        avatar={<Globe size={24} />}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} component="div">
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Enter content to translate"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here to translate..."
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} component="div">
            <Typography variant="subtitle2" gutterBottom>
              Select Target Language:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {languages.map((language) => (
                <Chip
                  key={language.value}
                  label={`${language.flag} ${language.label}`}
                  variant={targetLanguage === language.value ? 'filled' : 'outlined'}
                  color={targetLanguage === language.value ? 'primary' : 'default'}
                  onClick={() => handleLanguageSelect(language.value)}
                  clickable
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} component="div">
            <Button
              fullWidth
              variant="contained"
              onClick={translateContent}
              disabled={!content.trim() || isTranslating}
              startIcon={<Activity />}
            >
              {isTranslating ? 'Translating...' : `Translate to ${targetLanguage}`}
            </Button>
          </Grid>

          {translatedContent && (
            <Grid item xs={12} component="div">
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Translation:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={translatedContent}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={copyTranslation}
                    startIcon={<Activity size={16} />}
                  >
                    Copy Translation
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
} 