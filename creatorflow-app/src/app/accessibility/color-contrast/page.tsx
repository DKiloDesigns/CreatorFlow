'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  CheckCircle, 
  Warning, 
  Error, 
  Visibility, 
  VisibilityOff,
  Refresh,
  Palette,
  Contrast
} from '@mui/icons-material';
import { 
  checkWCAGCompliance, 
  suggestAlternativeColors,
  generateContrastReport 
} from '@/lib/color-contrast';

interface ColorTestResult {
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  status: 'pass' | 'fail' | 'warning';
  recommendation?: string;
  alternatives?: string[];
}

export default function ColorContrastPage() {
  const [foregroundColor, setForegroundColor] = useState('#171717');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [isBold, setIsBold] = useState(false);
  const [testResult, setTestResult] = useState<ColorTestResult | null>(null);
  const [recentTests, setRecentTests] = useState<ColorTestResult[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [bulkTestColors, setBulkTestColors] = useState<string[]>([]);
  const [bulkTestResults, setBulkTestResults] = useState<ColorTestResult[]>([]);

  useEffect(() => {
    // Load recent tests from localStorage
    const saved = localStorage.getItem('creatorflow-recent-color-tests');
    if (saved) {
      try {
        setRecentTests(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load recent tests:', error);
      }
    }
  }, []);

  const testColorContrast = () => {
    try {
      const result = checkWCAGCompliance(foregroundColor, backgroundColor, fontSize, isBold);
      const alternatives = suggestAlternativeColors(foregroundColor, backgroundColor);
      
      const testResult: ColorTestResult = {
        foreground: foregroundColor,
        background: backgroundColor,
        ratio: result.ratio,
        wcagAA: result.wcagAA,
        wcagAAA: result.wcagAAA,
        status: result.status,
        recommendation: result.recommendation,
        alternatives
      };
      
      setTestResult(testResult);
      
      // Add to recent tests
      const updated = [testResult, ...recentTests.filter(t => 
        t.foreground !== testResult.foreground || t.background !== testResult.background
      )].slice(0, 10);
      
      setRecentTests(updated);
      localStorage.setItem('creatorflow-recent-color-tests', JSON.stringify(updated));
      
    } catch (error) {
      console.error('Error testing color contrast:', error);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'fail':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'success';
      case 'warning':
        return 'warning';
      case 'fail':
        return 'error';
      default:
        return 'default';
    }
  };

  const addBulkTestColor = () => {
    if (foregroundColor && backgroundColor && !bulkTestColors.includes(`${foregroundColor}-${backgroundColor}`)) {
      setBulkTestColors([...bulkTestColors, `${foregroundColor}-${backgroundColor}`]);
    }
  };

  const runBulkTest = () => {
    const results: ColorTestResult[] = [];
    
    bulkTestColors.forEach(colorPair => {
      const [fg, bg] = colorPair.split('-');
      try {
        const result = checkWCAGCompliance(fg, bg, fontSize, isBold);
        results.push({
          foreground: fg,
          background: bg,
          ratio: result.ratio,
          wcagAA: result.wcagAA,
          wcagAAA: result.wcagAAA,
          status: result.status,
          recommendation: result.recommendation
        });
      } catch (error) {
        console.warn('Failed to test color pair:', colorPair, error);
      }
    });
    
    setBulkTestResults(results);
  };

  const clearBulkTest = () => {
    setBulkTestColors([]);
    setBulkTestResults([]);
  };

  const exportReport = () => {
    const report = generateContrastReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creatorflow-contrast-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Contrast color="primary" />
        Color Contrast Testing
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test color combinations for WCAG 2.1 AA compliance and get recommendations for improvement.
      </Typography>

      <Grid container spacing={3}>
        {/* Main Testing Interface */}
        <Grid item xs={12} md={6} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Test Color Combination</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} component="div">
                  <TextField
                    fullWidth
                    label="Foreground Color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    placeholder="#000000"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">🎨</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={6} component="div">
                  <TextField
                    fullWidth
                    label="Background Color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">🎨</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  select
                  label="Font Size"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as 'normal' | 'large')}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <option value="normal">Normal</option>
                  <option value="large">Large (18pt+)</option>
                </TextField>
                
                <Button
                  variant={isBold ? 'contained' : 'outlined'}
                  onClick={() => setIsBold(!isBold)}
                  size="small"
                >
                  {isBold ? 'Bold' : 'Normal'}
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={testColorContrast}
                  startIcon={<Refresh />}
                  fullWidth
                >
                  Test Contrast
                </Button>
              </Box>

              {/* Preview */}
              {showPreview && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Preview</Typography>
                    <IconButton size="small" onClick={() => setShowPreview(!showPreview)}>
                      {showPreview ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      backgroundColor: backgroundColor, 
                      color: foregroundColor,
                      fontSize: fontSize === 'large' ? '18px' : '14px',
                      fontWeight: isBold ? 'bold' : 'normal',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body1">
                      Sample text with {fontSize} font size{isBold ? ' and bold weight' : ''}.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      This is how your color combination will look in practice.
                    </Typography>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Results Display */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Test Results</Typography>
              
              {testResult ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {getStatusIcon(testResult.status)}
                    <Typography variant="h6" color={getStatusColor(testResult.status)}>
                      {testResult.status.toUpperCase()}
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Contrast Ratio</Typography>
                      <Typography variant="h4" color="primary">
                        {testResult.ratio.toFixed(2)}:1
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">WCAG 2.1 AA</Typography>
                      <Chip 
                        label={testResult.wcagAA ? 'PASS' : 'FAIL'} 
                        color={testResult.wcagAA ? 'success' : 'error'}
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  {testResult.recommendation && (
                    <Alert severity={testResult.status === 'pass' ? 'success' : 'warning'} sx={{ mb: 2 }}>
                      {testResult.recommendation}
                    </Alert>
                  )}

                  {testResult.alternatives && testResult.alternatives.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Alternative Colors</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {testResult.alternatives.map((color, index) => (
                          <Tooltip key={index} title={`Click to use ${color}`}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: color,
                                border: '2px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                cursor: 'pointer',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  transform: 'scale(1.1)'
                                }
                              }}
                              onClick={() => setForegroundColor(color)}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Test a color combination to see results here.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Bulk Testing */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Bulk Testing</Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={addBulkTestColor}
                  startIcon={<Palette />}
                >
                  Add Current Colors
                </Button>
                <Button
                  variant="contained"
                  onClick={runBulkTest}
                  disabled={bulkTestColors.length === 0}
                >
                  Run Bulk Test
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearBulkTest}
                  disabled={bulkTestColors.length === 0}
                >
                  Clear All
                </Button>
              </Box>

              {bulkTestColors.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Colors to Test ({bulkTestColors.length})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {bulkTestColors.map((colorPair, index) => {
                      const [fg, bg] = colorPair.split('-');
                      return (
                        <Chip
                          key={index}
                          label={`${fg} on ${bg}`}
                          onDelete={() => setBulkTestColors(bulkTestColors.filter((_, i) => i !== index))}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}

              {bulkTestResults.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Bulk Test Results</Typography>
                  <Grid container spacing={1}>
                    {bulkTestResults.map((result, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {getStatusIcon(result.status)}
                            <Typography variant="caption" color={getStatusColor(result.status)}>
                              {result.status.toUpperCase()}
                            </Typography>
                          </Box>
                          <Typography variant="caption" display="block">
                            {result.ratio.toFixed(2)}:1
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {result.foreground} on {result.background}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tests */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Tests</Typography>
                <Button
                  variant="outlined"
                  onClick={exportReport}
                  startIcon={<Contrast />}
                  size="small"
                >
                  Export Report
                </Button>
              </Box>
              
              {recentTests.length > 0 ? (
                <Grid container spacing={1}>
                  {recentTests.map((test, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {getStatusIcon(test.status)}
                          <Typography variant="caption" color={getStatusColor(test.status)}>
                            {test.status.toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography variant="caption" display="block">
                          {test.ratio.toFixed(2)}:1
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {test.foreground} on {test.background}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent tests. Start testing colors to build up your history.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
