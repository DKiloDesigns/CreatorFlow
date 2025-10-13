'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Slider, 
  TextField, 
  Button,
  Chip,
  Divider,
  Paper,
  Fade,
  Zoom
} from '@mui/material';
import { 
  TrendingUp, 
  Schedule, 
  MonetizationOn, 
  Calculate,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';

interface ROIData {
  platforms: number;
  postsPerWeek: number;
  hoursPerWeek: number;
  hourlyRate: number;
}

const DEFAULT_VALUES: ROIData = {
  platforms: 5,
  postsPerWeek: 20,
  hoursPerWeek: 10,
  hourlyRate: 50
};

const PLATFORM_COSTS = {
  individual: 15, // Average cost per platform tool
  creatorflow: 29 // CreatorFlow Pro monthly cost
};

export function ROICalculator() {
  const [values, setValues] = useState<ROIData>(DEFAULT_VALUES);
  const [isCalculated, setIsCalculated] = useState(false);
  const [savings, setSavings] = useState({
    monthly: 0,
    yearly: 0,
    timeSaved: 0,
    efficiency: 0
  });

  const calculateROI = () => {
    const individualCost = values.platforms * PLATFORM_COSTS.individual;
    const creatorflowCost = PLATFORM_COSTS.creatorflow;
    const monthlySavings = individualCost - creatorflowCost;
    const yearlySavings = monthlySavings * 12;
    
    // Time savings calculation (assuming 50% efficiency gain)
    const timeSaved = values.hoursPerWeek * 0.5;
    const efficiency = 50; // 50% efficiency improvement
    
    setSavings({
      monthly: monthlySavings,
      yearly: yearlySavings,
      timeSaved: timeSaved,
      efficiency: efficiency
    });
    setIsCalculated(true);
  };

  useEffect(() => {
    calculateROI();
  }, [values]);

  const handleSliderChange = (field: keyof ROIData) => (event: Event, newValue: number | number[]) => {
    setValues(prev => ({
      ...prev,
      [field]: newValue as number
    }));
  };

  const handleInputChange = (field: keyof ROIData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.default',
      borderTop: 1,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Calculate Your ROI
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            See exactly how much you can save with floai.studio
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Input Controls */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calculate sx={{ color: 'primary.main' }} />
                  Your Current Setup
                </Typography>

                {/* Platforms */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Number of Platforms: {values.platforms}
                  </Typography>
                  <Slider
                    value={values.platforms}
                    onChange={handleSliderChange('platforms')}
                    min={1}
                    max={16}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Instagram, YouTube, TikTok, LinkedIn, etc.
                  </Typography>
                </Box>

                {/* Posts per Week */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Posts per Week: {values.postsPerWeek}
                  </Typography>
                  <Slider
                    value={values.postsPerWeek}
                    onChange={handleSliderChange('postsPerWeek')}
                    min={1}
                    max={50}
                    step={1}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 10, label: '10' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' }
                    ]}
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />
                </Box>

                {/* Hours per Week */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Hours Spent per Week: {values.hoursPerWeek}
                  </Typography>
                  <Slider
                    value={values.hoursPerWeek}
                    onChange={handleSliderChange('hoursPerWeek')}
                    min={1}
                    max={40}
                    step={1}
                    marks={[
                      { value: 1, label: '1h' },
                      { value: 10, label: '10h' },
                      { value: 20, label: '20h' },
                      { value: 40, label: '40h' }
                    ]}
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />
                </Box>

                {/* Hourly Rate */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Your Hourly Rate: ${values.hourlyRate}
                  </Typography>
                  <TextField
                    type="number"
                    value={values.hourlyRate}
                    onChange={handleInputChange('hourlyRate')}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                    }}
                    sx={{ mb: 2 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={6}>
            <Fade in={isCalculated} timeout={1000}>
              <Card sx={{ height: '100%', bgcolor: 'primary.50' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: 'success.main' }} />
                    Your Savings with floai.studio
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Monthly Savings */}
                    <Grid item xs={6}>
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          ${savings.monthly.toFixed(0)}
                        </Typography>
                        <Typography variant="body1">
                          Monthly Savings
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Yearly Savings */}
                    <Grid item xs={6}>
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          ${savings.yearly.toFixed(0)}
                        </Typography>
                        <Typography variant="body1">
                          Yearly Savings
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Time Saved */}
                    <Grid item xs={6}>
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {savings.timeSaved.toFixed(1)}h
                        </Typography>
                        <Typography variant="body1">
                          Time Saved/Week
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Efficiency */}
                    <Grid item xs={6}>
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                          {savings.efficiency}%
                        </Typography>
                        <Typography variant="body1">
                          Efficiency Gain
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Cost Comparison */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Cost Comparison
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Individual Tools ({values.platforms} platforms):</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        ${(values.platforms * PLATFORM_COSTS.individual).toFixed(0)}/month
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>floai.studio Pro:</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        ${PLATFORM_COSTS.creatorflow}/month
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        You Save:
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        ${savings.monthly.toFixed(0)}/month
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    Start Your Free Trial
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Benefits */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Why Creators Choose floai.studio
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              'Unified Dashboard',
              'AI-Powered Content',
              'Advanced Analytics',
              'Team Collaboration',
              'White-Label Options',
              '24/7 Support'
            ].map((benefit, index) => (
              <Grid item key={index}>
                <Chip
                  icon={<CheckCircle />}
                  label={benefit}
                  color="success"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    height: 40
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
