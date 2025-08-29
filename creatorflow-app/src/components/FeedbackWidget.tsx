'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  MenuItem
} from '@mui/material';
import { Send, Star } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackWidgetProps {
  className?: string;
  defaultCategory?: string;
  showTitle?: boolean;
}

const FEEDBACK_CATEGORIES = [
  { value: 'general', label: 'General Feedback' },
  { value: 'ui_ux', label: 'User Interface' },
  { value: 'features', label: 'Features' },
  { value: 'performance', label: 'Performance' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'support', label: 'Support' },
  { value: 'campaign', label: 'Campaign Experience' },
];

const FEATURES = [
  'Content Creation',
  'Social Media Management',
  'Analytics Dashboard',
  'Scheduling Tools',
  'Template System',
  'Platform Integration',
  'Trial Experience',
];

export function FeedbackWidget({ 
  className = '', 
  defaultCategory = 'general',
  showTitle = true 
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState(defaultCategory);
  const [feature, setFeature] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !feedback.trim()) {
      toast.error('Please provide a rating and feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          rating,
          feedback: feedback.trim(),
          feature: feature || null,
          source: 'web',
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Thank you for your feedback!');
        setTimeout(() => {
          setIsOpen(false);
          setIsSubmitted(false);
          setRating(0);
          setFeedback('');
          setFeature('');
        }, 2000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  if (isSubmitted) {
    return (
      <Card className={className}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Chip icon={<Box sx={{ color: 'green.500' }}><Star className="h-12 w-12" /></Box>} label="Thank You!" />
          <Typography variant="h6" component="h3" sx={{ mt: 1, mb: 0.5 }}>Thank You!</Typography>
          <Typography variant="body2" color="text.secondary">Your feedback has been submitted successfully.</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outlined"
        sx={{ gap: 1 }}
      >
        <Star className="h-4 w-4" />
        Share Feedback
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star className="h-5 w-5" />
          {showTitle ? 'Share Your Feedback' : 'Feedback'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Help us improve CreatorFlow by sharing your experience
        </Typography>
      </CardHeader>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Rating */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              How would you rate your experience?
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  sx={{
                    p: 0.5,
                    borderRadius: 1,
                    transition: 'colors 0.2s ease-in-out',
                    color: star <= rating ? 'yellow.500' : 'grey.300'
                  }}
                >
                  <Star className="h-6 w-6" />
                </Button>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Typography>
          </Box>

          {/* Category */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Category
            </Typography>
            <Box sx={{ width: '100%' }}>
              <TextField
                select
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value as string)}
              >
                {FEEDBACK_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Feature (optional) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Feature (optional)
            </Typography>
            <Box sx={{ width: '100%' }}>
              <TextField
                select
                fullWidth
                label="Feature"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
              >
                <MenuItem value="">No specific feature</MenuItem>
                {FEATURES.map((feat) => (
                  <MenuItem key={feat} value={feat}>
                    {feat}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Feedback text */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Your feedback
            </Typography>
            <TextField
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              multiline
              rows={4}
              fullWidth
              label="Your feedback"
              variant="outlined"
              required
            />
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
            <Button
              type="submit"
              disabled={isSubmitting || !rating || !feedback.trim()}
              sx={{ flex: 1 }}
            >
              {isSubmitting ? (
                <>
                  <Box sx={{ 
                    animation: 'spin 1s linear infinite', 
                    borderRadius: '50%', 
                    height: 16, 
                    width: 16, 
                    border: '2px solid transparent', 
                    borderBottomColor: 'white'
                  }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Box sx={{ mr: 0.5 }}><Send className="h-4 w-4" /></Box>
                  Submit Feedback
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 