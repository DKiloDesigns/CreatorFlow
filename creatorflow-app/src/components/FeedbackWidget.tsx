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
  Grid,
  Chip
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
        <CardContent className="p-6 text-center">
          <Chip icon={<Star className="h-12 w-12 text-green-500" />} label="Thank You!" />
          <Typography variant="h6" component="h3" className="mt-2 mb-1">Thank You!</Typography>
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
        className={`${className} gap-2`}
      >
        <Star className="h-4 w-4" />
        Share Feedback
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <Typography variant="h5" component="h2" className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          {showTitle ? 'Share Your Feedback' : 'Feedback'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Help us improve CreatorFlow by sharing your experience
        </Typography>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Typography variant="body2" className="text-sm font-medium">How would you rate your experience?</Typography>
            <Box className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`p-1 rounded transition-colors ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
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
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Typography variant="body2" className="text-sm font-medium">Category</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </div>

          {/* Feature (optional) */}
          <div className="space-y-2">
            <Typography variant="body2" className="text-sm font-medium">Feature (optional)</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Feature"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value as string)}
                >
                  <MenuItem value="">No specific feature</MenuItem>
                  {FEATURES.map((feat) => (
                    <MenuItem key={feat} value={feat}>
                      {feat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </div>

          {/* Feedback text */}
          <div className="space-y-2">
            <Typography variant="body2" className="text-sm font-medium">Your feedback</Typography>
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
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !rating || !feedback.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 