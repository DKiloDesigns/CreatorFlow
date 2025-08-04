'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Send, CheckCircle } from 'lucide-react';
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
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground">Your feedback has been submitted successfully.</p>
        </CardContent>
      </Card>
    );
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className={`${className} gap-2`}
      >
        <MessageSquare className="h-4 w-4" />
        Share Feedback
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {showTitle ? 'Share Your Feedback' : 'Feedback'}
        </CardTitle>
        <CardDescription>
          Help us improve CreatorFlow by sharing your experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How would you rate your experience?</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`p-1 rounded transition-colors ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FEEDBACK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Feature (optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Feature (optional)</label>
            <Select value={feature} onValueChange={setFeature}>
              <SelectTrigger>
                <SelectValue placeholder="Select a feature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific feature</SelectItem>
                {FEATURES.map((feat) => (
                  <SelectItem key={feat} value={feat}>
                    {feat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Feedback text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your feedback</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
              rows={4}
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
              variant="outline"
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