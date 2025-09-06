'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Button,
  IconButton,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Slider,
  Rating,
} from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  LoadingSpinner,
  LoadingBar,
  SkeletonCard,
  LoadingOverlay,
  LoadingState,
  ProgressIndicator,
} from '@/components/ui/mui-loading';
import { Stack } from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Settings,
  Notifications,
  Download,
  Upload,
  Save,
  Refresh,
  PlayArrow,
  Pause,
  Stop,
} from '@/lib/mui-optimized-imports';

export default function MuiAdvancedDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'simple' | 'form' | 'confirm'>('simple');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    notifications: true,
    rating: 0,
    experience: 50,
  });

  const handleDialogOpen = (type: 'simple' | 'form' | 'confirm') => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateOverlayLoading = () => {
    setOverlayLoading(true);
    setTimeout(() => setOverlayLoading(false), 2000);
  };

  const renderSimpleDialog = () => (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogHeader>
        <DialogTitle>Simple Dialog</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <DialogDescription>
          This is a simple dialog with basic content. You can add any content here.
        </DialogDescription>
      </DialogContent>
      <DialogFooter>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button variant="contained" onClick={handleDialogClose}>
          Confirm
        </Button>
      </DialogFooter>
    </Dialog>
  );

  const renderFormDialog = () => (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogHeader>
        <DialogTitle>User Settings</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={formData.notifications}
                onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
              />
            }
            label="Enable notifications"
          />
          <Box>
            <Typography variant="body2" gutterBottom>
              Experience Level
            </Typography>
            <Slider
              value={formData.experience}
              onChange={(e, value) => setFormData(prev => ({ ...prev, experience: value as number }))}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box>
            <Typography variant="body2" gutterBottom>
              Rating
            </Typography>
            <Rating
              value={formData.rating}
              onChange={(e, value) => setFormData(prev => ({ ...prev, rating: value || 0 }))}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogFooter>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button variant="contained" onClick={handleDialogClose}>
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );

  const renderConfirmDialog = () => (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogHeader>
        <DialogTitle>Confirm Action</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <DialogDescription>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogDescription>
      </DialogContent>
      <DialogFooter>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleDialogClose}>
          Delete
        </Button>
      </DialogFooter>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        MUI Advanced Components Demo
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Showcasing advanced MUI components including dialogs, loading states, and specialized UI patterns.
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Dialogs" />
        <Tab label="Loading States" />
        <Tab label="Progress & Feedback" />
        <Tab label="Skeletons" />
        <Tab label="Stack Layout" />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Dialog Components
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Dialog Types
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => handleDialogOpen('simple')}
                >
                  Simple Dialog
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleDialogOpen('form')}
                >
                  Form Dialog
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDialogOpen('confirm')}
                >
                  Confirm Dialog
                </Button>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Alert Examples
              </Typography>
              <Stack spacing={2}>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  This is a success alert — check it out!
                </Alert>
                <Alert severity="info">
                  <AlertTitle>Info</AlertTitle>
                  This is an info alert — check it out!
                </Alert>
                <Alert severity="warning">
                  <AlertTitle>Warning</AlertTitle>
                  This is a warning alert — check it out!
                </Alert>
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  This is an error alert — check it out!
                </Alert>
              </Stack>
            </Box>
          </Stack>

          {/* Render dialogs */}
          {dialogType === 'simple' && renderSimpleDialog()}
          {dialogType === 'form' && renderFormDialog()}
          {dialogType === 'confirm' && renderConfirmDialog()}
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Loading States
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Loading Spinners
              </Typography>
              <Stack spacing={2}>
                <LoadingSpinner size="small" message="Small spinner" />
                <LoadingSpinner size="medium" message="Medium spinner" />
                <LoadingSpinner size="large" message="Large spinner" />
                <LoadingSpinner color="secondary" message="Secondary color" />
              </Stack>
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Loading Bars
              </Typography>
              <Stack spacing={2}>
                <LoadingBar variant="indeterminate" message="Indeterminate progress" />
                <LoadingBar variant="determinate" value={75} message="75% complete" />
                <LoadingBar color="secondary" message="Secondary color" />
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Loading State Component
            </Typography>
            <Stack spacing={2}>
              <Button onClick={simulateLoading} disabled={loading}>
                {loading ? 'Loading...' : 'Simulate Loading'}
              </Button>
              
              <LoadingState loading={loading} error={null}>
                <Paper sx={{ p: 2 }}>
                  <Typography>This content is shown when not loading</Typography>
                </Paper>
              </LoadingState>
            </Stack>
          </Box>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Progress & Feedback
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Progress Indicator
              </Typography>
              <Stack spacing={2}>
                <Button onClick={simulateProgress}>
                  Start Progress
                </Button>
                <ProgressIndicator
                  current={progress}
                  total={100}
                  message="Uploading files..."
                  showPercentage
                />
              </Stack>
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Loading Overlay
              </Typography>
              <Box sx={{ position: 'relative', minHeight: 200 }}>
                <LoadingOverlay open={overlayLoading} message="Processing data...">
                  <Paper sx={{ p: 3, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography>Content that gets overlaid when loading</Typography>
                  </Paper>
                </LoadingOverlay>
                <Button onClick={simulateOverlayLoading} sx={{ mt: 2 }}>
                  Toggle Overlay
                </Button>
              </Box>
            </Box>
          </Stack>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Skeleton Components
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Card Skeletons
              </Typography>
              <SkeletonCard variant="card" count={2} />
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>
                List Skeletons
              </Typography>
              <SkeletonCard variant="list" count={3} />
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Table Skeletons
              </Typography>
              <SkeletonCard variant="table" count={4} />
            </Box>
          </Stack>
        </Paper>
      )}

      {activeTab === 4 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            MUI Stack Layout Component
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Our custom Stack component provides flexible layout capabilities with responsive spacing, alignment, and direction options.
          </Typography>

          <Stack spacing={4}>
            {/* Basic Stack Examples */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Basic Stack Examples
              </Typography>
              <Stack spacing={2}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2">Vertical Stack (default)</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2">With spacing</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2">And alignment</Typography>
                </Paper>
              </Stack>
            </Box>

            {/* Horizontal Stack */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Horizontal Stack
              </Typography>
              <Stack spacing={2}>
                <Paper sx={{ p: 2, textAlign: 'center', minWidth: 80 }}>
                  <Typography variant="body2">Left</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', minWidth: 80 }}>
                  <Typography variant="body2">Center</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', minWidth: 80 }}>
                  <Typography variant="body2">Right</Typography>
                </Paper>
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Advanced Stack Features */}
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Advanced Features
            </Typography>
            
            <Stack spacing={3}>
              {/* Responsive Spacing */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Responsive Spacing
                </Typography>
                <Stack spacing={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">Small on mobile</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">Larger on desktop</Typography>
                  </Paper>
                </Stack>
              </Box>

              {/* Alignment Options */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Alignment Options
                </Typography>
                <Stack spacing={2} alignItems="center">
                  <Paper sx={{ p: 1, textAlign: 'center', minHeight: 40 }}>
                    <Typography variant="caption">Short</Typography>
                  </Paper>
                  <Paper sx={{ p: 3, textAlign: 'center', minHeight: 80 }}>
                    <Typography variant="body2">Tall</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', minHeight: 60 }}>
                    <Typography variant="body2">Medium</Typography>
                  </Paper>
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Interactive Demo */}
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Interactive Demo
            </Typography>
            
            <Stack spacing={3}>
              {/* Stack with Dividers */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Stack with Dividers
                </Typography>
                <Stack spacing={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">Section 1</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">Section 2</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">Section 3</Typography>
                  </Paper>
                </Stack>
              </Box>

              {/* Centered Stack */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Centered Stack
                </Typography>
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                  <Paper sx={{ p: 2, textAlign: 'center', width: '100%' }}>
                    <Typography variant="body2">Centered Content</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', width: '100%' }}>
                    <Typography variant="body2">With full width</Typography>
                  </Paper>
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Stack Layout Demo */}
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Stack Layout Options
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              MUI Stack provides flexible layout control with spacing and alignment options.
            </Typography>

            <Stack spacing={3}>
              {/* Flex Properties */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Flex Properties
                </Typography>
                <Stack spacing={2}>
                  <Paper sx={{ p: 2, textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption">Fixed</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">Flexible (grows)</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption">Fixed</Typography>
                  </Paper>
                </Stack>
              </Box>

              {/* Centered Items */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Centered Items
                </Typography>
                <Stack spacing={2}>
                  <Paper sx={{ p: 2, textAlign: 'center', minWidth: 80, minHeight: 60 }}>
                    <Typography variant="body2">Centered</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', minWidth: 80, minHeight: 60 }}>
                    <Typography variant="body2">Centered</Typography>
                  </Paper>
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Direction and Reverse Demo */}
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Direction and Reverse
            </Typography>
            
            <Stack spacing={3}>
              {/* Reverse Direction */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Reverse Direction
                </Typography>
                <Stack direction="column-reverse" spacing={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">First (rendered last)</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">Second</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">Last (rendered first)</Typography>
                  </Paper>
                </Stack>
              </Box>

              {/* Horizontal Reverse */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Horizontal Reverse
                </Typography>
                <Stack direction="row-reverse" spacing={2}>
                  <Paper sx={{ p: 2, textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption">Right</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption">Center</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="caption">Left</Typography>
                  </Paper>
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Justification Demo */}
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Justification Options
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  justify="start" (default)
                </Typography>
                <Stack spacing={2} justifyContent="start">
                  <Paper sx={{ p: 1, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="caption">1</Typography>
                  </Paper>
                  <Paper sx={{ p: 1, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="caption">2</Typography>
                  </Paper>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  justify="center"
                </Typography>
                <Stack spacing={2} justifyContent="center">
                  <Paper sx={{ p: 1, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="caption">1</Typography>
                  </Paper>
                  <Paper sx={{ p: 1, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="caption">2</Typography>
                  </Paper>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  justify="between"
                </Typography>
                <Stack spacing={2} justifyContent="space-between">
                  <Paper sx={{ p: 1, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="caption">1</Typography>
                  </Paper>
                  <Paper sx={{ p: 1, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="caption">2</Typography>
                  </Paper>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  justify="evenly"
                </Typography>
                <Stack spacing={2} justifyContent="space-evenly">
                  <Paper sx={{ p: 1, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="caption">1</Typography>
                  </Paper>
                  <Paper sx={{ p: 1, textAlign: 'center', minWidth: 40 }}>
                    <Typography variant="caption">2</Typography>
                  </Paper>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Container>
  );
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
} 